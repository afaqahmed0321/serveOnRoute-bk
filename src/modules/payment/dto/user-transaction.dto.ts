import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";


 export class getUserTransactionsDto{

    @ApiPropertyOptional()
    @IsOptional()
    user:string

    @ApiPropertyOptional()
    @IsOptional()
    sender:string

    @ApiPropertyOptional()
    @IsOptional()
    receiver:string

    @ApiPropertyOptional({
        example:'debit | credit'
    })
    @IsOptional()
    type:string

    @ApiPropertyOptional()
    @IsOptional()
    payment_method:string

    @ApiProperty()
    page:string

    @ApiProperty()
    limit:string

    @ApiPropertyOptional()
    @IsOptional()
    populate:string
}