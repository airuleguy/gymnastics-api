import { Test, TestingModule } from '@nestjs/testing';
import { GymnastsController } from './gymnasts.controller';
import { GymnastsService } from './gymnasts.service';

describe('GymnastsController', () => {
  let controller: GymnastsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GymnastsController],
      providers: [GymnastsService],
    }).compile();

    controller = module.get<GymnastsController>(GymnastsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
