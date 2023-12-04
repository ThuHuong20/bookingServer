import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Response } from 'express';
import { PaginationDto } from './dto/pagination-customer.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body() body: any,
    createCustomerDto: CreateCustomerDto,
    @Res() res: Response,
  ) {
    const customerData = {
      fullName: body?.customer?.fullName,
      email: body?.customer?.email,
      phoneNumber: body?.customer?.phoneNumber,
    };

    // tinh total ;
    let totalNotVoucherBefore: number;
    let totalNotVoucherAfter = (totalNotVoucherBefore = body?.details?.reduce(
      (acc: number, appointment: any) => {
        const appointmentCost = appointment.price * appointment.slot;
        return acc + appointmentCost;
      },
      0,
    ));
    // tinh tien khi khong co voucher
    if (!body.voucher) {
      totalNotVoucherBefore = body?.details?.reduce((acc, appointment) => {
        const appointmentCost = appointment.price * appointment.slot;
        return acc + appointmentCost;
      }, 0);
    } else {
      // tinh tien khi co voucher
      // tinh tien khi co voucher vs type cash
      if (body.voucher.discountType == 'cash') {
        totalNotVoucherBefore =
          totalNotVoucherAfter - Number(body?.voucher?.value);
        console.log('totalNotVoucherBefore', totalNotVoucherBefore);
        // tinh tien khi co voucher vs type cash & total < value discount
        if (totalNotVoucherBefore < 0) {
          totalNotVoucherBefore = 0;
        }
        // tinh tien khi co voucher vs type percent
      } else if (body.voucher.discountType == 'percent') {
        console.log('percent', body.voucher.discountType);
        totalNotVoucherBefore =
          totalNotVoucherAfter -
          totalNotVoucherAfter * Number(body?.voucher?.value) * 0.01;
      }
    }
    const appointmentData = {
      date: body?.appointment?.date,
      time: body?.appointment?.time,
      total: body?.voucher ? totalNotVoucherBefore : totalNotVoucherAfter,
    };
    const formatAppoimentDetail = body?.details;
    let voucherHistoryData: any;
    if (body?.voucher) {
      console.log('voucher', body?.voucher);
      voucherHistoryData = {
        voucherId: body?.voucher?.id,
      };
    }
    let result = await this.customersService.create(
      customerData,
      appointmentData,
      formatAppoimentDetail,
      voucherHistoryData,
      body?.voucher,
    );
    console.log('result', result);
    return res.status(result.status ? 200 : 213).json(result.message);
  }
  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Res() res: Response,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    try {
      console.log('vao phan trang customer');

      let pagination: PaginationDto = {
        skip,
        take,
      };
      let customerRes = await this.customersService.findAll(pagination);
      res.statusMessage = customerRes.message;
      res
        .status(customerRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
        .json(customerRes);
    } catch (err) {
      console.log('🚀CustomersController ~ err:', err);
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(AuthGuard)
  @Get('search')
  async findAllCustomer(@Res() res: Response, @Query('q') q: string) {
    console.log('search Customer', q);

    if (q != undefined) {
      try {
        console.log("q",q)
        return res.status(HttpStatus.OK).json(await this.customersService.searchByEmail(q))
      } catch (err) {
        throw new HttpException('Loi Controller', HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        let customerResAll = await this.customersService.findCustomer();
        res.statusMessage = customerResAll.message;
        res
          .status(customerResAll.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
          .json(customerResAll);
      } catch (err) {
        // console.log('🚀 ~ file: customers.controller.:', err);
        throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
