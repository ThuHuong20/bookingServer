import { PartialType } from '@nestjs/mapped-types';
import { CreateCronjobDto } from './create-cronjob.dto';

export class UpdateCronjobDto extends PartialType(CreateCronjobDto) {}
