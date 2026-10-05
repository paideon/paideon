import { IsEmail } from 'class-validator';

export class RequestActivationDto {
  @IsEmail()
  email!: string;
}
