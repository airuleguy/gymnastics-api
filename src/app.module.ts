import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/config';
import { DatabaseConfig } from './config/database.config';

import { ClubsModule } from './clubs/clubs.module';
import { GymnastsModule } from './gymnasts/gymnasts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
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
