import { UsersService } from '@users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@users/schemas/users.schema';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    readonly usersService: UsersService,
    readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    let criteria =
      payload.email != undefined && payload.email != '' && payload.email != null
        ? { email: payload.email }
        : { phone: payload.phone };
    const user = await this.usersService.findUserByCriteria(criteria);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    console.log(user._id, '----------------------------JWTpassed');
    return {
      _id: user._id,
      name: user.name,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      age: user.age,
      role: user.role,
      country: user.country,
      city: user.city,
      phone: user.phone,
      customerId: user.customerId,
    };
  }
}
