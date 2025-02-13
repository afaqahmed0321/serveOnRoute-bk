/* eslint-disable prettier/prettier */
import { STATUS } from '@/enums/status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  // @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  // @IsString()
  first_name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  // @IsString()
  last_name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  // @IsString()
  age: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  // @IsString()
  email: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  // @IsString()
  gender: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary'
  })
  avatar_file?: Express.Multer.File;

  avatar: Express.Multer.File;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary'
  })
  cover_image_file?: Express.Multer.File;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary'
  })
  car_picture_file?: Express.Multer.File;

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  driving_license_file?: Array<Express.Multer.File>;

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  national_ID_file?: Array<Express.Multer.File>;

  ID_file?: [Express.Multer.File];
  driving_license?: [string];

  cover_image: [Express.Multer.File];


  @ApiPropertyOptional({
    type: 'string',
    format: 'binary'
  })
  real_picture_file?: Express.Multer.File;
  
  real_picture: Express.Multer.File;
  


  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  country: string;


  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  vehicle_no: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  driving_license_expiry: string;


  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  address: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  total_earning: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  ranking: string;

  @ApiPropertyOptional({
    type: String,
    example: '12345-1234567-1'
  })
  @IsOptional()
  @IsString()
  ID: string;

  @ApiPropertyOptional({
    type: String,
    example: '12345-1234567-1'
  })
  @IsOptional()
  @IsString()
  license_id: string;

  @ApiPropertyOptional({
    type: String,
    example: '12345-1234567-1'
  })
  @IsOptional()
  @IsString()
  car_name: string;

  @ApiPropertyOptional({
    type: String,
    example: '12345-1234567-1'
  })
  @IsOptional()
  @IsString()
  car_picture:  [Express.Multer.File];

  @ApiPropertyOptional({
    type: String,
    example: 'active | inactive'
  })
  @IsOptional()
  @IsEnum(STATUS)
  @IsString()
  status: STATUS;

  @ApiPropertyOptional()
  @IsOptional()
  isApproved: boolean

  @ApiPropertyOptional()
  @IsOptional()
  account_linked: boolean

  files: Array<Express.Multer.File>

}
