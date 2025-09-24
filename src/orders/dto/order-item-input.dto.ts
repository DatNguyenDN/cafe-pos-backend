// src/orders/dto/order-item-input.dto.ts
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemInputDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  menuItemId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
