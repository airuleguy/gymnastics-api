import { Test, TestingModule } from '@nestjs/testing';
import { GymnastsService } from './gymnasts.service';

describe('GymnastsService', () => {
  let service: GymnastsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GymnastsService],
    }).compile();

    service = module.get<GymnastsService>(GymnastsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
