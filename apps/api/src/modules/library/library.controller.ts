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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CapabilityGuard } from '../access/capability.guard';
import { RequireCapability } from '../access/require-capability.decorator';
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

@Controller('library')
@UseGuards(JwtAuthGuard, CapabilityGuard)
export class LibraryController {
  constructor(private readonly library: LibraryService) {}

  // Browsing the catalogue is open to everyone who is signed in.
  @Get('books')
  listBooks(@CurrentUser() user: JwtPayload, @Query() query: BooksQueryDto) {
    return this.library.listBooks(user.schoolId, query);
  }

  @RequireCapability('library.manage')
  @Post('books')
  createBook(@CurrentUser() user: JwtPayload, @Body() dto: CreateBookDto) {
    return this.library.createBook(user.schoolId, dto);
  }

  @RequireCapability('library.manage')
  @Patch('books/:id')
  updateBook(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.library.updateBook(user.schoolId, id, dto);
  }

  @RequireCapability('library.manage')
  @Post('books/:id/copies')
  addCopy(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AddCopyDto,
  ) {
    return this.library.addCopy(user.schoolId, id, dto.barcode);
  }

  @RequireCapability('library.manage')
  @Post('books/import')
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

  @RequireCapability('library.members.read')
  @Get('members')
  members(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    return this.library.searchMembers(user.schoolId, search);
  }

  @RequireCapability('library.members.read')
  @Get('members/:id')
  memberDetail(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.library.memberDetail(user.schoolId, id);
  }

  @RequireCapability('library.desk')
  @Post('circulation/checkout')
  checkout(@CurrentUser() user: JwtPayload, @Body() dto: CheckoutDto) {
    return this.library.checkout(
      user.schoolId,
      user.sub,
      dto.memberBarcode,
      dto.copyBarcode,
    );
  }

  @RequireCapability('library.desk')
  @Post('circulation/return')
  returnCopy(@CurrentUser() user: JwtPayload, @Body() dto: ReturnDto) {
    return this.library.returnCopy(user.schoolId, user.sub, dto.copyBarcode);
  }

  @RequireCapability('library.desk')
  @Post('circulation/renew')
  renew(@CurrentUser() user: JwtPayload, @Body() dto: RenewDto) {
    return this.library.renew(user.schoolId, dto.copyBarcode);
  }

  @RequireCapability('library.fines')
  @Get('fines')
  unpaidFines(
    @CurrentUser() user: JwtPayload,
    @Query('memberId') memberId?: string,
  ) {
    return this.library.unpaidFines(user.schoolId, memberId);
  }

  @RequireCapability('library.fines')
  @Patch('fines/:id/pay')
  payFine(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.library.payFine(user.schoolId, id);
  }

  @RequireCapability('library.fines')
  @Patch('fines/:id/waive')
  waiveFine(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: WaiveFineDto,
  ) {
    return this.library.waiveFine(user.schoolId, user.sub, id, dto.reason);
  }

  @RequireCapability('library.reports')
  @Get('reports/overdue')
  overdue(@CurrentUser() user: JwtPayload) {
    return this.library.overdue(user.schoolId);
  }

  @RequireCapability('library.reports')
  @Get('reports/stats')
  stats(@CurrentUser() user: JwtPayload) {
    return this.library.stats(user.schoolId);
  }
}

// A person's own library record: loans and fines. It only ever reads the
// rows of the person in the access token, so everyone signed in may call it.
@Controller('library/me')
@UseGuards(JwtAuthGuard)
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
