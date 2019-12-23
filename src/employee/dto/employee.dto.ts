export class EmployeeDTO  {
    _id : string;
    verifiedEmail: boolean;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    employeeRole: string;
    password: string;
    dataReport: [
        {
            shiftDate: Date;
            startShift: Date;
            endShift: Date;
            comment: Array<string>;
            coordinates: [
                {
                    lat: number;
                    lng: number;
                }
            ]
        }
    ]
    
}