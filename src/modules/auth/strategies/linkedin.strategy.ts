import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-linkedin-oauth2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor() {
    super({
      clientID: process.env.LINKED_IN_CLIENT_ID,
      clientSecret: process.env.LINKED_IN_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/${process.env.LINKED_IN_CALLBACK_URL}`,
      scope: ['r_emailaddress'],
      // scope: ['r_emailaddress', 'r_liteprofile'],
      state: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      id: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    return done(null, user);
  }
}
