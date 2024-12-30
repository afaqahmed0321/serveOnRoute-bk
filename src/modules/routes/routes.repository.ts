import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { CreateRouteDto } from './dto/create-route.dto';
import { Route, RouteDocument } from './schemas/routes.schema';
import { Waypoint, WaypointDocument } from './schemas/waypoint.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class RoutesRepository {
  constructor(
    @InjectModel(Route.name) private RouteModel: Model<RouteDocument>,
    @InjectModel(Route.name)
    private RouteModelPag: PaginateModel<RouteDocument>,
    @InjectModel(Waypoint.name) private WaypointModel: Model<WaypointDocument>,
  ) {}

  async createRoute(route: CreateRouteDto): Promise<any> {
    return await this.RouteModel.create(route);
  }

  async createWaypoints(waypoints: any): Promise<any> {
    return await this.WaypointModel.create(waypoints);
  }

  async updateRoute(criteria: object, data: object): Promise<any> {
    return await this.RouteModel.findOneAndUpdate(criteria, data, {
      new: true,
    });
  }

  async findRouteById(route_id: any): Promise<Route | null> {
    return await this.RouteModel.findOne({ route_id: route_id });
  }

  async findRoutes(filter: any, options: any): Promise<object | null> {
    return await this.RouteModelPag.paginate(filter, options);
  }

  async findAllRoutes(): Promise<any> {
    return await this.RouteModelPag.find();
  }

  async findNearByRoutes(query: any): Promise<any> {
    // Get all the routes with at least one waypoint within maxDistance of the pickup or dropoff location
    const routes = await this.WaypointModel.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [query.pickupLongitude, query.pickupLatitude],
          },
          $maxDistance: query.maxDistance,
        },
      },
    }).or([
      {
        waypoints: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [query.dropoffLongitude, query.dropoffLatitude],
            },
            $maxDistance: query.maxDistance,
          },
        },
      },
    ]);

    // Get all the riders that have a route within the found routes
    return routes;
  }

  // async findNearbyWaypoints(latitude: number, longitude: number, maxDistance:number): Promise<Waypoint[]> {
  //   console.log("INTO NEARBY",latitude,">",longitude,"----",maxDistance)
  //   let waypoints = await this.WaypointModel
  //     .aggregate([
  //       {
  //         $geoNear: {
  //           near: { type: "Point", coordinates: [longitude, latitude] },
  //           maxDistance: maxDistance ,
  //           distanceField: "dist.calculated",
  //           includeLocs: "dist.location",
  //           spherical: true
  //         }
  //       }
  //     ])
  //     console.log(waypoints)
  //     return waypoints
  //   }
  async findNearbyWaypoints(
    latitude: number,
    longitude: number,
    maxDistance: number,
  ): Promise<Waypoint[]> {
    let waypoints = await this.WaypointModel.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    });
    return waypoints;
  }

  async findMultipleRoutes(routes: any[]) {
    return await this.RouteModel.find({ _id: { $in: routes } });
  }

  async findLastByRouteId(): Promise<any | null> {
    return this.RouteModel.aggregate([
      {
        $sort: {
          user_id: -1,
        },
      },
      { $limit: 1 },
    ]);
  }

  async deleteRoute(id: string): Promise<Route | null> {
    await this.WaypointModel.deleteMany({ route: new ObjectId(id) });
    return await this.RouteModel.findOneAndDelete({ _id: new ObjectId(id) });
  }

  //update status (isActive)
  async updateStatus(id: string, status: boolean): Promise<boolean> {
    const updatedRoute = await this.RouteModel.findByIdAndUpdate(
      new ObjectId(id),
      {
        isActive: status,
      },
      {
        new: true,
      },
    );
    return !!updatedRoute;
  }
}
