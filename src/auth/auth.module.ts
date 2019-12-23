import { EmployeeModule } from './../employee/employee.module';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [EmployeeModule,UserModule],
  controllers: [AuthController],
  providers: [AuthService,EmailService],
})
export class AuthModule {}
