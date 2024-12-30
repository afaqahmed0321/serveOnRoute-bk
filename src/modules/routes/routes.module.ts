import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { RoutesRepository } from './routes.repository';
import { Route, RouteSchema } from './schemas/routes.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Waypoint, WaypointSchema } from './schemas/waypoint.schema';
import { WaypointService } from '@/helpers/maps.helper';
import { HttpModule, HttpService } from '@nestjs/axios';
import UsersModule from '../users/users.module';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
    MongooseModule.forFeature([{ name: Waypoint.name, schema: WaypointSchema }]),
    HttpModule,
    UsersModule
  ],
  controllers: [RoutesController],
  providers: [
    RoutesService,
    RoutesRepository,
    WaypointService,
  ],
  exports:[
    RoutesService
  ]
})
export class RoutesModule {}
