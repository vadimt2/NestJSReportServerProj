import { IReport } from './../../report/interfaces/report.interface';
import { Document } from 'mongoose';


export interface IEmployee extends Document {
    _id : string;
    verifiedEmail: boolean;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    employeeRole: string;
    password:string;
    dataReport: Array<IReport>;
}