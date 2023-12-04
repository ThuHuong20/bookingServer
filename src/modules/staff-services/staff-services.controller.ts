import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StaffServicesService } from './staff-services.service';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';
import { UpdateStaffServiceDto } from './dto/update-staff-service.dto';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('staff-services')
@Controller('staff-services')
export class StaffServicesController {
  constructor(private readonly staffServicesService: StaffServicesService) {}
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Res() res: Response,
    @Body() createStaffServiceDto: CreateStaffServiceDto,
  ) {
    try {
      let StaffServiceRes = await this.staffServicesService.create(
        createStaffServiceDto,
      );
      res.statusMessage = StaffServiceRes.message;
      res
        .status(StaffServiceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED)
        .json(StaffServiceRes);
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {
      let staffServiceerviceRes = await this.staffServicesService.findOne(id);
      res.statusMessage = staffServiceerviceRes.message;
      res
        .status(
          staffServiceerviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED,
        )
        .json(staffServiceerviceRes.data);
    } catch (err) {
      throw new HttpException('loi model', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      let StaffServiceRes = await this.staffServicesService.remove(id);
      // console.log("StaffServiceRes:", StaffServiceRes)
      res.statusMessage = StaffServiceRes.message;
      res
        .status(StaffServiceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
        .json(StaffServiceRes);
    } catch (err) {
      //console.log(" err: controller", err)
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }
}
