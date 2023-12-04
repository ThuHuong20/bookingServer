import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { StaffService } from '../staff-services/entities/staff-service.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, StaffService]), ConfigModule],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule { }
