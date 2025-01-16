/* eslint-disable prettier/prettier */
// update-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone_number: string;
  
    @ApiProperty()
    @IsString()
    @MinLength(6)  // Minimum length for security
    @MaxLength(20) // Maximum length for security
    newPassword: string;
}
