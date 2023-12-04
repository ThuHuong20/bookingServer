import { Allow, IsNotEmpty, IsNumber } from "class-validator";

export class CreateStaffServiceDto {

    @IsNotEmpty()
    serviceId: number

    @IsNotEmpty()
    staffId: number

}
