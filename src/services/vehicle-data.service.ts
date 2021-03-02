import {TimelineEvent, VehicleDetails} from '../models/vehicle.model';

export class VehicleDataService {

    private vehicleData: { [key: string]: VehicleDetails } = {};

    constructor() {
        // TODO: it should load the data from the a .json file
    }

    public parseVehicleDates(obj: any): any {
        // TODO: it should parse the dates of any nested object recursively by finding any fields
        //  that contain the word 'date' using regex
        throw new Error('Not implemented');

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
        throw new Error('Not implemented');
    }

    public getFollowingTimelineEvents(vrm: string, skipInitialVrm = true): TimelineEvent[] {
        // TODO: it should recursively find any forward registrations of vehicle instances and return the
        //  combined timeline of those
        throw new Error('Not implemented');
    }




}
