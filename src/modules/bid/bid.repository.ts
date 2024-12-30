import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { Bid, BidDocument } from './entities/bid.entity';
import { ObjectId } from 'mongodb';
import { CreateBidDto } from './dto/create-bid.dto';


export class BidRepository {
  constructor(
    @InjectModel(Bid.name) private readonly bidModel: Model<BidDocument>,
    @InjectModel(Bid.name) private readonly bidPagModel: PaginateModel<BidDocument>,
  ) {}

  async createBid(bidBody: CreateBidDto): Promise<any> {
      return await this.bidModel.create(bidBody);
  }

  async updateBid(criteria: object, data: object): Promise<any> {
    return await this.bidModel.findOneAndUpdate(criteria, data, { new: true });
  }

  async findBidById(bid_id: string): Promise<Bid | null> {
    return await this.bidModel
      .findOne({ _id: new ObjectId(bid_id) })
      .populate('parcel bidder')
      .exec();
  }

  async findBids(filter: any, options: any): Promise<any | null> {
    return this.bidPagModel.paginate(filter, options);
  }

  async deleteBid(id: string): Promise<Bid | null> {
    const deletedBid = await this.bidModel.findOneAndDelete({
      _id: new ObjectId(id),
    });
    return deletedBid;
  }
}
