import { ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";

export class PaginationDto {
    @ApiProperty()
    @Allow()
    skip: number;

    @ApiProperty()
    @Allow()
    take: number;
}