import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConnectAccountDto {
  @ApiProperty({
    type: String,
    example: 'express',
  })
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({
    type: String,
  })
  email: string;

  @ApiPropertyOptional({
    type: String,
    example: 'US',
  })
  country: string;

  @ApiPropertyOptional({
    type: String,
    examples: {
      value: ['individual', 'company', 'non_profit', 'government_entity'],
    },
  })
  business_type: string;
}
