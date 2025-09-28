import { IsNumber } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNumber()
  orderId: number;
}
