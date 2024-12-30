import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongodb";

export class QueryPaymentDto{
    @ApiProperty()
    @IsNotEmpty()
    user:string | ObjectId;
}