import { UserService } from './../user/user.service';
import { GeneralGuard } from './../guardes/general.guard';
import { MapService } from './../map/map.service';
import { ReportService } from './../report/report.service';
import { ReportController } from './../report/report.controller';
import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeSchema } from './employee.schema';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../http-exception.filter';
import { EmployeeController } from './employee.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{name : 'Employee', 
  schema: EmployeeSchema}])],
  providers: [EmployeeService,ReportService, MapService, AuthService,UserService,   
    //{
  //   provide: APP_GUARD,
  //   useClass: GeneralGuard,
  // },
  //}
],
  exports: [EmployeeService,ReportService,MapService,AuthService,UserService],
  controllers: [EmployeeController,ReportController],
})
export class EmployeeModule {}