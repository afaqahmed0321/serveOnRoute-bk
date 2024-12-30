import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: string;
}
