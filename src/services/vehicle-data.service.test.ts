import {VehicleDataService} from './vehicle-data.service';
import vehicleData from '../../vehicle-data.json';

describe('vehicle-data.service', () => {
    let vehicleDataInstance: VehicleDataService;

    beforeAll(() => {
        vehicleDataInstance = new VehicleDataService();
    });

    describe('constructor', () => {
        it('should populate the vehicleData property correctly', () => {
            expect(vehicleDataInstance.getCarDetailsByVrm('KPL754')).toBeTruthy();
        });
    });

    describe('parseVehicleDates', () => {
        it('should parse any keys that contain the word \'date\' to milliseconds', () => {
            const date = '2005-10-24';
            const dummyData = {
                "id": "b3bba5fc-92a4-4dcc-af4d-cd641faf69de",
                "vrm": "KPL753",
                "make": "Volkswagen",
                "model": "Golf",
                "registrationDate": date,
                "timeline": [
                    {
                        "eventType": "vrm_change",
                        "eventDetails": {
                            "date": date,
                            "fromVrm": "KPL752",
                            "toVrm": "KPL753"
                        }
                    },
                    {
                        "eventType": "mot_test",
                        "eventDetails": {
                            "date": date,
                            "mileage": 129385
                        }
                    }
                ]
            };

            const parsedDatesDummyData = vehicleDataInstance.parseVehicleDates(dummyData);
            const parsedDate = Date.parse(date);

            expect(parsedDatesDummyData.registrationDate).toStrictEqual(parsedDate);
            for (const timelineEvent of parsedDatesDummyData.timeline) {
                expect(timelineEvent.eventDetails.date).toStrictEqual(parsedDate);
            }
        });
    });

    describe('getCarDetailsByVrm', () => {
        it('method should return the correct vehicle data', () => {
            const vrmToCheck = 'KPL754';
            const carToCheck = vehicleData.find(vehicle => vehicle.vrm === vrmToCheck);

            expect(vehicleDataInstance.getCarDetailsByVrm(vrmToCheck)).toStrictEqual(carToCheck);
        });
    });

    describe('getPreviousRegistrations', () => {
        it('should return an empty array if the car doesn\'t have any timeline events', () => {
            expect(vehicleDataInstance.getPreviousTimelineEvents('EKE699')).toStrictEqual([]);
        });

        it('should throw an error if the initial VRM is not found in the available vehicle data', () => {
            const nonExistingVrm = 'AAA111';
            const errorMessage = `Car with VRM ${nonExistingVrm} was not found.`;
            expect(() => vehicleDataInstance.getPreviousTimelineEvents(nonExistingVrm)).toThrow(errorMessage);
        });

        it('should return the timeline events of ALL previous registrations (2 previous registrations)', () => {
            const initialCarVrm = 'KPL754';
            const previousCarVrms = ['KPL753', 'KPL752'];

            const expectedEvents = vehicleData.filter(vehicle => [initialCarVrm, ...previousCarVrms].includes(vehicle.vrm!))
                .map(vehicle => vehicle.timeline)
                .flat();

            const expectations = expectedEvents.map(event => expect.objectContaining(event));
            const timeline = vehicleDataInstance.getPreviousTimelineEvents(initialCarVrm).timeline;
            expect(timeline).toEqual(expect.arrayContaining(expectations));
            expect(timeline.length).toStrictEqual(expectedEvents.length);

        });

        it('should return the timeline events of ALL previous registrations (1 previous registration)', () => {
            const initialCarVrm = 'KPL753';
            const previousCarVrm = 'KPL752';

            const expectedEvents = vehicleData.filter(vehicle => [initialCarVrm, previousCarVrm].includes(vehicle.vrm!))
                .map(vehicle => vehicle.timeline)
                .flat();

            const expectations = expectedEvents.map(event => expect.objectContaining(event));
            const timeline = vehicleDataInstance.getPreviousTimelineEvents(initialCarVrm).timeline;

            expect(timeline).toEqual(expect.arrayContaining(expectations));
            expect(timeline.length).toStrictEqual(expectedEvents.length);
        });
    });

    describe('getFollowingRegistrations', () => {
        it('should return an empty array if the car doesn\'t have any timeline events', () => {
            expect(vehicleDataInstance.getPreviousTimelineEvents('EKE699')).toStrictEqual([]);
        });

        it('should throw an error if the initial VRM is not found in the available vehicle data', () => {
            const nonExistingVrm = 'AAA111';
            const errorMessage = `Car with VRM ${nonExistingVrm} was not found.`;
            expect(() => vehicleDataInstance.getPreviousTimelineEvents(nonExistingVrm)).toThrow(errorMessage);
        });

        it('should return the timeline events of ALL following registrations (2 future registrations)', () => {
            const initialCarVrm = 'KPL752';
            const nextCarVrms = ['KPL753', 'KPL754'];

            const expectedEvents = vehicleData.filter(vehicle => [initialCarVrm, ...nextCarVrms].includes(vehicle.vrm!))
                .map(vehicle => vehicle.timeline)
                .flat();

            const expectations = expectedEvents.map(event => expect.objectContaining(event));
            const timeline = vehicleDataInstance.getPreviousTimelineEvents(initialCarVrm).timeline;

            expect(timeline).toEqual(expect.arrayContaining(expectations));
            expect(timeline.length).toStrictEqual(expectedEvents.length);
        });

        it('should return the timeline events of ALL following registrations (1 future registration)', () => {
            const initialCarVrm = 'KPL753';
            const nextCarVrm = 'KPL754';

            const expectedEvents = vehicleData.filter(vehicle => [initialCarVrm, nextCarVrm].includes(vehicle.vrm!))
                .map(vehicle => vehicle.timeline)
                .flat();

            const expectations = expectedEvents.map(event => expect.objectContaining(event));
            const timeline = vehicleDataInstance.getPreviousTimelineEvents(initialCarVrm).timeline;

            expect(timeline).toEqual(expect.arrayContaining(expectations));
            expect(timeline.length).toStrictEqual(expectedEvents.length);
        });
    });

    describe('getCompleteTimelineByVrm', () => {
        it('should return an empty array if the car doesn\'t have any timeline events', () => {
            expect(vehicleDataInstance.getPreviousTimelineEvents('EKE699')).toStrictEqual([]);
        });

        it('should throw an error if the initial VRM is not found in the available vehicle data', () => {
            const nonExistingVrm = 'AAA111';
            const errorMessage = `Car with VRM ${nonExistingVrm} was not found.`;
            expect(() => vehicleDataInstance.getPreviousTimelineEvents(nonExistingVrm)).toThrow(errorMessage);
        });

        it('should return the same array irrespectively of the initial VRM when multiple VRMs are connected', () => {
            const initialCarVrm = 'KPL752';
            const initialCarVrm2 = 'KPL753';
            const initialCarVrm3 = 'KPL753';

            const timeline1Events = vehicleDataInstance.getCompleteTimelineByVrm(initialCarVrm);
            const timeline2Events = vehicleDataInstance.getCompleteTimelineByVrm(initialCarVrm2);
            const timeline3Events = vehicleDataInstance.getCompleteTimelineByVrm(initialCarVrm3);

            const arrayExpectations2 = timeline2Events.timeline.map(event => expect.objectContaining(event));
            const arrayExpectations3 = timeline3Events.timeline.map(event => expect.objectContaining(event));

            expect(timeline1Events.timeline)
                .toEqual(expect.arrayContaining(arrayExpectations2));
            expect(timeline1Events.timeline)
                .toEqual(expect.arrayContaining(arrayExpectations3));

            expect(timeline1Events.timeline.length).toStrictEqual(timeline2Events.timeline.length);
            expect(timeline1Events.timeline.length).toStrictEqual(timeline3Events.timeline.length);
        });

    });


});
