import { Module,forwardRef } from '@nestjs/common';
import { ParcelService } from './parcel.service';
import { ParcelController } from './parcel.controller';
import { ParcelRepository } from './parcel.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Parcel, parcelSchema } from './schemas/parcel.schema';
import { UploadsService } from '@/helpers/aws.helper';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationGateway } from '../notifications/notifications.gateway';
import { GoogleMapsService } from './google-map.service';
import { RoutesModule } from '../routes/routes.module';

import { RoutesService } from '../routes/routes.service';
import UsersModule from '../users/users.module';
import { EventListener } from './parcel.listeners';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Parcel.name,schema:parcelSchema}]),
    forwardRef(()=>NotificationsModule),
    forwardRef(()=>RoutesModule),
    forwardRef(()=>UsersModule),
    forwardRef(()=>PaymentModule),
  ],
  controllers: [ParcelController],
  providers: [
    ParcelService,
    ParcelRepository,
    UploadsService,NotificationGateway,EventListener,
    GoogleMapsService,
  ],
  exports:[
    ParcelService
  ]
})
export class ParcelModule {}
