import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentDetailsService } from './appointment-details.service';
import { CreateAppointmentDetailDto } from './dto/create-appointment-detail.dto';
import { UpdateAppointmentDetailDto } from './dto/update-appointment-detail.dto';

@Controller('appointment-details')
export class AppointmentDetailsController {
  constructor(private readonly appointmentDetailsService: AppointmentDetailsService) {}

  @Post()
  create(@Body() createAppointmentDetailDto: CreateAppointmentDetailDto) {
    return this.appointmentDetailsService.create(createAppointmentDetailDto);
  }

  @Get()
  findAll() {
    return this.appointmentDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDetailDto: UpdateAppointmentDetailDto) {
    return this.appointmentDetailsService.update(+id, updateAppointmentDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentDetailsService.remove(+id);
  }
}
