import { useState, useMemo, useEffect } from 'react'
import { useNavigationType, useLocation, useParams } from 'react-router-dom'
import { referencePeriods } from '../components/explore/ReferencePeriodSelect.jsx'
import exploreStore from '../store/exploreStore.js'
import { MONTHLY } from '../utils/time.js'

const hasMonthlyAndDailyData = [
    'temperature',
    'precipitation',
    'humidity',
    'heat',
]

// Returns syncronized (uri/store) explore params
const useExploreUri = () => {
    const [isPop, setIsPop] = useState(false)
    const navigationType = useNavigationType()
    const { pathname } = useLocation()
    const params = useParams()
    const store = exploreStore()

    const path = pathname.split('/')
    const section = path[1]
    const tab = path[3]

    const uri = useMemo(() => {
        if (!isPop) {
            const {
                orgUnit,
                tab,
                periodType,
                monthlyPeriod,
                dailyPeriod,
                referencePeriod,
                month,
                vegetationIndex,
            } = store

            if (!orgUnit || !tab) {
                return null
            }

            const baseUri = `/${section}/${orgUnit.id}/${tab}`
            let uri

            if (tab === 'forecast10days' || tab === 'landcover') {
                uri = baseUri
            } else if (tab === 'vegetation') {
                uri = `${baseUri}/${vegetationIndex}`
            } else if (tab === 'climatechange' && month && referencePeriod) {
                uri = `${baseUri}/${month}/${referencePeriod.id}`
            } else if (hasMonthlyAndDailyData.includes(tab)) {
                if (
                    periodType === MONTHLY &&
                    monthlyPeriod &&
                    referencePeriod
                ) {
                    uri = `${baseUri}/monthly/${monthlyPeriod.startTime}/${
                        monthlyPeriod.endTime
                    }${tab !== 'heat' ? `/${referencePeriod.id}` : ''}`
                } else if (dailyPeriod) {
                    uri = `${baseUri}/daily/${dailyPeriod.startTime}/${dailyPeriod.endTime}`
                }
            }

            return uri
        }

        return null
    }, [store, section, isPop])

    useEffect(() => {
        setIsPop(navigationType === 'POP')
    }, [navigationType])

    useEffect(() => {
        if (isPop) {
            store.setTab(tab)

            const { month, startTime, endTime, referencePeriodId } = params

            if (tab === 'climatechange') {
                store.setMonth(Number(month))
            } else if (hasMonthlyAndDailyData.includes(tab)) {
                const periodType =
                    pathname.split('/')[4]?.toUpperCase() || MONTHLY
                store.setPeriodType(periodType)

                if (periodType === MONTHLY) {
                    store.setMonthlyPeriod({ startTime, endTime })
                } else if (periodType === 'DAILY') {
                    store.setDailyPeriod({ startTime, endTime })
                }
            }

            if (referencePeriodId) {
                store.setReferencePeriod(
                    referencePeriods.find((p) => p.id === referencePeriodId)
                )
            }
        }

        return () => {
            setIsPop(false)
        }
    }, [store, isPop, tab, params, pathname])

    return uri
}

export default useExploreUri
