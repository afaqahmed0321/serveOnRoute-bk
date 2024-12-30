import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

export class AdminNotificationDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsNotEmpty()
  @ApiPropertyOptional()
  type?: string;

  @ApiPropertyOptional({
    type: [String],
  })
  @IsNotEmpty()
  user: ObjectId[];
}
