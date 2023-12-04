import { Injectable } from '@nestjs/common';
import { CreateVoucherHistoryDto } from './dto/create-voucher-history.dto';
import { UpdateVoucherHistoryDto } from './dto/update-voucher-history.dto';

@Injectable()
export class VoucherHistoryService {
  create(createVoucherHistoryDto: CreateVoucherHistoryDto) {
    return 'This action adds a new voucherHistory';
  }

  findAll() {
    return `This action returns all voucherHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voucherHistory`;
  }

  update(id: number, updateVoucherHistoryDto: UpdateVoucherHistoryDto) {
    return `This action updates a #${id} voucherHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucherHistory`;
  }
}
