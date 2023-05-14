import { Test, TestingModule } from '@nestjs/testing';
import { GymnastsController } from './gymnasts.controller';
import { GymnastsService } from './gymnasts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gymnast } from './entities/gymnast.entity';
import { Repository } from 'typeorm';
import { ClubsService } from '../clubs/clubs.service';
import { Club } from '../clubs/entities/club.entity';

describe('GymnastsController', () => {
  let controller: GymnastsController;
  let gymnastMockRepository: Repository<Gymnast>;
  let clubMockRepository: Repository<Club>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GymnastsController],
      providers: [
        GymnastsService,
        {
          provide: getRepositoryToken(Gymnast),
          useValue: gymnastMockRepository,
        },
        ClubsService,
        {
          provide: getRepositoryToken(Club),
          useValue: clubMockRepository,
        },
      ],
    }).compile();

    controller = module.get<GymnastsController>(GymnastsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
