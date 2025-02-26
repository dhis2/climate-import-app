import i18n from '@dhis2/d2-i18n'

const getYearPeriod = (startYear, endYear) =>
    `${startYear}${endYear !== startYear ? `-${endYear}` : ''}`

export const animation = {
    duration: 300,
}

// Date fromat YYYY-MM
export const getYearFromId = (id) => id.substring(0, 4)
export const getMonthFromId = (id) => Number(id.substring(5, 7))

export const getSelectedMonths = (data, { startTime, endTime }) =>
    data.filter((d) => d.id >= startTime && d.id <= endTime)

export const getMonthlyPeriod = (data) => {
    const startMonth = data[0].id
    const endMonth = data[data.length - 1].id
    const startYear = startMonth.substring(0, 4)
    const endYear = endMonth.substring(0, 4)
    return getYearPeriod(startYear, endYear)
}

export const getDailyPeriod = (data) => {
    const firstYear = data[0].id.substring(0, 4)
    const lastYear = data[data.length - 1].id.substring(0, 4)
    return getYearPeriod(firstYear, lastYear)
}

export const strokePattern = {
    pattern: {
        color: 'rgba(0,0,0,.2)',
        path: 'M -5 15 L 15 -5M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2',
        width: 4,
        height: 4,
    },
}

export const credits = {
    href: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-land',
    text: i18n.t(
        'ERA5-Land / Copernicus Climate Change Service / Google Earth Engine'
    ),
}

export const heatCredits = {
    href: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/derived-utci-historical',
    text: i18n.t(
        'ERA5-HEAT / Copernicus Climate Change Service / Google Earth Engine'
    ),
}

export const vegetationCredits = {
    href: 'https://lpdaac.usgs.gov/products/mod13q1v061/',
    text: i18n.t('NASA LP DAAC at the USGS EROS Center / Google Earth Engine'),
}

export const landCoverCredits = {
    href: 'https://lpdaac.usgs.gov/products/mcd12q1v061/',
    text: i18n.t('NASA LP DAAC at the USGS EROS Center / Google Earth Engine'),
}
