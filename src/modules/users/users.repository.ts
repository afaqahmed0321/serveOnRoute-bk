import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model, PaginateModel } from 'mongoose';

//dtos
import { CreateUserDto } from './dto/create-user.dto';
//schemas
import { User, UserDocument } from './schemas/users.schema';
//repositories
import { RatingReviewRepository } from './../rating-review/rating-review.repository';

// type PaginateModel<T> = Model<T & Document> & {
//   paginate(query?: any, options?: any): Promise<any>;
// };
@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(User.name) private userModelPag: PaginateModel<UserDocument>,
    private ratingReposistory: RatingReviewRepository,
  ) {}

  async createUser(user: CreateUserDto): Promise<any> {
    return await this.userModel.create(user);
  }

  async updateUser(criteria: any, data: any): Promise<any> {
    return await this.userModel.findOneAndUpdate(criteria, data, { new: true });
  }

  async updateByEmail(criteria: { email: string }, data: User): Promise<any> {
    return await this.userModel.updateOne(criteria, data);
  }
  async updateByPhone(criteria: { phone: string }, data: User): Promise<any> {
    return await this.userModel.updateOne(criteria, data);
  }

  async getMultipleUsers(users: any[]) {
    return await this.userModel.find({ _id: { $in: users } });
  }

  async findUserByEmailAndLoggedIn(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      email,
      isLoggedIn: true,
    });
  }

  async findAllUsers(query: any, options: any): Promise<User | any> {
    const user = await this.userModelPag.paginate(query, options);
    return user;
  }

  async getAllUsers(): Promise<any> {
    const users = await this.userModel.find();
    return users;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    let user = await this.userModel.findOne({
      email,
    });
    // if(!user){
    //     throw new NotFoundException('User Not Found')
    // }
    return user;
  }

  async findUserByCriteria(criteria: object): Promise<User | null> {
    let user = await this.userModel.findOne(criteria);
    // if(!user){
    //     throw new NotFoundException('User Not Found')
    // }
    return user;
  }

  async increaseRidingCount(rider: ObjectId) {
    return await this.userModel.findOneAndUpdate(
      { _id: rider },
      { $inc: { total_rides: 1 } },
      { new: true },
    );
  }

  async findUserByUserId(_id: string): Promise<User | null> {
    console.log('\n\n\n\n\n\n');

    let user: any = await this.userModel.findOne({ _id: new ObjectId(_id) });
    let riderReviews = await this.ratingReposistory.findRatingReviewByRiderId(
      _id,
    );
    // calculate Rating
    let sumofAllRatings = 0;
    riderReviews?.map((item: any) => {
      sumofAllRatings = sumofAllRatings + item.rating;
    });
    console.log('Sum of All ratings ', sumofAllRatings);
    let averageRating = sumofAllRatings / riderReviews.length;
    console.log("average Rating' ", averageRating);
    // let rating =riderReviews
    user.rating = averageRating;
    console.log('user with ratign: ', user);
    let updatedUser = await this.userModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
    console.log(
      'rider all reviews: ',
      riderReviews,
      'updated User: ',
      updatedUser,
    );
    console.log('\n\n\n\n\n\n');

    return updatedUser;
  }

  async findLastByUserId(): Promise<any | null> {
    return this.userModel.aggregate([
      {
        $sort: {
          user_id: -1,
        },
      },
      { $limit: 1 },
    ]);
  }

  async countUsers(role: string, properties: any) {
    let totalDocs = await this.userModel.aggregate([
      {
        $match: { role: role },
      },
      {
        $count: 'total',
      },
    ]);
    let statusCount = await this.userModel.aggregate([
      {
        $match: { role: role },
      },
      {
        $group: {
          _id: { Status: '$status' },
          totalUsers: { $sum: 1 },
        },
      },
    ]);
    let resultObj: any = {
      total: 0,
      active: 0,
      inactive: 0,
      blocked: 0,
      unBlocked: 0,
      verified: 0,
      unVerified: 0,
    };
    resultObj.total = totalDocs[0].total;
    statusCount = statusCount.map((status) => {
      if (
        status?._id?.Status == 'active' ||
        status?._id?.Status == 'inactive'
      ) {
        resultObj[status._id.Status] = status.totalUsers;
        return {
          status: status._id.Status,
          counts: status.totalUsers,
        };
      }
    });
    let blockCounts = await this.userModel.aggregate([
      {
        $match: { role },
      },
      {
        $group: {
          _id: { IsBlock: '$is_block' },
          totalUsers: { $sum: 1 },
        },
      },
    ]);
    blockCounts = blockCounts.map((block) => {
      if (block?._id?.IsBlock == true) {
        resultObj.blocked = block.totalUsers;
        return {
          block: block._id.IsBlock,
          counts: block.totalUsers,
        };
      }
      if (block?._id?.IsBlock == false) {
        resultObj.unBlocked = block.totalUsers;
      }
    });
    let verifiedCounts = await this.userModel.aggregate([
      {
        $match: { role },
      },
      {
        $group: {
          _id: { IsVerified: '$isVerified' },
          totalUsers: { $sum: 1 },
        },
      },
    ]);
    verifiedCounts = verifiedCounts.map((verify) => {
      if (verify?._id?.IsVerified == true) {
        resultObj.verified = verify.totalUsers;
        return {
          block: verify._id.IsVerified,
          counts: verify.totalUsers,
        };
      }
      if (verify?._id?.IsVerified == false) {
        resultObj.unVerified = verify.totalUsers;
        return;
      }
    });
    return resultObj;
  }

  async deleteUser(_id: any): Promise<User | boolean | null> {
    let user = await this.userModel.findOne({ _id: new ObjectId(_id) });
    if (!user) {
      throw new BadRequestException(`User Not found with ID: ${_id}`);
    }
    console.log(user);
    let userDelete = await this.userModel.findOneAndDelete({
      _id: new ObjectId(_id),
    });
    return userDelete;
  }

  async searchUser(query: string): Promise<User[] | boolean | null> {
    return await this.userModel.find({
      $or: [
        { first_name: { $regex: query, $options: 'i' } },
        { last_name: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    });
  }
}
