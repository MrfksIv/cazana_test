import { VehicleTimelineGetter } from '../models/VehicleTimelineGetter.interface';
import * as dotenv from 'dotenv';

export class MileageCalculator {
    static ANNUAL_AVERAGE_MILEAGE: number;

    constructor (private dataService: VehicleTimelineGetter) {
        dotenv.config();

        if (process.env.ANNUAL_AVERAGE_MILEAGE) {
            MileageCalculator.ANNUAL_AVERAGE_MILEAGE = parseInt(process.env.ANNUAL_AVERAGE_MILEAGE, 10);
        } else {
            throw new Error('missing parameter from .env file: ANNUAL_AVERAGE_MILEAGE');
        }
    }

    private getVehicleTimeline(vrm: string) {
        // using delegation, we can substitute actual class during runtime
        // which makes Unit testing easier as we can mock the dataService class
        return this.dataService.getCompleteTimelineByVrm(vrm);
    }

    public calculateVehicleMileage(vrm: string): { totalMileage: number, averageMileage: number } {
        throw new Error('not implemented' + vrm);
    }
}
