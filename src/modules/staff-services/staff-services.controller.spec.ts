import { Test, TestingModule } from '@nestjs/testing';
import { StaffServicesController } from './staff-services.controller';
import { StaffServicesService } from './staff-services.service';

describe('StaffServicesController', () => {
  let controller: StaffServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffServicesController],
      providers: [StaffServicesService],
    }).compile();

    controller = module.get<StaffServicesController>(StaffServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
