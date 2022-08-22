import { Module } from '@nestjs/common';
import { GymnastsService } from './gymnasts.service';
import { GymnastsController } from './gymnasts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gymnast } from './entities/gymnast.entity';
import { ClubsModule } from '../clubs/clubs.module';
import { ClubsService } from '../clubs/clubs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gymnast]), ClubsModule],
  controllers: [GymnastsController],
  providers: [GymnastsService, ClubsService],
})
export class GymnastsModule {}
