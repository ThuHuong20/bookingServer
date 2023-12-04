import { Module } from '@nestjs/common';
import { VoucherHistoryService } from './voucher-history.service';
import { VoucherHistoryController } from './voucher-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherHistory } from './entities/voucher-history.entity';

@Module({
  imports : [TypeOrmModule.forFeature([VoucherHistory])],
  controllers: [VoucherHistoryController],
  providers: [VoucherHistoryService],
})
export class VoucherHistoryModule {}
