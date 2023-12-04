import { IsNotEmpty } from "class-validator";

export class CreateAppointmentDetailDto {
    @IsNotEmpty()
    appointmentId: number

    @IsNotEmpty()
    customerId: number

    @IsNotEmpty()
    serviceId: number
    
    @IsNotEmpty()
    staffId: number
    
    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    slot: number
}

export class ArrayCreateAppointmentDetailDto{
    createAppointmentDetailDto : CreateAppointmentDetailDto[]
}