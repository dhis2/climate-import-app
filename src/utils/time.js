import i18n from '@dhis2/d2-i18n'
import {
    convertFromIso8601,
    convertToIso8601,
    generateFixedPeriods,
    getNowInCalendar,
} from '@dhis2/multi-calendar-dates'

export const HOURLY = 'HOURLY'
export const DAILY = 'DAILY'
export const WEEKLY = 'WEEKLY'
export const MONTHLY = 'MONTHLY'
export const SIXTEEN_DAYS = 'SIXTEEN_DAYS'

export const oneDayInMs = 1000 * 60 * 60 * 24

export const periodTypes = [
    {
        id: DAILY,
        name: i18n.t('Daily'),
    },
    {
        id: WEEKLY,
        name: i18n.t('Weekly'),
    },
    {
        id: MONTHLY,
        name: i18n.t('Monthly'),
    },
]

// TODO: In UTC?
export const addPeriodTimestamp = (period) => {
    const startTime = new Date(period.startDate).getTime()
    const endTime = new Date(period.endDate).getTime() + oneDayInMs
    const middleTime = startTime + (endTime - startTime) / 2

    return {
        ...period,
        startTime,
        endTime,
        middleTime,
    }
}

export const getMiddleTime = (period) =>
    period.startTime + (period.endTime - period.startTime) / 2

/**
 * Pads a number with zeroes to the left
 * @param {Number} number Number to pad
 * @param {Number} count Number of digits to pad to
 * @returns {String} Padded number
 */
export const padWithZeroes = (number, count = 2) =>
    String(number).padStart(count, '0')

/**
 * Formats a Date into a startad date string (ISO 8601)
 * @param {Date} date
 * @returns {String}
 */
export const formatStandardDate = (date) => {
    const year = date.getFullYear()
    const month = padWithZeroes(date.getMonth() + 1)
    const day = padWithZeroes(date.getDate())

    return `${year}-${month}-${day}` // YYYY-MM-DD
}

/**
 * Converts a calendar date object to a date string
 * @param {Object} date Calendar date object
 * @returns {String} Date string in the format YYYY-MM-DD
 */
export const formatCalendarDate = (date) => {
    const year = date.eraYear ?? date.year
    const month = padWithZeroes(date.month)
    const day = padWithZeroes(date.day)

    return `${year}-${month}-${day}` // YYYY-MM-DD
}

/**
 * Returns calendar date by adding a period to the current date
 * @param {String} calendar Calendar used
 * @param {Object} period Period object
 * @returns {String} Date string in the format YYYY-MM-DD
 */
export const getCalendarDate = (calendar, period = { days: 0 }) => {
    const now = getNowInCalendar(calendar).add(period)
    return formatCalendarDate(now)
}

/**
 * Returns the current year
 * @returns {Number} Current year
 */
export const getCurrentYear = () => new Date().getFullYear()

/**
 * Returns the current month
 * @returns {Number} Current month
 */
export const getCurrentMonth = () => new Date().getMonth() + 1

/**
 * Returns the last available month
 * @param {Date} date Current date
 * @param {Number} lagDays Delay in days (10 days for ERA5-Land)
 * @returns {Array} Last year and month
 */
export const getLastMonth = (date = new Date(), lagDays = 10) => {
    // Based on https://stackoverflow.com/a/7937257
    const newDate = new Date(date.getTime())
    const month = newDate.getMonth()
    const monthsBack = newDate.getDate() > lagDays ? 1 : 2

    newDate.setMonth(month - monthsBack)

    while (newDate.getMonth() === month) {
        newDate.setDate(newDate.getDate() - 1)
    }

    return [newDate.getFullYear(), newDate.getMonth() + 1]
}

// Returns the default monthly period (12 months back)
export const getDefaultMonthlyPeriod = (lagDays) => {
    const [endYear, endMonth] = getLastMonth(new Date(), lagDays)
    const endTime = new Date(endYear, endMonth, 0)
    const startTime = new Date(endYear, endTime.getMonth() - 11, 1)
    const startYear = startTime.getFullYear()
    const startMonth = startTime.getMonth() + 1

    return {
        startTime: `${startYear}-${padWithZeroes(startMonth)}`,
        endTime: `${endYear}-${padWithZeroes(endMonth)}`,
    }
}

/**
 * Returns the default import data period
 * @param {String} calendar Calendar used
 * @returns {Object} Default import data period with calendar date strings
 */
export const getDefaultImportPeriod = (calendar) => ({
    periodType: DAILY,
    startTime: getCalendarDate(calendar, { months: -7 }),
    endTime: getCalendarDate(calendar, { months: -1 }),
    calendar,
})

/**
 * Returns the default explore data period (12 months back)
 * @param {Number} lagDays Delay in days (10 days for ERA5-Land)
 * @returns {Object} Default explore data period with standard date strings
 */
export const getDefaultExplorePeriod = (lagDays = 10) => {
    const endTime = new Date()

    endTime.setDate(endTime.getDate() - lagDays) // Subtract lag days
    endTime.setDate(0) // Last day of the previous month

    // First day 12 months back
    const startTime = new Date(
        endTime.getFullYear(),
        endTime.getMonth() - 11,
        1
    )

    return {
        startTime: formatStandardDate(startTime),
        endTime: formatStandardDate(endTime),
    }
}

/**
 * Returns number of months between start and end month (inclusive)
 * @param {String} startTime Start month in format YYYY-MM
 * @param {String} endTime End month in format YYYY-MM
 * @returns {Number} Number of months between start and end month
 */
export const getNumberOfMonths = (startTime, endTime) => {
    const startYear = parseInt(startTime.substring(0, 4))
    const start = parseInt(startTime.substring(5, 7))
    const endYear = parseInt(endTime.substring(0, 4))
    const end = parseInt(endTime.substring(5, 7))
    return (endYear - startYear) * 12 + (end - start) + 1
}

/**
 * Returns number of days between start and end date (inclusive)
 * @param {String} startTime Start date in format YYYY-MM-DD
 * @param {String} endTime End date in format YYYY-MM-DD
 * @returns {Number} Number of days between start and end date
 */
export const getNumberOfDays = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diff = end - start
    return diff / oneDayInMs + 1
}

/**
 * Formats a date string, timestamp or date array into format used by DHIS2 and <input> date
 * @param {Date} date
 * @returns {String}
 */
export const formatDate = (date) => {
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    return `${year}-${month}-${day}` // xxxx-xx-xx
}

/**
 * Translates a date string to a date object
 * @param {String} dateString Date string in the format YYYY-MM-DD or YYYY-MM
 * @returns {Object} Date object with year, month and day
 */
export const toDateObject = (dateString) => {
    const [year, month, day] = dateString.split('-')
    return {
        year: parseInt(year),
        month: parseInt(month),
        day: day ? parseInt(day) : 1,
    }
}

/**
 * Extracts the year from a date string
 * @param {String} dateString Date string in the format YYYY-MM-DD
 * @returns {Number} Year
 */
export const extractYear = (dateString) => parseInt(dateString.split('-')[0])

/**
 * Translates a calendar date to a standard date string
 * @param {String} dateString Calendar date string
 * @param {String} calendar Calendar used
 * @returns {String} Standard date string
 */
export const toStandardDate = (dateString, calendar) => {
    const date = convertToIso8601(toDateObject(dateString), calendar)
    const year = date.eraYear ?? date.year
    const month = padWithZeroes(date.month)
    const day = padWithZeroes(date.day)

    return `${year}-${month}-${day}` // YYYY-MM-DD
}

/**
 * Translates a standard date to a calendar date string
 * @param {String} dateString Standard date string
 * @param {String} calendar Calendar used
 * @returns {String} Calendar date string
 */
export const fromStandardDate = (dateString, calendar) => {
    const date = convertFromIso8601(toDateObject(dateString), calendar)
    const year = date.eraYear ?? date.year
    const month = padWithZeroes(date.month)
    const day = padWithZeroes(date.day)

    return `${year}-${month}-${day}`
}

/**
 * Returns a standard period object from a calendar period object
 * @param {Object} period Calendar period object
 * @param {String} calendar Calendar used
 * @returns {Object} Standard period object
 */
export const getStandardPeriod = ({
    startTime,
    endTime,
    calendar,
    periodType,
}) => ({
    startTime: toStandardDate(startTime, calendar),
    endTime: toStandardDate(endTime, calendar),
    periodType,
    calendar, // Include original calendar to allow conversion back to DHIS2 date
})

/**
 * Returns an array of period items for a given period object
 * @param {Object} period Calendar period object
 * @returns {Array} Period items
 */
export const getPeriods = (period) => {
    const {
        periodType,
        startTime,
        endTime,
        calendar = 'gregory',
        locale = 'en',
    } = period

    const startYear = extractYear(fromStandardDate(startTime, calendar))
    const endYear = extractYear(fromStandardDate(endTime, calendar))

    let items = []

    for (let year = startYear; year <= endYear; year++) {
        items = items.concat(
            generateFixedPeriods({
                year,
                calendar,
                locale,
                periodType,
            })
                .map((p) =>
                    calendar !== 'iso8601'
                        ? {
                              ...p,
                              startDate: toStandardDate(p.startDate, calendar),
                              endDate: toStandardDate(p.endDate, calendar),
                          }
                        : p
                )
                .filter(
                    (p) => p.startDate <= endTime && p.endDate >= startTime // Filter out periods outside the range
                )
        )
    }

    return items
}

/**
 * Creates a map of standard dates and DHIS2 calendar date ids
 * @param {Array} periods Period items
 * @returns {Map} Map with standard date as key and DHIS2 calendar date as value
 */
export const getMappedPeriods = (periods) => {
    const mappedPeriods = new Map()
    periods.reduce((map, p) => map.set(p.startDate, p.id), mappedPeriods)
    return mappedPeriods
}

/**
 * Checks if a period is valid
 * @param {Object} period Period object with startTime and endTime
 * @returns {Boolean} True if period is valid
 */
export const isValidPeriod = (period) =>
    Boolean(
        period &&
            period.startTime &&
            period.endTime &&
            new Date(period.startTime) <= new Date(period.endTime)
    )
