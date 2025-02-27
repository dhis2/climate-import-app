import i18n from '@dhis2/d2-i18n'
import {
    kelvinToCelsius,
    getRelativeHumidity,
    roundOneDecimal,
    roundTwoDecimals,
} from '../utils/calc.js'
import { HOURLY, DAILY, MONTHLY, SIXTEEN_DAYS } from '../utils/time.js'

// kelvin to celsius with one decimal
const temperatureParser = (v) => roundOneDecimal(kelvinToCelsius(v)).toString()

const relativeHumidityParser = ([dewData, tempData]) =>
    tempData.map((temp, i) => ({
        ...temp,
        value: roundOneDecimal(
            getRelativeHumidity(
                kelvinToCelsius(temp.value),
                kelvinToCelsius(dewData[i].value)
            )
        ).toString(),
    }))

// meter to mm without scientific notation
// https://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
const precipitationParser = (v) =>
    (v * 1000).toLocaleString('fullwide', {
        useGrouping: false,
    })

const vegetationIndexParser = (v) => roundTwoDecimals(v * 0.0001).toString()

const twoDecimals = (v) => roundTwoDecimals(v).toString()

export const era5Resolution = i18n.t('Approximately 31 km (0.25°)')
export const era5LandResolution = i18n.t('Approximately 9 km (0.1°)')
export const chirpsResolution = i18n.t('Approximately 5 km (0.05°)')
export const modisResolution = i18n.t('Approximately 250 m')

export default [
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Air temperature (ERA5-Land)'),
        shortName: i18n.t('Air temperature'),
        description: i18n.t(
            'Average air temperature in °C at 2 m above the surface'
        ),
        resolution: era5LandResolution,
        periodType: DAILY,
        band: 'temperature_2m',
        reducer: 'mean',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'temperature_2m',
            periodType: HOURLY,
            periodReducer: 'mean',
        },
        valueParser: temperatureParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'ERA5_LAND_TEMPERATURE',
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_max',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Max air temperature (ERA5-Land)'),
        shortName: i18n.t('Max air temperature'),
        description: i18n.t(
            'Maximum air temperature in °C at 2 m above the surface'
        ),
        resolution: era5LandResolution,
        periodType: DAILY,
        band: 'temperature_2m_max',
        reducer: 'max',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'temperature_2m',
            periodType: 'hourly',
            periodReducer: 'max',
        },
        valueParser: temperatureParser,
        aggregationType: i18n.t('Max'),
        dataElementCode: 'ERA5_LAND_TEMPERATURE_MAX',
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_min',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Min temperature (ERA5-Land)'),
        shortName: i18n.t('Min air temperature'),
        description: i18n.t(
            'Minimum air temperature in °C at 2 m above the surface'
        ),
        resolution: era5LandResolution,
        periodType: DAILY,
        band: 'temperature_2m_min',
        reducer: 'min',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'temperature_2m',
            periodType: HOURLY,
            periodReducer: 'min',
        },
        valueParser: temperatureParser,
        aggregationType: i18n.t('Min'),
        dataElementCode: 'ERA5_LAND_TEMPERATURE_MIN',
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/total_precipitation_sum',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Precipitation (ERA5-Land)'),
        shortName: i18n.t('Precipitation (ERA5)'),
        description: i18n.t('Total precipitation in mm'),
        resolution: era5LandResolution,
        periodType: DAILY,
        band: 'total_precipitation_sum',
        reducer: 'mean',
        periodReducer: 'sum',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'total_precipitation',
            periodType: HOURLY,
            periodReducer: 'sum',
        },
        valueParser: precipitationParser,
        aggregationType: i18n.t('Sum'),
        dataElementCode: 'ERA5_LAND_PRECIPITATION',
    },
    {
        id: 'UCSB-CHG/CHIRPS/DAILY',
        datasetId: 'UCSB-CHG/CHIRPS/DAILY',
        name: i18n.t('Precipitation (CHIRPS)'),
        shortName: i18n.t('Precipitation (CHIRPS)'),
        description: i18n.t('Precipitation in mm'),
        resolution: chirpsResolution,
        periodType: DAILY,
        band: 'precipitation',
        reducer: 'mean',
        periodReducer: 'sum',
        valueParser: twoDecimals,
        aggregationType: i18n.t('Sum'),
        dataElementCode: 'CHIRPS_PRECIPITATION',
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/dewpoint_temperature_2m',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Dewpoint temperature (ERA5-Land)'),
        shortName: i18n.t('Dewpoint temperature'),
        description: i18n.t(
            'Temperature in °C at 2 m above the surface to which the air would have to be cooled for saturation to occur.'
        ),
        resolution: era5LandResolution,
        periodType: DAILY,
        band: 'dewpoint_temperature_2m',
        reducer: 'mean',
        timeZone: {
            datasetId: 'ECMWF/ERA5_LAND/HOURLY',
            band: 'dewpoint_temperature_2m',
            periodType: HOURLY,
            periodReducer: 'mean',
        },
        valueParser: temperatureParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'ERA5_LAND_DEWPOINT_TEMPERATURE',
    },
    {
        id: 'ECMWF/ERA5_LAND/DAILY_AGGR/relative_humidity_2m',
        datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
        name: i18n.t('Relative humidity (ERA5-Land)'),
        shortName: i18n.t('Relative humidity'),
        description: i18n.t(
            'Percentage of water vapor in the air compared to the total amount of vapor that can exist in the air at its current temperature. Calculated using air temperature and dewpoint temperature at 2 m above surface.'
        ),
        resolution: era5LandResolution,
        periodType: DAILY,
        bands: [
            {
                band: 'dewpoint_temperature_2m',
                reducer: 'mean',
                timeZone: {
                    datasetId: 'ECMWF/ERA5_LAND/HOURLY',
                    band: 'dewpoint_temperature_2m',
                    periodType: HOURLY,
                    periodReducer: 'mean',
                },
            },
            {
                band: 'temperature_2m',
                reducer: 'mean',
                timeZone: {
                    datasetId: 'ECMWF/ERA5_LAND/HOURLY',
                    band: 'temperature_2m',
                    periodType: HOURLY,
                    periodReducer: 'mean',
                },
            },
        ],
        bandsParser: relativeHumidityParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'ERA5_LAND_RELATIVE_HUMIDITY',
    },
    {
        id: 'projects/climate-engine-pro/assets/ce-era5-heat/utci_mean',
        datasetId: 'projects/climate-engine-pro/assets/ce-era5-heat',
        name: i18n.t('Heat stress (ERA5-HEAT)'),
        shortName: i18n.t('Heat stress'),
        description: i18n.t('Average felt temperature in °C'),
        resolution: era5Resolution,
        periodType: DAILY,
        band: 'utci_mean',
        reducer: 'mean',
        valueParser: temperatureParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'ERA5_HEAT_UTCI',
    },
    {
        id: 'projects/climate-engine-pro/assets/ce-era5-heat/utci_max',
        datasetId: 'projects/climate-engine-pro/assets/ce-era5-heat',
        name: i18n.t('Max heat stress (ERA5-HEAT)'),
        shortName: i18n.t('Max heat stress'),
        description: i18n.t('Maximum felt temperature in °C'),
        resolution: era5Resolution,
        periodType: DAILY,
        band: 'utci_max',
        reducer: 'max',
        valueParser: temperatureParser,
        aggregationType: i18n.t('Max'),
        dataElementCode: 'ERA5_HEAT_UTCI_MAX',
    },
    {
        id: 'projects/climate-engine-pro/assets/ce-era5-heat/utci_min',
        datasetId: 'projects/climate-engine-pro/assets/ce-era5-heat',
        name: i18n.t('Min heat stress (ERA5-HEAT)'),
        shortName: i18n.t('Min heat stress'),
        description: i18n.t('Minimum felt temperature in °C'),
        resolution: era5Resolution,
        periodType: DAILY,
        band: 'utci_min',
        reducer: 'min',
        valueParser: temperatureParser,
        aggregationType: i18n.t('Min'),
        dataElementCode: 'ERA5_HEAT_UTCI_MIN',
    },
    {
        id: 'MODIS/061/MOD13Q1/NDVI',
        datasetId: 'MODIS/061/MOD13Q1',
        name: i18n.t('NDVI - Normalized difference vegetation index (MODIS)'),
        shortName: i18n.t('NDVI'),
        description: i18n.t('NDVI is a measure of vegetation greenness'),
        resolution: modisResolution,
        periodType: SIXTEEN_DAYS,
        band: 'NDVI',
        reducer: 'mean',
        valueParser: vegetationIndexParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'MODIS_NDVI',
    },
    {
        id: 'MODIS/061/MOD13Q1/EVI',
        datasetId: 'MODIS/061/MOD13Q1',
        name: i18n.t('EVI - Enhanced vegetation index (MODIS)'),
        shortName: i18n.t('EVI'),
        description: i18n.t('EVI is a measure of vegetation greenness'),
        resolution: modisResolution,
        periodType: SIXTEEN_DAYS,
        band: 'EVI',
        reducer: 'mean',
        valueParser: vegetationIndexParser,
        aggregationType: i18n.t('Average'),
        dataElementCode: 'MODIS_EVI',
    },
]

const era5band = [
    'temperature_2m',
    'temperature_2m_min',
    'temperature_2m_max',
    'dewpoint_temperature_2m',
    'total_precipitation_sum',
]

export const era5Daily = {
    datasetId: 'ECMWF/ERA5_LAND/DAILY_AGGR',
    band: era5band,
    // reducer: ["mean", "min", "max", "mean", "mean"],
    reducer: 'mean', // Use mean to reduce outlier effect
    resolution: era5LandResolution,
}

export const era5Monthly = {
    datasetId: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    band: era5band,
    resolution: era5LandResolution,
}

export const era5MonthlyNormals = {
    datasetId: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    band: [
        'temperature_2m',
        'dewpoint_temperature_2m',
        'total_precipitation_sum',
    ],
    resolution: era5LandResolution,
}

export const era5MonthlyTemperatures = {
    datasetId: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    band: ['temperature_2m'],
    resolution: era5LandResolution,
}

export const era5HeatDaily = {
    datasetId: 'projects/climate-engine-pro/assets/ce-era5-heat',
    band: ['utci_mean', 'utci_min', 'utci_max'],
    reducer: ['mean', 'min', 'max'],
    periodType: 'daily',
    resolution: era5Resolution,
}

export const era5HeatMonthly = {
    ...era5HeatDaily,
    aggregationPeriod: MONTHLY,
}

export const dhisDataSets = [
    {
        name: i18n.t('Climate/Weather'),
        shortName: i18n.t('Climate/Weather'),
        periodType: i18n.t('Daily'),
    },
    {
        name: i18n.t('Environment'),
        shortName: i18n.t('Environment'),
        periodType: i18n.t('Weekly or Monthly'),
    },
]

export const dhisDataElementGroups = [
    {
        name: i18n.t('Climate/Weather'),
        shortName: i18n.t('Climate/Weather'),
        dataElements: i18n.t('Assign above data elements (weather & climate)'),
    },
    {
        name: i18n.t('Environment'),
        shortName: i18n.t('Environment'),
        dataElements: i18n.t('Assign above data elements (vegetation)'),
    },
]
