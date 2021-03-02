import { TimelineEvent } from './vehicle.model';

export interface VehicleTimelineGetter {
    getCompleteTimelineByVrm(vrm: string): { firstRegistrationDate: number, timeline: TimelineEvent[] };
}
