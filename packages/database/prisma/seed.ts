import {
  PrismaClient,
  Role,
  UserStatus,
} from '@paideon/database/generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' }),
});
const schoolCode = 'PAIDEON-SEED';
const adminPassword = 'LibraryAdmin!2026';
const librarianPassword = 'LibraryDesk!2026';
const studentPassword = 'Student!2026';

async function main() {
  const school = await prisma.school.upsert({
    where: { schoolCode },
    update: {},
    create: {
      schoolCode,
      name: 'Paideon Demonstration School',
      slug: 'paideon-demo-school',
      type: 'NATIONAL',
      medium: ['ENGLISH'],
    },
  });

  await prisma.libraryConfig.upsert({
    where: { schoolId: school.id },
    update: { overdueFinePerDayLKR: 2 },
    create: {
      schoolId: school.id,
      updatedAt: new Date(),
      overdueFinePerDayLKR: 2,
    },
  });

  const staff: Array<{
    paideonId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    cardNumber: string;
    password: string;
  }> = [
    {
      paideonId: 'PAI-ADMIN-0001',
      email: 'admin@paideon.local',
      firstName: 'Library',
      lastName: 'Administrator',
      role: Role.ADMIN,
      cardNumber: 'PAI-ADMIN-CARD-0001',
      password: adminPassword,
    },
    {
      paideonId: 'PAI-LIB-0001',
      email: 'librarian@paideon.local',
      firstName: 'School',
      lastName: 'Librarian',
      role: Role.LIBRARIAN,
      cardNumber: 'PAI-LIB-CARD-0001',
      password: librarianPassword,
    },
  ];

  for (const person of staff) {
    await prisma.user.upsert({
      where: { paideonId: person.paideonId },
      update: {
        email: person.email,
        password: await bcrypt.hash(person.password, 12),
        role: person.role,
        status: UserStatus.ACTIVE,
      },
      create: {
        schoolId: school.id,
        paideonId: person.paideonId,
        email: person.email,
        password: await bcrypt.hash(person.password, 12),
        role: person.role,
        status: UserStatus.ACTIVE,
        firstName: person.firstName,
        lastName: person.lastName,
        cardNumber: person.cardNumber,
        emailVerified: true,
      },
    });
  }

  const studentHash = await bcrypt.hash(studentPassword, 12);
  for (let index = 1; index <= 10; index += 1) {
    const number = String(index).padStart(4, '0');
    const user = await prisma.user.upsert({
      where: { paideonId: `PAI-STU-${number}` },
      update: {
        password: studentHash,
        status: UserStatus.ACTIVE,
      },
      create: {
        schoolId: school.id,
        paideonId: `PAI-STU-${number}`,
        email: `student${number}@paideon.local`,
        password: studentHash,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
        firstName: 'Student',
        lastName: `${index}`,
        cardNumber: `PAI-STU-CARD-${number}`,
        emailVerified: true,
      },
    });

    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        schoolId: school.id,
        admissionNumber: `SEED-${number}`,
        dateOfBirth: new Date(Date.UTC(2010, 0, index)),
        gender: index % 2 === 0 ? 'FEMALE' : 'MALE',
        medium: 'ENGLISH',
        currentGrade: 8,
        admissionDate: new Date(Date.UTC(2020, 0, 1)),
        gradeAtAdmission: 2,
      },
    });
  }

  for (let index = 1; index <= 30; index += 1) {
    const number = String(index).padStart(3, '0');
    const catalogNumber = `SEED-${number}`;
    const book = await prisma.book.upsert({
      where: {
        catalogNumber_schoolId: { catalogNumber, schoolId: school.id },
      },
      update: {},
      create: {
        schoolId: school.id,
        catalogNumber,
        isbn13: `9780000000${number}`,
        title: `Sample Library Book ${number}`,
        authors: [`Sample Author ${index}`],
        categories: [index % 2 === 0 ? 'Fiction' : 'Non-fiction'],
        subjects: ['General'],
        localSubjects: [],
        tags: [],
      },
    });

    const copies = 1 + ((index - 1) % 3);
    for (let copy = 1; copy <= copies; copy += 1) {
      const code = `PAI-B-${number}-${String(copy).padStart(2, '0')}`;
      await prisma.bookCopy.upsert({
        where: { code_schoolId: { code, schoolId: school.id } },
        update: {},
        create: {
          bookId: book.id,
          schoolId: school.id,
          code,
        },
      });
    }
  }

  console.log('Seeded librarian circulation demo.');
  console.log(`ADMIN     admin@paideon.local / ${adminPassword}`);
  console.log(`LIBRARIAN librarian@paideon.local / ${librarianPassword}`);
  console.log(`STUDENT   student0001@paideon.local / ${studentPassword}`);
}

main()
  .catch((error: unknown) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
