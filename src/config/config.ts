import { Gymnast } from 'src/gymnasts/entities/gymnast.entity';
import { Club } from '../clubs/entities/club.entity';

export const configuration = () => ({
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    logging: process.env.POSTGRES_LOGGING,
    synchronize: true,
    entities: [Club, Gymnast],
  },
});
