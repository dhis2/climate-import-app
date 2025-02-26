import i18n from "@dhis2/d2-i18n";
import { animation, landCoverCredits } from "../../../../utils/chart";
import { roundOneDecimal } from "../../../../utils/calc";
import { landCoverTypes } from "../LandCoverSelect";

const band = "LC_Type1";

const getChartConfig = (name, data, type) => {
  const legend = landCoverTypes.find((c) => c.value === type);

  const years = data.map((d) => d.id.slice(0, 4)).map(Number);

  const total = Object.values(data[0][band]).reduce((acc, cur) => acc + cur, 0);

  const series = data.map((d, i) => ({
    x: years[i],
    y: roundOneDecimal(((d[band][type] || 0) / total) * 100),
  }));

  return {
    chart: {
      type: "column",
      height: 580,
    },
    title: {
      text: i18n.t("{{name}}: Land cover changes {{years}}", {
        name,
        years: `${years[0]}-${years[years.length - 1]}`,
        nsSeparator: ";",
      }),
    },
    credits: landCoverCredits,
    yAxis: {
      min: 0,
      max: 50,
      labels: {
        format: "{value}%",
      },
      title: {
        enabled: false,
      },
    },
    tooltip: {
      valueSuffix: "%",
    },
    plotOptions: {
      series: {
        animation,
      },
      column: {
        groupPadding: 0,
      },
    },
    series: [
      {
        data: series,
        name: legend.name,
        color: legend.color,
        zIndex: 1,
      },
    ],
  };
};

export default getChartConfig;
