import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { TableService } from './table.service';

@Controller('tables')
export class TableController {
  constructor(private tableService: TableService) {}

  @Get()
  getAll() {
    return this.tableService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.tableService.findOne(id);
  }

  @Post()
  create(@Body('name') name: string) {
    return this.tableService.create(name);
  }

  @Patch(':id/availability')
  setAvailability(
    @Param('id') id: number,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.tableService.setAvailability(id, isAvailable);
  }
}
