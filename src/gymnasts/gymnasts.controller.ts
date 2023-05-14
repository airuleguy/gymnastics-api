import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GymnastsService } from './gymnasts.service';
import { CreateGymnastDto } from './dto/create-gymnast.dto';
import { UpdateGymnastDto } from './dto/update-gymnast.dto';
import { ClubsService } from '../clubs/clubs.service';

@Controller('gymnasts')
export class GymnastsController {
  constructor(
    private readonly gymnastsService: GymnastsService,
    private readonly clubsService: ClubsService,
  ) {}

  @Post()
  async create(@Body() createGymnastDto: CreateGymnastDto) {
    if (createGymnastDto.club) {
      const found = await this.clubsService.findOne(createGymnastDto.club.id);
      if (!found) {
        throw new BadRequestException(
          'There is no Club corresponding to given ID',
        );
      }
    }
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
    this.gymnastsService.findOne(+id).then((gymnast) => {
      if (!gymnast) {
        throw new NotFoundException(
          'No Gymnast was found with the provided ID',
        );
      }
    });

    return this.gymnastsService.update(+id, updateGymnastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gymnastsService.remove(+id);
  }
}
