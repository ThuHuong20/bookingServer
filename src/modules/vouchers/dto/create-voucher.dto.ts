import { ApiProperty } from "@nestjs/swagger"
import { Allow, IsNotEmpty } from "class-validator"

export class CreateVoucherDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string

    @ApiProperty()
    @IsNotEmpty()
    code: string

    @ApiProperty()
    @IsNotEmpty()
    value: number

    @ApiProperty()
    @IsNotEmpty()
    discountType: string

    @ApiProperty()    
    startAt: string

    @ApiProperty()
    endAt: string
    

}
