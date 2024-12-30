import {
  Client,
  LatLngLiteral,
  AddressType,
} from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleMapsService extends Client {
  private readonly accessKey = this.config.get(
    'AIzaSyABbE8m9cfg-OspSdVkr58Lo5SplQ_XFLA',
  );

  apiKey = 'AIzaSyABbE8m9cfg-OspSdVkr58Lo5SplQ_XFLA';
  constructor(private config: ConfigService) {
    super();
  }

  async getCoordinates(address: {
    street: string;
    number: string;
    city: string;
    state: string;
    postalCode: string;
  }): Promise<any> {
    // Promise<LatLngLiteral>
    console.log('is it fine still here ', address);

    const googleRes = await this.geocode({
      params: {
        address: `${address.street}, ${address.number}, ${address.city}, ${address.state}, ${address.postalCode}`,
        key: this.apiKey, // this.accessKey,
      },
    }).catch((err) => {
      console.log('got error in geoCode: ', err);
    });
    if (googleRes) {
      const { lng, lat } = googleRes.data.results[0].geometry.location;
      return { lng, lat };
    } else return 'Got an error ';
  }

  async getDirections(origin: string, destination: string): Promise<any> {
    const response = await this.directions({
      params: {
        origin,
        destination,
        key: this.apiKey,
      },
    });
    if (response.data && response.data.routes.length > 0) {
      const { legs, overview_polyline } = response.data.routes[0];
      const points = overview_polyline.points;
      const path = this.decodePolyline(points);
      return { legs, path };
    } else {
      return null;
    }
  }

  private decodePolyline(encoded: string) {
    let index = 0,
      len = encoded.length,
      lat = 0,
      lng = 0,
      array = [];

    while (index < len) {
      let b,
        shift = 0,
        result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      array.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return array;
  }

  async getAddressByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<string> {
    const response = await this.reverseGeocode({
      params: {
        latlng: { lat: latitude, lng: longitude },
        result_type: [AddressType.street_address], // you can specify the type of result you want
        key: this.apiKey,
      },
    }).catch((err) => {
      console.log('catch error in address by coor: ', err);
    });
    if (response) {
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        return 'Address not found';
      }
    } else return 'error occured';
  }
}
