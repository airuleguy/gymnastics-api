import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GymnastsService } from './gymnasts.service';
import { CreateGymnastDto } from './dto/create-gymnast.dto';
import { UpdateGymnastDto } from './dto/update-gymnast.dto';

@Controller('gymnasts')
export class GymnastsController {
  constructor(private readonly gymnastsService: GymnastsService) {}

  @Post()
  create(@Body() createGymnastDto: CreateGymnastDto) {
    return this.gymnastsService.create(createGymnastDto);
  }

  @Get()
  findAll() {
    return this.gymnastsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gymnastsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGymnastDto: UpdateGymnastDto) {
    return this.gymnastsService.update(+id, updateGymnastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gymnastsService.remove(+id);
  }
}