import { ROLE } from '@/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpAdminDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(8)
  @MaxLength(64)
  password: string;


  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;
  
  @ApiProperty({enum:['admin']})
  @IsString()
  @IsNotEmpty()
  role: [ROLE.MANAGER];
   
}