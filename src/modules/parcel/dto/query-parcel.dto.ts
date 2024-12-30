import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryParcelDto {
  @ApiProperty()
  @IsString()
  page: string;

  @ApiProperty()
  @IsString()
  limit: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort: string;

  populate: {
    path: string;
    select: string;
  }[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  from_location: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  to_location: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customer_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rider_id: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  status: string | object;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fare: string;
}
