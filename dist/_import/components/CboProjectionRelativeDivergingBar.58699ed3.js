import * as Plot from "../../_npm/@observablehq/plot@0.6.17/d761ef9b.js";

export function CboProjectionRelativeDivergingBar(data, width) {
  const cleanData = data.map((d) => {
    return {
      participation: Number(
        d["Average monthly participation (Millions of people)"]
      ),
      spending: Number(
        d["Inflation-adjusted annual spending (Billions of 2023 dollars)"]
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
      "What relative changes does the CBO project for enrollment and spending?",
    subtitle:
      "SNAP spending will remain high while enrollment is projected to decrease.",
  });
}
