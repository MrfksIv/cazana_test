import { MileageCalculator } from '../controllers/mileage-calculator.controller';
import { VehicleDataService } from '../services/vehicle-data.service';
import * as dotenv from 'dotenv';
import vehicleData from '../../vehicle-data.json';
import { MileageEvent, TimelineEventTypes, VehicleDetails } from '../models/vehicle.model';
import { getYearsBetweenTwoDates } from '../utils/date-helper';

dotenv.config();

describe('e2e tests', () => {
    let mileageCalculator: MileageCalculator;
    let vehicleDataService: VehicleDataService;

    beforeAll(() => {
        vehicleDataService = new VehicleDataService()
        mileageCalculator = new MileageCalculator(vehicleDataService);
    });

    describe('connected VRMs should have the same mileage', () => {

        it ('should return the same average/total mileage values', () => {
            let parsedVehicleData = vehicleDataService.parseVehicleDates(vehicleData) as VehicleDetails[];
            const relevantTimeline = parsedVehicleData
                .filter(vehicle => ['KPL754', 'KPL753', 'KPL752']
                    .includes(vehicle.vrm!))
                .map(vehicle => vehicle.timeline)
                .flat()
                .filter(event => event?.eventType !== TimelineEventTypes.VRM_CHANGE)

                .sort((eventA, eventB) => {
                    const dateOfEventA = (eventA!.eventDetails as MileageEvent).date;
                    const dateOfEventB = (eventB!.eventDetails as MileageEvent).date;

                    if (dateOfEventA < dateOfEventB) return 1;
                    else if (dateOfEventA > dateOfEventB) return -1;
                    else return 0;
                });

            const lastEvent = relevantTimeline[0]!.eventDetails as MileageEvent;
            const oneBeforeLastEvent = relevantTimeline[1]!.eventDetails as MileageEvent;

            const yearDiffBetweenEvents = getYearsBetweenTwoDates(lastEvent.date, oneBeforeLastEvent.date);

            const expectedAvgMileage = (lastEvent.mileage - oneBeforeLastEvent.mileage) / yearDiffBetweenEvents;
            const expectedTotalMileage = lastEvent.mileage + (expectedAvgMileage * getYearsBetweenTwoDates(new Date().setUTCHours(0, 0, 0, 0), lastEvent.date));

            const {
                averageMileage: averageMileage1,
                totalMileage: totalMileage1
            } = mileageCalculator.calculateVehicleMileage('KPL754');

            const {
                averageMileage: averageMileage2,
                totalMileage: totalMileage2
            } = mileageCalculator.calculateVehicleMileage('KPL753');

            const {
                averageMileage: averageMileage3,
                totalMileage: totalMileage3
            } = mileageCalculator.calculateVehicleMileage('KPL752');

            expect(averageMileage1).toStrictEqual(expectedAvgMileage);
            expect(averageMileage1).toStrictEqual(averageMileage2);
            expect(averageMileage1).toStrictEqual(averageMileage3);

            expect(totalMileage1).toStrictEqual(expectedTotalMileage);
            expect(totalMileage1).toStrictEqual(totalMileage2);
            expect(totalMileage1).toStrictEqual(totalMileage3);

            console.log('avg:', averageMileage1);
            console.log('total:', totalMileage1);

        });
    });
});
