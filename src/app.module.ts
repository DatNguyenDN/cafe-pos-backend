import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';
import { Attendance } from './attendance/attendance.entity';
import { AttendanceModule } from './attendance/attendance.module';
import { SeederModule } from './seeder/seeder.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MenuItem } from 'src/menu/menu-item.entity';
import { MenuModule } from 'src/menu/menu.module';
import { Table } from 'src/tables/table.entity';
import { Order } from 'src/orders/order.entity';
import { OrderItem } from 'src/orders/order-item.entity';
import { TableModule } from 'src/tables/table.module';
import { OrderModule } from 'src/orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'cafe_pos',
      entities: [User, Attendance, MenuItem, Table, Order, OrderItem],
      synchronize: true,
    }),
    AttendanceModule,
    SeederModule,
    AuthModule,
    UsersModule,
    MenuModule,
    TableModule,
    OrderModule,
  ],
})
export class AppModule {}
