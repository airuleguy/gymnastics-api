import { Test, TestingModule } from '@nestjs/testing';
import { AthletesController as AthletesController } from './athletes.controller';
import { AthletesService } from './athletes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Athlete } from './entities/athlete.entity';
import { Repository } from 'typeorm';
import { ClubsService } from '../clubs/clubs.service';
import { Club } from '../clubs/entities/club.entity';

describe('AthletesController', () => {
  let controller: AthletesController;
  let gymnastMockRepository: Repository<Athlete>;
  let clubMockRepository: Repository<Club>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AthletesController],
      providers: [
        AthletesService,
        {
          provide: getRepositoryToken(Athlete),
          useValue: gymnastMockRepository,
        },
        ClubsService,
        {
          provide: getRepositoryToken(Club),
          useValue: clubMockRepository,
        },
      ],
    }).compile();

    controller = module.get<AthletesController>(AthletesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
