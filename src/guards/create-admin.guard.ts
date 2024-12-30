import { ROLE } from '@/enums/role.enum';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import {applyDecorators, CanActivate, ExecutionContext, Injectable, UseGuards} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CreateAdminAccess implements CanActivate{
    constructor(){}
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if(request.body.role.includes(ROLE.ADMIN) && request?.headers?.authorization){
            let user = function getUserFromHeader(header = request?.headers?.authorization.split(' ')[1]){
                
            }
            
            if(request.body.role.includes(ROLE.ADMIN) && request.user)
                return true 
                return false
        }else{
            return false
        }
    }
}