import {VehicleTimelineGetter} from '../models/VehicleTimelineGetter.interface';
import {TimelineEvent, TimelineEventTypes} from '../models/vehicle.model';
import {MileageCalculator} from './mileage-calculator.controller';
import * as dotenv from 'dotenv';

dotenv.config();
const ANNUAL_AVERAGE_MILEAGE = parseInt(process.env.ANNUAL_AVERAGE_MILEAGE!, 10);
const ONE_DAY_IN_MS = parseInt(process.env.ONE_DAY_IN_MS!, 10);
const DAYS_IN_A_YEAR = parseInt(process.env.DAYS_IN_A_YEAR!, 10);

const REGISTRATION_YEARS_AGO = 10;
const MILEAGE_AT_MOT = 60000;
const MOT_YEARS_AGO = 6;

const MILEAGE_AT_ADVERTISEMENT = 70000;
const ADVERTISEMENT_YEARS_AGO = 5;

const MILEAGE_AT_2ND_MOT = 75000;
const SECOND_MOT_YEARS_AGO = 3.4;

describe('mileage-calculator.controller', () => {
    let mileageCalculator: MileageCalculator;

    beforeAll(() => {
        mileageCalculator = new MileageCalculator(new MockDataService());
    });

    describe('calculateVehicleMileage', () => {

        it ('should return the correct mileage values for vehicles with NO mileage events', () => {
            const { averageMileage, totalMileage } = mileageCalculator.calculateVehicleMileage('noMileageEvents');

            expect(averageMileage).toStrictEqual(ANNUAL_AVERAGE_MILEAGE);
            expect(totalMileage).toStrictEqual(ANNUAL_AVERAGE_MILEAGE * REGISTRATION_YEARS_AGO);
        });

        it ('should return the correct mileage values for vehicles with ONE mileage events', () => {
            const { averageMileage, totalMileage } = mileageCalculator.calculateVehicleMileage('oneMileageEvent');

            const expectedAverageMileage = MILEAGE_AT_MOT / (REGISTRATION_YEARS_AGO - MOT_YEARS_AGO);
            const expectedTotalMileage = MILEAGE_AT_MOT + (expectedAverageMileage * MOT_YEARS_AGO);

            expect(averageMileage).toStrictEqual(expectedAverageMileage);
            expect(totalMileage).toStrictEqual(expectedTotalMileage);
        });

        it ('should return the correct mileage values for vehicles with MULTIPLE mileage events', () => {
            const { averageMileage, totalMileage } = mileageCalculator.calculateVehicleMileage('moreThanOneMileageEvent');

            // use the two most recent events
            const expectedAverageMileage = (MILEAGE_AT_2ND_MOT - MILEAGE_AT_ADVERTISEMENT) / (ADVERTISEMENT_YEARS_AGO - SECOND_MOT_YEARS_AGO);
            const expectedTotalMileage = MILEAGE_AT_2ND_MOT + (expectedAverageMileage * SECOND_MOT_YEARS_AGO);

            expect(averageMileage).toStrictEqual(expectedAverageMileage);
            expect(totalMileage).toStrictEqual(expectedTotalMileage);
        });
    });
});

class MockDataService implements VehicleTimelineGetter {
    private data: { [vrm: string]: { firstRegistrationDate: number, timeline: TimelineEvent[] } } = {
        noMileageEvents: {
            firstRegistrationDate: this.getYearsAgoInMsFromToday(REGISTRATION_YEARS_AGO),
            timeline: [
                {
                    eventType: TimelineEventTypes.VRM_CHANGE,
                    eventDetails: {
                        date: this.getYearsAgoInMsFromToday(10),
                        fromVrm: 'KPL752',
                        toVrm: 'KPL753'
                    }
                },
                {
                    eventType: TimelineEventTypes.VRM_CHANGE,
                    eventDetails: {
                        date: this.getYearsAgoInMsFromToday(5),
                        fromVrm: 'KPL753',
                        toVrm: 'KPL754'
                    }
                },
            ]
        },
        oneMileageEvent: {
            firstRegistrationDate: this.getYearsAgoInMsFromToday(REGISTRATION_YEARS_AGO),
            timeline: [
                {
                    eventType: TimelineEventTypes.VRM_CHANGE,
                    eventDetails: {
                        date: this.getYearsAgoInMsFromToday(REGISTRATION_YEARS_AGO),
                        fromVrm: 'VRM111',
                        toVrm: 'VRM222',
                    }
                },
                {
                    eventType: TimelineEventTypes.MOT_TEST,
                    eventDetails: {
                        mileage: MILEAGE_AT_MOT,
                        date: this.getYearsAgoInMsFromToday(MOT_YEARS_AGO)
                    }
                },
                {
                    eventType: TimelineEventTypes.VRM_CHANGE,
                    eventDetails: {
                        date: this.getYearsAgoInMsFromToday(5),
                        fromVrm: "KPL753",
                        toVrm: "KPL754"
                    }
                }
            ]
        },
        moreThanOneMileageEvent: {
            firstRegistrationDate: 1, // a wrong registration date shouldn't matter for cars with 2 or more mileage events
            timeline: [
                {
                  eventType: TimelineEventTypes.MOT_TEST,
                  eventDetails: {
                      mileage: MILEAGE_AT_2ND_MOT,
                      date: this.getYearsAgoInMsFromToday(SECOND_MOT_YEARS_AGO),
                  }
                },
                {
                    eventType: TimelineEventTypes.VRM_CHANGE,
                    eventDetails: {
                        date: this.getYearsAgoInMsFromToday(10),
                        fromVrm: 'VRM111',
                        toVrm: 'VRM222',
                    }
                },
                {
                    eventType: TimelineEventTypes.MOT_TEST,
                    eventDetails: {
                        mileage: MILEAGE_AT_MOT,
                        date: this.getYearsAgoInMsFromToday(MOT_YEARS_AGO)
                    }
                },
                {
                    eventType: TimelineEventTypes.VRM_CHANGE,
                    eventDetails: {
                        date: this.getYearsAgoInMsFromToday(5),
                        fromVrm: "KPL753",
                        toVrm: "KPL754"
                    }
                },
                {
                    eventType: TimelineEventTypes.ADVERTISEMENT,
                    eventDetails: {
                        date: this.getYearsAgoInMsFromToday(ADVERTISEMENT_YEARS_AGO),
                        mileage: MILEAGE_AT_ADVERTISEMENT
                    }
                },
            ]
        }
    };

    public getCompleteTimelineByVrm(vrm: string): { firstRegistrationDate: number; timeline: TimelineEvent[] } {
        return this.data[vrm];
    }

    public getYearsAgoInMsFromToday(yearsAgo: number) {
        return new Date().setUTCHours(0, 0, 0, 0) - yearsAgo * DAYS_IN_A_YEAR * ONE_DAY_IN_MS;
    }
}
