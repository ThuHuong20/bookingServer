import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  email: string;
}
