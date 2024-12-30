import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AccountLinkDto {
  @ApiProperty({
    type: String,
    example: 'acct_1MnldELwxyIa6OOm',
  })
  @IsNotEmpty()
  account: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/reauth',
  })
  @IsNotEmpty()
  refresh_url: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/return',
  })
  @IsNotEmpty()
  return_url: string;

  @ApiProperty({
    type: String,
    example: 'account_onboarding',
  })
  @IsOptional()
  type: string;
}
