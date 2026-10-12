import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BookCondition,
  CopyStatus,
  FineStatus,
  FineType,
  LoanStatus,
  Prisma,
  Role,
  UserStatus,
} from '@paideon/database/generated/client/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BooksQueryDto, CreateBookDto, UpdateBookDto } from './dto/library.dto';

const batchSize = 300;
const dayMs = 24 * 60 * 60 * 1000;

type CsvRow = {
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  startingBarcode: string;
  catalogNumber: string;
};

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async listBooks(schoolId: string, query: BooksQueryDto) {
    const search = query.q?.trim();
    const authorMatches = search
      ? await this.prisma.$queryRaw<Array<{ id: string }>>`
          SELECT b."id"
          FROM "Book" AS b
          CROSS JOIN LATERAL unnest(b."authors") AS author(value)
          WHERE b."schoolId" = ${schoolId}
            AND b."deletedAt" IS NULL
            AND author.value ILIKE ${`%${search}%`}
        `
      : [];
    const where: Prisma.BookWhereInput = {
      schoolId,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { authors: { has: search } },
              ...(authorMatches.length
                ? [{ id: { in: authorMatches.map((book) => book.id) } }]
                : []),
              { isbn13: { contains: search } },
              { isbn10: { contains: search } },
              { copies: { some: { code: { contains: search } } } },
            ],
          }
        : {}),
    };
    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: { copies: { select: { id: true, code: true, status: true } } },
        orderBy: { title: 'asc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.book.count({ where }),
    ]);
    return { data: books, page: query.page, limit: query.limit, total };
  }

  createBook(schoolId: string, dto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        schoolId,
        title: dto.title.trim(),
        authors: [dto.author.trim()],
        isbn13: dto.isbn?.trim() || null,
        categories: dto.category?.trim() ? [dto.category.trim()] : [],
        subjects: [],
        localSubjects: [],
        tags: [],
      },
    });
  }

  async updateBook(schoolId: string, id: string, dto: UpdateBookDto) {
    const exists = await this.prisma.book.findFirst({
      where: { id, schoolId, deletedAt: null },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Book not found.');
    return this.prisma.book.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.author !== undefined ? { authors: [dto.author.trim()] } : {}),
        ...(dto.isbn !== undefined ? { isbn13: dto.isbn.trim() || null } : {}),
        ...(dto.category !== undefined
          ? { categories: dto.category.trim() ? [dto.category.trim()] : [] }
          : {}),
      },
    });
  }

  async addCopy(schoolId: string, bookId: string, barcode: string) {
    const book = await this.prisma.book.findFirst({
      where: { id: bookId, schoolId, deletedAt: null },
      select: { id: true },
    });
    if (!book) throw new NotFoundException('Book not found.');
    try {
      return await this.prisma.$transaction(async (tx) => {
        const copy = await tx.bookCopy.create({
          data: { schoolId, bookId, code: barcode.trim() },
        });
        await tx.book.update({
          where: { id: bookId },
          data: { status: 'AVAILABLE' },
        });
        return copy;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('That barcode is already in use.');
      }
      throw error;
    }
  }

  async importCsv(schoolId: string, text: string) {
    const rows = parseCsv(text);
    if (!rows.length) throw new BadRequestException('The CSV file is empty.');
    const headers = rows[0].map((header) => header.trim().toLowerCase());
    const required = [
      'title',
      'author',
      'isbn',
      'category',
      'copies',
      'starting barcode',
    ];
    const indexes = new Map(headers.map((header, index) => [header, index]));
    if (required.some((header) => !indexes.has(header))) {
      throw new BadRequestException(
        'CSV headers must include title, author, isbn, category, copies, starting barcode.',
      );
    }

    const valid: CsvRow[] = [];
    let errors = 0;
    const usedCodes = new Set<string>();
    for (const row of rows.slice(1)) {
      const field = (name: string) => row[indexes.get(name)!]?.trim() ?? '';
      const copies = Number(field('copies'));
      const title = field('title');
      const author = field('author');
      const startingBarcode = field('starting barcode');
      if (
        !title ||
        !author ||
        !startingBarcode ||
        !Number.isInteger(copies) ||
        copies < 1 ||
        copies > 50
      ) {
        errors += 1;
        continue;
      }

      const codes = makeBarcodes(startingBarcode, copies);
      if (codes.some((code) => usedCodes.has(code))) {
        errors += 1;
        continue;
      }
      codes.forEach((code) => usedCodes.add(code));
      valid.push({
        title,
        author,
        isbn: field('isbn'),
        category: field('category'),
        copies,
        startingBarcode,
        catalogNumber: `CSV-${randomUUID()}`,
      });
    }

    let created = 0;
    let skipped = 0;
    for (let offset = 0; offset < valid.length; offset += batchSize) {
      const batch = valid.slice(offset, offset + batchSize);
      const result = await this.prisma.$transaction(async (tx) => {
        const allCodes = batch.flatMap((row) =>
          makeBarcodes(row.startingBarcode, row.copies),
        );
        const existingCopies = await tx.bookCopy.findMany({
          where: { schoolId, code: { in: allCodes } },
          select: { code: true },
        });
        const existingCodeSet = new Set(
          existingCopies.map((copy) => copy.code),
        );
        const rowsWithoutBarcodeConflict = batch.filter((row) =>
          makeBarcodes(row.startingBarcode, row.copies).every(
            (code) => !existingCodeSet.has(code),
          ),
        );
        const conflicted = batch.length - rowsWithoutBarcodeConflict.length;
        const insert = await tx.book.createMany({
          data: rowsWithoutBarcodeConflict.map((row) => ({
            schoolId,
            catalogNumber: row.catalogNumber,
            isbn13: row.isbn || null,
            title: row.title,
            authors: [row.author],
            categories: row.category ? [row.category] : [],
            subjects: [],
            localSubjects: [],
            tags: [],
          })),
          skipDuplicates: true,
        });
        const books = await tx.book.findMany({
          where: {
            schoolId,
            catalogNumber: {
              in: rowsWithoutBarcodeConflict.map((row) => row.catalogNumber),
            },
          },
          select: { id: true, catalogNumber: true },
        });
        const bookIds = new Map(
          books.map((book) => [book.catalogNumber, book.id]),
        );
        const copies = rowsWithoutBarcodeConflict.flatMap((row) => {
          const bookId = bookIds.get(row.catalogNumber);
          return bookId
            ? makeBarcodes(row.startingBarcode, row.copies).map((code) => ({
                bookId,
                schoolId,
                code,
              }))
            : [];
        });
        if (copies.length) {
          await tx.bookCopy.createMany({ data: copies, skipDuplicates: true });
        }
        return {
          created: insert.count,
          skipped: rowsWithoutBarcodeConflict.length - insert.count,
          errors: conflicted,
        };
      });
      created += result.created;
      skipped += result.skipped;
      errors += result.errors;
    }
    return { created, skipped, errors };
  }

  async searchMembers(schoolId: string, search = '') {
    const term = search.trim();
    const nameParts = term.split(/\s+/).filter(Boolean);
    const users = await this.prisma.user.findMany({
      where: {
        schoolId,
        status: { not: UserStatus.INACTIVE },
        ...(term
          ? {
              OR: [
                { cardNumber: { contains: term, mode: 'insensitive' } },
                { paideonId: { contains: term, mode: 'insensitive' } },
                { firstName: { contains: term, mode: 'insensitive' } },
                { lastName: { contains: term, mode: 'insensitive' } },
                ...nameParts.flatMap((part) => [
                  {
                    firstName: { contains: part, mode: 'insensitive' as const },
                  },
                  {
                    lastName: { contains: part, mode: 'insensitive' as const },
                  },
                ]),
              ],
            }
          : {}),
      },
      select: {
        id: true,
        paideonId: true,
        firstName: true,
        lastName: true,
        cardNumber: true,
        role: true,
        status: true,
      },
      take: 50,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
    return users;
  }

  async memberDetail(schoolId: string, id: string) {
    const member = await this.prisma.user.findFirst({
      where: {
        schoolId,
        OR: [{ id }, { cardNumber: id }, { paideonId: id }],
      },
      select: {
        id: true,
        schoolId: true,
        paideonId: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        cardNumber: true,
        loans: {
          where: { status: { in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE] } },
          include: { copy: { include: { book: true } } },
          orderBy: { dueDate: 'asc' },
        },
        fines: {
          where: { status: { in: [FineStatus.PENDING, FineStatus.PARTIAL] } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!member) throw new NotFoundException('Member not found.');
    return member;
  }

  checkout(
    schoolId: string,
    actorId: string,
    memberBarcode: string,
    copyBarcode: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const member = await tx.user.findFirst({
        where: { schoolId, cardNumber: memberBarcode },
      });
      if (!member) throw new NotFoundException('Member card was not found.');
      if (member.status !== UserStatus.ACTIVE) {
        throw new BadRequestException('Member account is not active.');
      }

      const config = await tx.libraryConfig.findUnique({ where: { schoolId } });
      const maximum =
        member.role === Role.STUDENT
          ? (config?.maxLoansStudent ?? 3)
          : (config?.maxLoansTeacher ?? 10);
      const activeCount = await tx.loan.count({
        where: {
          schoolId,
          userId: member.id,
          status: { in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE] },
        },
      });
      if (activeCount >= maximum) {
        throw new BadRequestException(
          `Member has reached the ${maximum}-book loan limit.`,
        );
      }

      const unpaid = await tx.fine.aggregate({
        where: {
          schoolId,
          userId: member.id,
          status: { in: [FineStatus.PENDING, FineStatus.PARTIAL] },
        },
        _sum: { amountLKR: true, amountPaidLKR: true },
      });
      const balance =
        Number(unpaid._sum.amountLKR ?? 0) -
        Number(unpaid._sum.amountPaidLKR ?? 0);
      const fineThreshold = Number(config?.maxFineLKR ?? 500);
      if (balance > fineThreshold) {
        throw new BadRequestException(
          `Checkout blocked: unpaid fines exceed Rs ${fineThreshold.toFixed(2)}.`,
        );
      }

      const copy = await tx.bookCopy.findFirst({
        where: { schoolId, code: copyBarcode },
        include: { book: true },
      });
      if (!copy) throw new NotFoundException('Book barcode was not found.');
      if (copy.status !== CopyStatus.AVAILABLE) {
        throw new ConflictException('This copy is not available for checkout.');
      }
      const claimed = await tx.bookCopy.updateMany({
        where: { id: copy.id, schoolId, status: CopyStatus.AVAILABLE },
        data: { status: CopyStatus.ON_LOAN },
      });
      if (claimed.count !== 1) {
        throw new ConflictException(
          'This copy was checked out by another session.',
        );
      }

      const loanDays = config?.loanDurationDays ?? 14;
      const loan = await tx.loan.create({
        data: {
          schoolId,
          userId: member.id,
          copyId: copy.id,
          dueDate: new Date(Date.now() + loanDays * dayMs),
          maxRenewals: config?.maxRenewals ?? 2,
          checkoutCondition: BookCondition.GOOD,
          checkedOutBy: actorId,
        },
      });
      const availableCopies = await tx.bookCopy.count({
        where: { bookId: copy.bookId, status: CopyStatus.AVAILABLE },
      });
      if (availableCopies === 0) {
        await tx.book.update({
          where: { id: copy.bookId },
          data: { status: 'CHECKED_OUT' },
        });
      }
      return {
        message: `Checked out "${copy.book.title}" to ${member.firstName} ${member.lastName}.`,
        loan,
        member: {
          id: member.id,
          name: `${member.firstName} ${member.lastName}`,
          cardNumber: member.cardNumber,
        },
        book: copy.book,
      };
    });
  }

  returnCopy(schoolId: string, actorId: string, copyBarcode: string) {
    return this.prisma.$transaction(async (tx) => {
      const copy = await tx.bookCopy.findFirst({
        where: { schoolId, code: copyBarcode },
        include: { book: true },
      });
      if (!copy) throw new NotFoundException('Book barcode was not found.');
      const loan = await tx.loan.findFirst({
        where: {
          schoolId,
          copyId: copy.id,
          status: { in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE] },
          returnDate: null,
        },
        include: { user: true },
        orderBy: { checkoutDate: 'desc' },
      });
      if (!loan) throw new BadRequestException('This copy has no active loan.');

      const now = new Date();
      const daysOverdue = Math.max(
        0,
        Math.ceil((now.getTime() - loan.dueDate.getTime()) / dayMs),
      );
      await tx.loan.update({
        where: { id: loan.id },
        data: {
          status: LoanStatus.RETURNED,
          returnDate: now,
          checkedInBy: actorId,
          returnCondition: BookCondition.GOOD,
        },
      });
      await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: CopyStatus.AVAILABLE },
      });
      await tx.book.update({
        where: { id: copy.bookId },
        data: { status: 'AVAILABLE' },
      });

      let fine = null;
      if (daysOverdue > 0) {
        const config = await tx.libraryConfig.findUnique({
          where: { schoolId },
        });
        const dailyRate = config?.overdueFinePerDayLKR ?? new Prisma.Decimal(2);
        fine = await tx.fine.create({
          data: {
            schoolId,
            userId: loan.userId,
            loanId: loan.id,
            type: FineType.OVERDUE,
            amountLKR: dailyRate.mul(daysOverdue),
            daysOverdue,
            dailyRateLKR: dailyRate,
          },
        });
      }
      return {
        message: `Returned "${copy.book.title}" from ${loan.user.firstName} ${loan.user.lastName}.`,
        daysOverdue,
        fine,
      };
    });
  }

  renew(schoolId: string, copyBarcode: string) {
    return this.prisma.$transaction(async (tx) => {
      const copy = await tx.bookCopy.findFirst({
        where: { schoolId, code: copyBarcode },
      });
      if (!copy) throw new NotFoundException('Book barcode was not found.');
      const loan = await tx.loan.findFirst({
        where: {
          schoolId,
          copyId: copy.id,
          status: { in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE] },
          returnDate: null,
        },
      });
      if (!loan) throw new BadRequestException('This copy has no active loan.');
      if (loan.renewalCount >= loan.maxRenewals) {
        throw new BadRequestException(
          'This loan has reached its renewal limit.',
        );
      }
      const config = await tx.libraryConfig.findUnique({ where: { schoolId } });
      const dueDate = new Date(
        Math.max(Date.now(), loan.dueDate.getTime()) +
          (config?.loanDurationDays ?? 14) * dayMs,
      );
      const renewed = await tx.loan.update({
        where: { id: loan.id },
        data: {
          dueDate,
          renewalCount: { increment: 1 },
          status: LoanStatus.ACTIVE,
        },
      });
      return { message: 'Loan renewed.', loan: renewed };
    });
  }

  unpaidFines(schoolId: string, memberId?: string) {
    return this.prisma.fine.findMany({
      where: {
        schoolId,
        status: { in: [FineStatus.PENDING, FineStatus.PARTIAL] },
        ...(memberId ? { userId: memberId } : {}),
      },
      select: {
        id: true,
        userId: true,
        loanId: true,
        amountLKR: true,
        amountPaidLKR: true,
        status: true,
        daysOverdue: true,
        dailyRateLKR: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            paideonId: true,
            cardNumber: true,
          },
        },
        loan: { include: { copy: { include: { book: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  payFine(schoolId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const fine = await tx.fine.findFirst({
        where: {
          id,
          schoolId,
          status: { in: [FineStatus.PENDING, FineStatus.PARTIAL] },
        },
        select: { id: true, amountLKR: true },
      });
      if (!fine) throw new NotFoundException('Unpaid fine not found.');
      return tx.fine.update({
        where: { id: fine.id },
        data: {
          status: FineStatus.PAID,
          amountPaidLKR: fine.amountLKR,
          paidAt: new Date(),
        },
      });
    });
  }

  async waiveFine(
    schoolId: string,
    actorId: string,
    id: string,
    reason: string,
  ) {
    const trimmedReason = reason.trim();
    if (!trimmedReason)
      throw new BadRequestException('A waiver reason is required.');
    const fine = await this.prisma.fine.findFirst({
      where: {
        id,
        schoolId,
        status: { in: [FineStatus.PENDING, FineStatus.PARTIAL] },
      },
      select: { id: true },
    });
    if (!fine) throw new NotFoundException('Unpaid fine not found.');
    return this.prisma.fine.update({
      where: { id },
      data: {
        status: FineStatus.WAIVED,
        waivedBy: actorId,
        waiverReason: trimmedReason,
        waivedAt: new Date(),
      },
    });
  }

  overdue(schoolId: string) {
    return this.prisma.loan.findMany({
      where: {
        schoolId,
        status: { in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE] },
        dueDate: { lt: new Date() },
      },
      select: {
        id: true,
        dueDate: true,
        checkoutDate: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            cardNumber: true,
            paideonId: true,
          },
        },
        copy: { include: { book: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async stats(schoolId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [books, copies, activeLoans, overdueCount, loansToday] =
      await Promise.all([
        this.prisma.book.count({ where: { schoolId, deletedAt: null } }),
        this.prisma.bookCopy.count({ where: { schoolId } }),
        this.prisma.loan.count({
          where: {
            schoolId,
            status: { in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE] },
          },
        }),
        this.prisma.loan.count({
          where: {
            schoolId,
            status: { in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE] },
            dueDate: { lt: new Date() },
          },
        }),
        this.prisma.loan.count({
          where: { schoolId, checkoutDate: { gte: startOfDay } },
        }),
      ]);
    return { books, copies, activeLoans, overdueCount, loansToday };
  }

  myLoans(schoolId: string, userId: string) {
    return this.prisma.loan.findMany({
      where: {
        schoolId,
        userId,
        status: { in: [LoanStatus.ACTIVE, LoanStatus.OVERDUE] },
      },
      include: { copy: { include: { book: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }
}

function makeBarcodes(start: string, count: number) {
  return Array.from({ length: count }, (_, index) =>
    index === 0
      ? start.trim()
      : `${start.trim()}-${String(index + 1).padStart(2, '0')}`,
  );
}

function parseCsv(input: string): string[][] {
  input = input.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted && character === '"' && input[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && input[index + 1] === '\n') index += 1;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }
  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}
