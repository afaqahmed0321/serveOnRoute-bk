import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsEqual } from '@decorators/dto/is-equal.decorator';

export class ChangeUserPasswordDto { 
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  password: string;
 
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEqual(ChangeUserPasswordDto, (cup: ChangeUserPasswordDto) => cup.password)
  @MinLength(8)
  @MaxLength(64)
  confirmPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  oldPassword: string;
}
