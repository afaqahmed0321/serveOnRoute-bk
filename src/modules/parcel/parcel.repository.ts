import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model, PaginateModel } from 'mongoose';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { Parcel, ParcelDocument } from './schemas/parcel.schema';
// import { createClient } from 'google';


@Injectable()
export class ParcelRepository {
  constructor(
    @InjectModel(Parcel.name) private parcelModel: Model<ParcelDocument>,
    @InjectModel(Parcel.name)
    private parcelModelPag: PaginateModel<ParcelDocument>,
    // private googleService: GoogleMapsService,
  ) {}

  async createParcel(parcel: CreateParcelDto): Promise<any> {
    return await this.parcelModel.create(parcel);
  }

  async findAndUpdateParcel(
    filter: any,
    data: any,
    options: object,
  ): Promise<object | null> {
    return await this.parcelModel.findOneAndUpdate(filter, data, options);
  }

  async updateParcel(criteria: object, data: object): Promise<object> {
    return await this.parcelModel.updateOne(criteria, data);
  }

  async findParcelById(id: string): Promise<Parcel | null> {
    return await this.parcelModel.findOne({ _id: new ObjectId(id) }).populate('customer_id rider_id');
  }
  
  async findParcelByCriteria(criteria: object): Promise<Parcel | null> {
    return await this.parcelModel.findOne(criteria)
  }

  async findParcels(filter: any, options: any): Promise<object | null> {
    return  await this.parcelModelPag.paginate(filter, options);
  }

  async countParcel(){
    return await this.parcelModel.aggregate([{
      $group:{
        _id:'$status',
        count:{$sum:1}
      }
    }])
  }
  

  async removeParcel(id: string): Promise<object | null> {
    let parcel = await this.parcelModel.findOneAndDelete({ _id: new ObjectId(id) });
    if (!parcel) {
      throw new BadRequestException('Parcel Not Exists');
    }
    return parcel;
  }

  //   let parcelDataById: any = await this.parcelModel.findOne({
  //     _id: new ObjectId(id),
  //   });
  //   console.log('\n\n\n\nends');
  //   return parcelDataById;
  // }


  async topTen(query:string){
    console.log(query);
    if(query == "customer"){
      
      return await this.parcelModel.aggregate([
        // Group by customer_id and calculate the total fare for each customer
        {
          $group: {
            _id: '$customer_id',
            totalFare: { $sum: { $toDouble: '$fare' } }
          }
        },
        // Sort by total fare in descending order
        {
          $sort: {
            totalFare: -1
          }
        },
        // Limit to the top 10 customers with highest fare
        {
          $limit: 10
        },
        // Lookup to fetch customer details using customer_id
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        // Unwind the customer array
        // {
        //   $unwind: '$customer'
        // },
        // Project the required fields
        {
          $project: {
            _id: 1,
            totalFare: 1,
            customer: 1,
          }
        }
      ])


    }else if(query == 'rider'){

      return await this.parcelModel.aggregate([
        // Group by rider_id and calculate the total pay_amount for each rider
        {
          $group: {
            _id: '$rider_id',
            totalPayAmount: { $sum: { $toDouble: '$pay_amount' } }
          }
        },
        // Sort by total pay_amount in descending order
        {
          $sort: {
            totalPayAmount: -1
          }
        },
        // Limit to the top 10 riders with highest pay_amount
        {
          $limit: 10
        },
        // Lookup to fetch rider details using rider_id
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'rider'
          }
        },
        // Unwind the rider array
        // {
        //   $unwind: '$rider'
        // },
        // Project the required fields
        {
          $project: {
            _id: 1,
            totalPayAmount: 1,
            rider: 1,
          }
        }
      ])
    }else{
      return 'No Selection between customer and rider'
    }
  }

}

