// orders/order.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { TableService } from '../tables/table.service';
import { MenuItem } from '../menu/menu-item.entity';
import { RevenueQueryDto } from './dto/revenue-query.dto';

type OrderItemInput = { menuItemId: number; quantity: number };

function makeDateRange(from?: string, to?: string) {
  let start: Date | undefined;
  let end: Date | undefined;

  if (from) {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    start = d;
  }
  if (to) {
    const d = new Date(to);
    d.setHours(23, 59, 59, 999);
    end = d;
  }
  return { start, end };
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(MenuItem) private readonly menuRepo: Repository<MenuItem>,
    private readonly tableService: TableService,
  ) {}

  // Lấy order "đang hoạt động" (chưa thanh toán) của 1 bàn
  async getActiveOrderByTable(tableId: number) {
    return this.orderRepo.findOne({
      where: { table: { id: tableId }, status: OrderStatus.PENDING },
      relations: ['items', 'items.menuItem', 'table'],
    });
  }

  // Tạo order mới cho bàn
  async createOrder(tableId: number, items: OrderItemInput[]) {
    const table = await this.tableService.findOne(tableId);
    if (!table) throw new NotFoundException('Table not found');

    // Nếu bàn đã có order pending, trả về luôn order đó (tránh tạo trùng)
    const existing = await this.getActiveOrderByTable(tableId);
    if (existing) {
      return existing; // Hoặc throw new ConflictException('Active order already exists for this table');
    }

    // Build items + total (tối ưu: fetch menu items theo mảng ID)
    const ids = Array.from(new Set(items.map((i) => i.menuItemId))).filter(
      Boolean,
    );
    const menuMap = new Map<number, MenuItem>();
    if (ids.length) {
      const menuItems = await this.menuRepo.find({ where: { id: In(ids) } });
      for (const m of menuItems) menuMap.set(m.id, m);
    }

    let total = 0;
    const orderItems: OrderItem[] = [];
    for (const i of items) {
      const menuItem = menuMap.get(i.menuItemId);
      if (!menuItem) continue;
      const item = this.itemRepo.create({
        menuItem,
        quantity: i.quantity,
        price: menuItem.price, // chốt giá tại thời điểm tạo
      });
      total += menuItem.price * i.quantity;
      orderItems.push(item);
    }

    const order = this.orderRepo.create({
      table,
      items: orderItems,
      total,
      status: OrderStatus.PENDING,
    });

    // Đặt trạng thái bàn đang bận
    await this.tableService.setAvailability(table.id, false);

    const saved = await this.orderRepo.save(order);

    // Trả về order kèm relations đầy đủ
    return this.orderRepo.findOne({
      where: { id: saved.id },
      relations: ['items', 'items.menuItem', 'table'],
    });
  }

  // NEW: Lấy chi tiết 1 order theo id (kèm items + items.menuItem + table)
  async getOrderById(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.menuItem', 'table'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // Cập nhật order hiện có (ghi đè toàn bộ danh sách items)
  async updateOrder(orderId: number, items: OrderItemInput[]) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'table'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status === OrderStatus.PAID) {
      throw new ConflictException('Cannot update a paid order');
    }

    // Xoá hết items cũ
    if (order.items?.length) {
      await this.itemRepo.remove(order.items);
    }

    // Tối ưu fetch menu items
    const ids = Array.from(new Set(items.map((i) => i.menuItemId))).filter(
      Boolean,
    );
    const menuMap = new Map<number, MenuItem>();
    if (ids.length) {
      const menuItems = await this.menuRepo.find({ where: { id: In(ids) } });
      for (const m of menuItems) menuMap.set(m.id, m);
    }

    // Thêm items mới + tính total
    let total = 0;
    const newItems: OrderItem[] = [];
    for (const i of items) {
      const menuItem = menuMap.get(i.menuItemId);
      if (!menuItem) continue;
      const item = this.itemRepo.create({
        order, // set quan hệ ngược
        menuItem,
        quantity: i.quantity,
        price: menuItem.price,
      });
      total += menuItem.price * i.quantity;
      newItems.push(item);
    }

    order.items = newItems;
    order.total = total;

    await this.orderRepo.save(order);

    // Trả về order kèm relations đầy đủ để FE render ngay
    return this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.menuItem', 'table'],
    });
  }

  // Thanh toán order
  async payOrder(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['table'],
    });
    if (!order) throw new NotFoundException('Order not found');

    order.status = OrderStatus.PAID;
    await this.tableService.setAvailability(order.table.id, true);
    await this.orderRepo.save(order);

    // Trả về trạng thái mới nhất
    return this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'items.menuItem', 'table'],
    });
  }

  // Danh sách order theo bàn (mới nhất trước)
  getOrdersByTable(tableId: number) {
    return this.orderRepo.find({
      where: { table: { id: tableId } },
      relations: ['items', 'items.menuItem', 'table'],
      order: { createdAt: 'DESC', id: 'DESC' },
    });
    // Nếu đã thêm UpdateDateColumn() ở Order, có thể đổi sang:
    // order: { updatedAt: 'DESC', createdAt: 'DESC' },
  }

  async getOrdersWithRevenue(
    q: RevenueQueryDto = {} as RevenueQueryDto,
  ): Promise<any[]> {
    const status = q.status ?? OrderStatus.PAID; // mặc định chỉ lấy PAID
    const { start, end } = makeDateRange(q.from, q.to);

    // Dùng QueryBuilder để linh hoạt
    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.menuItem', 'menuItem')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      qb.andWhere('order.status = :status', { status });
    }
    if (start) {
      qb.andWhere('order.createdAt >= :start', { start });
    }
    if (end) {
      qb.andWhere('order.createdAt <= :end', { end });
    }

    const orders = await qb.getMany();

    return orders.map((order) => {
      const totalAmount = (order.items || []).reduce(
        (sum, item) =>
          sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
        0,
      );
      return {
        id: order.id,
        table: order.table?.name || 'Take Away',
        createdAt: order.createdAt,
        status: order.status, // hữu ích cho FE hiển thị
        totalAmount,
      };
    });
  }
}
