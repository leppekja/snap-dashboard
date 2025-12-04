import { csvFormat, csvParse } from "d3-dsv";

async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return response.text();
}

const data = csvParse(
  await text(
    "https://raw.githubusercontent.com/leppekja/SNAP-performance-indicators/refs/heads/main/csvs/payment_error_rates.csv"
  ),
  (d) => d
);

const meltedDataset = data.reduce((acc, record) => {
  acc.push({
    "Fiscal Year": new Date(record["Fiscal Year"], 0, 1),
    State_Abbr: record["State_Abbr"],
    FIPS: record["FIPS"],
    "State/Territory": record["State/Territory"],
    Payment: Number(record["Over Payments"]),
    PaymentType: "OverPayment",
    totalErrorRate: record["Payment Error Rates"],
    Source_Document: record["Source_Document"],
  });

  acc.push({
    "Fiscal Year": new Date(record["Fiscal Year"], 0, 1),
    State_Abbr: record["State_Abbr"],
    FIPS: record["FIPS"],
    "State/Territory": record["State/Territory"],
    Payment: -Number(record["Under Payments"]),
    PaymentType: "UnderPayment",
    totalErrorRate: record["Payment Error Rates"],
    Source_Document: record["Source_Document"],
  });

  return acc;
}, []);

const yearsMissing = ["2016", "2020", "2021"];
const states = new Array(...new Set(data.map((d) => d["State/Territory"])));

const data2 = meltedDataset
  .concat(
    states
      .map((d) => {
        return yearsMissing
          .map((v) => {
            return [
              {
                "Fiscal Year": new Date(v, 0, 1),
                "State/Territory": d,
                Payment: NaN,
                totalErrorRate: NaN,
                PaymentType: "OverPayment",
              },
              {
                "Fiscal Year": new Date(v, 0, 1),
                "State/Territory": d,
                Payment: NaN,
                totalErrorRate: NaN,
                PaymentType: "UnderPayment",
              },
            ];
          })
          .flat();
      })
      .flat()
  )
  .sort((a, b) => {
    const stateComparison = a["State/Territory"].localeCompare(
      b["State/Territory"]
    );
    if (stateComparison !== 0) {
      return stateComparison;
    }
    return Number(a["Fiscal Year"]) - Number(b["Fiscal Year"]);
  });

// Calculate year-over-year percent change for each state
const changes = [];
let previousRecord = null;

for (const record of data2) {
  if (
    previousRecord &&
    previousRecord["State/Territory"] === record["State/Territory"]
  ) {
    const percentChange =
      ((record.Payment - previousRecord.Payment) / previousRecord.Payment) *
      100;
    const change = {
      "State/Territory": record["State/Territory"],
      "Fiscal Year": record["Fiscal Year"],
      "Payment Percent Change": percentChange,
      PaymentType: record.PaymentType,
    };
    changes.push(change);
  }
  previousRecord = record;
}

// Write out csv formatted data.
process.stdout.write(csvFormat(data2));
