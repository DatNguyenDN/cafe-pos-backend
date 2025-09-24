// backend/src/seeder/seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { MenuItem } from '../menu/menu-item.entity';
import { SeederService } from './seeder.service';
import { UserSeeder } from './user.seeder';
import { MenuItemSeeder } from './menu-item.seeder';
import { TableSeeder } from './table.seeder';
import { Table } from '../tables/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MenuItem, Table])],
  providers: [SeederService, UserSeeder, MenuItemSeeder, TableSeeder],
})
export class SeederModule {}
