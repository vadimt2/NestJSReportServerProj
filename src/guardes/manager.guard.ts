import { AuthService } from './../auth/auth.service';
import { Injectable, CanActivate, ExecutionContext, HttpStatus, HttpException } from "@nestjs/common";
import { UserRole } from "../user/userRole";

// Attribue allow anly manager
@Injectable()
export class ManagerGuard implements CanActivate{
    constructor(private readonly authService: AuthService){}
    canActivate(context: ExecutionContext){

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if(user && user.empolyeeRole == UserRole.manager){
            return true;
        }

        throw new HttpException('UNAUTHORIZED user',HttpStatus.UNAUTHORIZED);
    }

}