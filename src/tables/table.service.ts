import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './table.entity';

@Injectable()
export class TableService {
  constructor(@InjectRepository(Table) private tableRepo: Repository<Table>) {}

  findAll() {
    return this.tableRepo.find();
  }

  findOne(id: number) {
    return this.tableRepo.findOne({ where: { id }, relations: ['orders'] });
  }

  create(name: string) {
    const table = this.tableRepo.create({ name });
    return this.tableRepo.save(table);
  }

  async setAvailability(id: number, isAvailable: boolean) {
    const table = await this.findOne(id);
    if (!table) throw new Error('Table not found');
    table.isAvailable = isAvailable;
    return this.tableRepo.save(table);
  }
}
