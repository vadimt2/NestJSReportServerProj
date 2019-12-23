import { HttpExceptionFilter } from './http-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import appconfig from './config/appconfig';


@Module({
  imports: [MongooseModule.forRoot(appconfig.mongoURI),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File(appconfig.options.file),
      ],
    }), AuthModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },],
})
export class AppModule {}
