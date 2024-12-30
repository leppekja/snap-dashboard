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

The [USDA defines](https://www.fns.usda.gov/snap/qc/per) _payment error rates_ as measuring "the accuracy of each state’s eligibility and benefit determinations."

If eligibility or benefit determinations are incorrect, the state may pay too much, termed an _over payment_, or too little, an _under payment_, in SNAP benefits to the receiving household. The USDA reports the rates of over and under payments as a percent of all state cases.

Note that [there is a error threshold](https://www.fns.usda.gov/snap/qc/ett) that allows for small miscalculations; in 2025, this amount is $57.

If a person is denied entirely, is that an underpayment?

The [USDA charges a penalty](https://www.fns.usda.gov/snap/qc) to states which have high payment error rates for two consecutive years (higher than the national payment error rate) and "meet additional statuatory criteria.

Which states have qualified for these penalties, and when?

<div class="card">
  ${resize((width) => paymentErrorRatesOverTime(data, width))}
</div>

<div class="card">
  ${resize((width) => paymentErrorStateChange(data, width))}
</div>
