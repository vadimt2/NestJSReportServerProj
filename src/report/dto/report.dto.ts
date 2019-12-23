export class ReportDTO {
    _id: string;
    shiftDate: Date;
    startShift: Date
    endShift: Date;
    comment: Array<string>
    coordinates: [
        {
            lat: number,
            lng: number,
        }
    ];
    repoertToManager: boolean;
}