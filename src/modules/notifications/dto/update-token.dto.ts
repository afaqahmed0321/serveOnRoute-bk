import { PartialType } from "@nestjs/mapped-types";
import { CreateNotificationTokenDto } from "./create-token.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateNotificationTokenDto{
    @ApiPropertyOptional()
    @IsOptional()
    notification_token:string
    
    @ApiPropertyOptional()
    @IsOptional()
    device_type:string

    @ApiPropertyOptional()
    @IsOptional()
    status:string

    user:string
}