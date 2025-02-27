import { create } from 'zustand'
import { NDVI } from '../components/explore/land/VegetationIndexSelect.jsx'
import { defaultReferencePeriod } from '../components/explore/ReferencePeriodSelect.jsx'
import {
    getDefaultMonthlyPeriod,
    getDefaultExplorePeriod,
    getLastMonth,
    MONTHLY,
} from '../utils/time.js'

const exploreStore = create((set) => ({
    orgUnit: null,
    tab: null,
    periodType: MONTHLY,
    dailyPeriod: getDefaultExplorePeriod(),
    monthlyPeriod: getDefaultMonthlyPeriod(),
    referencePeriod: defaultReferencePeriod,
    month: getLastMonth()[1],
    vegetationIndex: NDVI,
    setOrgUnit: (orgUnit) => set({ orgUnit }),
    setTab: (tab) => set({ tab }),
    setPeriodType: (periodType) => set({ periodType }),
    setDailyPeriod: (dailyPeriod) => set({ dailyPeriod }),
    setMonthlyPeriod: (monthlyPeriod) => set({ monthlyPeriod }),
    setReferencePeriod: (referencePeriod) => set({ referencePeriod }),
    setMonth: (month) => set({ month }),
    setVegetationIndex: (vegetationIndex) => set({ vegetationIndex }),
}))

export default exploreStore
