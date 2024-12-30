import { envSchema } from '@config/schema/env.schema';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import AuthModule from '@auth/auth.module';
import UsersModule from '@users/users.module';
import { SeedsModule } from '@/shared/seeds.module';
import { CommandModule } from 'nestjs-command';
import { MailerModule } from '@nestjs-modules/mailer';
import ProfileModule from './profile/profile.module';
import { UploadsModule } from '@/modules/uploads/uploads.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { resolve } from 'path';
import { AppController } from '@/modules/app.controller';
import { RoutesModule } from './routes/routes.module';
import { ParcelModule } from './parcel/parcel.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { BidModule } from './bid/bid.module';
import { LoggerModule } from 'nestjs-pino';
import { PaymentModule } from './payment/payment.module';
import { ChatModule } from './chat/chat.module';
import { TrackingModule } from './tracking/tracking.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisFlushService } from './redis-flush.service';
// import { RedisModule, RedisModuleOptions } from 'nestjs-redis';
// import { RatingReviewModule } from './rating-review/rating-review.module';
// import { RatingReviewModule } from './rating-review/rating-review.module';
import { RatingReviewModule } from './rating-review/rating-review.module';
import { BookingModule } from './booking/booking.module';
import {EventEmitterModule} from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule';
import { ComplaintsCronService } from './cronjobs/complaintsCron';
import { NotificationCronService } from './cronjobs/notifyCron';
import { ComplaintsRepository } from './complaints/complaints.repository';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ServeStaticModule.forRoot(
      (() => {
        const publicDir = resolve('./public/');
        const servePath = '/';

        return {
          rootPath: publicDir,
          // serveRoot - if you want to see files on another controller,
          // e.g.: http://localhost:8088/files/1.png
          serveRoot: servePath,
          exclude: ['/api*'],
        };
      })(),
    ),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env'],
      validationSchema: envSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      }
    }),
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        // password: 'authpassword'
      }
    }), 
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    ProfileModule,
    SeedsModule,
    CommandModule,
    UploadsModule,
    RoutesModule,
    ParcelModule,
    DashboardModule,
    ComplaintsModule,
    BidModule,
    PaymentModule,
    ChatModule,
    TrackingModule,
    NotificationsModule,
    RatingReviewModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    RedisFlushService,
    ComplaintsCronService,
    NotificationCronService,
  ],
})
export class AppModule {}
// export class AppModule implements NestModule{
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(AppLoggerMiddleware).forRoutes('*');
//   }
// }
