import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";
import { ObjectId } from "mongoose";

// export class Account{
//     @ApiProperty()
//     country: string
    
//     @ApiPropertyOptional()
//     email: string
// }

// export class Card{

//         @ApiProperty()
//         card_number: string;

//         @ApiProperty()
//         card_exp_month: number;

//         @ApiProperty()
//         card_exp_year: number;

//         @ApiProperty()
//         card_cvc: string; 
// }

export class CreatePaymentDto {
    user?:ObjectId

    // @ApiProperty()
    // card:Card

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    card_number: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    card_exp_month: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    card_exp_year: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    card_cvc: string;

    payment_method?:string
    customerId?:string
    // @ApiPropertyOptional()
    // accountInfo?:Account

    // @ApiProperty()
    // account?:string
}