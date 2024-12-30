import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  findOne( 
    userId: string,
  ): object | PromiseLike<object | undefined> | undefined {
    throw new Error('Method not implemented.');
  }

  async createProfile(profile: CreateProfileDto): Promise<any> {
    return this.profileModel.create(profile); 
  }

  async findOneAndUpdate(filter: any, data: any, options: object): Promise<object | null> {
    return  this.profileModel.findOneAndUpdate(filter,data, options);
  }

  async updateProfile(criteria: object, data: object): Promise<object> {
    return this.profileModel.updateOne(criteria, data);
  }

  async findProfileByUserId(filter: any): Promise<object | null> {
    return this.profileModel.findOne(filter);
  }

}