import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MenuItem } from '../menu/menu-item.entity';
import { TableModule } from '../tables/table.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, MenuItem]),
    TableModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
