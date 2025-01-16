/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/users.schema';
import { UsersRepository } from './users.repository';
import { UploadsService } from '@/modules/uploads/uploads.service';
import { UserRoles, getUsersDto } from './dto/get-users.dto';
import * as _ from 'lodash';
import { ObjectId } from 'mongodb';
import { AccountLinkDto } from './dto/account-link.dto';
import { StripeService } from '@/helpers/stripe.hepler';
import { ConnectAccountDto } from './dto/connect-account.dto';
import { VerifyDriverDto } from './dto/verify-driver.dto';
import { Response } from 'express';
import * as XLSX from 'xlsx';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly uploadsService: UploadsService,
    private readonly stripeService: StripeService,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    return await this.usersRepository.createUser(user);
  }

  async updateUser(_id: any, data: any, req = null): Promise<any> {
    await this.usersRepository.findUserByUserId(_id);
    console.log(data);
    if (data.avatar_file) {
      const uploadedFile = await this.uploadsService.uploadFile(
        data.avatar_file.buffer,
        Date.now() + '-' + data.avatar_file.originalname,
      );
      data.avatar = uploadedFile.Location;
    }
    if (data.cover_image_file) {
      const uploadedFile = await this.uploadsService.uploadFile(
        data.cover_image_file.buffer,
        Date.now() + '-' + data.cover_image_file.originalname,
      );
      data.cover_image = uploadedFile.Location;
    }
    if (data?.national_ID_file?.length) {
      data.ID_file = [];
      for (let i = 0; i < data.national_ID_file.length; i++) {
        const uploadedFile = await this.uploadsService.uploadFile(
          data.national_ID_file[i].buffer,
          Date.now() + '-' + data.national_ID_file[i].originalname,
        );
        data.ID_file[i] = uploadedFile.Location;
      }
    }
    if (data?.driving_license_file?.length) {
      data.driving_license = [];
      for (let i = 0; i < data.driving_license_file.length; i++) {
        const uploadedFile = await this.uploadsService.uploadFile(
          data.driving_license_file[i].buffer,
          Date.now() + '-' + data.driving_license_file[i].originalname,
        );
        data.driving_license[i] = uploadedFile.Location;
      }
    }

    return this.usersRepository.updateUser({ _id: new ObjectId(_id) }, data);
  }

  async updateUserByCriteria(
    criteria: any,
    data: any,
    req = null,
  ): Promise<any> {
    return this.usersRepository.updateUser(criteria, data);
  }

  async verifyDriver(body: VerifyDriverDto) {
    console.log(body);
    return await this.usersRepository.updateUser(
      { _id: new ObjectId(body.user) },
      { isVerified: body.isVerified },
    );
  }

  async blockUser(user_id: any, data: any): Promise<any> {
    if (!(await this.findUserByUserId(user_id.user_id)))
      throw new NotFoundException(`User with _id ${user_id.user_id} Not Found`);
    user_id = { _id: new ObjectId(user_id.user_id) };
    const { block_proof_image } = data;
    if (block_proof_image) {
      const uploadedImage = await this.uploadsService.uploadFile(
        block_proof_image.buffer,
        `${user_id}-${Date.now()}-${block_proof_image.originalname}`,
      );
      data.block_proof_image = uploadedImage.Location;
    }
    if (data.block_proof_image == undefined) delete data.block_proof_image;
    delete data.user_id;

    return await this.usersRepository.updateUser(user_id, data);
  }

  async updateByEmail(email: string, data: any): Promise<any> {
    return this.usersRepository.updateByEmail({ email }, data);
  }

  async updateByPhone(phone: string, data: any): Promise<any> {
    return this.usersRepository.updateByPhone({ phone }, data);
  }

  async getMultipleUsers(users: any[]) {
    return await this.usersRepository.getMultipleUsers(users);
  }

  async findUserByEmailAndLoggedIn(email: string): Promise<User | null> {
    return this.usersRepository.findUserByEmailAndLoggedIn(email);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findUserByEmail(email);
  }

  async findUserByCriteria(criteria: object): Promise<User | null> {
    return await this.usersRepository.findUserByCriteria(criteria);
  }

  async increaseRidingCount(rider: ObjectId): Promise<User | null> {
    return await this.usersRepository.increaseRidingCount(rider);
  }

  async findUserByUserId(user_id: any): Promise<User | null> {
    return await this.usersRepository.findUserByUserId(user_id);
  }

  async getAllUsers(
    query: getUsersDto,
    body?: UserRoles,
  ): Promise<User[] | boolean | null> {
    const filters = _.pick(query, ['is_block', 'status', 'role']) || {};
    if (body?.role) {
      filters.role = { $in: body?.role } as any;
    }
    const options =
      _.pick(query, ['page', 'limit', 'sort', 'populate', 'skip']) || {};

    return this.usersRepository.findAllUsers(filters, options);
  }

  async deleteUser(_id: string): Promise<User | boolean | null> {
    return await this.usersRepository.deleteUser(_id);
  }

  async linkAccount(body: AccountLinkDto, userId: any) {
    const stripe = await this.stripeService.linkAccount(body);
    // await this.usersRepository.updateUser({_id:new ObjectId(userId)},{account:body.account})
    return stripe;
  }

  async getAccount(accountId: string) {
    return await this.stripeService.retrieveAccount(accountId);
  }

  async connectAccount(body: ConnectAccountDto, userId: any) {
    console.log(body);
    const account = await this.stripeService.createAccount(body);
    return await this.usersRepository.updateUser(
      { _id: new ObjectId(userId) },
      { account: account.id },
    );
  }

  async userCounts(role: string) {
    const properties = {
      is_block: { $in: [true, false] },
      status: { $in: ['active', 'inactive'] },
    };
    return await this.usersRepository.countUsers(role, properties);
  }

  /**
   * Generates user report
   * @param query
   * @param res
   * @param report
   */
  async generateUserReport(query: string, res: Response) {
    try {
      const usersData = await this.usersRepository.searchUser(query); // Make sure this function works and returns user data
      if (!usersData) {
        throw new Error('No user data found.');
      }
      const users = usersData as User[];

      // Create headings for CSV
      const headers: string[] = [
        'firstName',
        'lastName',
        'gender',
        'Email',
        'Phone',
        'age',
        'country',
        'city',
        'address',
        'ID',
        'IDFile',
        'vehicleNo',
        'avatar',
        'coverImage',
        'role',
        'status',
        'isBlock',
        'blockProofDescription',
        'blockProofImage',
        'isLoggedIn',
        'totalEarning',
        'account',
        'accountLinked',
        'Status',
        'IsBlock',
        'IsVerified',
        'IsLoggedIn',
      ];

      const exportData = await Promise.all(
        users.map(async (user) => {
          return [
            user?.first_name || '',
            user?.last_name || '',
            user?.gender || '',
            user?.email || '',
            user?.phone || '',
            user?.age !== undefined && user?.age !== null
              ? user.age.toString()
              : '',
            user?.country || '',
            user?.city || '',
            user?.address || '',
            user?.ID || '',
            user?.ID_file || '',
            user?.vehicle_no || '',
            user?.avatar || '',
            user?.cover_image || '',
            'admin', // (Array.isArray(user?.role) ? user.role.join(', ') : '') || '',
            user?.status || '',
            user?.is_block || '',
            user?.block_proof_description || '',
            user?.block_proof_image || '',
            user?.isLoggedIn || '',
            user?.total_earning !== undefined && user?.total_earning !== null
              ? user.total_earning.toString()
              : '',
            user?.account || '',
            user?.account_linked || '',
            user?.status || '',
            user?.is_block || '',
            user?.isVerified || '',
            user?.isLoggedIn || '',
          ];
        }),
      );
      const data = [headers, ...exportData];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data, {
        skipHeader: true,
      });
      XLSX.utils.book_append_sheet(wb, ws, 'UserReport');
      const buffer = XLSX.write(wb, { bookType: 'csv', type: 'buffer' });

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=userReport.csv',
      );
      res.setHeader('Content-Type', 'text/csv');
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
