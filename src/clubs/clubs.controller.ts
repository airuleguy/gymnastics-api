import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  async create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto as Club);
  }

  @Get()
  async findAll() {
    return this.clubsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateClubDto: UpdateClubDto) {
    const toEdit: Club = await this.clubsService.findOne(id);

    if (!toEdit) {
      throw new NotFoundException('No Club was found with the provided ID');
    }

    return this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    this.clubsService.remove(id);
  }
}
