import { AuthService } from './../auth/auth.service';
import { Injectable, CanActivate, ExecutionContext, HttpStatus, HttpException } from "@nestjs/common";
import { UserRole } from "../user/userRole";

@Injectable()
export class GeneralGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }
    async canActivate(context: ExecutionContext) {
        let flag = false;
        const request = await context.switchToHttp().getRequest();
        const arr = request.headers.authorization.split(" ");
        const user = await this.authService.verifyToken(arr[1]).then(user => {
            if (user) {
                flag = true;
                return;
            }
        }).catch(err => {
            throw new HttpException('UNAUTHORIZED user', HttpStatus.UNAUTHORIZED);
        });

        return flag;
    }
}
