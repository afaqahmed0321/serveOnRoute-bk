import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@/decorators/user.decorator';
import RequestUserInterface from '@/interfaces/request-user.interface';
import { QueryPaymentDto } from './dto/query-payment.dto';
import { SendTransactionDto } from './dto/send-transaction.dto';
import { listTransactionDto } from './dto/list-transaction.dto';
import { getUserTransactionsDto } from './dto/user-transaction.dto';
import { RefundTransactionDto } from './dto/refund-transaction.dto';
import { PlatformTransactionDto } from './dto/platform-transactions.dto';
import { UserStripeTransaction } from './dto/user-stripetransaction.dto';
import { AddBankAccountDto } from './dto/addBankAccount.dto';
import { GetBalanceDto } from './dto/getBalance.paylode.dto';
import { PayoutDto, PayoutPayload } from './dto/payout.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @User() userObj: RequestUserInterface,
  ) {
    console.log('USer', userObj);
    createPaymentDto.user = userObj._id;
    createPaymentDto.customerId = userObj.customerId;
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll(@Query() query: QueryPaymentDto) {
    return this.paymentService.findAll(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async sendTransaction(
    @Body() body: SendTransactionDto,
    @User() userObj: RequestUserInterface,
  ) {
    body.fromUser = userObj._id;
    body.customerId = userObj.customerId;
    return this.paymentService.transferPayment(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('platform-transactions')
  async listTransactions(@Query() query: listTransactionDto) {
    return this.paymentService.listTransactions(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('platform-user-transactions')
  async listPlatformTransactions(@Query() query: PlatformTransactionDto) {
    return this.paymentService.platformTransactions(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user-transactions')
  async getUserTransactions(@Query() query: getUserTransactionsDto) {
    console.log(getUserTransactionsDto);
    return this.paymentService.getUserTransactions(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-stripe-user-transactions')
  async getStripeTransactions(@Query() query: UserStripeTransaction) {
    return this.paymentService.stripeUserTransactions(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refund')
  Refund(@Body() body: RefundTransactionDto) {
    return this.paymentService.refundPayment(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/addBankAccount')
  async addBankAccount(
    @Body() body: AddBankAccountDto,
    @User() userObj: RequestUserInterface,
  ) {
    const { _id } = userObj;
    return await this.paymentService.addBankAccount(body, _id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/getAccountBalance')
  async getAccountBalance(
    @User() userObj: RequestUserInterface,
  ): Promise<GetBalanceDto> {
    console.log('user', userObj);
    const { _id } = userObj;
    return await this.paymentService.getBalance(_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/withdrawBalance')
  async withdrawBalance(
    @Body() body: PayoutDto,
    @User() userObj: RequestUserInterface,
  ): Promise<PayoutPayload> {
    const { _id } = userObj;
    return await this.paymentService.withdraw(body, _id);
  }
}
