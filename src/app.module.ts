import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GymnastModule } from './gymnast/gymnast.module';
import { TournamentModule } from './tournament/tournament.module';

@Module({
  imports: [GymnastModule, TournamentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
