import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification,notificationSchema } from './entities/notification.entity';
import { NotificationRepository } from './notifications.repository';
import { FirebaseService } from '@/helpers/firebase.helper';
import { NotificationToken, notificationTokenSchema } from './entities/notification-token.entity';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Notification.name, schema:notificationSchema}]),
    MongooseModule.forFeature([{name:NotificationToken.name, schema:notificationTokenSchema}])
],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository, FirebaseService],
  exports:[NotificationsService]
})
export class NotificationsModule {}
