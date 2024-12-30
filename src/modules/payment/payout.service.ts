import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { PayoutRepository } from './payout.repository';
import { Payout } from './schemas/payout.schema';
import { Schema } from 'mongoose';

@Injectable()
export class PayoutService {
  constructor(private readonly payoutRepository: PayoutRepository) {}

  /**
   * Creates payout service
   * @param body
   * @returns create
   */
  async create(body: any): Promise<Payout> {
    return await this.payoutRepository.create(body);
  }

  /**
   * Gets payout
   * @param userId
   * @returns
   */
  async getPayout(userId: Schema.Types.ObjectId | undefined) {
    return await this.payoutRepository.getPayout(userId);
  }

  /**
   * Gets payouts
   * @param query
   * @returns
   */
  async getPayouts(query: any) {
    const filter = _.pick(query, ['user', 'bankId']);
    const options = _.pick(query, ['page', 'limit', 'populate']);
    return await this.payoutRepository.getPayouts(filter, options);
  }
}
