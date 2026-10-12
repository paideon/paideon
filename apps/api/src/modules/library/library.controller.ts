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
import { Role } from '@paideon/database/generated/client/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
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
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.LIBRARIAN)
export class LibraryController {
  constructor(private readonly library: LibraryService) {}

  @Get('books')
  @Roles(Role.ADMIN, Role.LIBRARIAN, Role.STUDENT)
  listBooks(@CurrentUser() user: JwtPayload, @Query() query: BooksQueryDto) {
    return this.library.listBooks(user.schoolId, query);
  }

  @Post('books')
  createBook(@CurrentUser() user: JwtPayload, @Body() dto: CreateBookDto) {
    return this.library.createBook(user.schoolId, dto);
  }

  @Patch('books/:id')
  updateBook(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.library.updateBook(user.schoolId, id, dto);
  }

  @Post('books/:id/copies')
  addCopy(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AddCopyDto,
  ) {
    return this.library.addCopy(user.schoolId, id, dto.barcode);
  }

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

  @Get('members')
  members(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    return this.library.searchMembers(user.schoolId, search);
  }

  @Get('members/:id')
  memberDetail(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.library.memberDetail(user.schoolId, id);
  }

  @Post('circulation/checkout')
  checkout(@CurrentUser() user: JwtPayload, @Body() dto: CheckoutDto) {
    return this.library.checkout(
      user.schoolId,
      user.sub,
      dto.memberBarcode,
      dto.copyBarcode,
    );
  }

  @Post('circulation/return')
  returnCopy(@CurrentUser() user: JwtPayload, @Body() dto: ReturnDto) {
    return this.library.returnCopy(user.schoolId, user.sub, dto.copyBarcode);
  }

  @Post('circulation/renew')
  renew(@CurrentUser() user: JwtPayload, @Body() dto: RenewDto) {
    return this.library.renew(user.schoolId, dto.copyBarcode);
  }

  @Get('fines')
  unpaidFines(
    @CurrentUser() user: JwtPayload,
    @Query('memberId') memberId?: string,
  ) {
    return this.library.unpaidFines(user.schoolId, memberId);
  }

  @Patch('fines/:id/pay')
  payFine(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.library.payFine(user.schoolId, id);
  }

  @Patch('fines/:id/waive')
  waiveFine(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: WaiveFineDto,
  ) {
    return this.library.waiveFine(user.schoolId, user.sub, id, dto.reason);
  }

  @Get('reports/overdue')
  overdue(@CurrentUser() user: JwtPayload) {
    return this.library.overdue(user.schoolId);
  }

  @Get('reports/stats')
  stats(@CurrentUser() user: JwtPayload) {
    return this.library.stats(user.schoolId);
  }
}

@Controller('library/me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
export class StudentLibraryController {
  constructor(private readonly library: LibraryService) {}

  @Get('loans')
  myLoans(@CurrentUser() user: JwtPayload) {
    return this.library.myLoans(user.schoolId, user.sub);
  }
}
