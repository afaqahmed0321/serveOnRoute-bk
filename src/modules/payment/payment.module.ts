import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//services
import { PayoutService } from './payout.service';
import { PaymentService } from './payment.service';
import { TransactionService } from './transaction.service';
import { BankAccountService } from './bankAccount.service';
//controller
import { PaymentController } from './payment.controller';

//repository
import { PaymentRepository } from './payment.repository';
import { BankAccountRepository } from './bankAccount.repository';
import { TransactionRepository } from './transaction.repository';

//helpers
import { StripeService } from '@/helpers/stripe.hepler';

//module
import UsersModule from '../users/users.module';
import { ParcelModule } from '../parcel/parcel.module';

//schemas
import { Payout, payoutSchema } from './schemas/payout.schema';
import { Payment, paymentSchema } from './schemas/payment.schema';
import { Transaction, transactionSchema } from './schemas/transaction.schema';
import { BankAccount, bankAccountSchema } from './schemas/bankAccount.schema';
import { PayoutRepository } from './payout.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: paymentSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: transactionSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: BankAccount.name,
        schema: bankAccountSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Payout.name,
        schema: payoutSchema,
      },
    ]),
    UsersModule,
    forwardRef(() => ParcelModule),
  ],
  controllers: [PaymentController],
  providers: [
    //services
    StripeService,
    PaymentService,
    TransactionService,
    BankAccountService,
    PayoutService,

    //repository
    PaymentRepository,
    TransactionRepository,
    BankAccountRepository,
    PayoutRepository,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
