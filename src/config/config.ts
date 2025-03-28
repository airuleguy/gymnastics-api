import { Athlete } from '../athletes/entities/athlete.entity';
import { Branch } from '../branches/branch.entity';
import { Club } from '../clubs/entities/club.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const configuration = () => ({
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [Club, Athlete, Branch],
  },
});
