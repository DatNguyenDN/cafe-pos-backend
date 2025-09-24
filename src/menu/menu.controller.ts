import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu')
export class MenuController {
  constructor(private svc: MenuService) {}

  @Get()
  getAll() {
    return this.svc.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body) {
    return this.svc.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: number, @Body() body) {
    return this.svc.update(Number(id), body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: number) {
    return this.svc.remove(Number(id));
  }
}
