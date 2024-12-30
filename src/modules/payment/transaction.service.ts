import { Injectable } from "@nestjs/common";
import * as _ from "lodash";
import { TransactionRepository } from "./transaction.repository";

@Injectable()
export class TransactionService{
    constructor(private readonly transactionRepository:TransactionRepository){}    
    
    async create(body:any){
        return await this.transactionRepository.create(body);
    }
    
    async getTransactions(query:any){
        const filter = _.pick(query,["user","type","payment_method",'sender','receiver'])
        const options = _.pick(query,["page","limit","populate"])
        return await this.transactionRepository.getTransactions(filter,options);
    }
    
    async clearTransactions(user:string){
        return await this.transactionRepository.clearTransactions(user);
    }

}