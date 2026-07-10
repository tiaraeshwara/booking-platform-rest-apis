import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow<string>('database.host'),
  port: configService.getOrThrow<number>('database.port'),
  username: configService.getOrThrow<string>('database.username'),
  password: configService.getOrThrow<string>('database.password'),
  database: configService.getOrThrow<string>('database.name'),
  entities: [User, ServiceEntity, Booking],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: false,
});
