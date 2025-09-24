// src/orders/dto/revenue-query.dto.ts
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from '../order.entity';

export class RevenueQueryDto {
  // YYYY-MM-DD
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  from?: string;

  // YYYY-MM-DD
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  to?: string;

  // Mặc định PAID; cho phép override nếu cần
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
