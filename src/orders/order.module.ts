import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MenuItem } from '../menu/menu-item.entity';
import { TableModule } from '../tables/table.module';
import { Table } from 'src/tables/table.entity';
import { SocketGateway } from 'src/ws/socket.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, MenuItem, Table]),
    TableModule,
  ],
  providers: [OrderService, SocketGateway],
  controllers: [OrderController],
})
export class OrderModule {}
