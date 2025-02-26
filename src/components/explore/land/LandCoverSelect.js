import i18n from "@dhis2/d2-i18n";
import { SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import exploreStore from "../../../store/exploreStore";
import styles from "./styles/LandCoverSelect.module.css";

export const landCoverTypes = [
  // http://www.eomf.ou.edu/static/IGBP.pdf
  {
    value: 1,
    name: i18n.t("Evergreen Needleleaf forest"),
    color: "#162103",
  },
  {
    value: 2,
    name: i18n.t("Evergreen Broadleaf forest"),
    color: "#235123",
  },
  {
    value: 3,
    name: i18n.t("Deciduous Needleleaf forest"),
    color: "#399b38",
  },
  {
    value: 4,
    name: i18n.t("Deciduous Broadleaf forest"),
    color: "#38eb38",
  },
  {
    value: 5,
    name: i18n.t("Mixed forest"),
    color: "#39723b",
  },
  {
    value: 6,
    name: i18n.t("Closed shrublands"),
    color: "#6a2424",
  },
  {
    value: 7,
    name: i18n.t("Open shrublands"),
    color: "#c3a55f",
  },
  {
    value: 8,
    name: i18n.t("Woody savannas"),
    color: "#b76124",
  },
  {
    value: 9,
    name: i18n.t("Savannas"),
    color: "#d99125",
  },
  {
    value: 10,
    name: i18n.t("Grasslands"),
    color: "#92af1f",
  },
  {
    value: 11,
    name: i18n.t("Permanent wetlands"),
    color: "#10104c",
  },
  {
    value: 12,
    name: i18n.t("Croplands"),
    color: "#cdb400",
  },
  {
    value: 13,
    name: i18n.t("Urban and built-up"),
    color: "#cc0202",
  },
  {
    value: 14,
    name: i18n.t("Cropland/Natural vegetation mosaic"),
    color: "#332808",
  },
  {
    value: 15,
    name: i18n.t("Snow and ice"),
    color: "#d7cdcc",
  },
  {
    value: 16,
    name: i18n.t("Barren or sparsely vegetated"),
    color: "#f7e174",
  },
  {
    value: 17,
    name: i18n.t("Water"),
    color: "#aec3d6",
  },
];

const LandCoverSelect = () => {
  const { landCoverType, setLandCoverType } = exploreStore();

  return (
    <div className={styles.landCoverSelect}>
      <SingleSelectField
        label={i18n.t("Land cover type")}
        selected={String(landCoverType)}
        onChange={({ selected }) => setLandCoverType(Number(selected))}
      >
        {landCoverTypes.map((t) => (
          <SingleSelectOption
            key={t.value}
            value={String(t.value)}
            label={t.name}
          />
        ))}
      </SingleSelectField>
    </div>
  );
};

export default LandCoverSelect;
