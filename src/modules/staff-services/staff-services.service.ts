import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';
import { UpdateStaffServiceDto } from './dto/update-staff-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffService } from './entities/staff-service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StaffServicesService {
  constructor(
    @InjectRepository(StaffService)
    private StaffServiceRepository: Repository<StaffService>,
  ) {}

  async create(createStaffServiceDto: CreateStaffServiceDto) {
    try {
      let service = await this.StaffServiceRepository.save(
        createStaffServiceDto,
      );
      return {
        status: true,
        message: 'Servicio Creado',
        data: service,
      };
    } catch (err) {
      console.log('err', err);
      return {
        status: false,
        message: 'Create fail',
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      let staffServiceId = await this.StaffServiceRepository.findOne({
        where: { id },
        relations: {
          staff: true,
          service: true,
        },
      });
      return {
        status: true,
        message: 'find categoryId success',
        data: staffServiceId,
      };
    } catch (err) {
      return {
        status: false,
        message: 'find categoryId success',
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      let staffServiceId = await this.StaffServiceRepository.delete(id);
      //console.log("staffServiceId:", staffServiceId)
      return {
        status: true,
        message: 'delete success',
        data: staffServiceId,
      };
    } catch (err) {
      //console.log(" err:", err)
      return {
        status: true,
        message: 'delete success',
        data: null,
      };
    }
  }
}
