import { ObjectId } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ValidateNested,
  IsDefined,
  IsOptional,
  IsObject,
  IsNotEmpty,
  IsString,
  IsArray,
  IsDate,
  IsDateString,
  IsNumberString,
} from 'class-validator';
import {
  PARCEL_TYPE,
  PARCEL_BIDDING_TYPE,
} from '@/enums/parcel.enum';

export class CreateParcelDto {
  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // route_id:string

  customer_id?: ObjectId;

  // @ApiPropertyOptional()
  // @IsNotEmpty()
  // @IsString()
  // title:string

  // @ApiPropertyOptional()
  // @IsNotEmpty()
  // @IsString()
  // weight:string

  // @ApiPropertyOptional()
  // @IsNotEmpty()
  // @IsString()
  // description:string

  images: [String];

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files?: Array<Express.Multer.File>;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    fare:string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    height:string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    width:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  length: string;

  @ApiProperty({
    example: '15kg',
  })
  @IsNotEmpty()
  @IsString()
  weight: string;

  @ApiProperty({
    example: Object.values(PARCEL_TYPE),
  })
  @IsNotEmpty()
  parcel_type: PARCEL_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  // @Transform(({value})=> new Date(value))
  time: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  from_location: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  to_location: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  from_location_cor: string;

  @ApiProperty()
  @IsString()
  to_location_cor: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  biddingStartTime: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  biddingEndTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  receiving_slot: string;

  @ApiPropertyOptional({example:Object.values(PARCEL_BIDDING_TYPE)})
  @IsOptional()
  @IsString()  
  bidding_type: PARCEL_BIDDING_TYPE;
}
