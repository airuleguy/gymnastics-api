import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { Athlete } from './entities/athlete.entity';
import { ClubsService } from '../clubs/clubs.service';
import { BranchesService } from '../branches/branches.service';
import { PageDto, PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class AthletesService {
  constructor(
    @InjectRepository(Athlete)
    private athleteRepository: Repository<Athlete>,
    private clubsService: ClubsService,
    private branchesService: BranchesService,
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
    
    // Find branch by ID
    if (createAthleteDto.branchId) {
      const branch = await this.branchesService.findOne(createAthleteDto.branchId);
      if (!branch) {
        throw new BadRequestException('Branch not found with the provided ID');
      }
      
      // Create athlete with branch reference
      const athlete = this.athleteRepository.create({
        ...createAthleteDto,
        branch: branch,
      });
      
      return this.athleteRepository.save(athlete);
    }
    
    throw new BadRequestException('Branch ID is required');
  }

  async findAll(query: PaginationQueryDto): Promise<PageDto<Athlete>> {
    const { page = 1, limit = 15, search } = query;
    
    // Create base query
    const queryBuilder = this.athleteRepository.createQueryBuilder('athlete')
      .leftJoinAndSelect('athlete.club', 'club')
      .leftJoinAndSelect('athlete.branch', 'branch');
    
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
      .leftJoinAndSelect('athlete.branch', 'branch')
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
      relations: ['club', 'branch']
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
    
    // If branch is being updated, validate and get the branch
    if (updateAthleteDto.branchId) {
      const branch = await this.branchesService.findOne(updateAthleteDto.branchId);
      if (!branch) {
        throw new BadRequestException('Branch not found with the provided ID');
      }
      
      // Update with new athlete data
      return this.athleteRepository.save({
        ...athlete,
        ...updateAthleteDto,
        branch: branch,
        id: id
      });
    }
    
    // Update without changing branch
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
