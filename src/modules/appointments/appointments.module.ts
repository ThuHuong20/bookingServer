import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { MailService } from '../mail/mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[TypeOrmModule.forFeature([Appointment]),ConfigModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, MailService],
})
export class AppointmentsModule {}
