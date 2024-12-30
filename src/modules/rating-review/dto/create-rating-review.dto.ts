import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRatingReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  review: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  rider: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user: string;
}
