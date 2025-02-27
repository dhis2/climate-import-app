import { useDataEngine } from '@dhis2/app-runtime'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import checkPlaceLoader from '../utils/checkPlaceLoader.js'
import orgUnitLoader from '../utils/orgUnitLoader.js'
import AboutPage from './AboutPage.jsx'
import CheckPage from './check/CheckPage.jsx'
import ErrorPage from './ErrorPage.jsx'
import ClimateChange from './explore/climateChange/ClimateChange.jsx'
import ExplorePage from './explore/ExplorePage.jsx'
import Forecast from './explore/forecast/Forecast.jsx'
import HeatDaily from './explore/heat/HeatDaily.jsx'
import HeatMonthly from './explore/heat/HeatMonthly.jsx'
import HumidityDaily from './explore/humidity/HumidityDaily.jsx'
import HumidityMonthly from './explore/humidity/HumidityMonthly.jsx'
import Vegetation from './explore/land/Vegetation.jsx'
import OrgUnit from './explore/OrgUnit.jsx'
import PrecipitationDaily from './explore/precipitation/PrecipitationDaily.jsx'
import PrecipitationMonthly from './explore/precipitation/PrecipitationMonthly.jsx'
import Tabs from './explore/Tabs.jsx'
import TemperatureDaily from './explore/temperature/TemperatureDaily.jsx'
import TemperatureMonthly from './explore/temperature/TemperatureMonthly.jsx'
import ImportPage from './import/ImportPage.jsx'
import Root from './Root.jsx'
import SettingsPage from './settings/SettingsPage.jsx'
import SetupPage from './setup/SetupPage.jsx'

const monthlyPath = 'monthly/:startTime/:endTime/:referencePeriodId'
const dailyPath = 'daily/:startTime/:endTime'

// Shared routes for explore and check sections
const tabRoutes = [
    {
        path: 'forecast10days',
        element: <Tabs />,
        children: [
            {
                index: true,
                element: <Forecast />,
            },
        ],
    },
    {
        path: 'temperature',
        element: <Tabs />,
        children: [
            {
                path: monthlyPath,
                element: <TemperatureMonthly />,
            },
            {
                path: dailyPath,
                element: <TemperatureDaily />,
            },
        ],
    },
    {
        path: 'precipitation',
        element: <Tabs />,
        children: [
            {
                path: monthlyPath,
                element: <PrecipitationMonthly />,
            },
            {
                path: dailyPath,
                element: <PrecipitationDaily />,
            },
        ],
    },
    {
        path: 'humidity',
        element: <Tabs />,
        children: [
            {
                path: monthlyPath,
                element: <HumidityMonthly />,
            },
            {
                path: dailyPath,
                element: <HumidityDaily />,
            },
        ],
    },
    {
        path: 'heat',
        element: <Tabs />,
        children: [
            {
                path: 'monthly/:startTime/:endTime',
                element: <HeatMonthly />,
            },
            {
                path: dailyPath,
                element: <HeatDaily />,
            },
        ],
    },
    {
        path: 'climatechange',
        element: <Tabs />,
        children: [
            {
                path: ':month/:referencePeriodId',
                element: <ClimateChange />,
            },
        ],
    },
    {
        path: 'vegetation',
        element: <Tabs />,
        children: [
            {
                path: ':vegetationIndex',
                element: <Vegetation />,
            },
        ],
    },
]

const Routes = () => {
    const engine = useDataEngine()

    const router = createHashRouter([
        {
            path: '/',
            element: <Root />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: '/',
                    element: <AboutPage />,
                },
                {
                    path: 'explore',
                    children: [
                        {
                            index: true,
                            element: <ExplorePage />,
                        },
                        {
                            path: ':orgUnitId',
                            element: <OrgUnit />,
                            loader: orgUnitLoader(engine),
                            children: tabRoutes,
                        },
                    ],
                },
                {
                    path: 'check',
                    children: [
                        {
                            index: true,
                            element: <CheckPage />,
                        },
                        {
                            path: ':placeId',
                            element: <OrgUnit />,
                            loader: checkPlaceLoader,
                            children: tabRoutes,
                        },
                    ],
                },
                {
                    path: 'import',
                    element: <ImportPage />,
                },
                {
                    path: 'setup',
                    element: <SetupPage />,
                },
                {
                    path: 'settings',
                    element: <SettingsPage />,
                },
            ],
        },
    ])

    return <RouterProvider router={router}></RouterProvider>
}

export default Routes
