import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/config';
import { DatabaseConfig } from './config/database.config';

import { TournamentModule } from './tournament/tournament.module';
import { ClubsModule } from './clubs/clubs.module';
import { GymnastsModule } from './gymnasts/gymnasts.module';

@Module({
  imports: [
    TournamentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.local.env', '.production.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    ClubsModule,
    GymnastsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
