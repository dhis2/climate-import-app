import { useState, useEffect } from 'react'
import { getTimeSeriesData, getCacheKey } from '../utils/ee-utils.js'
import useEarthEngine from './useEarthEngine.js'

const getPeriodFromId = (id) => {
    const year = id.slice(0, 4)
    const month = id.includes('_') ? id.slice(5, 7) : id.slice(4, 6)
    const day = id.includes('_') ? id.slice(8, 10) : id.slice(6, 8)

    return `${year}-${month}${day ? `-${day}` : ''}`
}

const parseIds = (data) =>
    data.map((d) => ({ ...d, id: getPeriodFromId(d.id) }))

const cachedPromise = {}

const useEarthEngineTimeSeries = ({ dataset, period, feature, filter }) => {
    const [data, setData] = useState()
    const eePromise = useEarthEngine()

    useEffect(() => {
        let canceled = false

        if (dataset && period && feature) {
            const key = getCacheKey({ dataset, period, feature, filter })
            const { geometry } = feature

            if (cachedPromise[key]) {
                cachedPromise[key].then((data) => {
                    if (!canceled) {
                        setData(data)
                    }
                })

                return () => {
                    canceled = true
                }
            }

            setData()
            eePromise.then((ee) => {
                cachedPromise[key] = getTimeSeriesData({
                    ee,
                    dataset,
                    period,
                    geometry,
                    filter,
                }).then(parseIds)

                cachedPromise[key].then((data) => {
                    if (!canceled) {
                        setData(data)
                    }
                })
            })

            return () => {
                canceled = true
            }
        }
    }, [eePromise, dataset, period, feature, filter])

    return data
}

export default useEarthEngineTimeSeries
