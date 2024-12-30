import { ApiProperty } from '@nestjs/swagger';
export default class LoginUserDto {
  @ApiProperty({
    description:'Email or Phone'
  })
  readonly identifier: string;

  @ApiProperty()
  readonly password: string;
  
}
