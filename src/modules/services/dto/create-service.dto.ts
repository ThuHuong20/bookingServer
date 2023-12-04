import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @Allow()
  price: number;

  @ApiProperty()
  @Allow()
  name: string;

  @ApiProperty()
  @Allow()
  desc: string;

  @ApiProperty()
  @Allow()
  avatar: string;
}
