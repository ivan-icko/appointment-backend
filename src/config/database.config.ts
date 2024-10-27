import { registerAs } from '@nestjs/config';
import { DATABASE_CONFIG } from '../common/constants/global';

export default registerAs(DATABASE_CONFIG, () => ({
  sqlite: {
    type: 'sqlite',
    database: process.env.SQLITE_DB_SCHEMA,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: process.env.SQLITE_SYNCHRONIZE === 'true',
  },
}));
