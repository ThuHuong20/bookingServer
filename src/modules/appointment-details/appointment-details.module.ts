import { Module } from '@nestjs/common';
import { AppointmentDetailsService } from './appointment-details.service';
import { AppointmentDetailsController } from './appointment-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentDetail } from './entities/appointment-detail.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AppointmentDetail])],
  controllers: [AppointmentDetailsController],
  providers: [AppointmentDetailsService],
})
export class AppointmentDetailsModule {}
