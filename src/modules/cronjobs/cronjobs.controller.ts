import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { CreateCronjobDto } from './dto/create-cronjob.dto';
import { UpdateCronjobDto } from './dto/update-cronjob.dto';

@Controller('cronjobs')
export class CronjobsController {
  constructor(private readonly cronjobsService: CronjobsService) {}

  @Post()
  create(@Body() createCronjobDto: CreateCronjobDto) {
    return this.cronjobsService.create(createCronjobDto);
  }

  @Get()
  findAll() {
    return this.cronjobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cronjobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCronjobDto: UpdateCronjobDto) {
    return this.cronjobsService.update(+id, updateCronjobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cronjobsService.remove(+id);
  }
}
