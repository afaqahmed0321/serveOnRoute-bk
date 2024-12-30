import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class GetBalanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  availableBalance: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pendingBalance: number;
}
