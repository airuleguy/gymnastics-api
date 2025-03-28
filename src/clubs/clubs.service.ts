import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';
import { PageDto, PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
  ) {}

  create(newClub: CreateClubDto) {
    return this.clubsRepository.save(newClub as Club);
  }

  async findAll(query: PaginationQueryDto): Promise<PageDto<Club>> {
    const { page = 1, limit = 15, search } = query;
    
    // Create base query
    const queryBuilder = this.clubsRepository.createQueryBuilder('club')
      .leftJoinAndSelect('club.athletes', 'athletes');
    
    // Add search condition if provided
    if (search) {
      queryBuilder.where([
        { name: ILike(`%${search}%`) },
        { code: ILike(`%${search}%`) }
      ]);
    }
    
    // Get total count before pagination
    const total = await queryBuilder.getCount();
    
    // Add pagination
    const items = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    return {
      items,
      total,
      page,
      limit,
      totalPages
    };
  }

  findOne(id: number) {
    return this.clubsRepository.findOne({
      where: { id },
      relations: ['athletes']
    });
  }

  async update(id: number, updateClubDto: UpdateClubDto) {
    const club = await this.findOne(id);
    if (!club) {
      throw new NotFoundException('Club not found with the provided ID');
    }
    
    return this.clubsRepository.save({
      ...club,
      ...updateClubDto,
      id: id
    });
  }

  async remove(id: number) {
    const club = await this.findOne(id);
    if (!club) {
      throw new NotFoundException('Club not found with the provided ID');
    }
    
    // Check if club has athletes
    if (club.athletes && club.athletes.length > 0) {
      throw new Error('Cannot delete club with associated athletes. Remove the athletes first.');
    }
    
    return this.clubsRepository.remove(club);
  }
}
