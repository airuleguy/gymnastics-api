import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Athlete } from './entities/athlete.entity';
import { AthletesService as AthletesService } from './athletes.service';

describe('AthletesService', () => {
  let service: AthletesService;
  let mockRepository: Repository<Athlete>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AthletesService,
        {
          provide: getRepositoryToken(Athlete),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AthletesService>(AthletesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
