import { ICoordinates } from './../../map/interfaces/coordinates.interface';
export interface IReport {
    _id: string;
    shiftDate: Date;
    startShift: Date
    endShift: Date;
    comment: Array<string>
    coordinates: Array<ICoordinates>
    repoertToManager: boolean;
}