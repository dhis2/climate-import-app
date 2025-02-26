import Chart from "../Chart";
import VegetationIndexSelect from "./VegetationIndexSelect";
import DataLoader from "../../shared/DataLoader";
import getChartConfig from "./charts/vegetation";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import exploreStore from "../../../store/exploreStore";
import { NDVI, EVI } from "./VegetationIndexSelect";

const dataset = {
  datasetId: "MODIS/061/MOD13Q1",
  band: [NDVI, EVI],
  // reducer: "frequencyHistogram",
};

const period = {
  startTime: "2015-01-01",
  endTime: "2024-12-31",
};

const LandCover = () => {
  const orgUnit = exploreStore((state) => state.orgUnit);
  const index = exploreStore((state) => state.vegetationIndex);

  const data = useEarthEngineTimeSeries(dataset, period, orgUnit);

  if (!data) {
    return <DataLoader />;
  }

  return (
    <>
      <VegetationIndexSelect />
      <Chart config={getChartConfig(orgUnit.properties.name, data, index)} />
    </>
  );
};

export default LandCover;
