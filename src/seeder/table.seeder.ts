// backend/src/seeder/table.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../tables/table.entity';

@Injectable()
export class TableSeeder {
  constructor(@InjectRepository(Table) private tableRepo: Repository<Table>) {}

  async seed() {
    const count = await this.tableRepo.count();
    if (count > 0) return; // tránh tạo lại khi đã có dữ liệu

    const tables = [
      { name: 'Take Away' },
      { name: 'Table 1' },
      { name: 'Table 2' },
      { name: 'Table 3' },
      { name: 'Table 4' },
      { name: 'Table 5' },
      { name: 'Table 6' },
      { name: 'Table 7' },
      { name: 'Table 8' },
      { name: 'Table 9' },
      { name: 'Table 10' },
    ];

    const tableEntities = this.tableRepo.create(tables);
    await this.tableRepo.save(tableEntities);
    console.log('✅ Tables seeded');
  }
}
