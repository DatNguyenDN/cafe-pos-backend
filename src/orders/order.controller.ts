// src/orders/order.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Tạo order mới cho bàn (nếu bàn đã có order pending, service sẽ trả về order đó)
  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body.tableId, body.items);
  }

  // Cập nhật items của order hiện có
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateOrderDto) {
    return this.orderService.updateOrder(id, body.items);
  }

  // Thanh toán order
  @Patch(':id/pay')
  pay(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.payOrder(id);
  }

  @Get('revenue')
  async getOrdersWithRevenue() {
    return this.orderService.getOrdersWithRevenue();
  }

  // Danh sách order theo bàn (mới nhất trước)
  @Get('/table/:tableId')
  getByTable(@Param('tableId', ParseIntPipe) tableId: number) {
    return this.orderService.getOrdersByTable(tableId);
  }

  // NEW: Lấy order "đang hoạt động" (pending) của 1 bàn (kèm items + menuItem)
  @Get('/table/:tableId/active')
  getActiveByTable(@Param('tableId', ParseIntPipe) tableId: number) {
    return this.orderService.getActiveOrderByTable(tableId);
  }

  // NEW: Lấy chi tiết 1 order
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }
}
