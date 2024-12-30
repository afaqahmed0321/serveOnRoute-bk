import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
  Delete,
  Query,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto, UpdateStatusDto } from './dto/update-route.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DATA_UPDATED } from '@/constants/constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@/decorators/user.decorator';
import RequestUserInterface from '@/interfaces/request-user.interface';
import { QueryRouteDto } from './dto/query-route.dto';
import { RouteWaypointDto } from './dto/route-waypoints.dto';
import { NearByWaypoints } from './dto/nearby-riders.dto';

@ApiTags('Routes')
// @ApiBearerAuth()
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

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
  @Post()
  create(@User() user: RequestUserInterface, @Body() body: CreateRouteDto) {
    console.log(body);

    body.rider = user._id;
    return this.routesService.create({ ...body });
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
  @Get()
  findAll(@Query() query: QueryRouteDto) {
    return this.routesService.findAll(query);
  }

  @Get('/nearByWaypoints')
  getNearByWaypoints(@Query() location: NearByWaypoints) {
    console.log('WE ENTER?>>>>>>>>>>......');
    return this.routesService.getNearbyRoutes(location);
  }

  @Get('/waypoints')
  getWaypoints(@Query() query: RouteWaypointDto) {
    return this.routesService.getRouteWaypoints(query.from_cord, query.to_cord);
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
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    console.log(updateRouteDto);
    return this.routesService.update(id, updateRouteDto);
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      example: { status: 200, message: DATA_UPDATED },
    },
    description: '200, status updated sucessfully',
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
  @Put('/updateStatus:id')
  async statusUpdate(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    console.log(
      '<<<<<<<<<<<<<<<updateStatusDto>>>>>>>>>>>>>>>>',
      updateStatusDto,
    );
    this.routesService.updateRoute(id, updateStatusDto);
    return {
      status: HttpStatus.OK,
      message: DATA_UPDATED,
    };
  }
}
