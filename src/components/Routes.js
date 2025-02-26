import { RouterProvider, createHashRouter } from "react-router-dom";
import { useDataEngine } from "@dhis2/app-runtime";
import Root from "./Root";
import AboutPage from "./AboutPage";
import ExplorePage from "./explore/ExplorePage";
import OrgUnit from "./explore/OrgUnit";
import Tabs from "./explore/Tabs";
import Forecast from "./explore/forecast/Forecast";
import TemperatureMonthly from "./explore/temperature/TemperatureMonthly";
import TemperatureDaily from "./explore/temperature/TemperatureDaily";
import PrecipitationMonthly from "./explore/precipitation/PrecipitationMonthly";
import PrecipitationDaily from "./explore/precipitation/PrecipitationDaily";
import HumidityMonthly from "./explore/humidity/HumidityMonthly";
import HumidityDaily from "./explore/humidity/HumidityDaily";
import HeatMonthly from "./explore/heat/HeatMonthly";
import HeatDaily from "./explore/heat/HeatDaily";
import ClimateChange from "./explore/climateChange/ClimateChange";
import LandCover from "./explore/land/LandCover";
import Vegetation from "./explore/land/Vegetation";
import ImportPage from "./import/ImportPage";
import SetupPage from "./setup/SetupPage";
import SettingsPage from "./settings/SettingsPage";
import ErrorPage from "./ErrorPage";
import CheckPage from "./check/CheckPage";
import orgUnitLoader from "../utils/orgUnitLoader";
import checkPlaceLoader from "../utils/checkPlaceLoader";

const monthlyPath = "monthly/:startTime/:endTime/:referencePeriodId";
const dailyPath = "daily/:startTime/:endTime";

// Shared routes for explore and check sections
const tabRoutes = [
  {
    path: "forecast10days",
    element: <Tabs />,
    children: [
      {
        index: true,
        element: <Forecast />,
      },
    ],
  },
  {
    path: "temperature",
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
    path: "precipitation",
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
    path: "humidity",
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
    path: "heat",
    element: <Tabs />,
    children: [
      {
        path: "monthly/:startTime/:endTime",
        element: <HeatMonthly />,
      },
      {
        path: dailyPath,
        element: <HeatDaily />,
      },
    ],
  },
  {
    path: "climatechange",
    element: <Tabs />,
    children: [
      {
        path: ":month/:referencePeriodId",
        element: <ClimateChange />,
      },
    ],
  },
  {
    path: "vegetation",
    element: <Tabs />,
    children: [
      {
        path: ":vegetationIndex",
        // index: true,
        element: <Vegetation />,
      },
    ],
  },
  {
    path: "landcover",
    element: <Tabs />,
    children: [
      {
        // path: ":month/:referencePeriodId",
        index: true,
        element: <LandCover />,
      },
    ],
  },
];

const Routes = () => {
  const engine = useDataEngine();

  const router = createHashRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <AboutPage />,
        },
        {
          path: "explore",
          children: [
            {
              index: true,
              element: <ExplorePage />,
            },
            {
              path: ":orgUnitId",
              element: <OrgUnit />,
              loader: orgUnitLoader(engine),
              children: tabRoutes,
            },
          ],
        },
        {
          path: "check",
          children: [
            {
              index: true,
              element: <CheckPage />,
            },
            {
              path: ":placeId",
              element: <OrgUnit />,
              loader: checkPlaceLoader,
              children: tabRoutes,
            },
          ],
        },
        {
          path: "import",
          element: <ImportPage />,
        },
        {
          path: "setup",
          element: <SetupPage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};

export default Routes;
