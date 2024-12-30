import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator"

export class CreateBidDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    bid_amount:string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    parcel:string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    bidder:string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description:string

}
