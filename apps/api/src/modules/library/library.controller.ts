import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Requires } from '../access/decorators/requires.decorator';
import { CapabilityGuard } from '../access/guards/capability.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import {
  AddCopyDto,
  BooksQueryDto,
  CheckoutDto,
  CreateBookDto,
  RenewDto,
  ReturnDto,
  UpdateBookDto,
  WaiveFineDto,
} from './dto/library.dto';
import { LibraryService } from './library.service';

type CsvUpload = { buffer: Buffer; originalname: string };

// Every route says which capability opens it. A route with no @Requires() is
// refused (see CapabilityGuard), so a forgotten label never leaves one open.
@Controller('library')
@UseGuards(JwtAuthGuard, CapabilityGuard)
export class LibraryController {
  constructor(private readonly library: LibraryService) {}

  @Get('books')
  @Requires('library.catalog.read')
  listBooks(@CurrentUser() user: JwtPayload, @Query() query: BooksQueryDto) {
    return this.library.listBooks(user.schoolId, query);
  }

  @Post('books')
  @Requires('library.manage')
  createBook(@CurrentUser() user: JwtPayload, @Body() dto: CreateBookDto) {
    return this.library.createBook(user.schoolId, dto);
  }

  @Patch('books/:id')
  @Requires('library.manage')
  updateBook(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.library.updateBook(user.schoolId, id, dto);
  }

  @Post('books/:id/copies')
  @Requires('library.manage')
  addCopy(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AddCopyDto,
  ) {
    return this.library.addCopy(user.schoolId, id, dto.barcode);
  }

  @Post('books/import')
  @Requires('library.manage')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  importBooks(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: CsvUpload,
  ) {
    if (!file?.buffer || !file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('Upload a CSV file in the file field.');
    }
    return this.library.importCsv(user.schoolId, file.buffer.toString('utf8'));
  }

  @Get('members')
  @Requires('library.members.read')
  members(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    return this.library.searchMembers(user.schoolId, search);
  }

  @Get('members/:id')
  @Requires('library.members.read')
  memberDetail(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.library.memberDetail(user.schoolId, id);
  }

  @Post('circulation/checkout')
  @Requires('library.desk')
  checkout(@CurrentUser() user: JwtPayload, @Body() dto: CheckoutDto) {
    return this.library.checkout(
      user.schoolId,
      user.sub,
      dto.memberBarcode,
      dto.copyBarcode,
    );
  }

  @Post('circulation/return')
  @Requires('library.desk')
  returnCopy(@CurrentUser() user: JwtPayload, @Body() dto: ReturnDto) {
    return this.library.returnCopy(user.schoolId, user.sub, dto.copyBarcode);
  }

  @Post('circulation/renew')
  @Requires('library.desk')
  renew(@CurrentUser() user: JwtPayload, @Body() dto: RenewDto) {
    return this.library.renew(user.schoolId, dto.copyBarcode);
  }

  @Get('fines')
  @Requires('library.fines', 'library.members.read')
  unpaidFines(
    @CurrentUser() user: JwtPayload,
    @Query('memberId') memberId?: string,
  ) {
    return this.library.unpaidFines(user.schoolId, memberId);
  }

  @Patch('fines/:id/pay')
  @Requires('library.fines')
  payFine(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.library.payFine(user.schoolId, id);
  }

  @Patch('fines/:id/waive')
  @Requires('library.fines')
  waiveFine(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: WaiveFineDto,
  ) {
    return this.library.waiveFine(user.schoolId, user.sub, id, dto.reason);
  }

  @Get('reports/overdue')
  @Requires('library.reports', 'library.desk')
  overdue(@CurrentUser() user: JwtPayload) {
    return this.library.overdue(user.schoolId);
  }

  @Get('reports/stats')
  @Requires('library.reports', 'library.desk')
  stats(@CurrentUser() user: JwtPayload) {
    return this.library.stats(user.schoolId);
  }
}

// A person's own library record: loans and fines. It only ever reads the
// rows of the person in the access token, so there is no id to tamper with.
@Controller('library/me')
@UseGuards(JwtAuthGuard, CapabilityGuard)
@Requires('library.own.read')
export class MyLibraryController {
  constructor(private readonly library: LibraryService) {}

  // ?scope=current (default) lists books still out; ?scope=history lists
  // books already returned (or lost).
  @Get('loans')
  myLoans(@CurrentUser() user: JwtPayload, @Query('scope') scope?: string) {
    if (scope !== undefined && scope !== 'current' && scope !== 'history') {
      throw new BadRequestException('scope must be "current" or "history".');
    }
    return this.library.myLoans(user.schoolId, user.sub, scope ?? 'current');
  }

  @Get('fines')
  myFines(@CurrentUser() user: JwtPayload) {
    return this.library.myFines(user.schoolId, user.sub);
  }
}
