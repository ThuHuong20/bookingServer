import { async } from 'rxjs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  HttpStatus,
  HttpException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Response } from 'express';
import { PaginationDto } from '../services/dto/pagination-service.dto';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
class ResInterface {
  @ApiProperty()
  message : string 
  @ApiProperty()
  data : any
  @ApiProperty()
  status: boolean
}

function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

@ApiTags('vouchers')
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}
  @UseGuards(AuthGuard) 
  @Post()
  @ApiBody({
    schema : {
      type: "object" ,
      properties: {
        title : {
          type:"string",
        },
        code : {
          type:"string",
        },
        value : {
          type:"number",
        },
        discountType : {
          type:"string",
        }
        ,
        startAt : {
          type:"string",
        }
        ,
        endAt : {
          type:"string",
        }
      },
      example : {
        title : "Voucher of summer",
        code:"abC3#f",
        value : "10",
        discountType: "percent",
        startAt: "4/11/2023",
        endAt: "10/11/2023"
      }
    }
  })
@ApiResponse({
  type: ResInterface
})
  async create(
    @Body() body: any,
    createVoucherDto: CreateVoucherDto,
    @Res() res: Response,
  ): Promise<false | Response<any, Record<string, any>>> {
    let arrayVoucher = [];
    for (let i = 0; i < body.quantity; i++) {
      let createVoucher = generateRandomString(6);

      let formatVoucher = {
        code: createVoucher,
        discountType: body.discountType,
        value: body.value,
        title: body.title,
        startAt: body.startAt,
        endAt: body.endAt,
      };
      arrayVoucher.push(formatVoucher);
    }
    let voucherRes = await Promise.all(
      arrayVoucher.map(
        async (voucher) => await this.vouchersService.create(voucher),
      ),
    );
    if (!voucherRes) return false;
    return res.status(voucherRes ? 200 : 213).json(voucherRes);
  }

  @Get('search')
  @ApiResponse({
    type: ResInterface
  })
  async finMany(@Res() res: Response, @Query('search') search: string) {
    if (search != undefined) {
      try {
        let serviceRes = await this.vouchersService.searchByCode(search);
        res.statusMessage = serviceRes.message;
        return res.status(HttpStatus.OK).json(serviceRes);
      } catch (err) {
        throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        let serviceRes = await this.vouchersService.findMany();
        res.statusMessage = serviceRes.message;
        return res.status(HttpStatus.OK).json(serviceRes);
      } catch (err) {
        throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Get('getvoucher')
  @ApiResponse({
    type: ResInterface
  })
  async getVoucher(@Res() res: Response, @Query('getvoucher') search: string) {
    try {
      if (this.getVoucher != undefined) {
        let serviceRes = await this.vouchersService.getVoucher(search);
        res.statusMessage = serviceRes.message;
        return res.status(serviceRes.status ? 200 : 213).json(serviceRes);
      }
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard) 
  @Get()
  async findAll(
    @Res() res: Response,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    try {
      let pagination: PaginationDto = {
        skip,
        take,
      };
      let voucherRes = await this.vouchersService.findAll(pagination);
      res.statusMessage = voucherRes.message;
      res
        .status(voucherRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
        .json(voucherRes);
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.vouchersService.findOne(+id);
  }

  
  @UseGuards(AuthGuard) 
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.vouchersService.update(id, updateVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(+id);
  }
}
