import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BankAccount, BankAccountDocument } from './schemas/bankAccount.schema';
import { Model, PaginateModel, Schema } from 'mongoose';

@Injectable()
export class BankAccountRepository {
  constructor(
    @InjectModel(BankAccount.name)
    private readonly bankAccountModel: Model<BankAccountDocument>,
    @InjectModel(BankAccount.name)
    private readonly bankAccountPaginateModel: PaginateModel<BankAccountDocument>,
  ) {}

  async create(body: BankAccount): Promise<BankAccount> {
    return await this.bankAccountModel.create(body);
  }

  async getBankAccount(
    userId: Schema.Types.ObjectId | undefined,
  ): Promise<BankAccount | null> {
    return await this.bankAccountModel.findOne({ user: userId });
  }

  async getBankAccounts(filter: any, options: any) {
    return await this.bankAccountPaginateModel.paginate(filter, options);
  }
  async clearTransactions(user: string): Promise<any> {
    return await this.bankAccountModel.deleteMany({ user });
  }
}
