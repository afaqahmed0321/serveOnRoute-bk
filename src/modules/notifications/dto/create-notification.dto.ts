import { STATUS } from "@/enums/status.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateNotificationDto {
    @ApiPropertyOptional()
    @IsNotEmpty()
    title:string
    
    @ApiPropertyOptional()
    @IsNotEmpty()
    body:string

    @ApiProperty()
    notification_token?:string

    @ApiPropertyOptional({
        type:String,
    })
    type?:string

    @IsNotEmpty()
    user:ObjectId

}
