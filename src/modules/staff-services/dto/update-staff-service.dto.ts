import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffServiceDto } from './create-staff-service.dto';
import { Allow } from 'class-validator';

export class UpdateStaffServiceDto extends PartialType(CreateStaffServiceDto) {

}
