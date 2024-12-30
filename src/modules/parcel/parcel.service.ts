import { UploadsService } from '@/helpers/aws.helper';
import {
  Injectable,
  Inject,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ObjectId } from 'mongodb';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { QueryParcelDto } from './dto/query-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { ParcelRepository } from './parcel.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications/notifications.service';
import { RoutesService } from '../routes/routes.service';
import { STATUS } from '@/enums/status.enum';
import { UsersService } from '../users/users.service';
import { NOTIFICATION_TYPE } from '@/enums/notification.enum';
import { CancelParcelDto } from './dto/cancel-parcel.dto';
import RequestUserInterface from '@/interfaces/request-user.interface';
import { PaymentService } from '../payment/payment.service';
import { CompleteParcelDto } from './dto/complete-parcel.dto';

@Injectable()
export class ParcelService {
  constructor(
    private readonly parcelRepository: ParcelRepository,
    private readonly uploadsService: UploadsService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(NotificationsService)
    private readonly notificationService: NotificationsService,
    @Inject(RoutesService) private readonly routesService: RoutesService,
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {}

  async create(createParcelDto: CreateParcelDto) {
    const customerPaymentMethod = await this.paymentService.findCriteria({
      user: createParcelDto.customer_id,
    });

    if (!customerPaymentMethod) {
      throw new BadRequestException('Please add atleast one Payment Method!');
    } //test push
    const { files } = createParcelDto;
    if (files) {
      console.log(files);
      const uploadedFilesArray: any = [];
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        const temp = await this.uploadsService.uploadFile(
          item.buffer,
          Date.now() + '-' + item.originalname,
        );
        uploadedFilesArray.push(temp.Location);
      }
      createParcelDto.images = uploadedFilesArray;
    }
    const parcel = await this.parcelRepository.createParcel(createParcelDto);
    if (parcel) {
      // const parcelWithCustomer = await this.parcelRepository.findParcelById(
      //   parcel._id,
      // );
      const body = {
        title: 'Parcel Created successfully',
        body: `Parcel with Id: ${parcel._id} has been created, In Queue for Bidding`,
      };
      await this.notificationService.sendNotification({
        user: parcel.customer_id,
        title: body.title,
        body: body.body,
        type: NOTIFICATION_TYPE.PARCEL_CREATED,
      });

      // -----------GET PARCEL NEARBY RIDERS-------------
      let riders = await this.routesService.getNearbyRoutes({
        from_location: parcel.from_location_cor,
        to_location: parcel.to_location_cor,
        maxDistance: 1000,
      });

      //if riders not found in given radius, then find in 5km radius
      if (riders?.length === 0) {
        riders = await this.routesService.getNearbyRoutes({
          from_location: parcel.from_location_cor,
          // to_location: parcel.to_location_cor,
          maxDistance: 1000,
        });
      }

      // ------------GET RIDERS NOTIFICATION TOKENS-------------
      let tokensInfo = await this.notificationService.getMultipleTokens(
        riders as string[],
      );
      let notificationsTokens = tokensInfo.map(
        (token) => token.notification_token,
      );

      // NOTIFICATION TOKENS OF NEARBY RIDERS
      let riderNotification = {
        title: 'Parcel Created In Nearby',
        body: `Parcel with Id: ${parcel._id} has been created near you, If Intersted, >>> Please start Bidding <<<`,
        type: NOTIFICATION_TYPE.PARCEL_NOTIFY,
      };
      let ridersNotifications = tokensInfo.map((token) => {
        return { ...riderNotification, user: token.user };
      });

      const customerNotificationPayload = {
        title: 'Parcel Verification OTP Created Sucessfully',
        body: `kindly Save this OTP: ${parcel?.receiving_otp} for verification`,
        type: NOTIFICATION_TYPE.PARCEL_OTP,
      };

      // ---------------SEND NOTIFICATION TO CUSTOMER----------------
      await this.notificationService.sendNotification({
        user: createParcelDto?.customer_id,
        title: customerNotificationPayload.title,
        body: customerNotificationPayload.body,
        type: NOTIFICATION_TYPE.PARCEL_OTP,
      });

      // ---------------SEND NOTIFICATION TO RIDERS----------------
      await this.notificationService.create(ridersNotifications);
      await this.notificationService.sendMutipleDevicesNotification(
        riderNotification,
        notificationsTokens,
      );
    }
    return parcel;
  }

  findAll(query: QueryParcelDto) {
    const filter = _.pick(query, [
      'fare',
      'from_location',
      'to_loaction',
      'customer_id',
      'rider_id',
      'status',
    ]);
    const options = _.pick(query, ['page', 'limit', 'sort', 'populate']);

    options.populate = [
      {
        path: 'rider_id',
        select:
          'name first_name last_name phone avatar cover_image role rating',
      },
      {
        path: 'customer_id',
        select:
          'name first_name last_name phone avatar cover_image role rating',
      },
    ];

    if (filter?.customer_id)
      (filter.customer_id as unknown as ObjectId) = new ObjectId(
        filter.customer_id,
      );
    if (filter?.rider_id)
      (filter.rider_id as unknown as ObjectId) = new ObjectId(filter.rider_id);
    if (!filter.status) {
      filter.status = { $ne: 'pending' };
    }
    return this.parcelRepository.findParcels(filter, options);
  }

  async findOne(id: string) {
    return await this.parcelRepository.findParcelById(id);
  }

  async countParcel() {
    return await this.parcelRepository.countParcel();
  }

  async verifyOTP(
    id: string,
    body: CompleteParcelDto,
    user: RequestUserInterface,
  ) {
    const { _id } = user || {};
    const parcel = await this.parcelRepository.findParcelByCriteria({
      _id: new ObjectId(id),
    });
    if (parcel?.receiving_otp == body?.otp) {
      await this.parcelRepository.updateParcel(
        { _id: new ObjectId(id) },
        { status: STATUS.COMPLETED },
      );

      const body = {
        title: 'Parcel Completed Successfully',
        body: `Parcel with Id: ${parcel._id} has been completed, Thank you for using our service!`,
      };

      this.notificationService.sendNotification({
        user: parcel.customer_id,
        title: body.title,
        body: body.body,
        type: NOTIFICATION_TYPE.PARCEL_COMPLETED,
        rider_id: _id?.toString(),
      });

      return {
        success: true,
        message: 'OTP VERIFIED AND PARCEL COMPLETED!',
        parcel,
      };
    } else {
      throw new BadRequestException('OTP NOT MATCHED!');
    }
  }

  async update(id: string, updateParcelDto: UpdateParcelDto) {
    let { files } = updateParcelDto;
    if (files) {
      let uploadedFilesArray: any = [];
      for (let i = 0; i < files.length; i++) {
        let item = files[i];
        const temp = await this.uploadsService.uploadFile(
          item.buffer,
          Date.now() + '-' + item.originalname,
        );
        console.log(temp);
        uploadedFilesArray.push(temp.Location);
      }
      updateParcelDto.images = uploadedFilesArray;
    }
    let criteria: object = { _id: new ObjectId(id) };
    let options = { new: true };

    let parcel: any = await this.parcelRepository.findParcelByCriteria(
      criteria,
    );
    if (parcel.status == 'completed') {
      throw new BadRequestException('Parcel Already Completed!');
    }
    if (
      updateParcelDto.status == 'cancelled' &&
      parcel.status == 'inprogress'
    ) {
      throw new BadRequestException('Parcel Already InProgressed!');
    }
    let updatedParcel: any = await this.parcelRepository.findAndUpdateParcel(
      criteria,
      updateParcelDto,
      options,
    );
    if (updatedParcel.status == STATUS.COMPLETED) {
      await this.usersService.increaseRidingCount(updatedParcel.rider_id);
    }
    if (
      updateParcelDto.rider_id ||
      (updateParcelDto.pay_amount && !parcel.payment_intent)
    ) {
      this.eventEmitter.emit('upfront-payment', parcel);
    }
    return updatedParcel;
  }

  async cancelledParcel(
    cancelledParcelDto: CancelParcelDto,
    user: RequestUserInterface,
  ) {
    // let userDetails = await this.usersService.findUserByCriteria({_id:user._id})
    let parcel = await this.parcelRepository.findParcelByCriteria({
      _id: new ObjectId(cancelledParcelDto.parcel),
    });
    if (!parcel?.pickup) {
      if (
        user.role.includes('user') &&
        new ObjectId(parcel?.customer_id).equals(
          user._id as unknown as ObjectId,
        )
      ) {
        await this.parcelRepository.updateParcel(
          { _id: new ObjectId(cancelledParcelDto.parcel) },
          { status: STATUS.CANCELLED },
        );
        let body = {
          title: 'parcel has been cancelled by customer',
          body: `Parcel with Id: ${parcel?._id} has been cancelled!`,
        };
        await this.notificationService.sendNotification({
          user: parcel?.rider_id,
          title: body.title,
          body: body.body,
          type: NOTIFICATION_TYPE.PARCEL_CANCELLED,
        });
        this.eventEmitter.emit('parcel-refund-payment', parcel);
        return 'Parcel Cancelled';
      } else if (
        user.role.includes('rider') &&
        new ObjectId(parcel?.rider_id).equals(user._id as unknown as ObjectId)
      ) {
        this.eventEmitter.emit('reboot-bidding', parcel);
        this.eventEmitter.emit('parcel-refund-payment', parcel);
        return 'Parcel Cancelled with no penalty!';
      } else {
        return 'Not Authorized to Cancel Parcel';
      }
    }
  }

  remove(id: string) {
    return this.parcelRepository.removeParcel(id);
  }

  // notifyRiders(id: string) {
  //   return this.parcelRepository.notifyRiderAboutParcel(id);
  // }

  async topTen(selection: string) {
    return await this.parcelRepository.topTen(selection);
  }
}
