import Chart from "../Chart";
import LandCoverSelect from "./LandCoverSelect";
import DataLoader from "../../shared/DataLoader";
import getAllConfig from "./charts/landCoverAll";
import getChartConfig from "./charts/landCover";
import useEarthEngineTimeSeries from "../../../hooks/useEarthEngineTimeSeries";
import exploreStore from "../../../store/exploreStore";

const dataset = {
  datasetId: "MODIS/061/MCD12Q1",
  band: ["LC_Type1"],
  reducer: "frequencyHistogram",
};

const period = {
  startTime: "2001",
  endTime: "2024",
};

const LandCover = () => {
  const orgUnit = exploreStore((state) => state.orgUnit);
  const type = exploreStore((state) => state.landCoverType);

  const data = useEarthEngineTimeSeries(dataset, period, orgUnit);

  if (!data) {
    return <DataLoader />;
  }

  return (
    <>
      <Chart config={getAllConfig(orgUnit.properties.name, data)} />
      <LandCoverSelect />
      <Chart config={getChartConfig(orgUnit.properties.name, data, type)} />
    </>
  );
};

export default LandCover;
