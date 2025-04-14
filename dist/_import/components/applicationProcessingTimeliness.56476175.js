import * as Plot from "../../_npm/@observablehq/plot@0.6.16/75abcbb5.js";
import * as d3 from "../../_npm/d3@7.9.0/0441914a.js";
import * as htl from "../../_npm/htl@0.3.1/063eb405.js";

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
