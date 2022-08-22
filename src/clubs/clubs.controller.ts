import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto as Club);
  }

  @Get()
  findAll() {
    return this.clubsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateClubDto: UpdateClubDto) {
    this.clubsService.findOne(id).then((club) => {
      if (!club) {
        throw new NotFoundException('No Club was found with the provided ID');
      }
    });

    return this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.clubsService.remove(id);
  }
}
