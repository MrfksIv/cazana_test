const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const DAYS_IN_A_YEAR = 365;

export function parseDateInMs(dateString: string): number {
    const dateInMs = Date.parse(dateString);
    if (Number.isNaN(dateInMs)) {
        throw new Error(`String ${dateString} couldn't be parsed. (Should be of format yyyy-mm-dd)`);
    }
    return dateInMs;
}

export function getYearsBetweenTwoDates(dateInMs1: number, dateInMs2: number): number {
    const diffInMs = dateInMs1 - dateInMs2;
    const diffInDays = diffInMs / ONE_DAY_IN_MS;

    return diffInDays / DAYS_IN_A_YEAR;
}
