import {getYearsBetweenTwoDates, parseDateInMs} from './date-helper';

describe('date-helper', () => {
    describe('parseDateInMs', () => {
        it ('should parse date-strings that are of the expected format (yyyy-mm-dd) to ms', () => {
            const dateString = '2021-01-01';
            const parsedDateInMs = parseDateInMs(dateString);
            const [year, month, day] = dateString.split('-').map((str: string) => parseInt(str, 10));

            const date = new Date(parsedDateInMs);

            expect(date.getUTCFullYear()).toStrictEqual(year);
            expect(date.getUTCMonth()).toStrictEqual(month - 1);
            expect(date.getUTCDate()).toStrictEqual(day);
        });

        it ('should throw an error if the date-string format is wrong', () => {
            const wrongDates = [
                '2019-15-11',  // yyyy-dd-mm format is NOT a valid format for Date.parse
                '2019-11a',
                '2019-11-32',
            ];

            for (const wrongDate of wrongDates) {
                expect(() => parseDateInMs(wrongDate)).toThrow('msg');
            }

        });
    });

    describe('getYearsBetweenTwoDates', () => {
        it ('should correctly calculate the difference in years between two dates in ms', () => {
            const diffDatesToCheck = [
                {
                    dates: ['2020-05-01', '2019-05-01'],
                    expectedYearsDiff: 1
                },
                {
                    dates: ['2018-01-01', '2020-7-01'],
                    expectedYearsDiff: -2.5
                }
            ];

            for (const datesToCheck of diffDatesToCheck) {
                const [ date1, date2 ] = datesToCheck.dates.map(date => parseDateInMs(date));
                expect(getYearsBetweenTwoDates(date1, date2)).toStrictEqual(datesToCheck.expectedYearsDiff);
            }
        });
    });
});
