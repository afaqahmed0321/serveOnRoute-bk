import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTransactionDto{
    @IsNotEmpty()
    user:string

    status:string

    amount:string

    paymentMethod:string

    account:string

    type:string

}