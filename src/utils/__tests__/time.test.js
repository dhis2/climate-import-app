import {
    extractYear,
    formatStandardDate,
    formatCalendarDate,
    fromStandardDate,
    getCalendarDate,
    getMappedPeriods,
    getNumberOfMonths,
    getNumberOfDays,
    getLastMonth,
    getStandardPeriod,
    isValidPeriod,
    padWithZeroes,
    toDateObject,
    toStandardDate,
    getPeriods,
    oneDayInMs,
    DAILY,
    WEEKLY,
    MONTHLY,
} from '../time.js'

const timestamp = 1722902400000 // 2024-08-06

const gregoryCalendar = 'gregory'
const nepaliCalendar = 'nepali'
const ethiopicCalendar = 'ethiopic'

const gregoryDate = {
    year: 2024,
    month: 8,
    day: 6,
}

const gregoryDateString = '2024-08-06'
const gregoryStartDate = '2023-08-01'
const gregoryEndDate = '2024-07-31'

const gregoryPeriod = {
    startTime: gregoryStartDate,
    endTime: gregoryEndDate,
    calendar: gregoryCalendar,
    periodType: DAILY,
}

const nepaliDate = {
    year: 2081,
    month: 4,
    day: 22,
}

const nepaliDateString = '2081-04-22'
const nepaliStartDate = '2080-09-01'
const nepaliEndDate = '2081-03-31'

const nepaliPeriod = {
    startTime: nepaliStartDate,
    endTime: nepaliEndDate,
    calendar: nepaliCalendar,
    periodType: DAILY,
}

const ethiopicDate = {
    year: 2016,
    month: 11,
    day: 30,
}

const ethiopicDateString = '2016-11-30'
const ethiopicStartDate = '2016-04-01'
const ethiopicEndDate = '2016-10-30'

const ethiopicPeriod = {
    startTime: ethiopicStartDate,
    endTime: ethiopicEndDate,
    calendar: ethiopicCalendar,
    periodType: DAILY,
}

const now = new Date()
const today = formatStandardDate(now)
const tomorrow = formatStandardDate(new Date(now.getTime() + oneDayInMs))
const yesterday = formatStandardDate(new Date(now.getTime() - oneDayInMs))
const nextMonth = formatStandardDate(
    new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
)
const lastMonth = formatStandardDate(
    new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
)

const startMonth = '2023-08'
const endMonth = '2024-07'

describe('time utils', () => {
    it('it should pad a number with zeroes', () => {
        expect(padWithZeroes(1)).toEqual('01')
        expect(padWithZeroes(10)).toEqual('10')
        expect(padWithZeroes(1, 3)).toEqual('001')
    })

    it('it should format a standard date', () => {
        const date = new Date(timestamp)
        expect(formatStandardDate(date)).toEqual('2024-08-06')
    })

    it('it should format a calendar date', () => {
        expect(formatCalendarDate(gregoryDate)).toEqual(gregoryDateString)
        expect(formatCalendarDate(nepaliDate)).toEqual(nepaliDateString)
        expect(formatCalendarDate(ethiopicDate)).toEqual(ethiopicDateString)
    })

    it('it should convert a standard date to a calendar date', () => {
        expect(
            toStandardDate(formatCalendarDate(gregoryDate), gregoryCalendar)
        ).toEqual(gregoryDateString)
        expect(
            toStandardDate(formatCalendarDate(nepaliDate), nepaliCalendar)
        ).toEqual(gregoryDateString)
        expect(
            toStandardDate(formatCalendarDate(ethiopicDate), ethiopicCalendar)
        ).toEqual(gregoryDateString)
    })

    it('it should convert a calendar date to a standard date', () => {
        expect(toStandardDate(gregoryDateString, gregoryCalendar)).toEqual(
            gregoryDateString
        )
        expect(
            toStandardDate(formatCalendarDate(nepaliDate), nepaliCalendar)
        ).toEqual(gregoryDateString)
        expect(
            toStandardDate(formatCalendarDate(ethiopicDate), ethiopicCalendar)
        ).toEqual(gregoryDateString)
    })

    it('it should get the gregory calendar date', () => {
        expect(getCalendarDate(gregoryCalendar)).toEqual(today)
        expect(getCalendarDate(gregoryCalendar, { days: 1 })).toEqual(tomorrow)
        expect(getCalendarDate(gregoryCalendar, { days: -1 })).toEqual(
            yesterday
        )
        expect(getCalendarDate(gregoryCalendar, { months: 1 })).toEqual(
            nextMonth
        )
        expect(getCalendarDate(gregoryCalendar, { months: -1 })).toEqual(
            lastMonth
        )
    })

    it('it should get the nepali calendar date', () => {
        expect(getCalendarDate(nepaliCalendar)).toEqual(
            fromStandardDate(today, nepaliCalendar)
        )
        expect(getCalendarDate(nepaliCalendar, { days: 1 })).toEqual(
            fromStandardDate(tomorrow, nepaliCalendar)
        )
        expect(getCalendarDate(nepaliCalendar, { days: -1 })).toEqual(
            fromStandardDate(yesterday, nepaliCalendar)
        )
    })

    it('it should get the ethiopic calendar date', () => {
        expect(getCalendarDate(ethiopicCalendar)).toEqual(
            fromStandardDate(today, ethiopicCalendar)
        )
        expect(getCalendarDate(ethiopicCalendar, { days: 1 })).toEqual(
            fromStandardDate(tomorrow, ethiopicCalendar)
        )
        expect(getCalendarDate(ethiopicCalendar, { days: -1 })).toEqual(
            fromStandardDate(yesterday, ethiopicCalendar)
        )
    })

    it('it should get the number of months between two dates', () => {
        expect(getNumberOfMonths(startMonth, endMonth)).toEqual(12)
    })

    it('it should get the number of days between two dates', () => {
        expect(getNumberOfDays(gregoryStartDate, gregoryEndDate)).toEqual(366)
    })

    it('it should convert a date string to a date object', () => {
        expect(toDateObject(gregoryDateString)).toEqual(gregoryDate)
        expect(toDateObject(nepaliDateString)).toEqual(nepaliDate)
        expect(toDateObject(ethiopicDateString)).toEqual(ethiopicDate)
    })

    it('it should extract the year from a date string', () => {
        expect(extractYear(gregoryDateString)).toEqual(2024)
        expect(extractYear(nepaliDateString)).toEqual(2081)
        expect(extractYear(ethiopicDateString)).toEqual(2016)
    })

    it('it should get the standard period from a calendar period', () => {
        expect(getStandardPeriod(gregoryPeriod)).toEqual({
            startTime: gregoryStartDate,
            endTime: gregoryEndDate,
            calendar: gregoryCalendar,
            periodType: DAILY,
        })

        expect(getStandardPeriod(nepaliPeriod)).toEqual({
            startTime: toStandardDate(nepaliStartDate, nepaliCalendar),
            endTime: toStandardDate(nepaliEndDate, nepaliCalendar),
            calendar: nepaliCalendar,
            periodType: DAILY,
        })

        expect(getStandardPeriod(ethiopicPeriod)).toEqual({
            startTime: toStandardDate(ethiopicStartDate, ethiopicCalendar),
            endTime: toStandardDate(ethiopicEndDate, ethiopicCalendar),
            calendar: ethiopicCalendar,
            periodType: DAILY,
        })
    })

    it('it should get the previous month subtracting lag time', () => {
        expect(getLastMonth(new Date('December 1, 2024'), 10)).toEqual([
            2024, 10,
        ])
        expect(getLastMonth(new Date('December 31, 2024'), 10)).toEqual([
            2024, 11,
        ])
        expect(getLastMonth(new Date('January 1, 2025'), 10)).toEqual([
            2024, 11,
        ])
        expect(getLastMonth(new Date('January 11, 2025'), 10)).toEqual([
            2024, 12,
        ])
        expect(getLastMonth(new Date('February 1, 2025'), 10)).toEqual([
            2024, 12,
        ])
        expect(getLastMonth(new Date('February 11, 2025'), 10)).toEqual([
            2025, 1,
        ])
    })

    it('it should create mapped gregory periods', () => {
        const mappedPeriods = getMappedPeriods(getPeriods(gregoryPeriod))

        expect(mappedPeriods.get(gregoryStartDate)).toEqual('20230801')
        expect(mappedPeriods.get(gregoryEndDate)).toEqual('20240731')
    })

    it('it should create mapped nepali periods', () => {
        const mappedPeriods = getMappedPeriods(
            getPeriods({
                ...gregoryPeriod,
                calendar: nepaliCalendar,
            })
        )

        expect(mappedPeriods.get(gregoryStartDate)).toEqual('20800416')
        expect(mappedPeriods.get(gregoryEndDate)).toEqual('20810416')
    })

    it('it should create mapped ethiopic periods', () => {
        const mappedPeriods = getMappedPeriods(
            getPeriods({
                ...gregoryPeriod,
                calendar: ethiopicCalendar,
            })
        )

        expect(mappedPeriods.get(gregoryStartDate)).toEqual('20151125')
        expect(mappedPeriods.get(gregoryEndDate)).toEqual('20161124')
    })

    it('it should validate a period object', () => {
        expect(isValidPeriod(gregoryPeriod)).toEqual(true)
        expect(isValidPeriod({})).toEqual(false)
        expect(
            isValidPeriod({
                startDate: gregoryEndDate,
                endDate: gregoryStartDate,
            })
        ).toEqual(false)
    })

    it('it should generate daily periods', () => {
        const periods = getPeriods(gregoryPeriod)
        expect(periods.length).toEqual(366)
        expect(periods[0].startDate).toEqual(gregoryStartDate)
        expect(periods[periods.length - 1].endDate).toEqual(gregoryEndDate)
    })

    it('it should generate weekly periods', () => {
        const periods = getPeriods({
            ...gregoryPeriod,
            periodType: WEEKLY,
        })
        expect(periods.length).toEqual(53)
    })

    it('it should generate monthly periods', () => {
        const periods = getPeriods({
            ...gregoryPeriod,
            periodType: MONTHLY,
        })
        expect(periods.length).toEqual(12)
    })
})
