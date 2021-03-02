import {VehicleDataService} from './vehicle-data.service';

const vehicleData: any[] = [];

describe('vehicle-data.service', () => {
    let vehicleDataInstance: VehicleDataService;

    beforeAll(() => {
        vehicleDataInstance = new VehicleDataService();
    });

    describe('constructor', () => {
        it('should populate the vehicleData property correctly', () => {
            expect(vehicleDataInstance.getCarDetailsByVrm('ADD_VRM_HERE')).toBeTruthy();
        });
    });

    describe('parseVehicleDates', () => {
        it('should parse any keys that contain the word \'date\' to milliseconds', () => {

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
