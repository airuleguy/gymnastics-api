import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GymnastModule } from './gymnasts/gymnasts.module';
import { TournamentModule } from './tournament/tournament.module';

@Module({
  imports: [GymnastModule, TournamentModule, TypeOrmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
