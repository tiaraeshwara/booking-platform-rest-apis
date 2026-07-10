import 'reflect-metadata';
import { DataSource } from 'typeorm';
import configuration from '../config/configuration';
import { Booking } from '../bookings/entities/booking.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';

const config = configuration();

export default new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: [User, ServiceEntity, Booking],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
