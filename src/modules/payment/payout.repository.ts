import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payout, PayoutDocument } from './schemas/payout.schema';
import { Model, PaginateModel, Schema } from 'mongoose';

@Injectable()
export class PayoutRepository {
  constructor(
    @InjectModel(Payout.name)
    private readonly PayoutModel: Model<PayoutDocument>,
    @InjectModel(Payout.name)
    private readonly PayoutPaginateModel: PaginateModel<PayoutDocument>,
  ) {}

  async create(body: Payout): Promise<Payout> {
    return await this.PayoutModel.create(body);
  }

  async getPayout(
    userId: Schema.Types.ObjectId | undefined,
  ): Promise<Payout | null> {
    return await this.PayoutModel.findOne({ user: userId });
  }

  async getPayouts(filter: any, options: any) {
    return await this.PayoutPaginateModel.paginate(filter, options);
  }
  async clearPayout(user: string): Promise<any> {
    return await this.PayoutModel.deleteMany({ user });
  }
}
