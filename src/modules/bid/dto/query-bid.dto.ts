import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator"

export class QueryBidDto{
    @ApiProperty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    page:number

    @ApiProperty()
    @IsNumber()
    limit:number

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sort:string
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    populate:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    parcel:string
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    amount:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    rider:string
}