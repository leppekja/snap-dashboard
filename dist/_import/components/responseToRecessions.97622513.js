import * as Plot from "../../_npm/@observablehq/plot@0.6.16/75abcbb5.js";

export function responseToRecessions(data, width) {
  // https://fred.stlouisfed.org/series/JHDUSRGDPBR
  const recessionDates = [
    { start: 2001, end: 2001, trailing: 2006, leading: 2000 },
    { start: 2007, end: 2009, trailing: 2012, leading: 2006 },
    { start: 2020, end: 2020, trailing: 2025, leading: 2019 },
  ];
  // create 3 separate lines for each recession from start date to 5 years after end with participation data
  const recessionData = recessionDates.flatMap((d) => {
    return data
      .filter(
        (row) =>
          row["Fiscal year"] >= d.leading && row["Fiscal year"] <= d.trailing
      )
      .map((row) => {
        return {
          participation: Number(
            row["Average monthly participation (Millions of people)"]
          ),
          test: row["Fiscal year"] - d.start,
          "Fiscal year": new Date(row["Fiscal year"], 0, 1),
          type: `${d.start} Recession`,
        };
      });
  });

  return Plot.plot({
    width,
    y: { grid: true, label: "Millions of people" },
    x: {
      label: "Years since start of recession",
      anchor: "start",
      tickFormat: (d) => `${d} years`,
    },
    title: "How did SNAP enrollment change in response to recessions?",
    subtitle:
      "Enrollment continued to increase past the 2008 Great Recession, peaking in 2013.",
    color: { legend: true },
    marks: [
      Plot.ruleX([0]),
      Plot.lineY(recessionData, {
        x: "test",
        y: "participation",
        strokeWidth: 2,
        marker: "circle",
        stroke: "type",
      }),
      Plot.text(recessionData, {
        filter: (d) => d.test === 5,
        x: "test",
        y: "participation",
        text: (d) => `${d.type}`,
        dy: -15,
        textAnchor: "end",
        fill: "type",
      }),
    ],
  });
}
