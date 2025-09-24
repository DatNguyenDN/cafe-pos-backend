// backend/src/seeder/seeder.service.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserSeeder } from './user.seeder';
import { MenuItemSeeder } from './menu-item.seeder';
import { TableSeeder } from './table.seeder';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly menuItemSeeder: MenuItemSeeder,
    private tableSeeder: TableSeeder,
  ) {}

  async onApplicationBootstrap() {
    console.log('🌱 Running seeders...');
    await this.userSeeder.seed();
    await this.menuItemSeeder.seed();
    await this.tableSeeder.seed();
    console.log('✅ All seeders completed');
  }
}
