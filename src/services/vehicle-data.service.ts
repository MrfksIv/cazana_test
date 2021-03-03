import {TimelineEvent, TimelineEventTypes, VehicleDetails, VrmChangeEvent} from '../models/vehicle.model';
import vehicleData from '../../vehicle-data.json';
import {parseDateInMs} from '../utils/date-helper';
import {VehicleTimelineGetter} from '../models/VehicleTimelineGetter.interface';

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
        const initialCar = this.getCarDetailsByVrm(vrm);
        if (initialCar === null) {
            throw new Error(`Car with VRM ${vrm} was not found.`);
        }

        const fullTimeline: TimelineEvent[] = [];
        let firstRegistrationDate = initialCar.registrationDate;

        const that = this;

        (function recursiveSearch(vehicle: VehicleDetails): void {
            if (!vehicle.timeline) {
                return;
            }
            fullTimeline.push(...vehicle.timeline);
            firstRegistrationDate = vehicle.registrationDate;

            const vrmChangeEvents = vehicle.timeline
                ?.filter((event) => event.eventType === TimelineEventTypes.VRM_CHANGE) ?? null;

            // if no VRM Change events are available, return the current timeline if it exists, null otherwise
            if (vrmChangeEvents === null) {
                return;
            }
            const previousVrmEvent = vrmChangeEvents
                .filter((event) => (event.eventDetails as VrmChangeEvent).toVrm === vehicle.vrm);
            if (previousVrmEvent.length > 0) {
                const previousCar = that.getCarDetailsByVrm((previousVrmEvent[0].eventDetails as VrmChangeEvent).fromVrm);
                if (previousCar === null) {
                    return;
                }
                return recursiveSearch(previousCar);
            }
        })(initialCar);

        return { firstRegistrationDate, timeline: fullTimeline };
    }

    public getFollowingTimelineEvents(vrm: string, skipInitialVrm = true): TimelineEvent[] {
        const initialCar = this.getCarDetailsByVrm(vrm);
        if (initialCar === null) {
            throw new Error(`Car with VRM ${vrm} was not found.`);
        }

        const fullTimeline: TimelineEvent[] = [];
        const that = this;

        (function recursiveSearch(vehicle: VehicleDetails): void {
            if (!vehicle.timeline) {
                return;
            }

            if(skipInitialVrm) {
                if (vrm !== vehicle.vrm) {
                    fullTimeline.push(...vehicle.timeline);
                }
            } else {
                fullTimeline.push(...vehicle.timeline);
            }

            const vrmChangeEvents = vehicle.timeline?.filter(event => event.eventType === TimelineEventTypes.VRM_CHANGE) ?? null;

            if (vrmChangeEvents === null) {
                return;
            }

            const followingVrmEvent = vrmChangeEvents.filter(event => (event.eventDetails as VrmChangeEvent).fromVrm === vehicle.vrm);
            if (followingVrmEvent.length > 0) {
                const nextCar = that.getCarDetailsByVrm((followingVrmEvent[0].eventDetails  as VrmChangeEvent).toVrm);

                if (nextCar === null) {
                    return;
                }
                return recursiveSearch(nextCar);
            }

        })(initialCar);

        return fullTimeline;
    }




}
