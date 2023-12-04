import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { Allow } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
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

  @ApiProperty()
  @Allow()
  status: boolean;
}
