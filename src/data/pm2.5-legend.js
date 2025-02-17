import i18n from "@dhis2/d2-i18n";

// https://www.iqair.com/newsroom/what-is-aqi
// https://aqicn.org/scale/
export default {
  name: i18n.t("Air Quality Index (AQI"),
  description: i18n.t(""),
  items: [
    {
      category: "Good",
      name: i18n.t("Good"),
      description: i18n.t(
        "Air quality is considered satisfactory, and air pollution poses little or no risk"
      ),
      color: "#abd162",
      from: 0,
      to: 9,
    },
    {
      category: "Moderate",
      name: i18n.t("Moderate"),
      description: i18n.t(
        "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
      ),
      color: "#f8d461",
      from: 9,
      to: 35.5,
    },
    {
      category: "Unhealthy for Sensitive Groups",
      name: i18n.t("Unhealthy for Sensitive Groups"),
      description: i18n.t(
        "Members of sensitive groups may experience health effects. Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
      ),
      color: "#fb9956",
      from: 35.5,
      to: 55.5,
    },
    {
      category: "Unhealthy",
      name: i18n.t("Unhealthy"),
      description: i18n.t(
        "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
      ),
      color: "#f6686a",
      from: 55.5,
      to: 125.5,
    },
    {
      category: "Very unhealthy",
      name: i18n.t("Very unhealthy"),
      description: i18n.t(
        "Health warnings of emergency conditions. The entire population is more likely to be affected."
      ),
      color: "#a47db8",
      from: 125.5,
      to: 225.5,
    },
    {
      category: "Hazardous",
      name: i18n.t("Hazardous"),
      description: i18n.t(
        "Health alert: everyone may experience more serious health effects"
      ),
      color: "#a07785",
      from: 225.5,
      to: 400,
    },
  ],
};
