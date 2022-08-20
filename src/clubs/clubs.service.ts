import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
  ) {}

  create(newClub: CreateClubDto) {
    return this.clubsRepository.save(newClub as Club);
  }

  findAll() {
    return this.clubsRepository.find();
  }

  findOne(id: number) {
    return this.clubsRepository.findOneBy({ id });
  }

  update(id: number, updateClubDto: UpdateClubDto) {
    return this.clubsRepository.save({
      ...updateClubDto,
      id: id,
    });
  }

  remove(id: number) {
    this.clubsRepository.delete(id);
  }
}
