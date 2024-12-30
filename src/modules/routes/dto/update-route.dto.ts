import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRouteDto } from './create-route.dto';
import { IsOptional } from 'class-validator';

export class UpdateRouteDto extends PartialType(CreateRouteDto) {}

export class UpdateStatusDto {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  status: boolean;
}
