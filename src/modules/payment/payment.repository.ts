import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model, PaginateModel } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    // @InjectModel(Parcel.name) private parcelModelPag: PaginateModel<ParcelDocument>,
  ) {}

  async createPayment(payment: CreatePaymentDto): Promise<any> {
    return this.paymentModel.create(payment);
  }

  async findAndUpdatePayment(filter: any, data: any, options: object): Promise<object | null> {
    return  this.paymentModel.findOneAndUpdate(filter,data, options);
  }

  async updatePayment(criteria: object, data: object): Promise<object> {
    return this.paymentModel.updateOne(criteria, data);
  }

  async findPaymentById(id: string): Promise<object | null> {
    return this.paymentModel.findOne({_id: new ObjectId(id)});
  }
  
  async findPaymentByCriteria(criteria: object): Promise<Payment | null> {
    return await this.paymentModel.findOne(criteria);
  }
  
  async findPaymentAndPopulateUser(criteria: object): Promise<Payment | null> {
    return await this.paymentModel.findOne(criteria).populate('user');
  }
  
  async findPayments(filter:any): Promise<Payment[] | null> {
    return await this.paymentModel.find(filter);
  }

  async removePayment(id:string): Promise<object | null> {
    let payment = this.paymentModel.findOneAndDelete({_id: new ObjectId(id)});
    if(!payment){
      throw new BadRequestException('Card Not Exists')
    }
    return payment
  } 

}