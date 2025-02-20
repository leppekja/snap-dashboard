import * as Plot from "../../_npm/@observablehq/plot@0.6.16/75abcbb5.js";
import { rollup } from "../../_npm/d3-array@3.2.4/37839b6a.js";
import { sum } from "../../_npm/d3-array@3.2.4/37839b6a.js";

export function monthlyPersonsEnrollmentAllTimeChart(data, width) {
  // https://talk.observablehq.com/t/is-there-a-way-to-associate-hyperlink-to-plot-text/7881/4

  const notes = [
    [
      {
        year: new Date(2005, 9, 1),
        rate: 32,
        note: "The Gulf Coast Hurricanes in 2005 \ncaused a large short-term increase.↴",
      },
    ],
    [
      {
        year: new Date(2017, 10, 1),
        rate: 40,
        note: "More hurricanes ↑",
      },
    ],
    [
      {
        year: new Date(2020, 4, 1),
        rate: 35,
        note: "↑ The impact of \nthe COVID-19 pandemic",
      },
    ],
  ];

  const plotData = Array.from(
    rollup(
      data.filter((d) => new Date(d.fiscal_year_month) < new Date(2024, 7, 1)),
      (v) => sum(v, (d) => d.persons / 1000000),
      (d) => d.fiscal_year_month
    ),
    ([fiscal_year_month, personsInMils]) => ({
      fiscal_year_month: fiscal_year_month,
      personsInMils: personsInMils,
    })
  );

  return Plot.plot({
    width,
    x: { label: "Year" },
    y: { label: "millions of people", grid: true },
    title:
      "Monthly SNAP participation data shows the effect of short-term disasters on enrollment",
    subtitle:
      "February 2019 saw benefits be distributed in Jan 2019 to avoid a government shutdown, causing an aberration in the data.",
    marks: [
      Plot.lineY(plotData, {
        x: "fiscal_year_month",
        y: "personsInMils",
        tip: true,
      }),
      Plot.text(notes[0], {
        x: "year",
        y: "rate",
        text: "note",
        textAnchor: "end",
        href: (d) =>
          `https://www.ers.usda.gov/publications/pub-details/?pubid=45758`,
      }),
      Plot.text(notes[1], {
        x: "year",
        y: "rate",
        text: "note",
        textAnchor: "end",
        href: (d) =>
          `https://frac.org/research/resource-library/snap-monthly-data-2017`,
      }),
      Plot.text(notes[2], {
        x: "year",
        y: "rate",
        text: "note",
        textAnchor: "start",
      }),
    ],
  });
}
