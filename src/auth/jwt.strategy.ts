import { AuthService } from './auth.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import config from '../config/appconfig';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
constructor(private readonly authService:AuthService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secretOrKey
    });

}

async validate(payload: any, done: VerifiedCallback){
    const user = await this.authService.validateUser(payload);
    if(!user){
        return done(
            new HttpException('UNAUTHORIZED access',HttpStatus.UNAUTHORIZED),
            false,
        );
    } 

    return done(null, user, payload.iat);
}

}