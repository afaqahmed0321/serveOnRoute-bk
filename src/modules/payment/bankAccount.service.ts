import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { BankAccountRepository } from './bankAccount.repository';
import { BankAccount } from './schemas/bankAccount.schema';
import { Schema } from 'mongoose';

@Injectable()
export class BankAccountService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  /**
   * Creates bank account service
   * @param body
   * @returns create
   */
  async create(body: any): Promise<BankAccount> {
    return await this.bankAccountRepository.create(body);
  }

  /**
   * Gets bank account
   * @param userId
   * @returns
   */
  async getBankAccount(userId: Schema.Types.ObjectId | undefined) {
    return await this.bankAccountRepository.getBankAccount(userId);
  }

  /**
   * Gets bank accounts
   * @param query
   * @returns
   */
  async getBankAccounts(query: any) {
    const filter = _.pick(query, ['user', 'bankId']);
    const options = _.pick(query, ['page', 'limit', 'populate']);
    return await this.bankAccountRepository.getBankAccounts(filter, options);
  }
}
