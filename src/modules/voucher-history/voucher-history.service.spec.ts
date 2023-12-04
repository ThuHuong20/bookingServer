import { Test, TestingModule } from '@nestjs/testing';
import { VoucherHistoryService } from './voucher-history.service';

describe('VoucherHistoryService', () => {
  let service: VoucherHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoucherHistoryService],
    }).compile();

    service = module.get<VoucherHistoryService>(VoucherHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
