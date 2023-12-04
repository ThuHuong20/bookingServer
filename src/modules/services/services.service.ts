import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination-service.dto';
import { StaffService } from '../staff-services/entities/staff-service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    @InjectRepository(StaffService)
    private StaffServiceRepository: Repository<StaffService>,
  ) {}

  async remove(id: number) {
    try {
      let serviceData = await this.serviceRepository.findOne({ where: { id } });

      let newData = {
        ...serviceData,
        isDelete: true,
      };
      const result = this.serviceRepository.merge(serviceData, newData);

      const updateResult = await this.serviceRepository.save(result);

      if (updateResult) {
        return {
          status: true,
          data: updateResult,
          message: 'Delete ok',
        };
      }
    } catch (err) {
      return {
        status: false,
        message: 'Delete Faild ',
        data: null,
      };
    }
  }

  async create(createServiceDto: CreateServiceDto) {
    try {
      let service = await this.serviceRepository.save(createServiceDto);
      if (!service) {
        throw new Error('Error');
      }

      if (!service) {
        throw new HttpException(`service not found`, HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Servicio Creado',
        data: service,
      };
    } catch (err) {
      console.log('err', err);
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      let services = await this.serviceRepository.find({
        where: {
          isDelete: false,
        },
        relations: {
          staffServices: {
            service: true,
            staff: true,
          },
          appointmentDetails: true,
        },
        skip: pagination.skip,
        take: pagination.take,
      });

      let countItem = (
        await this.serviceRepository.find({
          where: {
            isDelete: false,
          },
        })
      ).length;
      let maxPage = Math.ceil(countItem / pagination.take);
      return {
        message: 'successful',
        data: services,
        maxPage,
      };
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST);
    }
  }

  async findServie() {
    try {
      let services = await this.serviceRepository.find({
        where: {
          isDelete: false,
          status: true,
        },
        relations: {
          staffServices: {
            staff: true,
          },
          appointmentDetails: true,
        },
      });
      return {
        message: 'successful',
        data: services,
      };
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      let data = await this.serviceRepository.findOne({ where: { id } });
      console.log('dataupdate', data);

      if (!data) return false;
      // console.log("updatedata", updateServiceDto);

      let newData = this.serviceRepository.merge(data, updateServiceDto);
      let result = await this.serviceRepository.save(newData);
      console.log('result', result);

      return {
        status: true,
        message: 'Update service Successfully!',
        data: result,
      };
    } catch (err) {
      return {
        status: false,
        message: 'Update Faild ',
        data: null,
      };
    }
  }

  async searchByName(name: string) {
    try {
      let service = await this.serviceRepository.find({
        where: {
          isDelete: false,
          name: ILike(`%${name}%`),
        },
        relations: {
          staffServices: true,
          //appointmentDetails: true
        },
      });
      return {
        data: service,
        message: 'Get service successfully',
      };
    } catch (err) {
      console.log('err111111:', err);
      throw new HttpException('Loi Model', HttpStatus.BAD_REQUEST);
    }
  }
}
