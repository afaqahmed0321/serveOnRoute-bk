import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model, PaginateModel } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification, NotificationDocument } from './entities/notification.entity';
import { NotificationToken, NotificationTokenDocument } from './entities/notification-token.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(Notification.name) private notificationModelPag: PaginateModel<NotificationDocument>,
    @InjectModel(NotificationToken.name) private notificationTokenModel: Model<NotificationTokenDocument>,
  ) {}

  async create(notificationBody: CreateNotificationDto | CreateNotificationDto[]): Promise<any> {
    return await this.notificationModel.create(notificationBody);
  }

  async findAndUpdate(filter: any, data: any, options: object): Promise<object | null> {
    return await this.notificationModel.findOneAndUpdate(filter,data, options);
  }

  async update(criteria: object, data: object): Promise<object| null> {
    return await this.notificationModel.findOneAndUpdate(criteria, data,{new:true});
  }

  async findById(id: string): Promise<object | null> {
    return await this.notificationModel.findOne({_id: new ObjectId(id)});
  }
  
  async find(filter:any,options:any): Promise<object | null> {
    return await this.notificationModelPag.paginate(filter,options);
  }

  async remove(id:string): Promise<object | null> {
    let notification = await this.notificationModel.findOneAndDelete({_id: new ObjectId(id)});
    if(!notification){
      throw new BadRequestException('Card Not Exists')
    }
    return notification
  } 

  async createNotificationToken(body:any){
      return await this.notificationTokenModel.findOneAndUpdate({user:body.user},body,{upsert:true,new:true});
  }

  async getNotificationToken(body:any){
      return await this.notificationTokenModel.findOne(body)
  }

  async getMultipleTokens(users:any[]){
    return await this.notificationTokenModel.find({user:{$in:users}})
  }

  async getAllNotificationToken(body:any): Promise<object[]> {
    return await this.notificationTokenModel.find(body);
  }

  async updateNotificationToken(filter:any,body:any){
      return await this.notificationTokenModel.findOneAndUpdate(filter,body,{new:true});
  }

  async removeNotificationToken(filter:any){
      return await this.notificationTokenModel.findOneAndDelete(filter);
  }

}