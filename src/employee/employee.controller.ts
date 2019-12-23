import { GeneralGuard } from './../guardes/general.guard';
import { IComment } from './interfaces/comment.interface';
import { IEmployee } from './interfaces/employee.interface';
import { EmployeeService } from './employee.service';
import { EmployeeDTO } from './dto/employee.dto';
import { Controller, Post, Body, Get, Param, Query, Headers, UseGuards } from '@nestjs/common';
import { MapService } from '../map/map.service';

@Controller('employee')
@UseGuards(GeneralGuard)
export class EmployeeController {

    constructor(private readonly employeeService: EmployeeService,
        private readonly mapService: MapService) { }

    @Post('startShift')
    async startShift(@Body() employeeDTO: IEmployee) {
        await this.employeeService.startShift(employeeDTO);
    }

    @Post('endShift')
    async endShift(@Body() employeeDTO: IEmployee) {
        await this.employeeService.endShift(employeeDTO);
    }

    @Post('addComment')
    async addComment(@Body() comment: IComment) {
        const getEmployee = await this.employeeService.addComment(comment.employeeId, comment.comment);
        return getEmployee
    }

    @Get('getAllEmployeeCoordinates')
    async getAllEmployeeCoordinates() {
        const getCoordinates = await this.mapService.getAllEmployeeCoordinates();
        return getCoordinates
    }

    @Get('getCoordinatesinatesByEmployee')
    async getCoordinatesinatesByEmployee(@Query("id") id: string) {
        const getCoordinates = await this.mapService.getCoordinatesinatesByEmployee(id);
        return getCoordinates
    }

    @Get('getAllEmployees')
    async getAllEmployees() {
        return await this.employeeService.getAllEmployees();
    }

    @Get('getEmployeeById')
    async getEmployeeById(id: string) {

    }
}
