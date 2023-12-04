import { Injectable } from '@nestjs/common';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Time } from './entities/time.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(Time)
    private timeRepository: Repository<Time>
  ) { }
  create(createTimeDto: CreateTimeDto) {
    return 'This action adds a new time';
  }

  async findAll() {
    try {
      let time = await this.timeRepository.findOne({
        where: {
          id: 1
        }
      });
      return {
        status: true,
        data: time
      }
    } catch {
      return {
        status: false,
        data: null
      }
    }
  }

  async update(updateTimeDto: UpdateTimeDto) {
    try {
      let timeSource = await this.timeRepository.findOne({
        where: {
          id: 1
        }
      })

      let timeSourceUpdate = this.timeRepository.merge(timeSource, updateTimeDto);
      let result = await this.timeRepository.save(timeSourceUpdate);
      return {
        status: true,
        data: result,
        message: "Update ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }


}
