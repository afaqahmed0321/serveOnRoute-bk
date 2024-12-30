import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Schema } from 'mongoose';
export class AddBankAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountId: string;

  @IsOptional()
  user?: Schema.Types.ObjectId | undefined;

  @IsOptional()
  bankId?: string;

  @IsOptional()
  accountNum?: string;
}
