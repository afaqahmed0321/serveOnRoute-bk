import { ApiProperty } from '@nestjs/swagger';
import { IsEqual } from '@decorators/dto/is-equal.decorator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export default class ForgotPasswordDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  readonly email: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly otp: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsEqual(ForgotPasswordDto, (cup: ForgotPasswordDto) => cup.password)
  readonly confirmPassword: string = '';
}
