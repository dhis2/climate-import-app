import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import {
  animation,
  vegetationCredits,
  getDailyPeriod,
} from "../../../../utils/chart";
import { roundTwoDecimals } from "../../../../utils/calc";
import { generateFixedPeriods } from "@dhis2/multi-calendar-dates";

const oneDayInMs = 1000 * 60 * 60 * 24;
const eightDaysInMs = oneDayInMs * 8;
const halfWeekInMs = oneDayInMs * 3.5;

const getFraction = (period, item) => {
  const periodLength = period.endTime - period.startTime;

  if (period.startTime >= item.startTime) {
    return (period.endTime - item.endTime) / periodLength;
  }

  return (item.startTime - period.startTime) / periodLength;
};

const getWeeklySeries = (data, index, period) => {
  // console.log("data", data);

  const series = generateFixedPeriods({
    year: 2024,
    calendar: "gregory",
    locale: "en",
    periodType: "WEEKLY",
  })
    .map((p) => ({
      ...p,
      startTime: new Date(p.startDate).getTime(),
      endTime: new Date(p.endDate).getTime() + oneDayInMs,
    }))
    .map((p) => {
      // https://en.wikipedia.org/wiki/Allen%27s_interval_algebra
      // https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
      // https://stackoverflow.com/questions/55024214/checking-if-two-time-ranges-overlap-with-one-another
      const items = data.filter(
        (d) =>
          (p.startTime < d.startTime && d.startTime < p.endTime) ||
          (p.startTime < d.endTime && d.endTime < p.endTime) ||
          (d.startTime <= p.startTime && d.endTime >= p.endTime)
      );

      let value = null;

      if (items.length > 0) {
        value = roundTwoDecimals(
          (items.length === 1
            ? items[0][index]
            : items.reduce(
                (acc, cur) => acc + cur[index] * getFraction(p, cur),
                0
              )) * 0.0001
        );
      }

      return {
        x: p.startTime + halfWeekInMs, // TODO: Remove halfWeekInMs,
        y: value,
      };
    })
    .filter((s) => s.y !== null);
  // console.log("series", series);

  // console.log("getWeeklySeries", new Date(dataWithDates[0].endTime));

  return series;
};

const getChartConfig = (name, data, index) => {
  const years = [...new Set(data.map((d) => d.id.slice(0, 4)).map(Number))];

  const series = years.map((year) =>
    data
      .filter((d) => d.id.startsWith(year))
      .map((d) => ({
        x: new Date(d.id).getTime() + eightDaysInMs, // TODO: Remove eightDaysInMs,
        y: roundTwoDecimals(d[index] * 0.0001),
      }))
  );

  // console.log("data", data);

  /*
  const weeklySeries = getWeeklySeries(data, index, {
    startTime: "2024-01-01",
    endTime: "2024-12-31",
  });
  */

  const last = series.length - 1;

  return {
    title: {
      text: i18n.t("{{name}}: {{index}} vegetation index {{period}}", {
        name,
        index,
        period: getDailyPeriod(data),
        nsSeparator: ";",
      }),
    },
    credits: vegetationCredits,
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: "°C",
    },
    // https://jsfiddle.net/BlackLabel/bvr639p5/
    /*
    xAxis: {
      type: "datetime",
      tickInterval: 2592000000,
      labels: {
        format: "{value: %b}",
      },
    },
    */
    xAxis: years.map((year, index) => ({
      type: "datetime",
      visible: index === 0,
      dateTimeLabelFormats: {
        month: "%b",
      },
      top: "0%",
      height: "100%",
      min: Date.UTC(year, 0, 1),
      max: Date.UTC(year, 11, 31),
    })),
    yAxis: {
      title: false,
      min: 0,
      max: 1,
    },
    chart: {
      height: 480,
      marginBottom: 75,
    },
    plotOptions: {
      series: {
        animation,
      },
      column: {
        borderColor: null,
        pointPadding: 0,
        groupPadding: 0,
      },
    },
    /*
    series: [
      {
        type: "line",
        data: series[10],
        name: years[10],
        color: colors.green500,
        lineWidth: 1.5,
        zIndex: 2,
      },
      {
        type: "column",
        data: weeklySeries,
        name: "Weekly",
        color: colors.green300,
        lineWidth: 1.5,
        zIndex: 3,
      },
    ],
    */
    series: series.map((s, i) => ({
      type: "spline",
      xAxis: i,
      data: s,
      name: years[i],
      color: i === last ? colors.green500 : colors.green300,
      lineWidth: i === last ? 3 : 1,
      marker: {
        enabled: false,
      },
      zIndex: i === last ? 2 : 1,
    })),
  };
};

export default getChartConfig;
