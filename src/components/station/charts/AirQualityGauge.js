import i18n from "@dhis2/d2-i18n";
import legend from "../../../data/pm2.5-legend";
import { roundOneDecimal } from "../../../utils/calc";

const thickness = 50;

const getChartConfig = (name, value, category, time) => ({
  title: {
    text: i18n.t("Air Quality PM<sub>2.5</sub>"),
    useHTML: true,
  },
  subtitle: {
    text: `${name}<br>${time}`,
    style: {
      fontSize: "14px",
      lineHeight: "20px",
    },
  },
  credits: {
    href: "https://airqo.net",
    text: i18n.t("AirQo"),
    style: {
      fontSize: "12px",
    },
  },
  chart: {
    type: "gauge",
    plotBackgroundColor: null,
    plotBackgroundImage: null,
    plotBorderWidth: 0,
    plotShadow: false,
    height: "80%",
  },
  pane: {
    startAngle: -90,
    endAngle: 90,
    background: null,
    center: ["50%", "75%"],
    size: "130%",
  },
  yAxis: {
    min: 0,
    max: 350,
    tickPosition: "inside",
    tickColor: "#FFFFFF",
    tickLength: thickness,
    tickWidth: 1,
    minorTickInterval: null,
    labels: {
      distance: 20,
      style: {
        fontSize: "14px",
      },
    },

    tickPositions: [9, 35.5, 55.5, 125.5, 225.5],
    lineWidth: 0,
    plotBands: legend.items.map((item) => ({
      ...item,
      thickness,
      borderRadius: "50%",
    })),
  },
  tooltip: {
    useHTML: true,
  },
  series: [
    {
      name: "PM<sub>2.5</sub>",
      data: [value],
      tooltip: {
        valueSuffix: " μg/m<sup>3</sup>",
      },
      dataLabels: {
        useHTML: true,
        format: `${category}<span>${roundOneDecimal(
          value
        )} μg/m<sup>3</sup></span>`,
        borderWidth: 0,
        className: "airquality-label",
        color: "#333333",
        style: {
          fontSize: "16px",
        },
      },
      dial: {
        radius: "80%",
        backgroundColor: "#333",
        baseWidth: 12,
        baseLength: "0%",
        rearLength: "0%",
      },
      pivot: {
        backgroundColor: "#333",
        radius: 6,
      },
    },
  ],
});

export default getChartConfig;
