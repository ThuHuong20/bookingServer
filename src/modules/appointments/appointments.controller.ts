import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    console.log("idAccept", id);
    let result = await this.appointmentsService.acceptAppointment(+id);
    if (!result) return false

    return res.status(HttpStatus.OK).json(result)

  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id);
  }
  @UseGuards(AuthGuard) 
  @Patch('information/:id')
  updateInformation(@Param('id') id: number, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    console.log("da vao controller")
    return this.appointmentsService.updateInformation(id, updateAppointmentDto);
  }
  @UseGuards(AuthGuard) 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
