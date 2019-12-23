import { EmployeeDTO } from './../employee/dto/employee.dto';
import { ReportDTO } from '../report/dto/report.dto';
import { Controller, Post, Body, Get, UseGuards, Query, Param, Headers } from '@nestjs/common';
import { ReportService } from './report.service';
import { GeneralGuard } from '../guardes/general.guard';
import { IReport } from './interfaces/report.interface';

@Controller('report')
@UseGuards(GeneralGuard)
export class ReportController {

    constructor(private readonly reportService: ReportService) { }

    @Get('getByMonthlyRepoetsByEmployee')
    async getByMonthlyRepoetsByEmployee(@Query("id") id:string){
        const report = await this.reportService.getByMonthlyRepoetsByEmployee(id);
        return  report
    }

    @Get('getCurrentDayReportByEmployee')
    async getByCurrentDay(@Query("id") id:string){
        const report = await this.reportService.getCurrentDayReportByEmployee(id);
        return  report;
    }

    @Get('getBySelectedDateRepoetsByEmployee')
    async getBySelectedDateRepoetsByEmployee(@Query("id") id:string, @Query("selectedDate") selectedDate: string)
    : Promise<IReport[]> {
        const report = await this.reportService.getBySelectedDateRepoetsByEmployee(id, selectedDate);
        return  report;
    }

    @Get('GetCalcOfAllEmployeesHoursByMonth')
    async GetCalcOfAllEmployeesHoursByMonth(@Query("selectedMonth") year: Date){
        return await this.reportService.GetCalcOfAllEmployeesHoursByMonth(year);
    }
}
