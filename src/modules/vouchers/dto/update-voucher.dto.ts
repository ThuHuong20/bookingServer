import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherDto } from './create-voucher.dto';
import { Allow } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {
    @ApiProperty()
    @Allow()
    id:number

    @ApiProperty()
    @Allow()
    title: string;

    @ApiProperty()
    @Allow()
    code: string;

    @ApiProperty()
    @Allow()
    value: number;

    @ApiProperty()
    @Allow()
    discountType: string;

    @ApiProperty()
    @Allow()
    IsDelete: boolean

    @ApiProperty()
    @Allow()
    status: boolean

}
