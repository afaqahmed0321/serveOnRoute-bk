import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { toNumber, trim } from '../../../helpers/cast.helper';

export class QueryComplaintsDto {
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @ApiProperty()
  @IsNumber()
  page: number;

  // @Transform(({value})=> toNumber(value,{default:1,min:1}))
  // @ApiProperty()
  // @IsNumber()
  // skip:number

  populate: {
    path: string;
    select: string;
  }[];

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @ApiProperty()
  @IsNumber()
  limit: number;

  @Transform(({ value }) => trim(value))
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  kind: string;

  @Transform(({ value }) => trim(value))
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  complainant: string;

  @Transform(({ value }) => trim(value))
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  complain_against: string;

  @Transform(({ value }) => trim(value))
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parcel: string;

  @Transform(({ value }) => trim(value))
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  select: string;
}
