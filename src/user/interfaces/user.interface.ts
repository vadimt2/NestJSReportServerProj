import { Document } from 'mongoose';


export interface IUser extends Document {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  employeeRole: string;
  password: string;
  token: string;
  verifiedEmail: boolean;
}