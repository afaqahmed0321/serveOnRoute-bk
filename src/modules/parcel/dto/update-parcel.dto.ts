// import { ApiPropertyOptionalOptionalOptional, PartialType } from '@nestjs/swagger';
// import { PartialType } from '@nestjs/mapped-types';
// import { CreateParcelDto } from './create-parcel.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PARCEL_BIDDING_TYPE, PARCEL_TYPE } from '@/enums/parcel.enum';
import { Type } from 'class-transformer';
import { STATUS } from '@/enums/status.enum';

export class UpdateParcelDto {
  images?: [string];

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files?: Array<Express.Multer.File>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  fare?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  height?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiving_otp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  width?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  length?: string;

  @ApiPropertyOptional({
    example: '15kg',
  })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiPropertyOptional({
    example: Object.values(PARCEL_TYPE),
  })
  @IsOptional()
  @IsString()
  parcel_type?: PARCEL_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  // @Transform(({value})=> new Date(value))
  time?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  from_location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  to_location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  from_location_cor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  to_location_cor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rider_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pay_amount?: string;

  payment_intent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  biddingStartTime?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  biddingEndTime?: Date;

  @ApiPropertyOptional({
    example: Object.values(STATUS),
  })
  @IsOptional()
  @IsString()
  status?: STATUS;

  @ApiPropertyOptional({
    example: Object.values(PARCEL_BIDDING_TYPE),
  })
  @IsOptional()
  @IsString()
  parcel_bidding_type?: PARCEL_BIDDING_TYPE;
}
