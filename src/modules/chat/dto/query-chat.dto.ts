import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class QueryChatDto{

    @ApiPropertyOptional()
    @IsOptional()
    conversationId:string;
    
    @ApiPropertyOptional()
    @IsOptional()
    message:string;

    @ApiPropertyOptional()
    @IsOptional()
    sender:string

    @ApiProperty()
    @IsNotEmpty()
    page:string

    @ApiProperty()
    @IsNotEmpty()
    limit:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sort:string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    populate:string
}