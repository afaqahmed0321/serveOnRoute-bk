import { ROLES_KEY } from '@/decorators/role.decorator';
import { ROLE } from '@/enums/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ArrayMinSize,
  IsOptional
  
} from 'class-validator';
import {IsPhoneOrEmail} from '@decorators/phone-email.decorator'


export class SignUpUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneOrEmail()
  @IsEmail()
  email: string;

  user_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneOrEmail()
  @IsString()
  phone: string;
  
  @ApiProperty()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional()
  @IsString()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  ID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(["male","female",'other'])
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsEnum(ROLE, { each: true })
  @ArrayMinSize(1)
  role: ROLE[];

  customerId?:string
  
}
