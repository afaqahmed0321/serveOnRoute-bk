import { ROLE } from '@/enums/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { toNumber, trim } from '../../../helpers/cast.helper';
import { STATUS } from '@/enums/status.enum';

export class getUsersDto {
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @ApiProperty()
  @IsNumber()
  page: number;

  // @Transform(({value})=> toNumber(value,{default:1,min:1}))
  // @ApiProperty()
  // @IsNumber()
  // skip:number

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @ApiProperty()
  @IsNumber()
  limit: number;

  @Transform(({ value }) => trim(value))
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ROLE)
  role: ROLE;

  @Transform(({ value }) => trim(value))
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(STATUS)
  status: STATUS;

  @Transform((value: TransformFnParams | string) => value === 'true')
  @ApiPropertyOptional()
  @IsOptional()
  is_block: boolean;
}

export class searchUserDto {
  //search user
  @Transform(({ value }) => trim(value))
  @ApiPropertyOptional()
  @IsOptional()
  search: string;
}

export class UserRoles {
  @ApiPropertyOptional()
  @IsOptional()
  role: string[];
}
