import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { interpolate, roundTwoDecimals } from '../../../../utils/calc.js'
import {
    animation,
    vegetationCredits,
    getDailyPeriod,
} from '../../../../utils/chart.js'
import {
    addPeriodTimestamp,
    getMiddleTime,
    getPeriods,
} from '../../../../utils/time.js'

const getInterpolatedSeries = ({ periodType, period, data, band }) =>
    getPeriods({ ...period, periodType })
        .map(addPeriodTimestamp)
        .map((p) => {
            const value = interpolate(data, p.middleTime, band)
            return {
                x: p.middleTime,
                y: value !== null ? value * 0.0001 : null,
            }
        })

const getChartConfig = ({ name, data, band, period, periodType }) => {
    const series = [
        {
            type: 'line',
            data: data.map((d) => ({
                x: getMiddleTime(d),
                y: roundTwoDecimals(d[band] * 0.0001),
            })),
            name: '16-days',
            color: colors.green600,
            lineWidth: 3,
            zIndex: 2,
        },
    ]

    // Used to debug WEEKLY and MONTHLY interpolation
    if (periodType) {
        series.push({
            type: 'line',
            data: getInterpolatedSeries({
                periodType,
                period,
                data,
                band,
            }),
            name: periodType,
            color: '#555',
            lineWidth: 1,
            zIndex: 3,
        })
    }

    return {
        title: {
            text: i18n.t('{{name}}: {{band}} vegetation index 2024', {
                name,
                band,
                period: getDailyPeriod(data),
                nsSeparator: ';',
            }),
        },
        credits: vegetationCredits,
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C',
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 2592000000,
            labels: {
                format: '{value: %b}',
            },
        },
        yAxis: {
            title: false,
            min: 0,
            max: 1,
        },
        chart: {
            height: 480,
            marginBottom: 75,
        },
        plotOptions: {
            series: {
                animation,
            },
            column: {
                borderColor: null,
                pointPadding: 0,
                groupPadding: 0,
            },
        },
        series,
    }
}

export default getChartConfig
