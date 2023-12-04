import { PartialType } from '@nestjs/swagger';
import { CreateVoucherHistoryDto } from './create-voucher-history.dto';

export class UpdateVoucherHistoryDto extends PartialType(CreateVoucherHistoryDto) {}
