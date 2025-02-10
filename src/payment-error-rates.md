---
toc: true
theme: dashboard
---

```js
import {
  paymentErrorRatesOverTime,
  paymentErrorStateChange,
} from "./components/payment_error_rate.js";
```

```js
const data = FileAttachment("data/snap.csv").csv({ typed: true });
const snapCostsAndParticipation = FileAttachment(
  "data/snap_participation_and_spending_with_projections.csv"
).csv({ typed: true });
```

# Do states accurately determine eligibility and benefits?

The [USDA defines](https://www.fns.usda.gov/snap/qc/per) _payment error rates_ as measuring "the accuracy of each state’s eligibility and benefit determinations." This is not a measure of fraud.

If eligibility or benefit determinations are incorrect, the state may pay too much, termed an _over payment_, or too little, an _under payment_, in SNAP benefits to the receiving household. The USDA reports the rates of over and under payments as a percent of all state cases, and as a weighted national average.

Note that [there is a error threshold](https://www.fns.usda.gov/snap/qc/ett) that allows for small miscalculations; in 2025, this amount is $57.

Also, the underpayment error rate does not include cases where a person is denied entirely incorrectly, and later deemed to have been eligible.

The [USDA charges a penalty](https://www.fns.usda.gov/snap/qc) to states which have high payment error rates for two consecutive years (higher than the national payment error rate) and "meet additional statuatory criteria".

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
<h3>In FY '23, nearly 60% of Alaska's cases resulted in
      overpayments due to a misapplication of a waiver, while 4.5% of recipients
      were underpaid in D.C. Explore more and highlight a state:</h3>
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

Senator Joni Earnst has twice submitted [a bill to reduce the payment error tolerance to zero](https://www.ernst.senate.gov/imo/media/doc/snap_back_inaccurate_snap_payments_bill_text.pdf). We
