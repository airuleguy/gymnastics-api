import { Module } from '@nestjs/common';
import { GymnastsService } from './gymnasts.service';
import { GymnastsController } from './gymnasts.controller';

@Module({
  controllers: [GymnastsController],
  providers: [GymnastsService]
})
export class GymnastsModule {}
