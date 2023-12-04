import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { Allow } from 'class-validator';

import { AppointmentStatus } from '../appointment.enum';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
    @Allow()
    id: number
    @Allow()
    status: AppointmentStatus
    @Allow()
    date: string
    @Allow()
    time: string
}
