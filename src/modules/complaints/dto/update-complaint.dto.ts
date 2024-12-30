import { STATUS } from '@/enums/status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class Proof {
  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  images: string[];
}

export class UpdateComplaintDto {
  @ApiPropertyOptional({
    type: String,
    example: {
      value: Object.values(STATUS),
    },
  })
  @IsString()
  @IsOptional()
  status: string;

  @ApiPropertyOptional()
  defendant_proof: Proof;

  @ApiPropertyOptional()
  complainant_proof: Proof;
}
