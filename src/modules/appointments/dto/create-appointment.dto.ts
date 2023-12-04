import { IsNotEmpty } from "class-validator";

export class CreateAppointmentDto {
    @IsNotEmpty()
    customerId: number

    @IsNotEmpty()
    date: string

    @IsNotEmpty()
    time: string

    @IsNotEmpty()
    total: number
}
