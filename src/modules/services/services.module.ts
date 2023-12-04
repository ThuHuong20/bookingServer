import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { StaffService } from '../staff-services/entities/staff-service.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Service, StaffService]), ConfigModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule { }
