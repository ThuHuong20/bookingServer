import { IsNotEmpty } from "class-validator";

export class CreateVoucherHistoryDto {
    @IsNotEmpty()
    appointmentId: number

    @IsNotEmpty()
    voucherId: number

    @IsNotEmpty()
    customerId: number

}
