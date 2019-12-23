import { IReport } from './../report/interfaces/report.interface';
import { ObjectId } from 'bson';
import { ReportDTO } from '../report/dto/report.dto';
import { HttpStatus, Body, Post } from '@nestjs/common';
import { IEmployee } from './interfaces/employee.interface';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeDTO } from './dto/employee.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CoordinatesDTO } from '../map/dto/coordinates.dto';



@Injectable()
export class EmployeeService {
    constructor(@InjectModel('Employee') private readonly employeeModel: Model<IEmployee>) { }

    private sanitizeUser(employee: IEmployee) {
        return employee.depopulate('password');
    }

    async getAllEmployees() {
        const getEmployees = await this.employeeModel.find().select("_id email firstName lastName");
        return getEmployees;
    }

    async getEmployeeById(id: string) {
        const getEmployee = await this.employeeModel.findById(id).select("_id email firstName lastName");

    }

    async findByEmail(email: string): Promise<IEmployee> {
        return await this.employeeModel.findOne({ email: email }).exec();
    }


    async create(employeeDTO: EmployeeDTO) {
        if (this.validateEmail(employeeDTO.email)) {
            const exsistEmployee = await this.findByEmail(employeeDTO.email);
            if (exsistEmployee) {
                throw new HttpException('Employee already exists', HttpStatus.BAD_REQUEST);
            }
            const createdEmployee = new this.employeeModel(employeeDTO);
            createdEmployee.employeeRole = "user";
            createdEmployee.verifiedEmail = false;
            console.log(createdEmployee)
            await createdEmployee.save();
            return this.sanitizeUser(createdEmployee);
        }
        throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);

    }

    validateEmail(email: string) {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase());
    }

    async getLastReportByEmployee(employeeDTO: IEmployee): Promise<IReport> {
        const lastReport = await this.employeeModel.aggregate([
            { $match: { "_id": new ObjectId(employeeDTO._id) } },
            { $unwind: "$dataReport" },
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
            { $sort: { "shiftDate": -1 } }
        ]).limit(1).exec();
        return lastReport[0];
    }

    async startShift(employeeDTO: IEmployee) {
        let lastRepoet: IReport = await this.getLastReportByEmployee(employeeDTO);
        // New shift for the first time
        if (lastRepoet === null || lastRepoet === undefined) {
            console.log(`new shift for the first time`)
            const report = new ReportDTO();
            report.shiftDate = new Date();
            report.startShift = new Date();
            let coordinates = new CoordinatesDTO();
            coordinates = employeeDTO.dataReport[0].coordinates[0];
            report.coordinates = [coordinates];
            const emp = await this.employeeModel.findById(employeeDTO._id)
            emp.dataReport.push(report);
            await emp.save();
            console.log("new shift")
            return;
        }

        // it means a new shift
        if (lastRepoet.endShift !== null && lastRepoet.endShift !== undefined) {
            let report = new ReportDTO();
            report.shiftDate = new Date();
            report.startShift = new Date();
            let coordinates = new CoordinatesDTO();
            coordinates = employeeDTO.dataReport[0].coordinates[0];
            report.coordinates = [coordinates];
            const emp = await this.employeeModel.findById(employeeDTO._id)
            emp.dataReport.push(report);
            await emp.save();
            return;
        }

        const stratShift = new Date(lastRepoet.startShift);
        const currentDate = new Date();
        const calcHoures = currentDate.getHours() - stratShift.getHours();

        if (lastRepoet.startShift.toDateString() === currentDate.toDateString()
            && calcHoures > 13 && lastRepoet.endShift === undefined && lastRepoet.endShift === null) {
            // must close the the shift + alert

            const emp = await this.employeeModel.findById(employeeDTO._id);
            lastRepoet.repoertToManager = true;
            await this.employeeModel.updateOne({ "_id": emp._id, "dataReport._id": lastRepoet._id }, {
                $set: {
                    "dataReport.$.endShift": new Date(
                        currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate(), 23, 59, 59, 59
                    )
                }
            })

            let report = new ReportDTO();
            report.shiftDate = new Date();
            report.startShift = new Date();
            let coordinates = new CoordinatesDTO();
            coordinates = employeeDTO.dataReport[0].coordinates[0];
            report.coordinates = [coordinates];
            const empl = await this.employeeModel.findById(employeeDTO._id);
            empl.dataReport.push(report);
            await empl.save();
            return;
        }

        if (lastRepoet.startShift.toDateString() !== currentDate.toDateString()
            && calcHoures > 13 && lastRepoet.endShift === undefined && lastRepoet.endShift === null) {
            // must close the the shift + alert

            const emp = await this.employeeModel.findById(employeeDTO._id);
            lastRepoet.repoertToManager = true;
            await this.employeeModel.updateOne({ "_id": emp._id, "dataReport._id": lastRepoet._id }, {
                $set: {
                    "dataReport.$.endShift": new Date(
                        currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate(), 23, 59, 59, 59
                    )
                }
            })


            let report = new ReportDTO();
            report.shiftDate = new Date();
            report.startShift = new Date();
            let coordinates = new CoordinatesDTO();
            coordinates = employeeDTO.dataReport[0].coordinates[0];
            report.coordinates = [coordinates];
            let empl = await this.employeeModel.findById(employeeDTO._id);
            empl.dataReport.push(report);
            await empl.save();
            return;
        }

        else if (lastRepoet.startShift !== null && lastRepoet.startShift !== undefined) {
            throw new HttpException("Shift already started", HttpStatus.BAD_REQUEST)
        }
    }


    async endShift(employeeDTO: IEmployee) {
        let lastRepoet: IReport = await this.getLastReportByEmployee(employeeDTO);

        // Shift not found
        if (lastRepoet === null || lastRepoet === undefined) {
            throw new HttpException("Can't end not started shift", HttpStatus.BAD_REQUEST);
        }

        // Shift alrady ended
        if (lastRepoet.startShift !== null && lastRepoet.startShift !== undefined && lastRepoet.endShift !== null && lastRepoet.endShift !== undefined) {
            throw new HttpException("You must start a new shift", HttpStatus.BAD_REQUEST);
        }

        const stratShift = new Date(lastRepoet.startShift);
        const currentDate = new Date();
        const calcHoures = currentDate.getHours() - stratShift.getHours();

        if (lastRepoet.startShift.toDateString() === currentDate.toDateString()
            && calcHoures > 13 && lastRepoet.endShift === undefined && lastRepoet.endShift === null) {
            const emp = await this.employeeModel.findById(employeeDTO._id);
            lastRepoet.repoertToManager = true;
            await this.employeeModel.updateOne({ "_id": emp._id, "dataReport._id": lastRepoet._id }, {
                $set: {
                    "dataReport.$.endShift": new Date(
                        currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate(), 23, 59, 59, 59
                    )
                }
            })
        }

        if (lastRepoet.startShift.toDateString() !== currentDate.toDateString()
            && calcHoures > 13 && lastRepoet.endShift === undefined && lastRepoet.endShift === null) {
            const emp = await this.employeeModel.findById(employeeDTO._id);
            lastRepoet.repoertToManager = true;
            await this.employeeModel.updateOne({ "_id": emp._id, "dataReport._id": lastRepoet._id }, {
                $set: {
                    "dataReport.$.endShift": new Date(
                        currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate(), 23, 59, 59, 59
                    )
                }
            })
        }


        // Found shift
        if (lastRepoet) {
            let emp = await this.employeeModel.findById(employeeDTO._id);
            await this.employeeModel.updateOne({
                "_id": emp._id, "dataReport._id":
                    lastRepoet._id
            }, { $set: { "dataReport.$.endShift": new Date() } })
            console.log("shift ended!!!!!!!!!!!!!!!!")
            return;
        }
        console.log("didn't work at all");
    }


    async addComment(id: string, comment: string) {
        let getEmployee = await this.employeeModel.findById(new ObjectId(id)).select("_id email dataReport")
        let lastRepoet = await this.getLastReportByEmployee(getEmployee);
        if (lastRepoet) {
            if (lastRepoet.startShift !== null && lastRepoet.endShift === undefined) {
                let getReport = getEmployee.dataReport.find(x=> x._id.toString() === lastRepoet._id.toString());
                if(getReport){
                    if(getReport.comment === null ||  getReport.comment === undefined){
                        getReport.comment = new Array<string>();
                    }
                    getReport.comment.push(comment);
                    await getEmployee.save();
                }
                return;
            }
            else if (lastRepoet.shiftDate != null && lastRepoet.endShift != null) {
                throw new HttpException('Shift has ended you must start a new shift', HttpStatus.BAD_REQUEST)
            }
            else if (lastRepoet.startShift === null) {
                throw new HttpException('Start a new shift', HttpStatus.BAD_REQUEST)
            }
        }
    }

}

