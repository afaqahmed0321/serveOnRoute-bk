import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class RefundTransactionDto{

    @ApiProperty()
    @IsNotEmpty()
    paymentIntentId: string

    @ApiProperty()
    @IsNotEmpty()
    amount: number

    @ApiProperty()
    @IsNotEmpty()
    refundApplicationFee: boolean

    @ApiProperty()
    @IsNotEmpty()
    reverseTransfer: boolean

}