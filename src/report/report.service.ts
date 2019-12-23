import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEmployee } from '../employee/interfaces/employee.interface';
import { ObjectId } from 'bson';
import { IReport } from './interfaces/report.interface';

@Injectable()
export class ReportService {
    constructor(@InjectModel('Employee') private readonly employeeModel: Model<IEmployee>) { }

    async getBySelectedDateRepoetsByEmployee(id: string, selectedDate: string) {
        const getDate = new Date(selectedDate);
        console.log(getDate.getMonth())
        const reports = await this.employeeModel.aggregate([
            { $match: { "_id": new ObjectId(id) } },
            { $unwind: "$dataReport" },
            { $project: { "dataReport": 1,
            month: { $month: '$dataReport.shiftDate' },year: { $year: '$dataReport.shiftDate' } , "_id": 0 } },
            { $match: { month: getDate.getMonth() + 1,
                        year: getDate.getFullYear() } },
            {
                $project: {
                    "_id": "$dataReport._id",
                    "shiftDate": "$dataReport.shiftDate",
                    "startShift": "$dataReport.startShift",
                    "endShift": "$dataReport.endShift",
                    "coordinates": "$dataReport.coordinates",
                    "comment": "$dataReport.comment"
                }
            },
        ])
        return reports;
    }

    async getByMonthlyRepoetsByEmployee(id: string) {
        const currentDate = new Date();
        const reports = await this.employeeModel.aggregate([
            { $match: { "_id": new ObjectId(id) } },
            { $unwind: "$dataReport" },
            { $project: { "dataReport": 1, month: { $month: '$dataReport.shiftDate' }, "_id": 0 } },
            { $match: { month: currentDate.getMonth() + 1 } },
            {
                $project: {
                    "_id": "$dataReport._id",
                    "shiftDate": "$dataReport.shiftDate",
                    "startShift": "$dataReport.startShift",
                    "endShift": "$dataReport.endShift",
                    "coordinates": "$dataReport.coordinates",
                    "comment": "$dataReport.comment"
                }
            },
        ])
        return reports;
    }

    async getCurrentDayReportByEmployee(id: string): Promise<IReport[]> {
        const currentDate = new Date();
        const reports = await this.employeeModel.aggregate().match({ "_id": new ObjectId(id) }).unwind("$dataReport")
            .match({
                "dataReport.shiftDate": {
                    "$gte": new Date(currentDate.toDateString())
                    , "$lte": new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate() + 1)
                }
            })
            .project({
                "_id": 0, "shiftDate": "$dataReport.shiftDate",
                "startShift": "$dataReport.startShift",
                "endShift": "$dataReport.endShift"
            })
        return reports;
    }

    async GetCalcOfAllEmployeesHoursByMonth(year: Date) {
        const arr: any[] = [];
        const getYear = new Date(year);
        const getDate = new Date();
        for (let i = 1; i <= 12; i++) {
            const reports = await this.employeeModel.aggregate(
                [
                    { $unwind: "$dataReport" }, {
                        $project: {
                            startShift: "$dataReport.startShift",
                            endShift: "$dataReport.endShift",
                            month: { $month: "$dataReport.startShift" },
                            year: { $year: "$dataReport.startShift" }
                        }
                    },
                    { $match: { $and: [{ month: i }, { year: 2019 }] }, },
                    { $project: { duration: { $divide: [{ $subtract: ["$endShift", "$startShift"] }, 3600000] } } },
                    { $group: { _id: null, avgAmount: { $avg: "$duration" }, } },
                    { $project: { _id: 0, avgAmount: "$avgAmount" } }]
            );
            if (reports[0] !== undefined) {
                let obj = { id: i, ...reports[0] };
                arr.push(obj)
            }
            else{
                let obj = { id: i, avgAmount: 0 };
                arr.push(obj)
            }
        }
        // console.log(arr)
        return arr;
    }

    async GetCalcOfByEmployeesHoursByMonth(id: string, selectedMonth: Date) {
        const getDate = new Date(selectedMonth);
        const reports = await this.employeeModel.aggregate(
            [
                { $unwind: "$dataReport" },
                {
                    $project: {
                        startShift: "$dataReport.startShift",
                        endShift: "$dataReport.endShift",
                        month: { $month: "$dataReport.startShift" },
                        year: { $year: "$dataReport.startShift" }
                    }
                },
                {
                    $match: {
                        $and: [
                            { "_id": new ObjectId(id) },
                            { month: getDate.getMonth() + 1 },
                            { year: getDate.getFullYear() }
                        ]
                    },
                },
                {
                    $project: {
                        duration: { $divide: [{ $subtract: ["$endShift", "$startShift"] }, 3600000] }

                    }
                },
                {
                    $group:
                    {
                        _id: null,
                        avgAmount: { $avg: "$duration" },
                    }
                }
            ]
        );
        return reports;
    }


}
