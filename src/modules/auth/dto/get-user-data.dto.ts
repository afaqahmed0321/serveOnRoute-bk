/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
