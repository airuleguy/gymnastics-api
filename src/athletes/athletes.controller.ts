import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AthletesService } from './athletes.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Controller('athletes')
export class AthletesController {
  constructor(
    private readonly athletesService: AthletesService,
  ) {}

  @Post()
  create(@Body() createAthleteDto: CreateAthleteDto) {
    return this.athletesService.create(createAthleteDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.athletesService.findAll(query);
  }

  @Get('club/:clubId')
  findByClubId(
    @Param('clubId') clubId: string,
    @Query() query: PaginationQueryDto
  ) {
    return this.athletesService.findByClubId(+clubId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.athletesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAthleteDto: UpdateAthleteDto) {
    return this.athletesService.update(+id, updateAthleteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.athletesService.remove(+id);
  }
}
