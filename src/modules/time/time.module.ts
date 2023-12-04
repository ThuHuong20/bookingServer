import { Module } from '@nestjs/common';
import { TimeService } from './time.service';
import { TimeController } from './time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Time } from './entities/time.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Time]),ConfigModule],
  controllers: [TimeController],
  providers: [TimeService],
})
export class TimeModule { }
