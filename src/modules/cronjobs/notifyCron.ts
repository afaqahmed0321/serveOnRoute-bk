import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Cron } from '@nestjs/schedule';
import { UsersRepository } from '../users/users.repository';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class NotificationCronService {
  constructor(
    private readonly logger: Logger,
    @Inject(forwardRef(() => UsersRepository)) private readonly usersRepository: UsersRepository,
    @Inject(NotificationsService) private readonly notificationService: NotificationsService,
  ) {}

  @Cron('0 0 * * *')
  async notificaionsUpdate() {
    this.logger.warn(
      '<<<<<<<<<<<<<<<<<<<<< ----- CRON-JOB STARTED ------ >>>>>>>>>>>>>>>>>',
    );
    this.logger.log(
      ' <<<<<<<<<<<<<<<<<<<< -------  LICENSE UPDATE ------ >>>>>>>>>>>>>>>>>',
    );

    try {
      const result = await this.usersRepository.getAllUsers();
      if (result.length === 0) {
        return;
      }
      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', result);

      result.forEach(async (element: any) => {
        const { driving_license_expiry, email, _id } = element;

        const currentDate = new Date();
        const diffTime = Math.abs(
          currentDate.getTime() - driving_license_expiry.getTime(),
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30 && diffDays > 7) {
          const notificationData = {
            title: 'License expired',
            body: 'Your license is expiring soon',
            type: 'lic_expire',
            user: _id,
          };
          this.notificationService.sendNotification(notificationData);
        } else if(diffDays < 7){
          await this.usersRepository.updateUser(
            { email: email },
            { is_block: true },
          );
          console.log('User blocked');
        };
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}
