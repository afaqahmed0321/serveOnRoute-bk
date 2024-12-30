import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class AppController {
  constructor() {}

  // @ApiCreatedResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 200, "message": 'string', "data": []},

  //   },
  //   description: '200, return followings data',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 401, message: 'string',
  //     },
  //   },
  //   description: 'Token has been expired',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 500,
  //       message: 'string',
  //       data: []
  //     },
  //   },
  //   description: '500: Internal Server Error',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 400, "message": BAD_REQUEST, "data": []},

  //   },
  //   description: '400, return bad request error',
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('monthly-report')
  // async MonthlyFollowers(@Req() req: any) {
  //   const res = {
  //     status: 200,
  //     message: DATA_FOUND,
  //     data: [
  //       {
  //         name: "Sessions for last 30 days",
  //         totalCount: 0,
  //         average: 0
  //       },
  //       {
  //         name: "Earnings for last 30 days",
  //         totalCount: 0,
  //         average: 0
  //       },
  //       {
  //         name: "Followers for last 30 days",
  //         totalCount: 0,
  //         average: 0
  //       },
  //       {
  //         name: "Views for last 30 days",
  //         totalCount: 0,
  //         average: 0
  //       }
  //     ]
  //   }
  //   //fetch monthly followers count
  //   const monthlyFollowers = await this.followRequestService.fetchMonthlyFollowers(req.user.email);
  //   res.data[2] = monthlyFollowers;

  //   //fetch monthly sessions count
  //   const sessionCount = await this.sessionsService.fetchSessionsCount(req.user.email);
  //   res.data[0] = sessionCount;

  //   //fetch monthly views count
  //   const viewsCount = await this.viewsService.fetchViewsCount(req.user.email);
  //     res.data[3] = viewsCount;

  //   return res;
  // }

  // @ApiCreatedResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 200, "message": 'string', "data": []},

  //   },
  //   description: '200, return dashboard number of count for graph',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 401, message: 'string',
  //     },
  //   },
  //   description: 'Token has been expired',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 500,
  //       message: 'string',
  //       data: []
  //     },
  //   },
  //   description: '500: Internal Server Error',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 400, "message": BAD_REQUEST, "data": []},

  //   },
  //   description: '400, return bad request error',
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('graph-data-count/:date_from/:date_to')
  // async graphDataCount(@Req() req: any,
  //                        @Param('date_from') dateFrom: string,
  //                        @Param('date_to') dateTo: string) {
  //   const res = {
  //     status: 200,
  //     message: DATA_FOUND,
  //     data: [
  //       {
  //         "name": "Sessions",
  //         "totalCount": 0
  //       },
  //       {
  //         "name": "Hours",
  //         "totalCount": 0
  //       },
  //       {
  //         "name": "Paid out",
  //         "totalCount": 0
  //       },
  //       {
  //         "name": "Followers",
  //         "totalCount": 0
  //       },
  //       {
  //         "name": "Views",
  //         "totalCount": 0
  //       },
  //       {
  //         "name": "Events",
  //         "totalCount": 0
  //       }
  //     ]
  //   }

  //   //fetch sessions count
  //   const sessionCount = await this.sessionsService.fetchSessionsCountWithDateFilter(req.user.email, dateFrom, dateTo);
  //   if (sessionCount.length > 0)
  //   {
  //     res.status = 200;
  //     res.message = DATA_FOUND;
  //     res.data[0].totalCount = sessionCount[0].total_sessions;
  //   }

  //   //fetch hours count
  //   const hoursCount = await this.sessionsService.fetchHoursCountWithDateFilter(req.user.email, dateFrom, dateTo);
  //   if (hoursCount.length > 0)
  //   {
  //     const total_hours = hoursCount[0].total_minutes / 60
  //     res.status = 200;
  //     res.message = DATA_FOUND;
  //     res.data[1].totalCount = total_hours;
  //   }

  //   //fetch monthly followers count
  //   const FollowersCount = await this.followRequestService.fetchFollowersWithDateFilter(req.user.email, dateFrom, dateTo);
  //   if (FollowersCount.length > 0)
  //   {
  //     res.status = 200;
  //     res.message = DATA_FOUND;
  //     res.data[3].totalCount = FollowersCount[0].total_followers;
  //   }

  //   //fetch views count
  //   const viewsCount = await this.viewsService.fetchViewsCountWithDateFilter(req.user.email, dateFrom, dateTo);
  //   if (viewsCount.length > 0)
  //   {
  //     res.status = 200;
  //     res.message = DATA_FOUND;
  //     res.data[4].totalCount = viewsCount[0].total_views;
  //   }

  //   return res;
  // }

  // @ApiCreatedResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 200, "message": 'string', "data": []},

  //   },
  //   description: '200, return dashboard graph sessions count date base',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 401, message: 'string',
  //     },
  //   },
  //   description: 'Token has been expired',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 500,
  //       message: 'string',
  //       data: []
  //     },
  //   },
  //   description: '500: Internal Server Error',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 400, "message": BAD_REQUEST, "data": []},

  //   },
  //   description: '400, return bad request error',
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('session-result/:date_from/:date_to')
  // async graphSessionResult(@Req() req: any,
  //                      @Param('date_from') dateFrom: string,
  //                      @Param('date_to') dateTo: string) {
  //   const res = {
  //     status: 200,
  //     message: DATA_FOUND,
  //     data: []
  //   }

  //   //fetch sessions count
  //   const sessionResult = await this.sessionsService.fetchSessionsResultWithDateFilter(req.user.email, dateFrom, dateTo);
  //   if (sessionResult.length > 0)
  //   {
  //     res.status = 200;
  //     res.message = DATA_FOUND;
  //     res.data = sessionResult;
  //   }

  //   return res;
  // }

  // @ApiCreatedResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 200, "message": 'string', "data": []},

  //   },
  //   description: '200, return dashboard graph hours count date base',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 401, message: 'string',
  //     },
  //   },
  //   description: 'Token has been expired',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 500,
  //       message: 'string',
  //       data: []
  //     },
  //   },
  //   description: '500: Internal Server Error',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 400, "message": BAD_REQUEST, "data": []},

  //   },
  //   description: '400, return bad request error',
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('hours-result/:date_from/:date_to')
  // async graphHoursResult(@Req() req: any,
  //                          @Param('date_from') dateFrom: string,
  //                          @Param('date_to') dateTo: string) {
  //   const res = {
  //     status: 200,
  //     message: DATA_FOUND,
  //     data: []
  //   }

  //   //fetch sessions count
  //   const hoursResult = await this.sessionsService.fetchHoursResultWithDateFilter(req.user.email, dateFrom, dateTo);
  //   if (hoursResult.length > 0)
  //   {
  //     res.status = 200;
  //     res.message = DATA_FOUND;
  //     res.data = hoursResult;
  //   }

  //   return res;
  // }

  // @ApiCreatedResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 200, "message": 'string', "data": []},

  //   },
  //   description: '200, return dashboard graph followers count date base',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 401, message: 'string',
  //     },
  //   },
  //   description: 'Token has been expired',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 500,
  //       message: 'string',
  //       data: []
  //     },
  //   },
  //   description: '500: Internal Server Error',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 400, "message": BAD_REQUEST, "data": []},

  //   },
  //   description: '400, return bad request error',
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('followers-result/:date_from/:date_to')
  // async graphFollowersResult(@Req() req: any,
  //                          @Param('date_from') dateFrom: string,
  //                          @Param('date_to') dateTo: string) {
  //   const res = {
  //     status: 200,
  //     message: DATA_FOUND,
  //     data: []
  //   }

  //   //fetch sessions count
  //   const followersResult = await this.followRequestService.fetchFollowersResultWithDateFilter(req.user.email, dateFrom, dateTo);
  //   if (followersResult.length > 0)
  //   {
  //     res.status = 200;
  //     res.message = DATA_FOUND;
  //     res.data = followersResult;
  //   }

  //   return res;
  // }

  // @ApiCreatedResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 200, "message": 'string', "data": []},

  //   },
  //   description: '200, return dashboard graph views count date base',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 401, message: 'string',
  //     },
  //   },
  //   description: 'Token has been expired',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 500,
  //       message: 'string',
  //       data: []
  //     },
  //   },
  //   description: '500: Internal Server Error',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 400, "message": BAD_REQUEST, "data": []},

  //   },
  //   description: '400, return bad request error',
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('views-result/:date_from/:date_to')
  // async graphViewsResult(@Req() req: any,
  //                          @Param('date_from') dateFrom: string,
  //                          @Param('date_to') dateTo: string) {
  //   const res = {
  //     status: 200,
  //     message: DATA_FOUND,
  //     data: []
  //   }

  //   //fetch views result
  //   const viewsCount = await this.viewsService.fetchViewsResultWithDateFilter(req.user.email, dateFrom, dateTo);

  //   if (viewsCount.length > 0)
  //   {
  //     res.status = 200;
  //     res.message = DATA_FOUND;
  //     res.data = viewsCount;
  //   }

  //   return res;
  // }

  // @ApiCreatedResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {status: 200, message: 'string', data: []},

  //   },
  //   description: '200, return languages',
  // })
  // @ApiUnauthorizedResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 401, message: 'string',
  //     },
  //   },
  //   description: 'Token has been expired',
  // })
  // @ApiInternalServerErrorResponse({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 500,
  //       message: 'string',
  //       data: []
  //     },
  //   },
  //   description: '500: Internal Server Error',
  // })
  // @ApiBadRequestResponse({
  //   schema: {
  //     type: 'object',
  //     example:
  //         {"status": 400, "message": BAD_REQUEST, "data": []},

  //   },
  //   description: '400, return bad request error',
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get('languages')
  // async languages(@Req() req: any,) {
  //   return {
  //     status: 200,
  //     message: DATA_FOUND,
  //     data: languagesData()
  //   };
  // }
}
