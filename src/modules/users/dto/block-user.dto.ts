import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class BlockUserDto {
  @ApiProperty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  is_block: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  block_proof_description: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  block_proof_image: Express.Multer.File;
}
