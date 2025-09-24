import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { MenuItem } from '../menu/menu-item.entity';
import * as bcrypt from 'bcrypt';
import 'reflect-metadata';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  database: process.env.DATABASE_NAME || 'cafe_pos_dev',
  synchronize: true,
});
