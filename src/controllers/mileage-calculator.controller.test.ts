import { VehicleTimelineGetter } from '../models/VehicleTimelineGetter.interface';
import { TimelineEvent, TimelineEventTypes } from '../models/vehicle.model';
import {MileageCalculator} from './mileage-calculator.controller';

describe('mileage-calculator.controller', () => {
    let mileageCalculator: MileageCalculator;

    beforeAll(() => {
        mileageCalculator = new MileageCalculator(new MockDataService());
    });
});

class MockDataService implements VehicleTimelineGetter {
    private data: { [vrm: string]: { firstRegistrationDate: number, timeline: TimelineEvent[] } } = {
        noMileageEvents: {
            firstRegistrationDate: 111,
            timeline: [
                {
                    eventType: TimelineEventTypes.VRM_CHANGE,
                    eventDetails: {
                        date: 1,
                        fromVrm: 'VRM HERE',
                        toVrm: 'VRM HERE'
                    }
                }
            ]

        }
    };

    public getCompleteTimelineByVrm(vrm: string): { firstRegistrationDate: number; timeline: TimelineEvent[] } {
        return this.data[vrm];
    }
}
