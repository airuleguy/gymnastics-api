import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { Athlete } from './entities/athlete.entity';

@Injectable()
export class AthletesService {
  constructor(
    @InjectRepository(Athlete)
    private gymnastRepository: Repository<Athlete>,
  ) {}

  create(createGymnastDto: CreateAthleteDto) {
    return this.gymnastRepository.save(createGymnastDto as Athlete);
  }

  findAll() {
    return this.gymnastRepository.find();
  }

  findOne(id: number) {
    return this.gymnastRepository.findOneBy({ id });
  }

  update(id: number, updateGymnastDto: UpdateAthleteDto) {
    return this.gymnastRepository.save({
      ...updateGymnastDto,
      id: id,
    });
  }

  remove(id: number) {
    this.gymnastRepository.delete(id);
  }
}
