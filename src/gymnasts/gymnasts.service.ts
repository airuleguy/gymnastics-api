import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGymnastDto } from './dto/create-gymnast.dto';
import { UpdateGymnastDto } from './dto/update-gymnast.dto';
import { Gymnast } from './entities/gymnast.entity';

@Injectable()
export class GymnastsService {
  constructor(
    @InjectRepository(Gymnast)
    private gymnastRepository: Repository<Gymnast>,
  ) {}
  create(createGymnastDto: CreateGymnastDto) {
    return this.gymnastRepository.save(createGymnastDto as Gymnast);
  }

  findAll() {
    return this.gymnastRepository.find();
  }

  findOne(id: number) {
    return this.gymnastRepository.findOneBy({ id });
  }

  update(id: number, updateGymnastDto: UpdateGymnastDto) {
    return this.gymnastRepository.save({
      ...updateGymnastDto,
      id: id,
    });
  }

  remove(id: number) {
    this.gymnastRepository.delete(id);
  }
}
