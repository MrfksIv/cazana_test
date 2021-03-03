import { VehicleTimelineGetter } from '../models/VehicleTimelineGetter.interface';
import { TimelineEvent, TimelineEventTypes } from '../models/vehicle.model';
import {MileageCalculator} from './mileage-calculator.controller';

describe('mileage-calculator.controller', () => {
    let mileageCalculator: MileageCalculator;

    beforeAll(() => {
        mileageCalculator = new MileageCalculator(new MockDataService());
    });

    describe('calculateVehicleMileage', () => {

        it ('should return the correct mileage values for vehicles with NO mileage events', () => {
            const { averageMileage, totalMileage } = mileageCalculator.calculateVehicleMileage('VRM');

            expect(averageMileage).toStrictEqual(0);
            expect(totalMileage).toStrictEqual(0);
        });

        it ('should return the correct mileage values for vehicles with ONE mileage events', () => {
            const { averageMileage, totalMileage } = mileageCalculator.calculateVehicleMileage('VRM');

            expect(averageMileage).toStrictEqual(0);
            expect(totalMileage).toStrictEqual(0);
        });

        it ('should return the correct mileage values for vehicles with MULTIPLE mileage events', () => {
            const { averageMileage, totalMileage } = mileageCalculator.calculateVehicleMileage('VRM');

            expect(averageMileage).toStrictEqual(0);
            expect(totalMileage).toStrictEqual(0);
        });
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
