import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeDto } from './create-time.dto';
import { Allow } from 'class-validator';

export class UpdateTimeDto extends PartialType(CreateTimeDto) {
    @Allow()
    duration: number

    @Allow()
    startTime: string

    @Allow()
    endTime: string

    @Allow()
    maxDate: number

    @Allow()
    stepMinute: number

    @Allow()
    reminderTime: number
}