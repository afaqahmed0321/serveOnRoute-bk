import { Status } from '@/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsDefined, IsOptional, IsObject,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class ProfileDto {

  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  license?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id_card?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  approved_by:ObjectId

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  status:Status


}
