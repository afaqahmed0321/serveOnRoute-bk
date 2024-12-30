import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryRatingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  populate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rider: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  user: string;
}
