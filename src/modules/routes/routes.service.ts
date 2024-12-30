import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as _ from 'lodash';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto, UpdateStatusDto } from './dto/update-route.dto';
import { RoutesRepository } from './routes.repository';
import { QueryRouteDto } from './dto/query-route.dto';
import { ObjectId } from 'mongodb';
import { WaypointService } from '@helpers/maps.helper';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoutesService {
  constructor(
    private readonly routesRepository: RoutesRepository,
    private readonly waypointService: WaypointService,
    private readonly usersService: UsersService,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    let user = await this.usersService.findUserByCriteria({
      _id: createRouteDto.rider,
    });
    if (!user?.account || !user?.account_linked) {
      throw new BadRequestException(
        'Please Connect your Payment Account First,if you have connected, then please link it!',
      );
    }
    let route = await this.routesRepository.createRoute(createRouteDto);
    let waypoints = await this.getRouteWaypoints(
      route.from_cord,
      route.to_cord,
    );
    if (waypoints) {
      waypoints.forEach((element: any) => {
        element.route = route._id;
        return element;
      });
      console.log('FINAL----------------->', waypoints);
      await this.routesRepository.createWaypoints(waypoints);
    }
    return route;
  }

  findAll(query: QueryRouteDto) {
    console.log(query);
    let filter = _.pick(query, ['time', 'from', 'to', 'rider']);
    let options = _.pick(query, [
      'page',
      'limit',
      'sort',
      'populate',
      'select',
    ]);
    return this.routesRepository.findRoutes(filter, options);
  }

  findOne(id: string) {
    return this.routesRepository.findRouteById(id);
  }

  update(id: string, updateRouteDto: UpdateRouteDto) {
    return this.routesRepository.updateRoute(
      { _id: new ObjectId(id) },
      updateRouteDto,
    );
  }

  async getNearbyRoutes(query: any) {
    console.log(query);
    let latitude = parseFloat(query.from_location.split(',')[0]);
    let longitude = parseFloat(query.from_location.split(',')[1]);
    const from_waypoints = await this.routesRepository.findNearbyWaypoints(
      latitude,
      longitude,
      parseFloat(query.maxDistance),
    );
    if (from_waypoints?.length) {
      const from_routes = from_waypoints.map((waypoint) => waypoint.route);
      const filteredFromRoutes = removeDuplicates(from_routes);
      const to_waypoints = await this.routesRepository.findNearbyWaypoints(
        parseFloat(query.to_location.split(',')[0]),
        parseFloat(query.to_location.split(',')[1]),
        parseFloat(query.maxDistance),
      );
      const to_routes = to_waypoints.map((waypoint) => waypoint.route);
      const filteredToRoutes = removeDuplicates(to_routes);
      console.log('TO ROUTES>>>', filteredToRoutes);
      console.log(
        '////////////////////////FROM Routes>>>>',
        filteredFromRoutes,
      );
      if (filteredFromRoutes.length) {
        let commonRoutes = findCommonElements(
          filteredFromRoutes,
          filteredToRoutes,
        );
        console.log('CommonRoute>>>', commonRoutes);
        let riders = await this.getRoutesRiders(commonRoutes);
        return riders;
      }
    }

    function removeDuplicates(arr: any) {
      const uniqueSet = new Set(arr.map((obj: any) => obj.toString()));
      return Array.from(uniqueSet, (id) => new ObjectId(id as string));
    }

    function findCommonElements(arr1: any, arr2: any) {
      const set1 = new Set(arr1.map((item: any) => item.toString()));
      const commonElements = arr2.filter((item: any) =>
        set1.has(item.toString()),
      );
      return commonElements;
    }
  }

  async getRoutesRiders(routes: any[]) {
    let Routes = await this.routesRepository.findMultipleRoutes(routes);
    let riders = Routes.map((route) => route.rider);
    const filteredRiders = riders.filter(
      (rider, pos) => riders.indexOf(rider) == pos,
    );
    console.log('filteredRiders-------------------------->>>>', filteredRiders);
    return filteredRiders;
  }

  async getRouteWaypoints(from: any, to: any) {
    const waypoints = await this.waypointService.getRouteWaypoints(from, to);
    if (waypoints?.length) {
      let newWaypoints = waypoints.map((waypoint: any) => {
        return {
          location: {
            type: 'Point',
            coordinates: [waypoint[0], waypoint[1]],
          },
        };
      });
      return newWaypoints;
    }
  }

  remove(id: string) {
    return this.routesRepository.deleteRoute(id);
  }

  async updateRoute(id: string, updateRouteDto: UpdateStatusDto) {
    try {
      const { status } = updateRouteDto || {};
      const result = await this.routesRepository.updateStatus(id, status);
      if (result) {
        return { status: 200, message: 'Route Updated Successfully' };
      } else {
        throw new BadRequestException('error while updating route status');
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
