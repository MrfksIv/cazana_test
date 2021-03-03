import {VehicleTimelineGetter} from '../models/VehicleTimelineGetter.interface';
import * as dotenv from 'dotenv';
import {TimelineEventTypes} from '../models/vehicle.model';

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
        // using delegation, we can substitute the actual class during runtime
        // which makes Unit testing easier as we can mock the dataService class
        return this.dataService.getCompleteTimelineByVrm(vrm);
    }

    public calculateVehicleMileage(vrm: string): { totalMileage: number, averageMileage: number } {
        let totalMileage: number;
        let averageMileage: number;
        const nowInMsWithoutTime = new Date().setUTCHours(0, 0, 0, 0);

        const { firstRegistrationDate, timeline } = this.getVehicleTimeline(vrm);

        // keep only events with mileage information (by filtering out VRM_CHANGE events)
        const filteredTimeline = timeline?.filter((evt) => evt.eventType !== TimelineEventTypes.VRM_CHANGE) ?? [];

        if (filteredTimeline.length === 0) {
            // no events with mileage available therefore use the ANNUAL_AVERAGE_MILEAGE
        } else if (filteredTimeline.length === 1) {
            // only one event with mileage information exists, so use the firstRegistrationDate
            // with the date of the first mileage event to calculate the average
        } else {
            // use the two most recent events to calculate the average by sorting in descending order and keeping the
            // first two elements
        }

        return { totalMileage, averageMileage };

    }
}
