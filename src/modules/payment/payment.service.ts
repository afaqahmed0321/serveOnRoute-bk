import { StripeService } from '@/helpers/stripe.hepler';
import {
  Injectable,
  Inject,
  BadRequestException,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';
import { SendTransactionDto } from './dto/send-transaction.dto';
import { UsersService } from '../users/users.service';
import { TransactionService } from './transaction.service';
import { RefundTransactionDto } from './dto/refund-transaction.dto';
import { ParcelService } from '../parcel/parcel.service';
import { ObjectId } from 'mongodb';
import { QueryPaymentDto } from './dto/query-payment.dto';
import { User } from '../users/schemas/users.schema';
import { AddBankAccountDto } from './dto/addBankAccount.dto';
import { BankAccount } from './schemas/bankAccount.schema';
import { BankAccountService } from './bankAccount.service';
import { Schema } from 'mongoose';
import { GetBalanceDto } from './dto/getBalance.paylode.dto';
import { PayoutService } from './payout.service';
import { PayoutDto, PayoutPayload } from './dto/payout.dto';
import moment from 'moment';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    @Inject(UsersService) private readonly usersService: UsersService,
    private readonly stripeService: StripeService,
    private readonly payoutService: PayoutService,
    private readonly bankAccountService: BankAccountService,
    private readonly transactionService: TransactionService,
    // private readonly payoutService,
    @Inject(forwardRef(() => ParcelService))
    private readonly parcelService: ParcelService,
  ) {}

  /**
   * Creates payment service
   * @param createPaymentDto
   * @returns
   */
  async create(createPaymentDto: CreatePaymentDto) {
    console.log('-----------', createPaymentDto);
    // let account = await this.stripeService.createAccount(createPaymentDto.account)
    let paymentMethod = await this.stripeService.createPaymentMethod(
      createPaymentDto,
    );
    if (paymentMethod) {
      await this.stripeService.attachPaymentToCustomer(
        createPaymentDto.customerId as string,
        paymentMethod.id,
      );
    }
    createPaymentDto.payment_method = paymentMethod.id;
    let payment = await this.paymentRepository.createPayment(createPaymentDto);
    return payment;
  }

  /**
   * Finds all
   * @param query
   * @returns
   */
  async findAll(query: QueryPaymentDto) {
    query.user = new ObjectId(query.user);
    console.log('>>>>>>>>>>>>>>>.', query);
    return await this.paymentRepository.findPayments(query);
  }

  /**
   * Finds one
   * @param id
   * @returns
   */
  findOne(id: string) {
    return this.paymentRepository.findPaymentById(id);
  }

  /**
   * Finds criteria
   * @param criteria
   * @returns
   */
  async findCriteria(criteria: object) {
    return await this.paymentRepository.findPaymentByCriteria(criteria);
  }

  /**
   * Finds platform account
   * @returns
   */
  async findPlatformAccount() {
    let accounts = await this.stripeService.listAccounts({ type: 'platform' });
    if (!accounts.data.length) {
      throw new BadRequestException('Not Found Platform Account');
    }
    return accounts.data[0];
  }

  /**
   * Updates payment service
   * @param id
   * @param updatePaymentDto
   * @returns
   */
  update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentRepository.findAndUpdatePayment(id, updatePaymentDto, {
      new: true,
    });
  }

  /**
   * Transfers payment
   * @param body
   * @returns
   */
  async transferPayment(body: SendTransactionDto) {
    // if(!body.paymentMethod){
    //   let paymentMethod = await this.stripeService.createPaymentMethod(body.card)
    //   body.paymentMethod = paymentMethod.id
    // }
    let transfer = await this.stripeService.createPaymentIntent(
      parseFloat(body.amount),
      body.paymentMethod,
      body?.customerId as string,
      body.rider_account,
      body.currency,
    );
    if (transfer) {
      let toUser = await this.usersService.findUserByCriteria({
        account: body.rider_account,
      });
      await this.parcelService.update(body.parcel, {
        payment_intent: transfer.id,
      });
      await this.transactionService.create({
        sender: body.fromUser,
        receiver: new ObjectId(toUser?._id),
        amount: body.amount,
        currency: body.currency,
        type: 'debit',
        payment_method: body.paymentMethod,
        payment_intent_id: transfer.id,
      });
      await this.transactionService.create({
        sender: body.fromUser,
        receiver: new ObjectId(toUser?._id),
        amount: body.amount,
        currency: body.currency,
        type: 'credit',
        account: body.rider_account,
        payment_intent_id: transfer.id,
      });
    }
    return transfer;
  }

  /**
   * Refunds payment
   * @param body
   * @returns
   */
  async refundPayment(body: RefundTransactionDto) {
    let refund = await this.stripeService.processRefund(
      body.paymentIntentId,
      body.amount,
      body.refundApplicationFee,
      body.reverseTransfer,
    );
    return refund;
  }

  /**
   * Stripes user transactions
   * @param query
   * @returns
   */
  async stripeUserTransactions(query: any) {
    if (query.user) {
      let user = (await this.usersService.findUserByUserId(query.user)) as User;
      query.customer = user.customerId;
      delete query.user;
    }
    console.log(query);
    return await this.stripeService.listUserTransactions(query);
  }

  /**
   * Lists transactions
   * @param query
   * @returns
   */
  async listTransactions(query: any) {
    return await this.stripeService.listTransactions(query);
  }

  /**
   * Platforms transactions
   * @param query
   * @returns
   */
  async platformTransactions(query: any) {
    let stripeTransactions = await this.stripeService.getPlatformTransactions(
      query.startDate,
      query.endDate,
    );
    let transactionsWithDetails = await Promise.all(
      stripeTransactions.map(async (transaction: any) => {
        if (transaction.receiverAccount || transaction.senderPaymentMethod) {
          let receiverDetails = await this.usersService.findUserByCriteria({
            account: transaction.receiverAccount,
          });
          let senderDetails =
            await this.paymentRepository.findPaymentAndPopulateUser({
              payment_method: transaction.senderPaymentMethod,
            });
          transaction.senderDetails = senderDetails?.user;
          transaction.receiverDetails = receiverDetails;
          transaction.created = new Date(transaction.created * 1000);
        }
        return transaction;
      }),
    );
    return transactionsWithDetails;
  }

  /**
   * Gets user transactions
   * @param query
   * @returns
   */
  async getUserTransactions(query: any) {
    return await this.transactionService.getTransactions(query);
  }

  remove(id: string) {
    return this.paymentRepository.removePayment(id);
  }

  /**
   * Adds bank account
   * @param body
   * @param [userId]
   * @returns bank account
   */
  async addBankAccount(
    body: AddBankAccountDto,
    userId?: Schema.Types.ObjectId | undefined,
  ): Promise<BankAccount> {
    const { token, accountId } = body;
    //check exist or not
    const isExist = await this.bankAccountService.getBankAccount(userId);
    if (isExist) {
      throw new NotFoundException('Bank Account already exist');
    }

    const bankAccountData = await this.stripeService.addBankAccount(
      accountId,
      token,
    );

    //insert into Database
    const bankAccount = await this.bankAccountService.create({
      user: userId,
      bankId: bankAccountData.id,
      accountNum: bankAccountData?.last4,
    });
    return bankAccount;
  }

  /**
   * Gets balance
   * @param userId
   * @returns
   */
  async getBalance(
    userId: Schema.Types.ObjectId | undefined,
  ): // userId: Schema.Types.ObjectId | undefined,
  Promise<GetBalanceDto> {
    console.log('>>>>>>>>>>>>>>>>>>>>>userId');
    const userData = await this.usersService.findUserByCriteria({
      _id: userId,
    });
    if (!userData?.account) {
      throw new NotFoundException('Account not found');
    }
    console.log('>>>>>>>>>>>>>>>>>>>>>userData', userData);
    const balance = await this.stripeService.getBalance(userData.account);

    console.log('>>>>>>>>>>>>>>>>>>>>>balance', balance);

    // get available balance and pending balance
    const availableBalance = balance.available[0].amount / 100;
    const pendingBalance = balance.pending[0].amount / 100;
    return { availableBalance, pendingBalance };
  }

  /**
   * Withdraws payment service
   * @param params
   * @param userId
   * @returns withdraw
   */
  async withdraw(
    params: PayoutDto,
    userId: Schema.Types.ObjectId | undefined,
  ): Promise<PayoutPayload> {
    const { amount } = params || {};
    const connectAccount = await this.usersService.findUserByCriteria({
      _id: userId,
    });

    if (!connectAccount?.account) {
      throw new NotFoundException('connect account not found');
    }

    const bankAccount = await this.bankAccountService.getBankAccount(userId);

    const balance = await this.stripeService.getBalance(
      connectAccount?.account,
    );

    console.log('>>>>>>>>>>>>>>>>>>>>>balance', balance);

    const amountInCent = amount * 100;

    console.log('balance.available[0].amount', balance.available[0].amount);
    // if (balance.available[0].amount < amountInCent) {
    //   throw new BadRequestException('Insufficient balance');
    // }

    if (bankAccount) {
      const payout = await this.stripeService.payout(
        bankAccount?.bankId,
        amountInCent,
        'cad',
      );

      //insert into payout schema
      const payoutData = await this.payoutService.create({
        user: userId,
        payoutId: payout?.id,
        amount: amountInCent,
      });
      // const timestamp = payout.arrival_date
      const timestamp = moment.unix(payout?.arrival_date).format('YYYY/MM/DD');
      const msgResponse = `Your payment has been withdrawn, the estimated arrival date for your payment will be ${timestamp} Thanks `;
      return { data: payoutData, message: msgResponse };
    } else {
      throw new NotFoundException('bank account not found');
    }
  }
}
