import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDetailDto } from './create-appointment-detail.dto';

export class UpdateAppointmentDetailDto extends PartialType(CreateAppointmentDetailDto) {}
