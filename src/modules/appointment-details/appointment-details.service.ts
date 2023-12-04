import { Injectable } from '@nestjs/common';
import { CreateAppointmentDetailDto } from './dto/create-appointment-detail.dto';
import { UpdateAppointmentDetailDto } from './dto/update-appointment-detail.dto';

@Injectable()
export class AppointmentDetailsService {
  create(createAppointmentDetailDto: CreateAppointmentDetailDto) {
    return 'This action adds a new appointmentDetail';
  }

  findAll() {
    return `This action returns all appointmentDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointmentDetail`;
  }

  update(id: number, updateAppointmentDetailDto: UpdateAppointmentDetailDto) {
    return `This action updates a #${id} appointmentDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointmentDetail`;
  }
}
