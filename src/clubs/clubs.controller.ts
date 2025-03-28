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
  Query,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto as Club);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.clubsService.findAll(query);
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
  async remove(@Param('id') id: number) {
    try {
      await this.clubsService.remove(id);
      return { success: true };
    } catch (error) {
      if (error.message.includes('Cannot delete club with associated athletes')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
