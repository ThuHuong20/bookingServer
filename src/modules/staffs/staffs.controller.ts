import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
  Req,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { uploadFileToStorage } from '../../fb';
import { PaginationDto } from './dto/pagination-staff.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

class ResInterface {
  @ApiProperty()
  message: string;
  @ApiProperty()
  data: any;
  @ApiProperty()
  status: boolean;
}

@ApiTags('staffs')
@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}
  @UseGuards(AuthGuard)
  @Post()
  @ApiResponse({
    type: ResInterface,
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Res() res: Response,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const data = JSON.parse(body.staff);
    // console.log("body.staff:", body.staff)
    // console.log("file", file);
    let avatar = await uploadFileToStorage(file, 'staff', file?.buffer);
    // console.log("avatar", avatar);

    const newData = {
      ...data,
      avatar: avatar,
    };
    try {
      let staffRes = await this.staffsService.create(newData, data.serviceList);
      //serviceList

      res
        .status(staffRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
        .json(staffRes);
    } catch (err) {
      console.log('error', err);
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiResponse({
    type: ResInterface,
  })
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
      let staffRes = await this.staffsService.findAll(pagination);
      res.statusMessage = staffRes.message;
      res
        .status(staffRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
        .json(staffRes);
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('search')
  @ApiResponse({
    type: ResInterface,
  })
  async findAllService(@Res() res: Response, @Query('q') q: string) {
    if (q != undefined) {
      try {
        return res
          .status(HttpStatus.OK)
          .json(await this.staffsService.searchByName(q));
      } catch (err) {
        throw new HttpException('Loi Controller', HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        let serviceResAll = await this.staffsService.findStaff();
        res.statusMessage = serviceResAll.message;
        res
          .status(serviceResAll.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
          .json(serviceResAll);
      } catch (err) {
        throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
      }
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiResponse({
    type: ResInterface,
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() body: any,
    updateStaffDto: UpdateStaffDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let data;
      if (body.staff) {
        data = JSON.parse(body.staff);
        // console.log("data", data);
      }
      if (file) {
        let url = await uploadFileToStorage(file, 'staff', file?.buffer);
        data = {
          ...data,
          avatar: url,
        };
        let staffRes = await this.staffsService.update(id, data);
        if (staffRes) {
          res.statusMessage = staffRes.message;
          res
            .status(staffRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
            .json(staffRes);
        }
      } else {
        let staffRes = await this.staffsService.update(id, data);
        if (staffRes) {
          res.statusMessage = staffRes.message;
          res
            .status(staffRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
            .json(staffRes);
        }
      }
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiResponse({
    type: ResInterface,
  })
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      let staffRes = await this.staffsService.remove(id);
      res.status(staffRes ? HttpStatus.OK : HttpStatus.ACCEPTED).json(staffRes);
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }
}
