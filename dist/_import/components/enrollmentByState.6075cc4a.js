import * as Plot from "../../_npm/@observablehq/plot@0.6.16/75abcbb5.js";

export function enrollmentByState(data, grid) {
  //observablehq.com/@observablehq/observable-plot-grid-choropleth
  // .then((states) => new Map(states.map((state) => [state.name, state])));

  const dataLookUp = new Map(data.map((d) => [d.state_abbr, d]));
  //#4269d0
  //#efb118
  return Plot.plot({
    title: "SNAP participation rate by state in fiscal year 2023",
    subtitle:
      "Nearly 1 in 4 people in New Mexico received SNAP benefits in 2023",
    height: 420,
    axis: null,
    color: {
      legend: true,
      scheme: "Cividis",
      tickFormat: (d) => d + "%",
    },
    marks: [
      Plot.cell(grid, {
        x: "x",
        y: "y",
        fill: (d) =>
          Number(dataLookUp.get(d.key)["SNAP participation rate 2023"]),
      }),
      Plot.text(grid, {
        x: "x",
        y: "y",
        text: (d) => d.key,
        fill: (d) =>
          Number(dataLookUp.get(d.key)["SNAP participation rate 2023"]) < 10
            ? "lightgray"
            : "black",
      }),
      Plot.text(grid, {
        x: "x",
        y: "y",
        dy: 12,
        text: (d) =>
          Number(dataLookUp.get(d.key)["SNAP participation rate 2023"]).toFixed(
            1
          ) + "%",
        fill: (d) =>
          Number(dataLookUp.get(d.key)["SNAP participation rate 2023"]) < 10
            ? "lightgray"
            : "black",
      }),
    ],
  });
}

export function enrollmentByStateBar(data) {
  return Plot.plot({
    title: "SNAP participation rate in fiscal year 2023",
    marginRight: 80,
    marks: [
      Plot.barY(data, {
        x: "state_abbr",
        y: "SNAP participation rate 2023",
        fy: "region",
        title: "State",
        sort: { x: "y", reverse: true },
      }),
      Plot.frame(),
    ],
  });
}

export function enrollmentByStateAbbr(data) {
  return Plot.plot({
    title:
      "Percent of each state's population receiving SNAP benefits in fiscal year 2023",
    color: {
      legend: true,
    },
    marks: [
      Plot.text(
        data,
        Plot.stackX2({
          y: (d) => Math.floor(d["SNAP participation rate 2023"]),
          x: (d) => 1,
          fill: "region",
          text: "state_abbr",
          title: "Label",
          order: "sum",
          reverse: true,
          sort: { x: "y", reverse: true, limit: 20 },
        })
      ),
      Plot.ruleY([0]),
    ],
  });
}
