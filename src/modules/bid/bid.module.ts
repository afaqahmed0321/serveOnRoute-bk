import { Module, forwardRef } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { Bid, BidSchema } from './entities/bid.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BidRepository } from './bid.repository';
import { ParcelModule } from '../parcel/parcel.module';
import UsersModule from '../users/users.module';
import { BidGateway } from './bid.gateway';
import { ParcelService } from '../parcel/parcel.service';
import { ParcelRepository } from '../parcel/parcel.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
    ParcelModule,
    NotificationsModule
  ],
  controllers: [BidController],
  providers: [BidGateway, BidService, BidRepository],
})
export class BidModule {}
