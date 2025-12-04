import * as Plot from "../../_npm/@observablehq/plot@0.6.17/d761ef9b.js";
import * as d3 from "../../_npm/d3@7.9.0/e780feca.js";
import * as htl from "../../_npm/htl@0.3.1/72f4716c.js";

export function totalStatesTimelyChart(data, width) {
  const timelyTotalsByYear = data.reduce((acc, d) => {
    const year = d.Year;
    const timelyCount = d.Rate >= 95 ? 1 : 0;
    acc[year] = (acc[year] || 0) + timelyCount;
    return acc;
  }, {});

  timelyTotalsByYear[2020] = 0;
  timelyTotalsByYear[2021] = 0;

  const plotData = Object.entries(timelyTotalsByYear).map(([year, count]) => ({
    Year: year,
    Count: count,
  }));

  const textMarks = [
    {
      x: "2020",
      y: 10,
      text: "Suspension of quality\ncontrol measures due\nto COVID-19 meant\nno published rates\nfor 2020 or 2021.",
    },
  ];

  return Plot.plot({
    title:
      "The number of states meeting the USDA standard sharply declined after the COVID-19 pandemic.",
    subtitle:
      "State agencies are required to process each case within 30 days of application, or within 7 days for households eligible for expedited service.",
    color: {
      type: "ordinal",
      legend: true,
      domain: ["Timely", "Untimely", "Very Untimely"],
      range: ["#80cdc1", "#dfc27d", "#a6611a"],
    },
    width: width,
    x: {
      type: "band",
      label: "",
      tickFormat: "",
      tickRotate: width < 600 ? 45 : 0,
      // domain: [2000, 2023],
    },
    y: {
      grid: true,
    },
    marginLeft: 30,
    facet: {
      paddingTop: 45,
      label: "",
    },
    marks: [
      Plot.frame({ anchor: "bottom", stroke: "grey" }),
      Plot.rectY(plotData, {
        x: "Year",
        y: "Count",
        fill: "#80cdc1",
      }),
      Plot.text(plotData, {
        x: "Year",
        y: "Count",
        text: (d) => d.Count.toString(),
        dx: -0,
        dy: -10,
        fontSize: 12,
        textAnchor: "middle",
        fillOpacity: 0.8,
      }),
      Plot.text(textMarks, {
        x: "x",
        y: "y",
        text: "text",
        dx: -10,
        dy: -10,
        fontSize: 12,
        textAnchor: "start",
        fillOpacity: 0.8,
      }),
    ],
  });
}

export function applicationProcessingTimelinessChart(data, width) {
  //https://github.com/observablehq/plot/discussions/2196
  //First calculate totals by year
  const timelyTotalsByYear = data.reduce((acc, d) => {
    const year = d.Year;
    const timelyCount = d.Rate >= 95 ? 1 : 0;
    acc[year] = (acc[year] || 0) + timelyCount;
    return acc;
  }, {});

  const timelyTotalsByState = data.reduce((acc, d) => {
    const state = d.State;
    const timelyCount = d.Rate >= 95 ? 1 : 0;
    acc[state] = (acc[state] || 0) + timelyCount;
    return acc;
  });

  const plotData = data.map((d) => ({
    ...d,
    Year: new Date(d.Year, 0, 1),
    Timeliness:
      d.Rate >= 95 ? "Timely" : d.Rate >= 90 ? "Untimely" : "Very Untimely",
    TimelyTotal: timelyTotalsByYear[d.Year],
    timelyBracketFacet:
      timelyTotalsByState[d.State] >= 4
        ? "often"
        : timelyTotalsByState[d.State] >= 1 && timelyTotalsByState[d.State] < 4
        ? "sometimes"
        : "never",
  }));

  const facetOrder = ["often", "sometimes", "never"];

  return htl.html`${d3
    .sort(
      d3.groups(plotData, (d) => d.timelyBracketFacet),
      (d) => facetOrder.indexOf(d[0])
    )
    .map(([groupName, groupData]) => {
      return Plot.plot({
        subtitle: `States that ${groupName} meet the USDA timeliness standard based on published annual Application Timeliness Rates.`,
        color: {
          type: "ordinal",
          legend: true,
          domain: ["Timely", "Untimely", "Very Untimely"],
          range: ["#80cdc1", "#dfc27d", "#a6611a"],
        },
        width: width,
        x: {
          interval: "year",
          // label: "",
          // tickFormat: "",
          tickRotate: width < 600 ? 45 : 0,
        },
        y: {
          label: "",
          marginLeft: 100,
        },
        marginTop: 0,
        marginLeft: 100,
        marks: [
          Plot.frame({
            anchor: "bottom",
            stroke: "white",
          }),
          Plot.cell(groupData, {
            x: "Year",
            y: "State",
            stroke: "Timeliness",
            fill: "Timeliness",
            sort: "Year",
            opacity: (d) => (d.Timeliness == "Timely" ? 1 : 0.4),
            r: 2,
            inset: 1,
          }),
        ],
      });
    })}`;
}

export function enrollmentAgainstTimeliness(enrollmentData, aptData, width) {
  const plotEnrollData = Object.entries(
    enrollmentData.reduce((acc, d) => {
      const state = d.state;
      const year = new Date(d.fiscal_year_month).getFullYear();
      const households = d.households;
      acc[state] = acc[state] || {};
      acc[state][year] = (acc[state][year] || 0) + households;
      return acc;
    }, {})
  ).flatMap(([state, yearData]) =>
    Object.entries(yearData).map(([year, households]) => ({
      State: state,
      Year: parseInt(year),
      Households: households,
    }))
  );

  const plotData = plotEnrollData.map((d) => {
    return {
      ...d,
      aptData: aptData.find(
        (apt) => apt.State === d.State && apt.Year === d.Year
      )?.Rate,
    };
  });

  const mostRecentYear = d3.max(plotData, (d) => d.Year) - 1;

  return Plot.plot({
    y: { label: "Application Processing Timeliness Rate (%)" },
    x: { label: "Number of Households Enrolled" },
    width: width,
    marks: [
      Plot.ruleY([95], { strokeDasharray: "4 4", stroke: "grey" }),
      Plot.dot(plotData, {
        x: "Households",
        y: "aptData",
        channels: {
          State: "State",
          Year: "Year",
          Households: "Households",
          aptData: "Rate",
        },
        tip: {
          format: {
            fill: null,
            opacity: null,
            Year: (d) => d,
            r: null,
            y: null,
            x: null,
          },
        },
        r: (d) => (Number(d.Year) == mostRecentYear ? 4 : 2),
        fill: (d) => (Number(d.Year) == mostRecentYear ? "#80cdc1" : "#dfc27d"),
        opacity: (d) => (Number(d.Year) == mostRecentYear ? 1 : 0.1),
        stroke: "black",
      }),
    ],
  });
}
