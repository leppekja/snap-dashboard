import * as Plot from "npm:@observablehq/plot";

export function averageMonthlyParticipation(data, width) {
  const cleanData = data.map((d) => {
    return {
      participation: Number(
        d["Average monthly participation (Millions of people)"]
      ),
      "Fiscal year": new Date(d["Fiscal year"], 0, 1),
      type:
        new Date(d["Fiscal year"], 0, 1) <= new Date(2023, 0, 1)
          ? "USDA Reported Participation (2000 - 2023)"
          : "CBO Projected Participation (2023 - 2034)",
    };
  });

  return Plot.plot({
    width,
    title:
      "What does average monthly participation each year in SNAP look like?",
    subtitle:
      "The COVID-19 pandemic in 2020 reversed a downward trend in already high SNAP enrollment, but the CBO projects modest enrollment decreases ahead.",
    y: {
      fontSize: 18,
      grid: true,
      domain: [0, 46],
      label: "Millions of people",
    },
    color: {
      legend: true,
      // list option is used to specify the order of the legend
      // this matches the chronological order of the data better
      // https://github.com/observablehq/plot/discussions/1953
      domain: [
        "USDA Reported Participation (2000 - 2023)",
        "CBO Projected Participation (2023 - 2034)",
      ],
    },
    marks: [
      Plot.lineY(cleanData, {
        x: "Fiscal year",
        y: "participation",
        marker: "circle",
        stroke: "type",
        strokeWidth: 2,
      }),
      Plot.tip(
        cleanData,
        Plot.pointer({
          x: "Fiscal year",
          y: "participation",
          // https://talk.observablehq.com/t/tip-text-in-line-chart-refuses-to-be-formatted/8959
          format: { x: "%Y" },
        })
      ),
    ],
  });
}
export function yearlyCostsLineChart(data, width) {
  const cleanData = data.map((d) => {
    return {
      spending: Number(
        d["Inflation-adjusted annual spending (Billions of 2023 dollars)"]
      ),
      "Fiscal year": new Date(d["Fiscal year"], 0, 1),
      type:
        new Date(d["Fiscal year"], 0, 1) <= new Date(2023, 0, 1)
          ? "USDA Reported Spending (2000 - 2023)"
          : "CBO Projected Spending (2023 - 2034)",
    };
  });

  return Plot.plot({
    width,
    title: "What does yearly spending on SNAP look like?",
    subtitle:
      "Inflation-adjusted annual program spending, FY 2000–34 (Billions of 2023 dollars)",
    y: { grid: true, domain: [0, 130], label: "Billions of 2023 dollars" },

    color: {
      legend: true,
      // list option is used to specify the order of the legend
      // this matches the chronological order of the data better
      // https://github.com/observablehq/plot/discussions/1953
      domain: [
        "USDA Reported Spending (2000 - 2023)",
        "CBO Projected Spending (2023 - 2034)",
      ],
    },
    marks: [
      Plot.lineY(cleanData, {
        x: "Fiscal year",
        y: "spending",
        marker: "circle",
        stroke: "type",
        strokeWidth: 2,
      }),
      Plot.tip(
        cleanData,
        Plot.pointer({
          x: "Fiscal year",
          y: "spending",
          format: { x: "%Y" },
        })
      ),
    ],
  });
}

// Plot.lineY(
//   cleanData.filter((d) => d["Fiscal year"] > new Date(2023, 0, 1)),
//   {
//     x: "Fiscal year",
//     y: "participation",
//     marker: "circle",
//     tip: true,
//     stroke: "yellow",
//     strokeDasharray: "1,2",
//   }
// ),
