import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class AddCopyDto {
  @IsString()
  @IsNotEmpty()
  barcode!: string;
}

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  memberBarcode!: string;

  @IsString()
  @IsNotEmpty()
  copyBarcode!: string;
}

export class ReturnDto {
  @IsString()
  @IsNotEmpty()
  copyBarcode!: string;
}

export class RenewDto {
  @IsString()
  @IsNotEmpty()
  copyBarcode!: string;
}

export class WaiveFineDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

export class BooksQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 25;
}
