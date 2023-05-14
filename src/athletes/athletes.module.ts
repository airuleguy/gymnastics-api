import { Module } from '@nestjs/common';
import { AthletesService } from './athletes.service';
import { AthletesController } from './athletes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Athlete } from './entities/athlete.entity';
import { ClubsModule } from '../clubs/clubs.module';
import { ClubsService } from '../clubs/clubs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Athlete]), ClubsModule],
  controllers: [AthletesController],
  providers: [AthletesService, ClubsService],
})
export class AthletesModule {}
