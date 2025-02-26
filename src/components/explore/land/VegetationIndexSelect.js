import { SegmentedControl } from "@dhis2/ui";
import exploreStore from "../../../store/exploreStore";
import styles from "./styles/VegetationIndexSelect.module.css";

export const NDVI = "NDVI";
export const EVI = "EVI";

const VegetationIndexSelect = () => {
  const { vegetationIndex, setVegetationIndex } = exploreStore();

  return (
    <div className={styles.periodTypeButtons}>
      <SegmentedControl
        ariaLabel="Vegetatuion index"
        onChange={({ value }) => setVegetationIndex(value)}
        options={[
          {
            label: NDVI,
            value: NDVI,
          },
          {
            label: EVI,
            value: EVI,
          },
        ]}
        selected={vegetationIndex}
      />
    </div>
  );
};

export default VegetationIndexSelect;
