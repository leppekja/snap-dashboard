---
toc: true
theme: dashboard
---

```js
import {
  paymentErrorRatesOverTime,
  paymentErrorStateChange,
  potentialCostSharingPER,
} from "./components/payment_error_rate.js";
```

```js
const data = FileAttachment("data/snap.csv").csv({ typed: true });
const snapCostsAndParticipation = FileAttachment(
  "data/snap_participation_and_spending_with_projections.csv"
).csv({ typed: true });
const grid = FileAttachment("data/grid.csv").csv({ typed: true });
```

# Do states accurately determine eligibility and benefits?

The [USDA defines](https://www.fns.usda.gov/snap/qc/per) _payment error rates_ as measuring "the accuracy of each state’s eligibility and benefit determinations." This is not a measure of fraud.

If eligibility or benefit determinations are incorrect, the state may pay too much, termed an _over payment_, or too little, an _under payment_, in SNAP benefits to the receiving household. The USDA reports the rates of over and under payments as a percent of total allotment amounts, and as a weighted national average by state caseloads.

Note that when errors (over or under-payments) are identified, they [must be fixed](https://www.fns.usda.gov/snap/qc#AreSNAPrecipientsresponsibleforpayingbackbenefitstheyincorrectlyreceivedDotheygetrepaidforbenefitslessthanwhattheywereentitledto). So people who receive too much need to pay the state back, and people who receive too little are reimbursed by the state.

Practically, nearly all reports will list a general payment error rate, which is the summed percents of the over and underpayments. For example, Maryland had a 13.64% payment error rate in FY 2024, which was comprised of 8.85% of overpayments and 4.79% of underpayments.

Note that [there is a error threshold](https://www.fns.usda.gov/snap/qc/ett) that allows for small miscalculations; in 2025, this amount is $57. It [increases by one dollar](https://www.fns.usda.gov/snap/qc/ett/fy26) to $58 in FY 2026.

Also, the underpayment error rate does not include cases where a person is denied entirely incorrectly, and later deemed to have been eligible.

It's important to note that error rates are published in dollar amounts. A 10% total payment error rate indicates an estimate that 10% of dollars paid through SNAP were initially incorrectly paid.

So in Maryland, this does not mean that 8.85% of households were overpaid! It means that 8.85% of dollors paid through SNAP were paid out as overpayments. If Maryland paid out $100 in SNAP benefits, $8.85 was overpaid, and $4.79 was not paid to households that should have been paid.

This doesn't say anything about the magnitude of each payment (with the exception of knowing it was above the treshold by basis of it being included in the error rate), nor how common overpayments were, nor how many people were overpaid.

A lower underpayment rate (compared to overpayments) just indicates

- the total amount of money that should have been given to households but wasn't initially (underpayment)
- is less than
- the total amount of money that was given to households initially but shouldn't have been (overpayment).

For this reason, I think the payment error rate is a poor metric for public usage. Most news articles won't really even dive into what the error rate exactly calculates. It's just "the payment error rate", which to me implies the frequency of errors made. For example, this [news article](https://www.silive.com/data/2024/07/national-snap-benefit-payment-error-rate-nears-12-which-states-issue-the-most-overpayments-underpayments.html) seems to incorrectly infer how often households are under or over paid.

<!-- Which states have qualified for these penalties, and when? -->

```js
const stateInput = Inputs.select(
  data.map((d) => d["State/Territory"]),
  { unique: true, sort: true, multiple: false, label: "" }
);
const state = Generators.input(stateInput);
```

<div class="card">
<h2>Measurement policy changes and national crises contribute to rising published error rates in recent years.</h2>
<h3>In FY '23, nearly 60% of Alaska's SNAP dollars were
      overpayments due to a misapplication of a waiver. Explore more and highlight a state:</h3>
  ${stateInput}
  ${resize((width) => paymentErrorRatesOverTime(data, state, width))}
</div>

<!-- <div class="card">
  ${resize((width) => paymentErrorStateChange(data, width))}
</div> -->

### What exactly are we measuring?

We need to acknowledge that policy changes on the national and state levels likely influence these rates over time.

A [2014 GAO report](https://www.gao.gov/products/gao-16-708t) notes that the USDA "cited the change from only counting errors over $50 in the rate to counting all errors over $37 as a key factor in an increase in the rate in fiscal year 2014."

States may adopt certain waivers or procedures which limit the possibility for errors entirely, as well, like [simplified reporting options](https://www.fns.usda.gov/snap/waivers/state-options-report), which when initially offered in the 2002 Farm Bill was [estimated to have a potential effect of -1.2% to 1.5% on the error rate of each state](https://www.fns.usda.gov/research/snap/effects-simplified-reporting-payment-accuracy). An example of this might be a taking a standard medical deduction rather than requiring individuals to prove every medical expense.

Additionally, some states have [intentionally misreported cases and implemented disallowed policies to lower their error rates](https://www.justice.gov/archives/opa/pr/florida-department-children-and-families-agrees-pay-175-million-resolve-false-claims-act).

### Should there be a tolerance for errors at all?

Senator Joni Earnst has twice submitted [a bill to reduce the payment error tolerance to zero](https://www.ernst.senate.gov/imo/media/doc/snap_back_inaccurate_snap_payments_bill_text.pdf).

The [USDA charges a penalty](https://www.fns.usda.gov/snap/qc) to states which have high payment error rates for two consecutive years (higher than the national payment error rate) and "meet additional statuatory criteria". 50% of the charged penalty can be used for program improvement within the state. I'm unsure of where to find data about which states have been penalized or the amounts charged.

### Basing policy on the payment error rate

In 2025, the Trump Administration passed a bill to link these error rates to more severe financial penalties through a cost-sharing program, where the federal government will force the states to pay more of the program benefits and administration costs if the error rate is above 6% starting in FY 2028.

This is detailed in section 139 STAT. 84 in the [text of the act](https://www.congress.gov/bill/119th-congress/house-bill/1/text). Obviously, the FY 2025 and 2026 error rates are not available yet. Let's just go ahead for the fun of it and use the latest FY 2024 rates to see what happens.

```js
// data is in long format; only need first instance between over or underpayment really
const totalErrorRateByState2024 = data.filter(
  (d) =>
    (d["Fiscal Year"].getFullYear() === 2024) &
    (d.PaymentType === "OverPayment")
);

const costShareInput = Inputs.radio(
  new Map([
    ["0%", 0],
    ["5%", 5],
    ["10%", 10],
    ["15%", 15],
  ]),
  {
    label: "Potential Level of Cost Sharing in 2028",
    value: 0,
  }
);
const costShareLevel = Generators.input(costShareInput);
```

<div class="card">
  <h2>SNAP benefits will be much more expensive for states with high payment error rates.</h2>
  <h3>Recent legislation passed by the Trump Administration pushes allotment costs onto states starting FY 2028 if payment error rates exceed thresholds of 6%, 8%, or 10%+.</h3>
  ${costShareInput}
  ${resize((width) => potentialCostSharingPER(totalErrorRateByState2024, grid, costShareLevel))}
</div>
