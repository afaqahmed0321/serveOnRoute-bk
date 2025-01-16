/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcrypt';
import { ChangeUserPasswordDto } from '@auth/dto/change-user-password.dto';
import { User } from '@users/schemas/users.schema';
import RequestUserInterface from '@interfaces/request-user.interface';
import DecodedUser from '@auth/interfaces/decoded-user.interface';
import JwtTokensInterface from '@auth/interfaces/jwt-tokens.interface';
import AuthRepository from '@auth/auth.repository';
import { generateRandom } from '@helpers/general.helper';
import ForgotPasswordDto from '@auth/dto/forgot-password.dto';
import { Cache } from 'cache-manager';
import { MailerService } from '@nestjs-modules/mailer';
import { TwilioService } from '@/helpers/twilio.helper';
import SendOtpDto from './dto/send-otp.dto';
import { verifyOtpDto } from './dto/verify-otp.dto';
import { StripeService } from '@/helpers/stripe.hepler';
import { WsException } from '@nestjs/websockets';
import { TokenExpiredError } from 'jsonwebtoken';
import { GetUserDataDto } from './dto/get-user-data.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private usersService: UsersService,
    private jwtService: JwtService,
    private repository: AuthRepository,
    private readonly mailerService: MailerService,
    private readonly twilioService: TwilioService,
    private readonly stripeService: StripeService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const criteria = email.includes('@') ? { email } : { phone: email };
    const user = await this.usersService.findUserByCriteria(criteria);
    if (!user) {
      throw new NotFoundException('User Not Exists');
    }
    if (user && (await bcrypt.compare(pass, user.password ?? ''))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<JwtTokensInterface> {
    // Data that needs to be signed with JWT
    const payload = await this.payload(user);
    const criteria = user.email ? { email: user.email } : { phone: user.phone };
    const identifier = user.email ? user.email : user.phone;
    const checkLoginToken = await this.repository.getToken(identifier);
    // if (
    //   checkLoginToken ||
    //   (await this.usersService.findUserByCriteria({
    //     ...criteria,
    //     isLoggedIn: true,
    //   }))
    // ) {
    //   throw new ForbiddenException('User Already Signin');
    // }
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
    });

    // await this.repository.addRefreshToken(identifier, refreshToken);
    const accessToken = this.jwtService.sign(payload);
    await this.usersService.updateUserByCriteria(criteria, {
      accessToken,
      isLoggedIn: true,
    });
    if (user?.is_block == true) {
      throw new UnauthorizedException('Blocked User');
    }
    // if(user?.phone && user?.isVerified == false ){
    //   throw new UnauthorizedException(  'User Not Verified' );
    // }
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      roles: user.role,
    };
  }

  async getRefreshTokenByEmail(email: string): Promise<string | unknown> {
    return this.repository.getToken(email);
  }

  public async getUserFromAuthenticationToken(token: string) {
    try {
      const getPayload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (getPayload._id) {
        const user = await this.usersService.findUserByUserId(getPayload._id);
        console.log(user);
        if (!user) {
          throw new WsException('User Not Exist with that Token!');
        }
        return this.payload(user);
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // throw new UnauthorizedException('Token has expired');
        console.log('Token Expired Error', err);
      }
      // throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(refreshToken: string): Promise<JwtTokensInterface> {
    const decodedUser = this.jwtService.decode(refreshToken) as DecodedUser;

    if (!decodedUser) {
      throw new ForbiddenException('Incorrect token');
    }

    const oldRefreshToken = await this.getRefreshTokenByEmail(
      decodedUser.email,
    );

    // if the old refresh token is not equal to request refresh token then this user is unauthorized
    if (!oldRefreshToken || oldRefreshToken !== refreshToken) {
      throw new UnauthorizedException(
        'Authentication credentials were missing or incorrect',
      );
    }
    const payload = await this.payload(decodedUser);
    const user = await this.usersService.findUserByEmail(payload.email);
    return await this.login(user as User);
  }

  async signup(signUpUserDto: any): Promise<JwtTokensInterface | any> {
    const { password } = signUpUserDto;
    let finduser;
    if (signUpUserDto.email) {
      finduser = await this.usersService.findUserByEmail(signUpUserDto.email);
    } else if (signUpUserDto.phone) {
      finduser = await this.usersService.findUserByCriteria({
        phone: signUpUserDto.phone,
      });
      // if(!finduser) await this.twilioService.twilioSendOTP(signUpUserDto.phone,'sms')
      if (finduser) {
        throw new BadRequestException(
          'User with Identifier(Email, Phone) already exists',
        );
      }
    }
    const customer = await this.stripeService.createCustomer({
      name: `${signUpUserDto.first_name} ${signUpUserDto.last_name}`,
      phone: signUpUserDto.phone,
    });
    console.log(customer);
    signUpUserDto.customerId = customer?.id;
    const user = await this.usersService.createUser({
      ...signUpUserDto,
      password: await AuthService.hashPassword(password),
    });

    //insert or update id user has any referral code

    const payload = await this.payload(user);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
    });
    if (payload.email) {
      // await this.repository.addRefreshToken(payload.email, refreshToken);
      await this.usersService.updateByEmail(user.email, { isLoggedIn: true });
    }
    if (payload.phone) {
      // await this.repository.addRefreshToken(payload.phone, refreshToken);
      await this.usersService.updateByEmail(user.phone, { isLoggedIn: true });
    }

    return {
      user: user,
      access_token: this.jwtService.sign(payload),
      roles: user.role,
      refresh_token: refreshToken,
    };
  }

  async changePassword(
    changeUserPasswordDto: ChangeUserPasswordDto,
    user: RequestUserInterface,
  ): Promise<string | unknown> {
    // Check if oldPassword matches user password
    const criteria = user.email.includes('@') ? user.email : user.phone;
    const update_criteria = user.email.includes('@')
      ? { email: user.email }
      : { phone: user.phone };
    if (
      !(await this.validateUser(criteria, changeUserPasswordDto.oldPassword))
    ) {
      // No meaningful message returned because of security measures. Ambiguous response
      throw new BadRequestException();
    }

    return this.usersService.updateUserByCriteria(update_criteria, {
      password: await AuthService.hashPassword(changeUserPasswordDto.password),
    } as User);
  }

  public async verifyToken(
    token: string,
    secret: string,
  ): Promise<DecodedUser | null> {
    try {
      return (await this.jwtService.verifyAsync(token, {
        secret,
      })) as DecodedUser | null;
    } catch (error) {
      return null;
    }
  }

  public static async hashPassword(password: string): Promise<string> {
    // Generating new hashed password to save in database
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }


  async getUserData(body: GetUserDataDto): Promise<User> {
    const user = await this.usersService.findUserByCriteria({
      phone: body.phone_number,
    });
    console.log("this is user:", user);
    if (!user) {
      throw new BadRequestException('User Not Found');
    } else {
      return user;
    }
  }

  async updataPassword(body: UpdatePasswordDto): Promise<any> {

    const { phone_number, newPassword } = body;

    const user = await this.usersService.findUserByCriteria({phone: phone_number,});
    console.log("this is user:", user);
    console.log("this is paswordddddddddd:", newPassword);
    
    if (!user) {
      throw new BadRequestException('User Not Found');
    } 

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    console.log("this is hashedddd paswordddddddddd:", user.password);

    await this.usersRepository.updateUser({ phone: phone_number }, user);

    return { message: 'Password updated successfully', data: user };

  }



  async sendOtp(body: SendOtpDto): Promise<string> {
    const user = await this.usersService.findUserByCriteria({
      phone: body.phone_number,
    });
    console.log("this is userrrrr", user)
    if (!user) {
      throw new BadRequestException('User Not Found');
    }
    return await this.twilioService.twilioSendOTP(body.phone_number);
  }

  async verifyOTP(body: verifyOtpDto): Promise<string> {
    const user = await this.usersService.findUserByCriteria({
      phone: body.phone_number,
    });

    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    const checkFlag = await this.twilioService.verifyOTP(
      body.phone_number,
      body.OTP,
    );

    if (checkFlag) {
      await this.usersService.updateUserByCriteria(
        { phone: body.phone_number },
        { isVerified: true },
      );
      return 'OTP verification successful';
    } else {
      throw new BadRequestException('OTP provided expired or wrong!');
    }
  }

  async forgotPasswordOtp(email: string): Promise<string> {
    if (!(await this.usersService.findUserByEmail(email))) {
      return '';
    }
    const otp = generateRandom(20);
    // Todo needs to generate mail
    this.mailerService
      .sendMail({
        to: email, // list of receivers
        subject: 'Forgot Password Link Wellavi', // Subject line
        html: `<h1>Please click the below link and reset your password. Your code will be expired in 5 minutes. Thanks!</h1></br><a class='button' href=${process.env.BASE_URL_FRONT_END}/new-password?token=${otp}&email=${email}>Click here to reset Password</a>`, // plaintext body
      })
      .then(async (res) => {
        await this.repository.setForgetOtp(`forget#${email}`, otp);
        return otp;
      })
      .catch(() => {
        return;
      });
    return otp;
    // return this.repository.setForgetOtp(`forget#${email}`, otp, 300); // Expiry is set to 5 minutes 60s*5 = 300s
  }

  async forgotPassword(reqBody: ForgotPasswordDto): Promise<string | unknown> {
    const res = {
      status: 400,
      message: 'invalid request',
    };
    const user = await this.usersService.findUserByEmail(reqBody.email);
    if (!user) {
      res.message = 'no user exist';
      return res;
    }

    const otp = await this.repository.getForgetOtp(reqBody.email);
    if (otp != reqBody.otp) {
      res.message = 'invalid code please try again';
      return res;
    }
    try {
      const updateResult = await this.usersService.updateUser(
        { email: reqBody.email } as User,
        {
          password: await AuthService.hashPassword(reqBody.password),
        } as User,
      );
      return updateResult;
    } catch (e: any) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async socialAuthRedirect(
    req: any,
    type: string,
  ): Promise<JwtTokensInterface> {
    //Insert  user in database after google login
    let access_token = '';
    let user: User | null;
    const payload = await this.payload(req.user);

    user = await this.usersService.findUserByEmail(req.user.email);
    if (user) {
      access_token = this.jwtService.sign(payload);
    } else {
      user = await this.usersService.createUser({
        ...payload,
        password: await AuthService.hashPassword('123456789'),
        isLoggedIn: true,
        name: req.user.name,
        age: '',
        phone: '',
        country: '',
        city: '',
        role: req.body.role,
      });
      access_token = req.user.accessToken;
    }

    //Add refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
    });
    // await this.repository.addRefreshToken(payload.email, refreshToken);

    return {
      access_token: access_token,
      roles: user.role,
      refresh_token: refreshToken,
    };
  }

  deleteTokenByKey(email: string): Promise<number> {
    return this.repository.removeToken(email);
  }

  async logout(token: string): Promise<object> {
    const decodedUser: DecodedUser | null = await this.verifyToken(
      token,
      process.env.JWT_SECRET ?? '',
    );
    if (!decodedUser) {
      throw new ForbiddenException('Incorrect token');
    }
    const user = await this.usersService.findUserByCriteria({
      accessToken: token,
    });

    if (!user) {
      throw new BadRequestException(
        ' Token not Matched with User, Already Log Out',
      );
    }
    const criteria = decodedUser?.email
      ? { email: decodedUser?.email }
      : { phone: decodedUser?.phone };
    const identifier = decodedUser?.email
      ? decodedUser?.email
      : decodedUser?.phone;

    const deletedUsersCount = await this.deleteTokenByKey(identifier as string);

    await this.usersService.updateUserByCriteria(criteria, {
      accessToken: null,
      isLoggedIn: false,
    });

    if (deletedUsersCount === 0) {
      throw new NotFoundException();
    }

    return {
      message: 'Successfully Logged out',
    };
  }

  async payload(data: any) {
    return {
      name: data?.name || data?.first_name || 'RouteOn User',
      email: data?.email || '',
      phone: data?.phone || '',
      _id: data?._id,
      avatar: data?.avatar,
      socketId: '',
      role: data.role,
    };
  }

  /**
   * Logouts with number
   * @param phoneNumber
   * @returns with number
   */
  async logoutWithNumber(phoneNumber: string): Promise<object> {
    const user = await this.usersService.findUserByCriteria({
      phone: phoneNumber,
    });
    const criteria = user?.email
      ? { email: user?.email }
      : { phone: user?.phone };
    const identifier = user?.email ? user?.email : user?.phone;

    const deletedUsersCount = await this.deleteTokenByKey(identifier as string);

    const updatedUser = await this.usersService.updateUserByCriteria(criteria, {
      accessToken: null,
      isLoggedIn: false,
    });

    if (deletedUsersCount === 0) {
      throw new NotFoundException();
    }

    return {
      message: 'Successfully Logged out',
      data: updatedUser,
    };
  }
}
