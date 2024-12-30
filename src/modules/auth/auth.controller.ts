import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginUserDto from './dto/login-user.dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ChangeUserPasswordDto } from '@auth/dto/change-user-password.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { User } from '@decorators/user.decorator';
import RequestUserInterface from '@interfaces/request-user.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import RequestWithUserInterface from '@interfaces/request-with-user.interface';
import AuthBearer from '@decorators/auth-bearer.decorator';
import DecodedUser from '@auth/interfaces/decoded-user.interface';
import { ApiForbiddenResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import JwtTokensInterface from '@auth/interfaces/jwt-tokens.interface';
import { AuthGuard } from '@nestjs/passport';
import ForgotPasswordOtpDto from '@auth/dto/forgot-password-otp.dto';
import ForgotPasswordDto from '@auth/dto/forgot-password.dto';
import { Request, Response } from 'express';
import LoginResponseInterface from '@auth/interfaces/login-response.interface';
import { boolean } from 'joi';
import SignupResponseInterface from '@auth/interfaces/signup-response.interface';
import {
  SERVER_ERROR,
  TOKEN_EXPIRED,
  USER_NOT_FOUND,
  INVALID_PASSWORD,
  RETURN_TOKEN,
  USER_SIGNED_UP,
  INVALID_USER_INFO,
  PASSWORD_CHANGED,
  PASSWORDS_NOT_MATCHED,
  USER_DETAILS,
  UNAUTHRIZED,
  FORBIDDEN_REQUEST,
  RETURN_USER_ID,
  VALIDATION_EXCEPTION,
  RETURN_JWT_TOKEN,
  SUCCESS_MESSAGE,
  DATA_UPDATED,
  USER_NOT_EXIST,
  EMAIL_SENT,
} from '@/constants/constants';
import { general_token } from '@/helpers/general.helper';
import { Auth } from '@/decorators/role.decorator';
import { ROLE } from '@/enums/role.enum';
import { CreateAdminAccess } from '@/guards/create-admin.guard';
import { SignUpAdminDto } from './dto/signup-admin.dto';
import SendOtpDto from './dto/send-otp.dto';
import { verifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ----------------SWAGGER-DOCS--------------------------
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        access_token: 'string',
        roles: [],
      },
    },
    description: RETURN_TOKEN,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [INVALID_PASSWORD, PASSWORDS_NOT_MATCHED],
        error: 'Bad Request',
      },
    },
    description: VALIDATION_EXCEPTION,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: TOKEN_EXPIRED,
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        error: 'Not Found',
      },
    },
    description: USER_NOT_FOUND,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({ summary: 'Identifier: email phone' })
  // ----------------SWAGGER-DOCS--------------------------
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: RequestWithUserInterface,
    @Res({ passthrough: true }) res: Response,
  ): Promise<object> {
    const tokens: JwtTokensInterface = await this.authService.login(req.user);
    console.log(req.user._id);
    console.log(tokens);
    // general_token(tokens.refresh_token, res);
    return {
      status: 200,
      message: 'Authorization Successful',
      access_token: tokens.access_token,
      roles: tokens.roles,
      _id: req.user._id,
    };
  }

  // ----------------SWAGGER-DOCS--------------------------
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        access_token: 'string',
        data: {
          first_name: 'string',
          last_name: 'string',
          email: 'string',
          password: 'string',
          role: ['string'],
          isLoggedIn: boolean,
          _id: 'string',
          createdAt: 'string',
          updatedAt: 'string',
        },
      },
    },
    description: USER_SIGNED_UP,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            required: {
              first_name: 'string',
              last_name: 'string',
              email: 'string',
              password: 'string',
              role: ['string'],
              isLoggedIn: boolean,
              _id: 'string',
              createdAt: 'string',
              updatedAt: 'string',
            },
          },
        ],
        error: 'Bad Request',
      },
    },
    description: INVALID_USER_INFO,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @ApiBody({ type: SignUpUserDto })
  @Post('signup')
  async signup(
    @Req() req: RequestWithUserInterface,
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignUpUserDto,
  ): Promise<object> {
    const tokens = await this.authService.signup(req.body);
    if (tokens instanceof BadRequestException) return tokens;
    console.log('TOKEN ERROR', tokens);
    if (tokens == null) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    } else {
      general_token(tokens.refresh_token, res);
      return {
        status: 200,
        message: 'Registration Successful',
        access_token: tokens.access_token,
        roles: tokens.user.role,
        _id: tokens.user._id,
      };
    }
  }

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        access_token: 'string',
        data: {
          name: 'string',
          email: 'string',
          password: 'string',
          role: ['string'],
          _id: 'string',
          createdAt: 'string',
          updatedAt: 'string',
        },
      },
    },
    description: USER_SIGNED_UP,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            required: {
              name: 'string',
              email: 'string',
              password: 'string',
              role: ['string'],
              _id: 'string',
              createdAt: 'string',
              updatedAt: 'string',
            },
          },
        ],
        error: 'Bad Request',
      },
    },
    description: INVALID_USER_INFO,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @ApiBearerAuth()
  @ApiBody({ type: SignUpAdminDto })
  // @Auth(Role.SUPER_ADMIN)
  @Post('signup-admin')
  async signupAdmin(
    @Req() req: RequestWithUserInterface,
    @Res({ passthrough: true }) res: Response,
  ): Promise<object> {
    const tokens = await this.authService.signup(req.body);
    console.log('TOKEN ERROR', tokens);
    if (tokens == null) {
      return {
        status: 400,
        message: 'Email Already Exist',
      };
    } else {
      general_token(tokens.refresh_token, res);
      return {
        status: 200,
        message: 'Registration Successful',
        access_token: tokens.access_token,
        roles: tokens.user.role,
      };
    }
  }

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        acknowledged: boolean,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      },
    },
    description: PASSWORD_CHANGED,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            required: {
              password: 'string',
              confirmPassword: 'string',
              oldPassword: 'string',
            },
          },
        ],
        error: 'Bad Request',
      },
    },
    description: PASSWORDS_NOT_MATCHED,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @ApiBody({ type: ChangeUserPasswordDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('changePassword')
  async changePassword(
    @Body() changeUserPasswordDto: ChangeUserPasswordDto,
    @User() user: RequestUserInterface,
  ) {
    let res = {
      status: 500,
      message: 'INTERNAL_SERVER_ERROR',
    };
    let result = await this.authService.changePassword(
      changeUserPasswordDto,
      user,
    );
    if (result) {
      res.status = 200;
      res.message = DATA_UPDATED;
    }
    return res;
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      example: {
        name: 'string',
        email: 'string',
        role: [],
      },
    },
    description: USER_DETAILS,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: UNAUTHRIZED,
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: FORBIDDEN_REQUEST,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('token')
  async getUserByAccessToken(
    @AuthBearer() token: string,
  ): Promise<RequestUserInterface> {
    const decodedUser: DecodedUser | null = await this.authService.verifyToken(
      token,
      process.env.JWT_SECRET ?? '',
    );

    if (!decodedUser) {
      throw new ForbiddenException();
    }
    // exp is JWT token expiry timestamp and iat
    const { ...user } = decodedUser;
    return user;
  }

  @Post('send-otp')
  sendLoginOTP(@Body() body: SendOtpDto) {
    return this.authService.sendOtp(body);
  }

  @Patch('verify-otp')
  verifyOtp(@Body() body: verifyOtpDto) {
    return this.authService.verifyOTP(body);
  }

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        id: 'string',
        message: 'success',
      },
    },
    description: RETURN_USER_ID,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              password: 'string',
            },
            value: 'string',
            property: 'string',
            children: [],
            constraints: {},
          },
        ],
        error: 'Bad Request',
      },
    },
    description: VALIDATION_EXCEPTION,
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        error: 'Not Found',
      },
    },
    description: USER_NOT_FOUND,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @Post('forgotPassword/otp')
  async forgotPasswordOtp(@Body() reqBody: ForgotPasswordOtpDto): Promise<any> {
    const response = {
      status: 400,
      message: USER_NOT_EXIST,
    };
    const result = await this.authService.forgotPasswordOtp(reqBody.email);
    if (result && result.length != 0) {
      response.message = EMAIL_SENT;
      response.status = 200;
    }
    return response;
  }

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        id: 'string',
        message: 'success',
      },
    },
    description: RETURN_USER_ID,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              password: 'string',
            },
            value: 'string',
            property: 'string',
            children: [],
            constraints: {},
          },
        ],
        error: 'Bad Request',
      },
    },
    description: VALIDATION_EXCEPTION,
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        error: 'Not Found',
      },
    },
    description: USER_NOT_FOUND,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @Put('forgotPassword')
  async forgotPassword(@Body() reqBody: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(reqBody);
  }

  @Post()
  sendOtp(@Body() body: SendOtpDto) {
    return this.authService.sendOtp(body);
  }

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        access_token: 'string',
        roles: [],
      },
    },
    description: RETURN_JWT_TOKEN,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: TOKEN_EXPIRED,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const tokens: JwtTokensInterface = await this.authService.refreshToken(
      req.cookies['refresh-token'],
    );

    general_token(tokens.refresh_token, res);
    return {
      access_token: tokens?.access_token,
      roles: tokens?.roles,
    };
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: object) {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.socialAuthRedirect(req, 'google');
    return res.redirect(
      `${process.env.BASE_URL_FRONT_END}/social-login?token=${tokens.refresh_token}`,
    );
  }

  @Get('linkedin/login')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin(@Req() req: any) {
    return;
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthRedirect(
    @Req() req: object,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.socialAuthRedirect(req, 'linkedin');
    return res.redirect(
      `${process.env.BASE_URL_FRONT_END}/social-login?token=${tokens.refresh_token}`,
    );
  }

  // @Get('facebook/login')
  // @UseGuards(AuthGuard('facebook'))
  // async facebookLogin(@Req() req: any) {
  //   return;
  // }

  // @Get('facebook/redirect')
  // @UseGuards(AuthGuard('facebook'))
  // async facebookLoginRedirect(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response,
  // ): Promise<any> {
  //   const tokens = await this.authService.socialAuthRedirect(req, 'facebook');
  //   return res.redirect(
  //     `${process.env.BASE_URL_FRONT_END}/social-login?token=${tokens.refresh_token}`,
  //   );
  // }

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        access_token: 'string',
        roles: [],
      },
    },
    description: RETURN_JWT_TOKEN,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: TOKEN_EXPIRED,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @Post('social-login/:token')
  async getTokenForSocialLogin(
    @Param('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseInterface> {
    const tokens: JwtTokensInterface = await this.authService.refreshToken(
      token,
    );

    general_token(tokens.refresh_token, res);

    return {
      access_token: tokens.access_token,
      roles: tokens.roles,
    };
  }

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'logged Out',
      },
    },
    description: SUCCESS_MESSAGE,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: TOKEN_EXPIRED,
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: SERVER_ERROR,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(
    @AuthBearer() token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    res.clearCookie('refresh-token');
    return this.authService.logout(token);
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('logout/:phoneNumber')
  async logoutWithNumber(
    @Param('phoneNumber') phoneNumber: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    res.clearCookie('refresh-token');
    return this.authService.logoutWithNumber(phoneNumber);
  }
}
