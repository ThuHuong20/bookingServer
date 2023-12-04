import { Test, TestingModule } from '@nestjs/testing';
import { VoucherHistoryController } from './voucher-history.controller';
import { VoucherHistoryService } from './voucher-history.service';

describe('VoucherHistoryController', () => {
  let controller: VoucherHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherHistoryController],
      providers: [VoucherHistoryService],
    }).compile();

    controller = module.get<VoucherHistoryController>(VoucherHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
