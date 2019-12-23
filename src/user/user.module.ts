import { HttpExceptionFilter } from './../http-exception.filter';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [MongooseModule.forFeature([{name : 'Employee', 
  schema: UserSchema}])],
  providers: [UserService
  ],
  exports: [UserService],
})
export class UserModule {}