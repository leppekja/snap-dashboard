import * as Plot from "../../_npm/@observablehq/plot@0.6.17/d761ef9b.js";
import { Generators } from "../../_observablehq/stdlib.00247f76.js";
import * as Inputs from "../../_observablehq/stdlib/inputs.cf170d8f.js";

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
      note: "Adjusting how payment errors\nwere defined meant a larg\nincrease in the rate\n relative to previous years.↴",
    },
    {
      year: new Date(2020, 0, 1),
      rate: 30,
      note: "State quality reporting\n was suspended in 2020 and 2021\n due to the COVID-19 pandemic.↴",
    },
    {
      year: new Date(2022, 0, 1),
      rate: 40,
      note: "Including procedural errors, even if\nthe household was paid correctly,\n also led to large increases\nin the rate in 2022 and 2023.↴",
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
        lineWidth: 60,
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
        // https://www.linen.dev/s/observable-community/t/18859016/is-there-a-way-to-make-formatting-of-tips-conditional-based-
        channels: {
          "Overpayment Rate": (d) =>
            d.Payment >= 0 ? Math.abs(d.Payment) + "%" : null,
          "Underpayment Rate": (d) =>
            d.Payment <= 0 ? Math.abs(d.Payment) + "%" : null,
          State: "State/Territory",
          "Total PER": "totalErrorRate",
        },
        tip: {
          format: {
            state: true,
            x: (d) => d.getFullYear(),
            "Overpayment Rate": true,
            "Underpayment Rate": true,
            "Total PER": true,
            fill: null,
            y: false,
          },
        },
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
