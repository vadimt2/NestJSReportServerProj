export interface UserDTO {
    _id : string;
    email: string;
    password: string;
    employeeRole: string;
    verifiedEmail: boolean;
    token:string;
  }