import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import axios from 'axios'

@Injectable()
export class WaypointService {
  private readonly API_KEY = 'AIzaSyATpSrcISxeRrwW8iTnB2j_C8UNR7Dv4f8';

  constructor( private readonly httpService: HttpService) {}

  async getRouteWaypoints(origin: string, destination: string): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${this.API_KEY}`;

    const response = await axios.get(url);

    const legs = response.data.routes[0].legs;
    const waypoints = legs.flatMap((leg: any) => leg.steps.flatMap((step: any) => step.polyline.points));
    const decodedWaypoints: number[][][] = waypoints.map((encoded: string) => decodePolyline(encoded));
    let flatWaypoints = decodedWaypoints.flatMap((subArray:any)=>subArray)
    return flatWaypoints;
}
}

function decodePolyline(encoded: string): number[][] {
  const poly = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    poly.push([lng / 1E5, lat / 1E5]);
  }

  return poly;
}

