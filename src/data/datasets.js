import i18n from "@dhis2/d2-i18n";
import {
  kelvinToCelsius,
  getRelativeHumidity,
  roundOneDecimal,
} from "../utils/calc";
import { HOURLY, MONTHLY } from "../utils/time";

// kelvin to celsius with one decimal
const temperatureParser = (v) => roundOneDecimal(kelvinToCelsius(v));

const relativeHumidityParser = ([dewData, tempData]) =>
  tempData.map((temp, i) => ({
    ...temp,
    value: roundOneDecimal(
      getRelativeHumidity(
        kelvinToCelsius(temp.value),
        kelvinToCelsius(dewData[i].value)
      )
    ),
  }));

// meter to mm without scientific notation
// https://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
const precipitationParser = (v) =>
  (v * 1000).toLocaleString("fullwide", {
    useGrouping: false,
  });

export const era5Resolution = i18n.t("Approximately 31 km (0.25°)");
export const era5LandResolution = i18n.t("Approximately 9 km (0.1°)");
export const chirpsResolution = i18n.t("Approximately 5 km (0.05°)");

export default [
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Air temperature (ERA5-Land)"),
    shortName: i18n.t("Air temperature"),
    description: i18n.t(
      "Average air temperature in °C at 2 m above the surface"
    ),
    resolution: era5LandResolution,
    band: "temperature_2m",
    reducer: "mean",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "temperature_2m",
      periodType: HOURLY,
      periodReducer: "mean",
    },
    valueParser: temperatureParser,
    aggregationType: i18n.t("Average"),
    dataElementCode: "ERA5_LAND_TEMPERATURE",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_max",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Max air temperature (ERA5-Land)"),
    shortName: i18n.t("Max air temperature"),
    description: i18n.t(
      "Maximum air temperature in °C at 2 m above the surface"
    ),
    resolution: era5LandResolution,
    band: "temperature_2m_max",
    reducer: "max",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "temperature_2m",
      periodType: "hourly",
      periodReducer: "max",
    },
    valueParser: temperatureParser,
    aggregationType: i18n.t("Max"),
    dataElementCode: "ERA5_LAND_TEMPERATURE_MAX",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/temperature_2m_min",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Min temperature (ERA5-Land)"),
    shortName: i18n.t("Min air temperature"),
    description: i18n.t(
      "Minimum air temperature in °C at 2 m above the surface"
    ),
    resolution: era5LandResolution,
    band: "temperature_2m_min",
    reducer: "min",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "temperature_2m",
      periodType: HOURLY,
      periodReducer: "min",
    },
    valueParser: temperatureParser,
    aggregationType: i18n.t("Min"),
    dataElementCode: "ERA5_LAND_TEMPERATURE_MIN",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/total_precipitation_sum",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Precipitation (ERA5-Land)"),
    shortName: i18n.t("Precipitation (ERA5)"),
    description: i18n.t("Total precipitation in mm"),
    resolution: era5LandResolution,
    band: "total_precipitation_sum",
    reducer: "mean",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "total_precipitation",
      periodType: HOURLY,
      periodReducer: "sum",
    },
    valueParser: precipitationParser,
    aggregationType: i18n.t("Sum"),
    dataElementCode: "ERA5_LAND_PRECIPITATION",
  },
  {
    id: "UCSB-CHG/CHIRPS/DAILY",
    datasetId: "UCSB-CHG/CHIRPS/DAILY",
    name: i18n.t("Precipitation (CHIRPS)"),
    shortName: i18n.t("Precipitation (CHIRPS)"),
    description: i18n.t("Precipitation in mm"),
    resolution: chirpsResolution,
    band: "precipitation",
    reducer: "mean",
    aggregationType: i18n.t("Sum"),
    dataElementCode: "CHIRPS_PRECIPITATION",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/dewpoint_temperature_2m",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Dewpoint temperature (ERA5-Land)"),
    shortName: i18n.t("Dewpoint temperature"),
    description: i18n.t(
      "Temperature in °C at 2 m above the surface to which the air would have to be cooled for saturation to occur."
    ),
    resolution: era5LandResolution,
    band: "dewpoint_temperature_2m",
    reducer: "mean",
    timeZone: {
      datasetId: "ECMWF/ERA5_LAND/HOURLY",
      band: "dewpoint_temperature_2m",
      periodType: HOURLY,
      periodReducer: "mean",
    },
    valueParser: temperatureParser,
    aggregationType: i18n.t("Average"),
    dataElementCode: "ERA5_LAND_DEWPOINT_TEMPERATURE",
  },
  {
    id: "ECMWF/ERA5_LAND/DAILY_AGGR/relative_humidity_2m",
    datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
    name: i18n.t("Relative humidity (ERA5-Land)"),
    shortName: i18n.t("Relative humidity"),
    description: i18n.t(
      "Percentage of water vapor in the air compared to the total amount of vapor that can exist in the air at its current temperature. Calculated using air temperature and dewpoint temperature at 2 m above surface."
    ),
    resolution: era5LandResolution,
    bands: [
      {
        band: "dewpoint_temperature_2m",
        reducer: "mean",
        timeZone: {
          datasetId: "ECMWF/ERA5_LAND/HOURLY",
          band: "dewpoint_temperature_2m",
          periodType: HOURLY,
          periodReducer: "mean",
        },
      },
      {
        band: "temperature_2m",
        reducer: "mean",
        timeZone: {
          datasetId: "ECMWF/ERA5_LAND/HOURLY",
          band: "temperature_2m",
          periodType: HOURLY,
          periodReducer: "mean",
        },
      },
    ],
    bandsParser: relativeHumidityParser,
    aggregationType: i18n.t("Average"),
    dataElementCode: "ERA5_LAND_RELATIVE_HUMIDITY",
  },
  // {
  //   id: "Local Min Tempreture",
  //   datasetId: "Local_Data",
  //   tag : 'min temp',
  //   name: i18n.t("Local Min Tempreture (Land)"),
  //   shortName: i18n.t("Air temperature"),
  //   description: i18n.t(
  //     "Average local  max observed air temperature in °C"
  //   ),
  //   aggregationType: i18n.t("Min"),
  //   dataElementCode: "LOCAL_TEMPERATURE_MAX",
  // },
  // {
  //   id: "Local Max Tempreture",
  //   datasetId: "Local_Data",
  //   tag : 'max temp',
  //   name: i18n.t("Local Max Tempreture (Land)"),
  //   shortName: i18n.t("Air temperature"),
  //   description: i18n.t(
  //     "Average local min observed air temperature in °C"
  //   ),
  //   aggregationType: i18n.t("Min"),
  //   dataElementCode: "LOCAL_TEMPERATURE_MIN",
  //   },
  {
    id: "Local Precipitation",
    datasetId: "Local_Data",
    tag : 'Rainfall',
    name: i18n.t("Local Precipitation "),
    shortName: i18n.t("Precipitation"),
    description: i18n.t(
      "Precipitation received in mm"
    ),
    aggregationType: i18n.t("Average"),
    dataElementCode: "LOCAL_TEMPERATURE_MAX",
  }
  {
    id: "projects/climate-engine-pro/assets/ce-era5-heat/utci_mean",
    datasetId: "projects/climate-engine-pro/assets/ce-era5-heat",
    name: i18n.t("Heat stress (ERA5-HEAT)"),
    shortName: i18n.t("Heat stress"),
    description: i18n.t("Average felt temperature in °C"),
    resolution: era5Resolution,
    band: "utci_mean",
    reducer: "mean",
    valueParser: temperatureParser,
    aggregationType: i18n.t("Average"),
    dataElementCode: "ERA5_HEAT_UTCI",
  },
  {
    id: "projects/climate-engine-pro/assets/ce-era5-heat/utci_max",
    datasetId: "projects/climate-engine-pro/assets/ce-era5-heat",
    name: i18n.t("Max heat stress (ERA5-HEAT)"),
    shortName: i18n.t("Max heat stress"),
    description: i18n.t("Maximum felt temperature in °C"),
    resolution: era5Resolution,
    band: "utci_max",
    reducer: "max",
    valueParser: temperatureParser,
    aggregationType: i18n.t("Max"),
    dataElementCode: "ERA5_HEAT_UTCI_MAX",
  },
  {
    id: "projects/climate-engine-pro/assets/ce-era5-heat/utci_min",
    datasetId: "projects/climate-engine-pro/assets/ce-era5-heat",
    name: i18n.t("Min heat stress (ERA5-HEAT)"),
    shortName: i18n.t("Min heat stress"),
    description: i18n.t("Minimum felt temperature in °C"),
    resolution: era5Resolution,
    band: "utci_min",
    reducer: "min",
    valueParser: temperatureParser,
    aggregationType: i18n.t("Min"),
    dataElementCode: "ERA5_HEAT_UTCI_MIN",
  },
];

const era5band = [
  "temperature_2m",
  "temperature_2m_min",
  "temperature_2m_max",
  "dewpoint_temperature_2m",
  "total_precipitation_sum",
];

export const era5Daily = {
  datasetId: "ECMWF/ERA5_LAND/DAILY_AGGR",
  band: era5band,
  // reducer: ["mean", "min", "max", "mean", "mean"],
  reducer: "mean", // Use mean to reduce outlier effect
  resolution: era5LandResolution,
};

export const era5Monthly = {
  datasetId: "ECMWF/ERA5_LAND/MONTHLY_AGGR",
  band: era5band,
  resolution: era5LandResolution,
};

export const era5MonthlyNormals = {
  datasetId: "ECMWF/ERA5_LAND/MONTHLY_AGGR",
  band: [
    "temperature_2m",
    "dewpoint_temperature_2m",
    "total_precipitation_sum",
  ],
  resolution: era5LandResolution,
};

export const era5MonthlyTemperatures = {
  datasetId: "ECMWF/ERA5_LAND/MONTHLY_AGGR",
  band: ["temperature_2m"],
  resolution: era5LandResolution,
};

export const era5HeatDaily = {
  datasetId: "projects/climate-engine-pro/assets/ce-era5-heat",
  band: ["utci_mean", "utci_min", "utci_max"],
  reducer: ["mean", "min", "max"],
  periodType: "daily",
  resolution: era5Resolution,
};

export const era5HeatMonthly = {
  ...era5HeatDaily,
  aggregationPeriod: MONTHLY,
};
