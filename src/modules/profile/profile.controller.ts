import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody, ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CreateProfileDto} from './dto/create-profile.dto';
import {UpdateProfileDto} from './dto/update-profile.dto';
import {ProfileService} from './profile.service';
import {
    DATA_FOUND,
    DATA_NOT_FOUND,
    DATA_UPDATED,
    INTERNAL_SERVER_ERROR,
    SUCCESSFULLY_SAVED
} from "@/constants/constants";

@ApiTags('Profile')
@Controller('profile')
@ApiBearerAuth()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {
    }

    //User's Profile Section
    @ApiCreatedResponse({
        schema: {
            type: 'object',
            example:
                {"status": 201, "message": SUCCESSFULLY_SAVED},

        },
        description: '201, return success message',
    })
    @ApiUnauthorizedResponse({
        schema: {
            type: 'object',
            example: {
                status: 401, message: 'string',
            },
        },
        description: 'Token has been expired',
    })
    @ApiInternalServerErrorResponse({
        schema: {
            type: 'object',
            example: {
                status: 500,
                message: 'string'
            },
        },
        description: '500: Internal Server Error',
    })
    @ApiBadRequestResponse({
        schema: {
            type: 'object',
            example:
                {"status": 400, "message": "string"},

        },
        description: '400, return bad request error',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('userProfile')
    createUserProfile(@Req() req: any,
                  @Body() reqBody: CreateProfileDto) {
        return this.profileService.create(reqBody); 
    }

    @ApiOkResponse({
        schema: {
            type: 'object',
            example: {
                status: 200,
                message: "message",
                data: {
                    title: 'string',
                    experience: 'string',
                    education: 'string',
                    language: [],
                    about: 'string',
                }
            },
        },
        description: '200, returns profile data',
    })
    @ApiUnauthorizedResponse({
        schema: {
            type: 'object',
            example: {
                status: 401, message: 'string',
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
    @Get('userProfile')
    async getUserProfile(@Req() req: any) {
        let res = {
            status: 500,
            message: INTERNAL_SERVER_ERROR,
            data: {}
        }
        const row = await this.profileService.findUserByUserId(req.user.email, 'user');
        if (row) {
            res.status = 200;
            res.data = row;
            res.message = DATA_FOUND;
        } else {
            res.status = 200;
            res.message = DATA_NOT_FOUND;
        }
        return res;
    }

}
