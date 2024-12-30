import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class Card{

        @ApiPropertyOptional()
        card_number: string;
        @ApiPropertyOptional()
        card_exp_month: number;
        @ApiPropertyOptional()
        card_exp_year: number;
        @ApiPropertyOptional()
        card_cvc: string; 
}

export class SendTransactionDto{
    // @ApiPropertyOptional({
    //     type:Object
    // })
    // card:Card

    @ApiPropertyOptional({
        type:String
    })
    @IsString()
    @IsNotEmpty()
    paymentMethod:string

    @ApiPropertyOptional({
        type:String
    })
    @IsString()
    @IsNotEmpty()
    currency:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    parcel:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    amount:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    rider_account:string

    fromUser?:ObjectId;
    toUser?:string;
    customerId?:string;

}