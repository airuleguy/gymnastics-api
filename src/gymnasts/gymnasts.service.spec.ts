import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gymnast } from './entities/gymnast.entity';
import { GymnastsService } from './gymnasts.service';

describe('GymnastsService', () => {
  let service: GymnastsService;
  let mockRepository: Repository<Gymnast>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymnastsService,
        {
          provide: getRepositoryToken(Gymnast),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GymnastsService>(GymnastsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
