import { UserService } from './../user/user.service';
import { Injectable, HttpException, HttpStatus, Next } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { Payload } from './payLoad';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    async signPayLoad(payload: Payload) {
        return sign(payload, 'secretKey', { expiresIn: "1d" })
    }

    async validateUser(payload: Payload) {
        return await this.userService.findByPayLoad(payload);
    }

    async verifyToken(token: string) {
        return verify(token, "secretKey")
    }
}
