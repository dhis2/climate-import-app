import { getMiddleTime } from './time.js'

// Based on: https://bmcnoldy.earth.miami.edu/Humidity.html
export const getRelativeHumidity = (temperature, dewpoint) =>
    (100 * Math.exp((17.625 * dewpoint) / (243.04 + dewpoint))) /
    Math.exp((17.625 * temperature) / (243.04 + temperature))

export const roundOneDecimal = (v) => Math.round(v * 10) / 10

export const roundTwoDecimals = (v) => Math.round(v * 100) / 100

export const kelvinToCelsius = (k) => k - 273.15

export const toCelcius = (k) => roundOneDecimal(kelvinToCelsius(k))

export const getTimeFromId = (id) => new Date(id).getTime()

export const metersToMillimeters = (m) => roundOneDecimal(m * 1000)

// periods needs to be sorted by time
export const interpolate = (periods, targetTime, band = 'value') => {
    let lower = null
    let upper = null

    // Find the two periods surrounding the targetTime
    for (let i = 0; i < periods.length; i++) {
        const period = periods[i]
        const middleTime = period.middleTime || getMiddleTime(period)

        if (middleTime <= targetTime) {
            lower = period
        }
        if (middleTime >= targetTime && !upper) {
            upper = period
            break
        }
    }

    // If no periods found, return null
    if (!lower || !upper) {
        return null
    }

    // Perform linear interpolation
    const t1 = lower.middleTime || getMiddleTime(lower)
    const t2 = upper.middleTime || getMiddleTime(upper)
    const y1 = lower[band]
    const y2 = upper[band]

    // Interpolated value at targetTime
    return y1 + ((targetTime - t1) / (t2 - t1)) * (y2 - y1)
}
