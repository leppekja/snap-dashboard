import * as Plot from "../../_npm/@observablehq/plot@0.6.16/75abcbb5.js";

export function paymentErrorRatesOverTime(data, width) {
  const notes = [
    {
      year: new Date(2015, 0, 1),
      rate: 15,
      note: "Measurement quality issues\n were identified in 2015,\n and the FY 2016 reporting\n was later cancelled.↴",
    },
    {
      year: new Date(2020, 0, 1),
      rate: 30,
      note: "State quality reporting\n was suspended in 2020 and 2021\n due to the COVID-19 pandemic.↴",
    },
  ];

  return Plot.plot({
    title:
      "Since the COVID-19 pandemic, SNAP payment errors have mostly stayed steady, with notable exceptions.",
    subtitle:
      "In FY '23, nearly 60% of Alaska's cases resulted in overpayments due to a misapplication of a waiver, while 4.5% of recipients were underpaid in D.C.",
    aspectRatio: 1,
    height: 550,
    width: width,
    x: { label: "Fiscal Year" },
    y: {
      grid: true,
      label: "← Under Payments · Over Payments →",
      labelAnchor: "center",
      tickFormat: Math.abs,
      domain: [-20, 60],
      //https://github.com/observablehq/plot/issues/1414
      // can't move ylabel down?
    },
    color: {
      domain: ["UnderPayment", "OverPayment"],
      scheme: "BrBg",
      legend: true,
    },
    marks: [
      Plot.ruleY([0]),
      Plot.lineY(
        data.filter((d) => d.PaymentType === "OverPayment"),
        {
          x: "Fiscal Year",
          y: "Payment",
          z: "State/Territory",
          stroke: "lightGray",
        }
      ),
      Plot.lineY(
        data.filter((d) => d.PaymentType === "UnderPayment"),
        {
          x: "Fiscal Year",
          y: "Payment",
          z: "State/Territory",
          stroke: "lightGray",
        }
      ),
      Plot.dot(data, {
        x: "Fiscal Year",
        y: "Payment",
        fill: "PaymentType",
        title: "State/Territory",
        tip: true,
      }),
      Plot.text(notes, {
        x: "year",
        y: "rate",
        text: "note",
        textAnchor: "end",
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
