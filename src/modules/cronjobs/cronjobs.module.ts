import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { CronjobsController } from './cronjobs.controller';
import { MailService } from '../mail/mail.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { TimeService } from '../time/time.service';
import { Time } from '../time/entities/time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Time])],
  controllers: [CronjobsController],
  providers: [CronjobsService, MailService, AppointmentsService,TimeService],
})
export class CronjobsModule {}
