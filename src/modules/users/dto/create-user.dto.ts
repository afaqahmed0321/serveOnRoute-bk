import { ROLE } from '@/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Admin } from 'mongodb';

export class CreateUserDto {
  // @IsString()
  // @IsNotEmpty()
  // username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  name:string
  

  @IsNotEmpty()
  @IsOptional()
  age:string;


  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isLoggedIn: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  phone: string;
  
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  city: string;

  @ApiProperty({type:Array})
  @IsEnum(ROLE,{each:true})
  @IsNotEmpty()
  role:ROLE
}
