// src/orders/dto/create-order.dto.ts
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemInputDto } from './order-item-input.dto';

export class CreateOrderDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  tableId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}
