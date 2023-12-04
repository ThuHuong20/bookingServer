import { async } from 'rxjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationDto } from '../services/dto/pagination-service.dto';
import moment from 'moment';

function formatTimestampToDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
@Injectable()
export class VouchersService {
  constructor(@InjectRepository(Voucher) private voucherSer: Repository<Voucher>) { }
  async create(data: CreateVoucherDto) {
    try {
      let result = await this.voucherSer.save(data)
      return {
        status: true,
        message: "create okey ",
        data: result
      }
    } catch {
      return {
        status: false,
        message: "create failed ",
        data: null
      }
    }
  }


  async findAll(pagination: PaginationDto) {
    try {
      let services = await this.voucherSer.find({
        where: {
          IsDelete: false
        },
        skip: pagination.skip,
        take: pagination.take
      })

      let countItem = (await this.voucherSer.find({
        where: {
          IsDelete: false
        }
      })).length
      let maxPage = Math.ceil(countItem / pagination.take)
      return {
        message: 'get voucher pagination successful',
        data: services,
        maxPage
      }
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST)
    }
  }

  async findMany() {
    let result = await this.voucherSer.find({
      where: {
        IsDelete: false
      }
    })
    if (!result) return {
      status: false,
      message: "get faild"
    }
    return {
      status: true,
      message: 'successful get all voucher',
      data: result
    }
  }

  async searchByCode(searchString: string) {
    try {
      let result = await this.voucherSer.find({
        where: {
          code: ILike(`%${searchString}%`),
          IsDelete: false
        }
      })
      if (result.length > 0) {
        return {
          data: result,
          message: "search voucher okey"
        }
      } else {
        return {
          massage: "invailid voucher"
        }
      }

    } catch {
      return {
        data: null,
        message: "search voucher faild"
      }

    }
  }
  async getVoucher(searchString: string) {
    try {
      let result = await this.voucherSer.findOne({
        where: {
          code: ILike(`${searchString}`),
          IsDelete: false
        }
      })
      if (result) {
        // check xem trang thai voucher da su dung hay chua
        if (!result.status) {// check xem voucher con trong thoi han hay khong
          if ((Date.now() - Number(result.startAt)) < 0 || (Date.now() - Number(result.endAt)) > 0) {
            return {
              status: false,
              data: null,
              message: ` Expiry date of Voucher From : ${formatTimestampToDate(Number(result.startAt))}  - To : ${formatTimestampToDate(Number(result.endAt))} !`
            }
          } else {
            return {
              status: true,
              data: result,
              message: "Add Voucher Successfull !"
            }
          }
        } else {
          return {
            status: false,
            data: null,
            message: "Voucher has been used, please try again with another voucher, Thank You !"
          }
        }

      } else {
        return {
          status: false,
          message: " Voucher Invalid !"
        }
      }


    } catch {
      return {
        data: null,
        message: "search voucher faild"
      }

    }
  }

  async findOne(id: number) {
    try {
      const result = await this.voucherSer.findOne({
        where: {
          id,
        }
      })
      if (!result) return {
        status: false,
        data: null,
        message: 'Not Found'
      }
      return {
        status: true,
        message: 'get one voucher successfully',
        data: result
      }
    } catch {

    }

  }

  async update(id: number, updateVoucherDto: UpdateVoucherDto) {
    try {
      const oldData = await this.voucherSer.findOne({
        where: {
          id
        }
      })
      const resutl = this.voucherSer.merge(oldData, updateVoucherDto)
      const updateData = await this.voucherSer.save(resutl)
      if (!resutl) return false
      return {
        status: true,
        message: "Delete Successfull ",
        data: updateData
      }
    } catch {
      return {
        status: false,
        message: "Delete Faild ",
        data: null
      }
    }

  }
  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }
}