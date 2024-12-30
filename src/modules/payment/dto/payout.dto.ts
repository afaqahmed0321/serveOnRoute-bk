import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Schema } from 'mongoose';
import { Payout } from '../schemas/payout.schema';
export class PayoutDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  user?: Schema.Types.ObjectId | undefined;
}

export class PayoutPayload {
  data?: Payout;
  message?: string;
}
