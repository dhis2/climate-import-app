import i18n from "@dhis2/d2-i18n";
import { animation, landCoverCredits } from "../../../../utils/chart";
import { roundOneDecimal } from "../../../../utils/calc";
import { landCoverTypes } from "../LandCoverSelect";

const band = "LC_Type1";

const getChartConfig = (name, data) => {
  // console.log(name, data);

  const years = data.map((d) => d.id.slice(0, 4)).map(Number);

  const total = Object.values(data[0][band]).reduce((acc, cur) => acc + cur, 0);

  const keys = [
    ...new Set(data.map((d) => Object.keys(d[band]).map(Number)).flat()),
  ];

  // console.log("Keys", keys);

  const series = keys.map((key) => ({
    key,
    name: landCoverTypes.find((c) => c.value === key).name,
    color: landCoverTypes.find((c) => c.value === key).color,
    data: data.map((d) => roundOneDecimal(((d[band][key] || 0) / total) * 100)),
  }));

  series.sort((a, b) => {
    const aValue = data[0][band][a.key] || 0;
    const bValue = data[0][band][b.key] || 0;
    return aValue - bValue;
  });

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
    xAxis: {
      categories: years,
    },
    yAxis: {
      min: 0,
      max: 100,
      labels: {
        format: "{value}%",
      },
      title: {
        enabled: false,
      },
    },
    tooltip: {
      shared: true,
      headerFormat:
        '<span style="font-size:12px"><b>{point.key}</b></span><br>',
      valueSuffix: "%",
    },
    plotOptions: {
      series: {
        animation,
        /* pointWidth: 24, */
      },
      column: {
        stacking: "normal",
        borderColor: null,
        // pointPadding: 0,
        groupPadding: 0,
      },
    },
    series,
  };
};

export default getChartConfig;
