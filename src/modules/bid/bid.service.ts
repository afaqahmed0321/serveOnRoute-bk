import { Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { BidRepository } from './bid.repository';
import { QueryBidDto } from './dto/query-bid.dto';
import * as _ from 'lodash';
import { ObjectId } from 'mongodb';
import { ParcelService } from '../parcel/parcel.service';

@Injectable()
export class BidService {
  constructor(
      private readonly bidRepository: BidRepository,
      private parcelService: ParcelService,
    ) {}

  async create(createBidDto: CreateBidDto) {
    // let parcel: any = await this.parcelService.findOne(createBidDto?.parcel);
    // if (!parcel) return `Parcel not found with ${createBidDto?.parcel} id`;
    // let now = new Date();
    // let minuteMiliseconds = 1000 * 60;

    // if((parcel.bidding_type == 'now' && Math.abs(now.getTime()- parcel?.time.getTime())/minuteMiliseconds >= 5) ||
    //     ((parcel.bidding_type == 'range' || parcel.bidding_type == 'time') && now > parcel?.biddingEndTime))
    //     {
    //         return "Bid Time Expired, Parcel bidding time reached out!"
    //     }
      return await this.bidRepository.createBid(createBidDto);
      
  }

  async findAll(queryBidDto: QueryBidDto) {
    const filter = _.pick(queryBidDto, ['parcel', 'rider', 'amount']);
    const options = _.pick(queryBidDto, ['page', 'limit', 'populate', 'sort']);
    return await this.bidRepository.findBids(filter, options);
  }

  async findOne(id: string) {
    return await this.bidRepository.findBidById(id);
  }
  
  async findOneAndPopulate(id: string) {
    return await this.bidRepository.findBidById(id);
  }

  async update(id: string, updateBidDto: UpdateBidDto) {
    return await this.bidRepository.updateBid({ _id: new ObjectId(id) }, updateBidDto);
  }

  async remove(id: string) {
    return await this.bidRepository.deleteBid(id);
  }
  
}
