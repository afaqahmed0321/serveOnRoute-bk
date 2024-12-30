import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateNotificationTokenDto{
    @ApiProperty()
    @IsNotEmpty()
    notification_token:string
    
    @ApiPropertyOptional()
    @IsOptional()
    device_type:string

    user:string
    role:[string]
}