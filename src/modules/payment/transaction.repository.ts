import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Transaction, TransactionDocument } from "./schemas/transaction.schema";
import { Model, PaginateModel } from "mongoose";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class TransactionRepository{
    constructor(
        @InjectModel(Transaction.name) private readonly transactionModel:Model<TransactionDocument>,
        @InjectModel(Transaction.name) private readonly transactionPaginateModel:PaginateModel<TransactionDocument>,
    ){}

    async create(body:CreateTransactionDto){
        return await this.transactionModel.create(body);
    }

    async getTransactions(filter:any,options:any){
        return await this.transactionPaginateModel.paginate(filter,options);
    }

    async clearTransactions(user:string):Promise<any>{
        return await this.transactionModel.deleteMany({user});
    }

    

}