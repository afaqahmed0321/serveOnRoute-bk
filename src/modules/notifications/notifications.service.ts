import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './notifications.repository';
import * as _ from 'lodash';
import { FirebaseService } from '@helpers/firebase.helper';
import { CreateNotificationTokenDto } from './dto/create-token.dto';
import { UpdateNotificationTokenDto } from './dto/update-token.dto';
import { ObjectId } from 'mongodb';
import { AdminNotificationDto } from './dto/adminNotification.dto';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { NOTIFICATION_TYPE } from '@/enums/notification.enum';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly firebaseService: FirebaseService,
  ) {}
  create(
    createNotificationDto: CreateNotificationDto | CreateNotificationDto[],
  ) {
    console.log('Enter into Notification Service');
    return this.notificationRepository.create(createNotificationDto);
  }

  findAll(query: any) {
    const filter = _.pick(query, ['user', 'is_read', 'type']);
    if (filter.user) filter.user = new ObjectId(filter.user);
    const options = _.pick(query, ['page', 'sort', 'populate', 'limit']);
    return this.notificationRepository.find(filter, options);
  }

  findOne(id: string) {
    return this.notificationRepository.findById(id);
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.notificationRepository.update(
      { _id: new ObjectId(id) },
      updateNotificationDto,
    );
  }

  remove(id: string) {
    return this.notificationRepository.remove(id);
  }

  async getMultipleTokens(users: any[]) {
    return await this.notificationRepository.getMultipleTokens(users);
  }

  async acceptNotifications(
    user: any,
    notification_dto: CreateNotificationTokenDto,
  ): Promise<object> {
    notification_dto.user = user._id;
    notification_dto.role = user.role;
    const notification_token =
      await this.notificationRepository.createNotificationToken(
        notification_dto,
      );
    return notification_token;
  }

  async updateNotificationsToken(
    user: any,
    notification_dto: UpdateNotificationTokenDto,
  ): Promise<object | null> {
    return await this.notificationRepository.updateNotificationToken(
      { user: new ObjectId(user._id) },
      notification_dto,
    );
  }

  async getNotificationsToken(user: any): Promise<any | null> {
    return await this.notificationRepository.getNotificationToken({
      user: new ObjectId(user._id),
    });
  }

  async removeNotificationsToken(user: any): Promise<object | null> {
    return await this.notificationRepository.removeNotificationToken({
      user: user._id,
    });
  }

  async sendNotification(body: any): Promise<any> {
    await this.create(body);
    const tokenDoc = await this.notificationRepository.getNotificationToken({
      user: new ObjectId(body.user),
      status: 'active',
    });
    console.log('user deviceId', tokenDoc);
    if (!tokenDoc) {
      return undefined;
    } else {
      let notificationPayload: any;
      if (body?.type === NOTIFICATION_TYPE.PARCEL_COMPLETED) {
        notificationPayload = {
          notification: {
            title: body.title,
            body: body.body,
          },
          data: {
            notificationType: body?.type,
            rider_id: body?.rider_id,
          },
          token: tokenDoc?.notification_token as string,
        };
      } else {
        notificationPayload = {
          notification: {
            title: body.title,
            body: body.body,
          },
          data: {
            notificationType: body?.type,
          },
          token: tokenDoc?.notification_token as string,
        };
      }
      const notificationSending =
        await this.firebaseService.sendPushNotification(notificationPayload);
      console.log('Notification Sending', notificationSending);
      return notificationSending;
    }
  }

  async sendMutipleDevicesNotification(body: any, tokens: any): Promise<any> {
    // const tokenDoc:any = await this.notificationRepository.getAllNotificationToken({role:'rider'})
    console.log('Riders Token>>>>>', tokens);
    if (tokens?.length) {
      const notificationPayload = {
        notification: {
          title: body.title,
          body: body.body,
        },
        data: {
          notificationType: body.type,
        },
        tokens: tokens as [string],
      };
      const multipleNotification =
        await this.firebaseService.sendMultipleDevicesPushNotification(
          notificationPayload,
        );
      console.log('MultipleNoti>>>>>', multipleNotification);
      return multipleNotification;
    } else {
      return undefined;
    }
  }

  /**
   * Admins notification
   * @param input
   * @returns notification
   */
  async adminNotification(input: AdminNotificationDto): Promise<BatchResponse> {
    try {
      const { body, title, user, type } = input || {};

      if (user?.length <= 0) {
        throw new NotFoundException('No token found for user ${user}');
      }

      //get the token of the user
      const tokenDoc = await this.notificationRepository.getMultipleTokens(
        user,
      );
      const tokens: string[] = tokenDoc.map(
        (token) => token.notification_token,
      );
      const notificationPayload = {
        notification: {
          title: title,
          body: body,
        },
        data: {
          notificationType: type,
        },
        tokens: tokens as [string],
      };
      const multipleNotification =
        await this.firebaseService.sendMultipleDevicesPushNotification(
          notificationPayload,
        );
      console.log('MultipleNotification>>>>>', multipleNotification);

      return multipleNotification;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
