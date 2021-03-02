import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.ONE_DAY_IN_MS || !process.env.DAYS_IN_A_YEAR) {
    throw new Error('Check for missing properties from .env: [ONE_DAY_IN_MS, DAYS_IN_A_YEAR]');
}
const ONE_DAY_IN_MS = parseInt(process.env.ONE_DAY_IN_MS, 10);
const DAYS_IN_A_YEAR = parseInt(process.env.DAYS_IN_A_YEAR, 10);

if (Number.isNaN(ONE_DAY_IN_MS) || Number.isNaN(DAYS_IN_A_YEAR)) {
    throw new Error('Wrong property types in .env: [ONE_DAY_IN_MS, DAYS_IN_A_YEAR] must be integers');
}

export function parseDateInMs(dateString: string): number {
    const dateInMs = Date.parse(dateString);
    if (Number.isNaN(dateInMs)) {
        throw new Error(`String ${dateString} couldn't be parsed. (Should be of format yyyy-mm-dd)`);
    }
    return dateInMs;
}

export function getYearsBetweenTwoDates(dateInMs1: number, dateInMs2: number, decimalPlaces = 2): number {
    const diffInMs = dateInMs1 - dateInMs2;
    const diffInDays = diffInMs / ONE_DAY_IN_MS;

    // ignores leap-years but this will cause an insignificant error over the lifetime of a car
    return +(diffInDays / DAYS_IN_A_YEAR).toFixed(decimalPlaces);
}
