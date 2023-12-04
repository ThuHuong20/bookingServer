import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  HttpException,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from '../../fb';
import { Response, query } from 'express';

import { PaginationDto } from './dto/pagination-service.dto';
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

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
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
    const data = JSON.parse(body.service);
    let avatar = await uploadFileToStorage(file, 'service', file.buffer);
    const newData = {
      ...data,
      avatar: avatar,
    };
    try {
      let serviceRes = await this.servicesService.create(newData);
      res
        .status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
        .json(serviceRes);
    } catch (err) {
      console.log('err', err);
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
      let serviceRes = await this.servicesService.findAll(pagination);
      res.statusMessage = serviceRes.message;
      res
        .status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
        .json(serviceRes);
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
          .json(await this.servicesService.searchByName(q));
      } catch (err) {
        throw new HttpException('Loi Controller', HttpStatus.BAD_REQUEST);
      }
    } else {
      try {
        let serviceResAll = await this.servicesService.findServie();
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
    @Req() req: Request,
    @Param('id') id: number,
    @Body() body: any,
    updateServiceDto: UpdateServiceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('updatedata');
    // updateServiceDto = JSON.parse(body.services)
    try {
      let updateServiceDto;
      if (body.services) {
        updateServiceDto = JSON.parse(body.services);
      }
      if (file) {
        let url = await uploadFileToStorage(file, 'service', file?.buffer);
        updateServiceDto = {
          ...updateServiceDto,
          avatar: url,
        };
        let serviceRes = await this.servicesService.update(
          id,
          updateServiceDto,
        );
        console.log('serviceRes', serviceRes);

        if (serviceRes) {
          res.statusMessage = serviceRes.message;
          res
            .status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
            .json(serviceRes);
        }
      } else {
        let serviceRes = await this.servicesService.update(
          id,
          updateServiceDto,
        );
        if (serviceRes) {
          res.statusMessage = serviceRes.message;
          res
            .status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED)
            .json(serviceRes);
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
      let serviceRes = await this.servicesService.remove(id);
      res
        .status(serviceRes ? HttpStatus.OK : HttpStatus.ACCEPTED)
        .json(serviceRes);
      res.statusMessage = serviceRes.message;
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST);
    }
  }
}
