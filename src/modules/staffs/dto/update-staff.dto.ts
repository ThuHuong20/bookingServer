import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffDto } from './create-staff.dto';
import { Allow } from 'class-validator';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
    @Allow()
    name: string

    @Allow()
    birthDay: string

    @Allow()
    phoneNumber: string

    @Allow()
    desc: string

    @Allow()
    avatar: string

    @Allow()
    experience: string

    @Allow()
    status: boolean
}
