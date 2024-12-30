import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  password: string;

}
