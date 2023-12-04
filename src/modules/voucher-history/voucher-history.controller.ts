import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VoucherHistoryService } from './voucher-history.service';
import { CreateVoucherHistoryDto } from './dto/create-voucher-history.dto';
import { UpdateVoucherHistoryDto } from './dto/update-voucher-history.dto';

@Controller('voucher-history')
export class VoucherHistoryController {
  constructor(private readonly voucherHistoryService: VoucherHistoryService) {}

  @Post()
  create(@Body() createVoucherHistoryDto: CreateVoucherHistoryDto) {
    return this.voucherHistoryService.create(createVoucherHistoryDto);
  }

  @Get()
  findAll() {
    return this.voucherHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voucherHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherHistoryDto: UpdateVoucherHistoryDto) {
    return this.voucherHistoryService.update(+id, updateVoucherHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherHistoryService.remove(+id);
  }
}
