import { Test, TestingModule } from '@nestjs/testing';
import { ClubsService } from './clubs.service';
import { Club } from './entities/club.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClubsService', () => {
  let service: ClubsService;
  let mockRepository: Repository<Club>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
        {
          provide: getRepositoryToken(Club),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
