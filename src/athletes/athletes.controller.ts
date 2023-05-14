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
import { AthletesService } from './athletes.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { ClubsService } from '../clubs/clubs.service';

@Controller('athletes')
export class AthletesController {
  constructor(
    private readonly gymnastsService: AthletesService,
    private readonly clubsService: ClubsService,
  ) {}

  @Post()
  async create(@Body() createGymnastDto: CreateAthleteDto) {
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
  update(@Param('id') id: string, @Body() updateGymnastDto: UpdateAthleteDto) {
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
