import { TimelineEvent, VehicleDetails } from '../models/vehicle.model';
import vehicleData from '../../vehicle-data.json';
import { parseDateInMs } from '../utils/date-helper';
import { VehicleTimelineGetter } from '../models/VehicleTimelineGetter.interface';

export class VehicleDataService implements VehicleTimelineGetter {

    private vehicleData: { [vrm: string]: VehicleDetails } = {};

    constructor() {
        for (const vehicle of vehicleData) {
            if (typeof vehicle.vrm === 'string') {
                this.vehicleData[vehicle.vrm] = this.parseVehicleDates(vehicle);
            }
        }
    }

    public parseVehicleDates(obj: any): any {

        if ( ['string', 'number'].includes(typeof obj) ) {
            return;
        }

        for (const [key, val] of Object.entries(obj)) {
            if (Array.isArray(val)) {
                // TODO: handle the case where the array contains only primitives
                obj[key] = val.map(elem => this.parseVehicleDates(elem));
            }
            if (typeof val === 'string' && /date/gi.test(key)) {
                obj[key] = parseDateInMs(val as string);
            }
            if (typeof val === 'object') {
                obj[key] = this.parseVehicleDates(val);
            }
        }
        return obj;

    }

    public getCarDetailsByVrm(vrm: string): VehicleDetails | null {
        return this.vehicleData[vrm] ?? null;
    }

    public getCompleteTimelineByVrm(vrm: string): { firstRegistrationDate: number, timeline: TimelineEvent[] } {
        const { timeline: previousTimeline, firstRegistrationDate } = this.getPreviousTimelineEvents(vrm);
        const futureTimeline = this.getFollowingTimelineEvents(vrm);

        return {firstRegistrationDate, timeline: [...previousTimeline, ...futureTimeline]};
    }

    public getPreviousTimelineEvents(vrm: string): { firstRegistrationDate: number, timeline: TimelineEvent[] } {
        // TODO: it should recursively find any backward registrations of vehicle instances and return the
        //  combined timeline of those
        console.log(vrm);
        throw new Error('Not implemented');
    }

    public getFollowingTimelineEvents(vrm: string, skipInitialVrm = true): TimelineEvent[] {
        // TODO: it should recursively find any forward registrations of vehicle instances and return the
        //  combined timeline of those
        console.log(vrm, skipInitialVrm);
        throw new Error('Not implemented');
    }




}
