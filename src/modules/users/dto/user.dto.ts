import { ROLE } from '@enums/role.enum';
import { Prop } from '@nestjs/mongoose';
import { CreateUserDto } from './create-user.dto';

export class UserDto extends CreateUserDto {
  @Prop({ type: [String], enum: ROLE, default: [ROLE.NORMAL_USER] })
  roles: ROLE[];
}
