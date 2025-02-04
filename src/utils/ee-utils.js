import i18n from '@dhis2/d2-i18n'
import area from '@turf/area'
import { HOURLY, DAILY, MONTHLY, getMappedPeriods, getPeriods } from './time.js'

const VALUE_LIMIT = 5000

// Returns the linear scale in meters of the units of this projection
export const getScale = (image) => image.select(0).projection().nominalScale()

// Makes evaluate a promise
export const getInfo = (instance) =>
    new Promise((resolve, reject) =>
        instance.evaluate((data, error) => {
            if (error) {
                reject(error)
            } else {
                resolve(data)
            }
        })
    )

// Reduce a feature collection to array of objects with id and properties
export const getFeatureCollectionPropertiesArray = (data) =>
    data.features.map((f) => ({
        id: f.id,
        ...f.properties,
    }))

export const cleanData = (data) =>
    data.map((f) => ({
        id: f.id.substring(9),
        date: f.id.slice(0, 8),
        value: f.properties.value,
    }))

const getReducedCollection = ({
    ee,
    collection,
    startDate,
    endDate,
    reducer,
}) =>
    collection
        .filter(ee.Filter.date(startDate, endDate))
        [reducer]()
        .set('system:index', startDate.format('YYYYMMdd'))
        .set('system:time_start', startDate.millis())
        .set('system:time_end', endDate.millis())

export const getEarthEngineValues = ({
    ee,
    dataset: datasetParams,
    period,
    features,
}) =>
    new Promise(async (resolve, reject) => {
        const dataset = period.timeZone
            ? { ...datasetParams, ...datasetParams.timeZone }
            : datasetParams

        const {
            datasetId,
            band,
            reducer = 'mean',
            periodType: datasetPeriodType,
            periodReducer = reducer,
            valueParser,
        } = dataset

        const {
            startTime,
            endTime,
            timeZone = 'UTC',
            periodType,
            calendar,
        } = period

        const periods = getPeriods(period)
        const endTimePlusOne = ee.Date(endTime).advance(1, 'day')
        const timeZoneStart = ee.Date(startTime).format(null, timeZone)
        const timeZoneEnd = endTimePlusOne.format(null, timeZone)
        const mappedPeriods = getMappedPeriods(periods, calendar)

        const dataParser = (data) =>
            data.map((f) => ({
                ...f.properties,
                period: mappedPeriods.get(f.properties.period),
                value: valueParser
                    ? valueParser(f.properties.value)
                    : f.properties.value,
            }))

        let collection = ee
            .ImageCollection(datasetId)
            .select(band)
            .filter(ee.Filter.date(timeZoneStart, timeZoneEnd))

        const imageCount = await getInfo(collection.size())

        if (imageCount === 0) {
            reject(new Error(i18n.t('No data found for the selected period')))
        }

        let eeScale = getScale(collection.first())

        if (reducer === 'min' || reducer === 'max') {
            // ReduceRegions with min/max reducer may fail if the features are smaller than the pixel area
            // https://stackoverflow.com/questions/59774022/reduce-regions-some-features-dont-contains-centroid-of-pixel-in-consecuence-ex

            const scale = await getInfo(eeScale)

            const minArea = Math.min(
                ...features
                    .filter((f) => f.geometry.type.includes('Polygon'))
                    .map(area)
            )

            if (minArea < scale * scale) {
                eeScale = Math.sqrt(minArea) / 2
            }
        }

        const featureCollection = ee.FeatureCollection(features)

        const eeReducer = ee.Reducer[reducer]()

        if (periodType !== datasetPeriodType) {
            // Filter images with data
            const imagesWithData = ee.Filter.listContains(
                'system:band_names',
                band
            )

            // Go from hourly to daily
            if (datasetPeriodType === HOURLY) {
                const days = ee
                    .Date(timeZoneEnd)
                    .difference(ee.Date(timeZoneStart), 'days')

                const daysList = ee.List.sequence(0, days.subtract(1))

                collection = ee.ImageCollection.fromImages(
                    daysList.map((day) => {
                        const startUTC = ee.Date(startTime).advance(day, 'days')
                        const startDate = ee.Date(
                            startUTC.format(null, timeZone)
                        )
                        const endDate = startDate.advance(1, 'days')

                        return getReducedCollection({
                            ee,
                            collection,
                            startDate,
                            endDate,
                            reducer: periodReducer,
                        })
                    })
                ).filter(imagesWithData)
            }

            // Go from daily to period type (weekly or monthly)
            if (periodType !== DAILY) {
                const periodList = ee.List(periods)

                collection = ee.ImageCollection.fromImages(
                    periodList.map((item) => {
                        const period = ee.Dictionary(item)
                        const startDate = ee.Date(period.get('startDate'))
                        const endDate = ee
                            .Date(period.get('endDate'))
                            .advance(1, 'day')

                        return getReducedCollection({
                            ee,
                            collection,
                            startDate,
                            endDate,
                            reducer: periodReducer,
                        })
                    })
                ).filter(imagesWithData)
            }
        }

        // Aggregate data for each feature
        const reduced = collection
            .map((image) =>
                image
                    .reduceRegions({
                        collection: featureCollection,
                        reducer: eeReducer,
                        scale: eeScale,
                    })
                    .map((feature) =>
                        ee.Feature(null, {
                            ou: feature.get('id'),
                            period: image.date().format('YYYY-MM-dd'),
                            value: feature.get(reducer),
                        })
                    )
            )
            .flatten()

        const valueCollection = ee.FeatureCollection(reduced)

        const valueCount = await getInfo(valueCollection.size())

        if (valueCount <= VALUE_LIMIT) {
            return getInfo(valueCollection.toList(VALUE_LIMIT))
                .then(dataParser)
                .then(resolve)
        } else {
            const chunks = Math.ceil(valueCount / VALUE_LIMIT)

            return Promise.all(
                Array.from({ length: chunks }, (_, chunk) =>
                    getInfo(
                        valueCollection.toList(VALUE_LIMIT, chunk * VALUE_LIMIT)
                    )
                )
            )
                .then((data) => [].concat(...data))
                .then(dataParser)
                .then(resolve)
        }
    })

export const getEarthEngineData = ({ ee, dataset, period, features }) => {
    if (dataset.bands) {
        // Multiple bands (used for relative humidity)
        const { bandsParser = (v) => v } = dataset

        return Promise.all(
            dataset.bands.map((band) =>
                getEarthEngineValues({
                    ee,
                    dataset: { ...dataset, ...band },
                    period,
                    features,
                })
            )
        ).then(bandsParser)
    } else {
        return getEarthEngineValues({ ee, dataset, period, features })
    }
}

export const getTimeSeriesData = async ({
    ee,
    dataset,
    period,
    geometry,
    filter,
}) => {
    const {
        datasetId,
        band,
        reducer = 'mean',
        sharedInputs = false,
        aggregationPeriod,
    } = dataset

    let collection = ee.ImageCollection(datasetId).select(band)

    if (Array.isArray(filter)) {
        filter.forEach((f) => {
            if (ee.Filter[f.type]) {
                collection = collection.filter(
                    ee.Filter[f.type].apply(this, f.arguments)
                )
            }
        })
    }

    let eeReducer

    if (Array.isArray(reducer)) {
        // Combine multiple reducers
        // sharedInputs = true means that all reducers are applied to all bands
        // sharedInouts = false means one reducer for each band
        eeReducer = reducer.reduce(
            (r, t, i) =>
                i === 0
                    ? r[t]().unweighted()
                    : r.combine({
                          reducer2: ee.Reducer[t]().unweighted(),
                          outputPrefix: sharedInputs ? '' : String(i),
                          sharedInputs,
                      }),
            ee.Reducer
        )

        if (!sharedInputs && Array.isArray(band)) {
            // Use band names as output names
            eeReducer = eeReducer.setOutputs(band)
        }
    } else {
        // Single reducer
        eeReducer = ee.Reducer[reducer]()
    }

    const { startTime, endTime, timeZone = 'UTC' } = period

    if (aggregationPeriod === MONTHLY) {
        const startMonth = ee.Date(startTime)
        const endMonth = ee.Date(endTime).advance(1, 'month') // Include last month

        collection = collection.filter(ee.Filter.date(startMonth, endMonth))

        const monthCount = endMonth.difference(startMonth, 'month').round()
        const months = ee.List.sequence(0, monthCount.subtract(1))
        const dates = months.map((month) => startMonth.advance(month, 'month'))

        const byMonth = ee.ImageCollection.fromImages(
            dates.map((date) => {
                const startDate = ee.Date(date)
                const endDate = startDate.advance(1, 'month')

                return collection
                    .filter(ee.Filter.date(startDate, endDate))
                    .mean() // Use mean to avoid extremes on monthly chart
                    .set('system:index', startDate.format('YYYYMM'))
                    .set('system:time_start', startDate.millis())
                    .set('system:time_end', endDate.millis())
            })
        )

        collection = byMonth
    } else {
        const endTimePlusOne = ee.Date(endTime).advance(1, 'day')
        const timeZoneStart = ee.Date(startTime).format(null, timeZone)
        const timeZoneEnd = endTimePlusOne.format(null, timeZone)

        collection = collection.filter(
            ee.Filter.date(timeZoneStart, timeZoneEnd)
        )
    }

    let eeScale = getScale(collection.first())

    const { type, coordinates } = geometry

    if (type.includes('Polygon')) {
        // unweighted reducer may fail if the features are smaller than the pixel area
        const scale = await getInfo(eeScale)
        const orgUnitArea = area(geometry)

        if (orgUnitArea < scale * scale) {
            eeScale = Math.sqrt(orgUnitArea) / 2
        }
    }

    const eeGeometry = ee.Geometry[type](coordinates)

    // Returns a time series array of objects
    return getInfo(
        ee.FeatureCollection(
            collection.map((image) =>
                ee
                    .Feature(
                        null,
                        image.reduceRegion(eeReducer, eeGeometry, eeScale)
                    )
                    .set('system:index', image.get('system:index'))
            )
        )
    ).then(getFeatureCollectionPropertiesArray)
}

export const getClimateNormals = ({ ee, dataset, period, geometry }) => {
    const { datasetId, band } = dataset
    const { startTime, endTime } = period
    const { type, coordinates } = geometry
    const eeGeometry = ee.Geometry[type](coordinates)

    const collection = ee
        .ImageCollection(datasetId)
        .select(band)
        .filterDate(`${startTime}-01-01`, `${endTime + 1}-01-01`)

    const byMonth = ee.ImageCollection.fromImages(
        ee.List.sequence(1, 12).map((month) =>
            collection
                .filter(ee.Filter.calendarRange(month, null, 'month'))
                .mean()
                .set('system:index', ee.Number(month).format('%02d'))
        )
    )

    const eeScale =
        type === 'Point' ? ee.Number(1) : getScale(collection.first())

    const eeReducer = ee.Reducer.mean()

    const data = ee.FeatureCollection(
        byMonth.map((image) =>
            ee
                .Feature(
                    null,
                    image.reduceRegion(eeReducer, eeGeometry, eeScale)
                )
                .set('system:index', image.get('system:index'))
        )
    )

    return getInfo(data).then(getFeatureCollectionPropertiesArray)
}

const getKeyFromFilter = (filter) =>
    filter
        ? `-${filter
              .map((f) => `${f.type}-${f.arguments.join('-')}`)
              .join('-')}`
        : ''

export const getCacheKey = ({ dataset, period, feature, filter }) => {
    const { datasetId, band } = dataset
    const { startTime, endTime } = period
    const { id } = feature
    const bandkey = Array.isArray(band) ? band.join('-') : band
    const filterKey = getKeyFromFilter(filter)

    return `${id}-${datasetId}-${bandkey}-${startTime}-${endTime}${filterKey}`
}
