import { AccountLinkDto } from '@/modules/users/dto/account-link.dto';
import { Injectable } from '@nestjs/common';
require('dotenv').config();
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor() {}

  private readonly stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY as string,
    {
      apiVersion: '2022-11-15',
    },
  );

  async createCustomer(body: any) {
    return await this.stripe.customers.create(body);
  }

  async createAccount(body: any | createAccountEnable) {
    console.log('<INTO CONNECT ACCOUNT>');
    body.capabilities = {
      card_payments: { requested: true },
      transfers: { requested: true },
    };
    return await this.stripe.accounts.create(body);
  }

  async retrieveAccount(accountId: string) {
    return await this.stripe.accounts.retrieve(accountId);
  }

  async linkAccount(body: any) {
    return await this.stripe.accountLinks.create(body);
  }

  async deleteAccount(accountId: string) {
    return await this.stripe.accounts.del(accountId);
  }

  async listAccounts(param: any) {
    return await this.stripe.accounts.list(param);
  }

  async updateAccount(accountId: string, body: any) {
    return await this.stripe.accounts.update(accountId, body);
  }

  async createPaymentMethod(
    paymentDetails: any,
  ): Promise<Stripe.PaymentMethod> {
    const { card_number, card_exp_month, card_exp_year, card_cvc } =
      paymentDetails;

    // Create a PaymentMethod object representing the customer's payment details
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: card_number,
        exp_month: card_exp_month,
        exp_year: card_exp_year,
        cvc: card_cvc,
      },
    });

    return paymentMethod;
  }

  async attachPaymentToCustomer(customer: string, paymentMethod: string) {
    return await this.stripe.paymentMethods.attach(paymentMethod, {
      customer: customer,
    });
  }

  async createPaymentIntent(
    amount: number,
    paymentMethodId: string,
    customer: string,
    riderAccountId: string,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    // Calculate the amount to charge the customer, after subtracting the platform fee
    const platformFee = Math.round(amount * 0.1);
    const amountAfterPlatformFee = amount - platformFee;
    console.log(
      '---------------------------------------------------------------->>>>>>',
    );
    // Create a PaymentIntent object with the specified amount and PaymentMethod
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountAfterPlatformFee,
      currency,
      payment_method: paymentMethodId,
      customer: customer,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: riderAccountId,
      },
      confirm: true,
    });

    return paymentIntent;
  }

  async processRefund(
    paymentIntentId: string,
    amount: number,
    refundApplicationFee: boolean,
    reverseTransfer: boolean,
  ): Promise<Stripe.Refund> {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
      refund_application_fee: refundApplicationFee,
      reverse_transfer: reverseTransfer,
    });
    return refund;
  }

  async listTransactions(query: any) {
    return await this.stripe.balanceTransactions.list(query);
  }

  async listUserTransactions(query: any) {
    return await this.stripe.charges.list({
      customer: query.customer,
    });
  }

  async getPlatformTransactions(
    startDate: string | Date,
    endDate: string | Date,
  ) {
    let charges;
    if (startDate || endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      console.log(Math.floor(startDate.getTime() / 1000));
      charges = await this.stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000), // Convert Date to Unix timestamp
          lte: Math.floor(endDate.getTime() / 1000), // Convert Date to Unix timestamp
        },
        expand: ['data.transfer'],
      });
    } else {
      charges = await this.stripe.charges.list({
        expand: ['data.transfer'],
      });
    }
    console.log('/////////////LIST>>>>>>>>>>>>', charges);

    const transactions = charges.data.map((charge: any) => {
      const senderAccountId = charge.transfer?.destination;
      const receiverAccountId =
        charge.transfer?.source_transaction?.destination || null;
      const senderCustomerId = charge.transfer?.destination_payment?.customer;
      const senderPaymentMethod = charge.payment_method;
      const receiverAccount = charge.destination;
      const receiverCustomerId = charge.customer;

      return {
        senderAccountId,
        receiverAccountId,
        senderCustomerId,
        receiverCustomerId,
        senderPaymentMethod,
        receiverAccount,
        amount: charge.amount,
        currency: charge.currency,
        created: charge.created,
      };
    });

    return transactions;
  }

  async getTransactionsByDateRange(
    startDate: number,
    endDate: number,
  ): Promise<Stripe.Charge[]> {
    const allCharges: Stripe.Charge[] = [];

    let hasMoreCharges = true;
    let startingAfter = undefined;

    while (hasMoreCharges) {
      const charges: any = await this.stripe.charges.list({
        limit: 100,
        starting_after: startingAfter,
      });

      const filteredCharges = charges.data.filter(
        (charge: any) =>
          charge.created >= startDate && charge.created <= endDate,
      );

      allCharges.push(...filteredCharges);

      if (charges.has_more) {
        startingAfter = charges.data[charges.data.length - 1].id;
      } else {
        hasMoreCharges = false;
      }
    }

    return allCharges;
  }

  async addBankAccount(
    accountId: string,
    token: string,
  ): Promise<Stripe.Response<Stripe.BankAccount | Stripe.Card>> {
    const bankAccount = await this.stripe.accounts.createExternalAccount(
      accountId,
      {
        external_account: token,
      },
    );
    return bankAccount;
  }

  async getBalance(accountId: string): Promise<Stripe.Balance> {
    const balance = await this.stripe.balance.retrieve({
      stripeAccount: accountId,
    });
    return balance;
  }

  async payout(
    bankId: string,
    amount: number,
    currency: string,
  ): Promise<Stripe.Payout> {
    const payout = await this.stripe.payouts.create({
      amount: amount,
      currency: currency,
      destination: bankId,
    });

    return payout;
  }
}

export interface PaymentIntentDetails {
  name: string;
  email: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
}

export interface PaymentMethodDetails {
  card_number: string;
  card_exp_month: number;
  card_exp_year: number;
  card_cvc: string;
}
export interface listTransactionsDto {
  limit: number;
  type: [string];
}

export interface createAccountEnable {
  type: string;
  country: string;
  email: string;
  requested_capabilities: [string]; //['card_payments', 'transfers'],
  business_type: string;
  business_profile: {
    name: string;
    url: string;
    product_description: string;
    support_email: string;
    support_phone: '123-456-7890';
    mcc: '5734';
  };
  individual: {
    first_name: 'John';
    last_name: 'Doe';
    email: 'john.doe@example.com';
    dob: {
      day: 1;
      month: 1;
      year: 1980;
    };
    address: {
      line1: '123 Main St';
      city: 'Anytown';
      state: 'NY';
      postal_code: '12345';
      country: 'US';
    };
    phone: '555-555-5555';
    // ssn_last_4: '1234',
  };
  // tos_acceptance: {
  //   date: Math.floor(Date.now() / 1000),
  //   ip: '127.0.0.1',
  // },
}

//   async createSourceToken(cardNumber: string, expMonth: number, expYear: number, cvc: string) {
//     const token = await this.stripe.tokens.create({
//         card: {
//             number: cardNumber,
//             exp_month: expMonth,
//             exp_year: expYear,
//             cvc: cvc,
//         },
//     } as unknown as Stripe.TokenCreateParams );
//     return token.id;
//   }

//   async createCharge(body:any) {
//     try {
//       // Charge a customer
//       const charge = await this.stripe.charges.create({
//         amount: body.amount, // Amount in cents
//         currency: body.currency || 'usd',
//         source: await this.createSourceToken(body.card.number,body.card.expMonth,body.card.exp_year,body.card.cvc), // Test card token
//         description: 'Test charge',
//       });
//       return charge.id;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }

//   async transferToAppAccount(body:any):Promise<any>{
//     // Transfer funds to your app account
//     let createCharge = await this.createCharge(body)

//     const appTransfer = await this.stripe.transfers.create({
//         amount: body.amount, // Amount in cents
//         currency: body.currency || 'usd',
//         source_transaction: createCharge,
//         destination: this.configService.get('STRIPE_CONNECTED_ACCOUNT')as string, // Your app account ID
//         description: 'Transfer from charge',
//       });
//       return appTransfer
//     }

//     async transferToUserAccount(){
//         // Transfer funds to another user's bank account
//       const recipientTransfer = await this.stripe.transfers.create({
//         amount: 700, // Amount in cents
//         currency: 'usd',
//         destination: 'ba_XXXXXXXXXXXXXXXXXXXXXXXX', // The recipient's bank account ID
//         description: 'Transfer from app account',
//       });
//       return recipientTransfer;
//     }
