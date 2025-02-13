/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import RequestWithUserInterface from '@interfaces/request-with-user.interface';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { UpdateUserPasswordDto } from '@users/dto/update-user-password.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '@auth/auth.service';
import {
  DATA_FOUND,
  DATA_NOT_FOUND,
  DATA_UPDATED,
  INTERNAL_SERVER_ERROR,
} from '@/constants/constants';
import { google } from 'googleapis';
import { ROLE } from '@/enums/role.enum';
import { Auth } from '@/decorators/role.decorator';
import { UserRoles, getUsersDto, searchUserDto } from './dto/get-users.dto';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { BlockUserDto } from './dto/block-user.dto';
import { instanceToPlain } from 'class-transformer';
import { AccountLinkDto } from './dto/account-link.dto';
import { ConnectAccountDto } from './dto/connect-account.dto';
import RequestUserInterface from '@/interfaces/request-user.interface';
import { User } from '@/decorators/user.decorator';
import { QueryUserCountsDto } from './dto/query-countsuser.dto';
import { VerifyDriverDto } from './dto/verify-driver.dto';
import { QueryLoggedInDto } from './dto/query-loggedIn.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({
    schema: {
      type: 'object',
      example: { status: 200, message: DATA_UPDATED },
    },
    description: '200, update settings',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        status: 401,
        message: 'string',
      },
    },
    description: 'Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        status: 500,
        message: 'string',
      },
    },
    description: 'Internal Server Error',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: { status: 400, message: 'string' },
    },
    description: '400, return bad request error',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // @ApiBody({type: UpdateUserDto})
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar_file', maxCount: 1 },
        { name: 'cover_image_file', maxCount: 1 },
        { name: 'national_ID_file', maxCount: 2 },
        { name: 'driving_license_file', maxCount: 2 },
        { name: 'real_picture_file', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
        { name: 'car_picture', maxCount: 1 },
        { name: 'ID_file', maxCount: 1 },
        { name: 'cover_image', maxCount: 1 },
      ],
      { limits: { fileSize: 10 * 1024 * 1024 } },
    ),
  )
  @Put('update-user')
  async updateUser(
    @Req() req: RequestWithUserInterface,
    @Body() data: UpdateUserDto,
    @UploadedFiles()
    files: {
      avatar_file: Express.Multer.File[];
      cover_image_file: Express.Multer.File[];
      national_ID_file: Express.Multer.File[];
      driving_license_file: Express.Multer.File[];
      real_picture_file: Express.Multer.File[];
    },
  ) {
    data.avatar_file = files?.avatar_file?.length
      ? files.avatar_file[0]
      : undefined;
    data.cover_image_file = files?.cover_image_file?.length
      ? files.cover_image_file[0]
      : undefined;
    data.national_ID_file = files?.national_ID_file?.length
      ? files.national_ID_file
      : undefined;
    data.driving_license_file = files?.driving_license_file?.length
      ? files.driving_license_file
      : undefined;
    data.real_picture_file = files?.real_picture_file?.length
      ? files.real_picture_file[0]
      : undefined; 

    let res = {
      status: 500,
      message: INTERNAL_SERVER_ERROR,
      result: '',
    };
    // @ts-ignore
    let result = await this.userService.updateUser(req.user._id, data, req);
    if (result) {
      res.status = 200;
      res.message = DATA_UPDATED;
      res.result = result;
    }
    return res;
  }

  @Put('change-login')
  updateLoggedIn(@Query() query: QueryLoggedInDto) {
    query.isLoggedIn =
      query.isLoggedIn != undefined
        ? query.isLoggedIn
        : (query.isLoggedIn = false);
    return this.userService.updateUserByCriteria(query, { isLoggedIn: false });
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      example: { status: 200, message: DATA_UPDATED },
    },
    description: '200, update settings',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        status: 401,
        message: 'string',
      },
    },
    description: 'Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        status: 500,
        message: 'string',
      },
    },
    description: 'Internal Server Error',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: { status: 400, message: 'string' },
    },
    description: '400, return bad request error',
  })
  @ApiBearerAuth()
  // @UseInterceptors(checkHeader())
  @Auth(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @Post('/all')
  getAllUser(@Query() query: getUsersDto, @Body() body: UserRoles) {
    return this.userService.getAllUsers(query, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/account-link')
  accountLink(@User() user: RequestUserInterface) {
    return this.userService.updateUserByCriteria(
      { _id: user._id },
      { account_linked: true },
    );
  }

  @HttpCode(200)
  @ApiBearerAuth()
  // @UseInterceptors(checkHeader())
  @Auth(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @Post('/driver-verify')
  adminVerifyUser(@Body() body: VerifyDriverDto) {
    return this.userService.verifyDriver(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('link-account')
  accountlink(
    @Body() body: AccountLinkDto,
    @User() user: RequestUserInterface,
  ) {
    return this.userService.linkAccount(body, user._id);
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'accountId',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard)
  @Get('get-account')
  accountget(@Query('accountId') query: string) {
    return this.userService.getAccount(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('connect-account')
  addConnectAccount(
    @Body() body: ConnectAccountDto,
    @User() user: RequestUserInterface,
  ) {
    return this.userService.connectAccount(body, user._id);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      example: { status: 200, message: DATA_UPDATED },
    },
    description: '200, update settings',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        status: 401,
        message: 'string',
      },
    },
    description: 'Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        status: 500,
        message: 'string',
      },
    },
    description: 'Internal Server Error',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: { status: 400, message: 'string' },
    },
    description: '400, return bad request error',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        block_proof_image: {
          type: 'string',
          format: 'binary',
        },
        block_proof_description: {
          type: 'string',
        },
        user_id: {
          type: 'string',
        },
        is_block: {
          type: 'boolean',
        },
      },
    },
  })
  @HttpCode(200)
  @ApiBearerAuth()
  @Auth(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @Post('block')
  @UseInterceptors(
    FileInterceptor('block_proof_image', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async blockUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: BlockUserDto,
  ) {
    if (file) body.block_proof_image = file;
    let newbody = instanceToPlain(body);
    return await this.userService.blockUser({ user_id: body.user_id }, newbody);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      example: { status: 200, message: DATA_UPDATED },
    },
    description: '200, update settings',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        status: 401,
        message: 'string',
      },
    },
    description: 'Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        status: 500,
        message: 'string',
      },
    },
    description: 'Internal Server Error',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: { status: 400, message: 'string' },
    },
    description: '400, return bad request error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserPasswordDto })
  @Put('update-password')
  async updatePassword(
    @Req() req: RequestWithUserInterface,
    @Body() data: UpdateUserPasswordDto,
  ) {
    let res = {
      status: 500,
      message: INTERNAL_SERVER_ERROR,
    };
    let user = await this.userService.findUserByEmail(req.user.email);
    if (
      user &&
      (await bcrypt.compare(data.old_password, user.password ?? ''))
    ) {
      let obj = {
        password: await AuthService.hashPassword(data.password),
      };
      let result = await this.userService.updateUser(req.user._id, obj);
      if (result) {
        res.status = 200;
        res.message = DATA_UPDATED;
      }
    } else {
      res.status = 400;
      res.message = 'wrong password';
    }
    return res;
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      example: {
        status: 200,
        message: 'message',
        data: {
          _id: 'string',
          user_id: 'string',
          name: 'string',
          email: 'string',
          role: [],
          isLoggedIn: true,
        },
      },
    },
    description: '200, returns user data',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        status: 401,
        message: 'string',
      },
    },
    description: 'Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        status: 500,
        message: 'string',
        details: {},
      },
    },
    description: 'Internal Server Error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/email')
  async fetchUserByEmail(@Req() req: RequestWithUserInterface) {
    let res = {
      status: 200,
      message: DATA_NOT_FOUND,
      data: {},
    };
    const user = await this.userService.findUserByEmail(req.user.email);
    if (user) {
      res.data = user;
      res.message = DATA_FOUND;
    } else {
      res.status = 500;
    }
    return res;
  }

  @Get('counts')
  userCounts(@Query() query: QueryUserCountsDto) {
    return this.userService.userCounts(query.role);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      example: {
        status: 200,
        message: 'message',
        data: {
          _id: 'string',
          user_id: 'string',
          name: 'string',
          email: 'string',
          role: [],
          isLoggedIn: true,
        },
      },
    },
    description: '200, returns user data',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        status: 401,
        message: 'string',
      },
    },
    description: 'Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        status: 500,
        message: 'string',
        details: {},
      },
    },
    description: 'Internal Server Error',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user-by-id/:user_id')
  async findUserByUserId(@Param('user_id') userId: string) {
    let res = {
      status: 500,
      message: INTERNAL_SERVER_ERROR,
      data: {},
    };
    const user = await this.userService.findUserByUserId(userId);
    if (user) {
      res.data = user;
      res.message = DATA_FOUND;
    } else {
      res.status = 400;
      res.message = DATA_NOT_FOUND;
    }
    return res;
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/create-token')
  async createToken(@Body() body: any) {
    let code = body?.code;
    let response;
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_ROUTEON_CLIENT_ID,
      process.env.GOOGLE_ROUTEON_CLIENT_SECRET,
      '',
    );

    console.log(
      process.env.GOOGLE_ROUTEON_CLIENT_ID,
      process.env.GOOGLE_ROUTEON_CLIENT_SECRET,
    );

    try {
      response = await oauth2Client.getToken(code);
    } catch (err) {
      response = err;
    }
    return response;
  }

  @ApiParam({ name: '_id', type: String })
  @Auth(ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.MANAGER)
  @Delete(':_id')
  async deleteUser(@Param('_id') _id: string) {
    return await this.userService.deleteUser(_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Auth(ROLE.ADMIN, ROLE.SUPER_ADMIN)
  @Get('/usersReport')
  async generateReport(@Query() query: searchUserDto, @Res() res: Response) {
    const { search } = query || {};
    return await this.userService.generateUserReport(search, res);
  }
}
