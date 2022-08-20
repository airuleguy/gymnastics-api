import { Injectable } from '@nestjs/common';
import { CreateGymnastDto } from './dto/create-gymnast.dto';
import { UpdateGymnastDto } from './dto/update-gymnast.dto';

@Injectable()
export class GymnastsService {
  create(createGymnastDto: CreateGymnastDto) {
    return 'This action adds a new gymnast';
  }

  findAll() {
    return `This action returns all gymnasts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gymnast`;
  }

  update(id: number, updateGymnastDto: UpdateGymnastDto) {
    return `This action updates a #${id} gymnast`;
  }

  remove(id: number) {
    return `This action removes a #${id} gymnast`;
  }
}
