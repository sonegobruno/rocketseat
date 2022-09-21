export function convertHourToMinutes(hourString: string): number {
    const [ hours, minutes ] = hourString.split(':').map(Number)

    const minutesAccount = (hours * 60) + minutes
    return minutesAccount
}