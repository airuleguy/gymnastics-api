import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { Athlete } from './entities/athlete.entity';
import { ClubsService } from '../clubs/clubs.service';
import { PageDto, PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class AthletesService {
  constructor(
    @InjectRepository(Athlete)
    private athleteRepository: Repository<Athlete>,
    private clubsService: ClubsService,
  ) {}

  async create(createAthleteDto: CreateAthleteDto) {
    // If club is provided, validate it exists
    if (createAthleteDto.club?.id) {
      const club = await this.clubsService.findOne(createAthleteDto.club.id);
      if (!club) {
        throw new BadRequestException('Club not found with the provided ID');
      }
      // Only use the ID to avoid overwriting club data
      createAthleteDto.club = { id: club.id } as any;
    }
    
    return this.athleteRepository.save(createAthleteDto as Athlete);
  }

  async findAll(query: PaginationQueryDto): Promise<PageDto<Athlete>> {
    const { page = 1, limit = 15, search } = query;
    
    // Create base query
    const queryBuilder = this.athleteRepository.createQueryBuilder('athlete')
      .leftJoinAndSelect('athlete.club', 'club');
    
    // Add search condition if provided
    if (search) {
      queryBuilder.where([
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { nid: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) }
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

  // Get athletes by club ID with pagination
  async findByClubId(clubId: number, query: PaginationQueryDto): Promise<PageDto<Athlete>> {
    const { page = 1, limit = 15, search } = query;
    
    // Create base query with club filter
    const queryBuilder = this.athleteRepository.createQueryBuilder('athlete')
      .leftJoinAndSelect('athlete.club', 'club')
      .where('club.id = :clubId', { clubId });
    
    // Add search condition if provided
    if (search) {
      queryBuilder.andWhere([
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { nid: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) }
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
    return this.athleteRepository.findOne({
      where: { id },
      relations: ['club']
    });
  }

  async update(id: number, updateAthleteDto: UpdateAthleteDto) {
    // Check if athlete exists
    const athlete = await this.findOne(id);
    if (!athlete) {
      throw new NotFoundException('Athlete not found with the provided ID');
    }
    
    // If club is being updated, validate the new club exists
    if (updateAthleteDto.club?.id) {
      const club = await this.clubsService.findOne(updateAthleteDto.club.id);
      if (!club) {
        throw new BadRequestException('Club not found with the provided ID');
      }
      // Only use the ID to avoid overwriting club data
      updateAthleteDto.club = { id: club.id } as any;
    }
    
    return this.athleteRepository.save({
      ...athlete,
      ...updateAthleteDto,
      id: id
    });
  }

  async remove(id: number) {
    const athlete = await this.findOne(id);
    if (!athlete) {
      throw new NotFoundException('Athlete not found with the provided ID');
    }
    return this.athleteRepository.remove(athlete);
  }
}
