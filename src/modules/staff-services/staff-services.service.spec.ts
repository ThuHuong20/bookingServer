import { Test, TestingModule } from '@nestjs/testing';
import { StaffServicesService } from './staff-services.service';

describe('StaffServicesService', () => {
  let service: StaffServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffServicesService],
    }).compile();

    service = module.get<StaffServicesService>(StaffServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
