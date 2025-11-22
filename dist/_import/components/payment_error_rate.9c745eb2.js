import * as Plot from "../../_npm/@observablehq/plot@0.6.16/75abcbb5.js";
import { Generators } from "../../_observablehq/stdlib.bb0de5c5.js";
import * as Inputs from "../../_observablehq/stdlib/inputs.baa9c6bc.js";

export function paymentErrorRatesOverTime(data, highlight, width) {
  const notes = [
    {
      year: new Date(2015, 0, 1),
      rate: 15,
      note: "Measurement quality issues\n were identified in 2015,\n and the FY 2016 reporting\n was later cancelled.↴",
    },
    {
      year: new Date(2017, 0, 1),
      rate: 23,
      note: "Adjusting how payment errors were defined\n meant a large increase in the rate\n relative to previous years.↴",
    },
    {
      year: new Date(2020, 0, 1),
      rate: 30,
      note: "State quality reporting\n was suspended in 2020 and 2021\n due to the COVID-19 pandemic.↴",
    },
    {
      year: new Date(2022, 0, 1),
      rate: 40,
      note: "Including procedural errors, even if the household was paid correctly,\n also led to large increases in the rate in 2022 and 2023.↴",
      href: `https://www.cbpp.org/research/food-assistance/snap-includes-extensive-payment-accuracy-system`,
    },
  ];

  const ylabel = [
    {
      x: new Date(2003, 0, 1),
      y: 0,
      text: "← Under Payments · Over Payments →",
      textAnchor: "end",
    },
  ];

  const highlightLine = data.filter((d) => d["State/Territory"] === highlight);

  return Plot.plot({
    aspectRatio: 1,
    height: 550,
    width: width,
    marginLeft: 50,
    x: { label: "Fiscal Year" },
    y: {
      grid: true,
      tickFormat: (d) => Math.abs(d) + "%",
      domain: [-10, 60],
      //https://github.com/observablehq/plot/issues/1414
      // can't move ylabel down?
    },
    color: {
      domain: ["UnderPayment", "OverPayment"],
      scheme: "BrBg",
      legend: true,
      tickFormat: (d) => d + " Rate",
    },
    marks: [
      Plot.ruleY([0]),
      Plot.text(ylabel, {
        x: "x",
        y: "y",
        text: "text",
        textAnchor: "middle",
        rotate: -90,
        dx: -40,
      }),
      Plot.lineY(
        data.filter((d) => d.PaymentType === "OverPayment"),
        {
          x: "Fiscal Year",
          y: "Payment",
          z: "State/Territory",
          stroke: "lightgray",
          strokeOpacity: 0.1,
        }
      ),
      Plot.lineY(
        data.filter((d) => d.PaymentType === "UnderPayment"),
        {
          x: "Fiscal Year",
          y: "Payment",
          z: "State/Territory",
          stroke: "lightgray",
          strokeOpacity: 0.1,
        }
      ),
      Plot.text(notes, {
        x: "year",
        y: "rate",
        text: "note",
        href: (d) => d.href || null,
        textAnchor: "end",
      }),
      Plot.lineY(
        highlightLine.filter((d) => d.PaymentType === "UnderPayment"),
        {
          x: "Fiscal Year",
          y: "Payment",
          z: "State/Territory",
          stroke: "white",
        }
      ),
      Plot.lineY(
        highlightLine.filter((d) => d.PaymentType === "OverPayment"),
        {
          x: "Fiscal Year",
          y: "Payment",
          z: "State/Territory",
          stroke: "white",
          strokeWidth: 2,
        }
      ),
      Plot.dot(highlightLine, {
        x: "Fiscal Year",
        y: "Payment",
        fill: "PaymentType",
        title: "State/Territory",
        tip: true,
        r: 4,
      }),
    ],
  });
}

export function paymentErrorStateChange(data, width) {
  return Plot.plot({
    title: "State Payment Error Rates often see large changes year-to-year.",
    width: width,
    height: 550,
    marks: [
      Plot.dot(data, {
        x: "Fiscal Year",
        y: "Payment Percent Change",
      }),
    ],
  });
}
