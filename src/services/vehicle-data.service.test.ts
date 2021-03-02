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

        });

        it('should throw an error if the initial VRM is not found in the available vehicle data', () => {

        });

        it('should return the timeline events of ALL previous registrations (2 previous registrations)', () => {

        });

        it('should return the timeline events of ALL previous registrations (1 previous registration)', () => {

        });
    });

    describe('getFollowingRegistrations', () => {
        it('should return an empty array if the car doesn\'t have any timeline events', () => {

        });

        it('should throw an error if the initial VRM is not found in the available vehicle data', () => {

        });

        it('should return the timeline events of ALL following registrations (2 future registrations)', () => {

        });

        it('should return the timeline events of ALL following registrations (1 future registration)', () => {

        });
    });

    describe('getCompleteTimelineByVrm', () => {
        it('should return an empty array if the car doesn\'t have any timeline events', () => {

        });

        it('should throw an error if the initial VRM is not found in the available vehicle data', () => {

        });

        it('should return the same array irrespectively of the initial VRM when multiple VRMs are connected', () => {

        });

    });


});
