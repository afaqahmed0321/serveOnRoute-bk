import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model, PaginateModel } from 'mongoose';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Complaint, ComplaintDocument } from './schemas/complaint.schema';

@Injectable()
export class ComplaintsRepository {
  constructor(
    @InjectModel(Complaint.name)
    private ComplaintModel: Model<ComplaintDocument>,
    @InjectModel(Complaint.name)
    private ComplaintModelPag: PaginateModel<ComplaintDocument>,
  ) {}

  async createComplaint(complaint: CreateComplaintDto): Promise<any> {
    return await this.ComplaintModel.create(complaint);
  }

  async updateComplaint(criteria: object, data: object): Promise<any> {
    console.log(data);
    return await this.ComplaintModel.findOneAndUpdate(criteria, data, {
      new: true,
    });
  }

  async findComplaintById(complain_id: string): Promise<Complaint | null> {
    return await this.ComplaintModel.findOne({ _id: new ObjectId(complain_id) })
      .populate({
        path: 'complainant',
        select: 'name first_name last_name _id role avatar is_block',
      })
      .populate({
        path: 'complain_against',
        select: 'name first_name last_name _id role avatar is_block',
      })
      .populate({ path: 'parcel' })
      .exec();
  }

  async fetchComplaintById(complain_id: string): Promise<Complaint | null> {
    let complain = await this.ComplaintModel.findOne({
      _id: new ObjectId(complain_id),
    });
    if (!complain) {
      throw new BadRequestException(
        `Complain with Id ${complain_id} not Exists`,
      );
    }
    return complain;
  }

  async findComplaints(filter: any, options: any): Promise<any | null> {
    // return this.ComplaintModel.find().populate({path:'complainant', select:'name _id role'}).populate({path:'complain_against', select:'name _id role'}).exec()
    return this.ComplaintModelPag.paginate(filter, options);
  }

  async findAllComplaints(query: { status: string }): Promise<any | null> {
    // return this.ComplaintModel.find().populate({path:'complainant', select:'name _id role'}).populate({path:'complain_against', select:'name _id role'}).exec()
    return await this.ComplaintModel.find(query);
  }

  async deleteComplaint(id: string): Promise<Complaint | null> {
    return await this.ComplaintModel.findOneAndDelete({
      _id: new ObjectId(id),
    });
  }
}
