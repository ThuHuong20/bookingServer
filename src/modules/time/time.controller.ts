import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { TimeService } from './time.service';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('time')
@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Post()
  create(@Body() createTimeDto: CreateTimeDto) {
    return this.timeService.create(createTimeDto);
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      let serviceRes = await this.timeService.findAll();
      return res
        .status(serviceRes.status ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
        .json(serviceRes);
    } catch {
      throw new HttpException('ControllerErr', HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(AuthGuard)
  @Patch()
  update(@Body() updateTimeDto: UpdateTimeDto) {
    return this.timeService.update(updateTimeDto);
  }
}
