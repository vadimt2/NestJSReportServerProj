import { EmailService } from './../email/email.service';
import { EmployeeService } from './../employee/employee.service';
import { EmployeeDTO } from './../employee/dto/employee.dto';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/dto/user.dto';
import { UserService } from './../user/user.service';
import { Controller, Post, Get, Body, UseGuards, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Payload } from './payLoad';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly employeeService: EmployeeService,
        private readonly emailService: EmailService) { }

    @Post('login')
    async login(@Body() userDTO: UserDTO) {
        const user = await this.userService.login(userDTO);
        const payload: Payload = {
            email: user.email
        }
        const token = await this.authService.signPayLoad(payload);
        console.log(`${user} loged in`);
        return { user, token }
    }

    @Post('register')
    async register(@Body() employeeDTO: EmployeeDTO) {

        const user = await this.employeeService.create(employeeDTO);

        const payload: Payload = {
            email: user.email
        }

        this.emailService.sendMail(employeeDTO.email, "Confirm your email", `
        Confirm here: http://localhost:4200/auth/emailconfirmation/${user._id}`)

        const token = await this.authService.signPayLoad(payload);

        return { user, token }
    }

    @Get('confirmEmail')
    async confirmEmail(@Body() userDto: UserDTO) {
        console.log(userDto)
        console.log("Has an request");

        const getResult = await this.userService.verifyEmail(userDto._id);

        return getResult == true ? true : false;
    }

    @Post('forgotpassword')
    async forgotpassword(@Body() userDto: UserDTO) {
        const user = await this.userService.findByEmail(userDto.email);
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
        }
        const payload: Payload = {
            email: user.email
        }
        const token = await this.authService.signPayLoad(payload);

        const result = this.emailService.sendMail("vadimt2@gmail.com", "Confirm your email", `
     Confirm here: http://localhost:4200/auth/changepassword/${token}`)
        result.catch(err => {
            console.log(err)
        });
        return HttpStatus.OK;
    }

    @Post('changepassword')
    async changePassword(@Body() userDTO: UserDTO) {
        console.log(userDTO.password)
        const token = await this.authService.verifyToken(userDTO.token).then(tokenResult => {
            console.log(tokenResult)
            return tokenResult;
        }).catch(err => {
            throw new HttpException(err, HttpStatus.UNAUTHORIZED);
        })

        if (token) {
            const payload = token as Payload
            const user = this.userService.setPassword(payload.email, userDTO.password);
            return user;
        }
        else {
            console.log(token)
            return token;

        }

    }

}
