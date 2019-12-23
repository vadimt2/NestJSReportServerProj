import { IEmployee } from './../employee/interfaces/employee.interface';
import { ReportDTO } from '../report/dto/report.dto';
import { HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CoordinatesDTO } from '../map/dto/coordinates.dto';

@Injectable()
export class MapService {
    constructor(@InjectModel('Employee') private readonly employeeModel: Model<IEmployee>) { }

    async getAllEmployeeCoordinates() {
        // const getCoordinates1 = await this.employeeModel.aggregate([
        //     { $project: { "dataReport": 1, "_id": 0 } },
        //     { $unwind: "$dataReport" },
        //     { $project: { "dataReport.coordinates": 1, "_id": 0 } },
        //     { $unwind: "$dataReport.coordinates" },
        //     { $project: { "dataReport.coordinates": 1, "_id": 0 } },
        // ]);
        // return getCoordinates1;

        const getCoordinates = await this.employeeModel.distinct("dataReport.coordinates");
        // console.log(getCoordinates.length);
        return getCoordinates;
    }

    async getCoordinatesinatesByEmployee(id: string) {
        const getCoordinates = await this.employeeModel.findById(id).distinct("dataReport.coordinates");
        if(!getCoordinates){
            throw new HttpException('invalid credentials',HttpStatus.NOT_FOUND);
        }
        // console.log(getCoordinates);
        return getCoordinates;


        // console.log(email)
        // const getCoordinates = await this.employeeModel.aggregate([
        //     { $project: { "dataReport": 1,"email":1 , "_id": 0 } },
        //     { $match: { "email": email.email} },
        //     { $unwind: "$dataReport" },
        //     { $project: { "dataReport.coordinates": 1,"email":1 ,"_id": 0 } },
        //     { $unwind: "$dataReport.coordinates" },
        //     { $project: { "dataReport.coordinates": 1,"email":1 ,"_id": 0 } },
        // ]);
        // return getCoordinates;
    }
}