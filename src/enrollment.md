---
toc: true
theme: dashboard
---

```js
import { responseToRecessions } from "./components/responseToRecessions.js";
import { CboProjectionRelativeDivergingBar } from "./components/CboProjectionRelativeDivergingBar.js";
```

```js
const snapCostsAndParticipation = FileAttachment(
  "data/snap_participation_and_spending_with_projections.csv"
).csv({ typed: true });
const snapMonthly = FileAttachment("data/snap-monthly.csv").csv({
  typed: true,
});
```

```js

```

# How does SNAP enrollment change after economic downturns?

<p style="max-width: 100%">Ongoing debate is focused around policies that decrease enrollment, such as employment requirements, and cutting costs, like limiting benefit amounts. SNAP is a <i>countercyclical</i> assistance program, meaning that the enrollment will likely rise in response to disasters or economic recessions. The more topical question for pundits and politicians - especially when the Farm Bill is up for renewal - is how enrollment should decrease</p>

<div class="grid grid-cols-2">
<div>

- SNAP is a emergency program.
- The period following the start of the Great Recession in 2008 peaked in 2013 with about 20 million additional enrollees.

- The COVID-19 pandemic in 2020 reversed a downward trend in already high SNAP enrollment.

</div>
<div class="card">
${resize((width) => responseToRecessions(snapCostsAndParticipation, width))}
</div>
<div>

- Projections for SNAP enrollment & spending diverge, with spending increasing yearly from a higher baseline while enrollment is expected to steadily decrease.

<div class="card">
${resize((width) => CboProjectionRelativeDivergingBar(snapCostsAndParticipation, width))}
</div>

This is partially due to [changes in how the Thrifty Food Plan is calculated during the Biden administration](https://www.usda.gov/media/press-releases/2021/08/16/usda-modernizes-thrifty-food-plan-updates-snap-benefits) to better reflect increases in the cost of food and modern diet recommendations.

</div>

<div class="card">
${resize((width) => Plot.plot({
  width,
  title: "monthly data",
  marks: [
    Plot.lineY(snapMonthly.filter(d => new Date(d.fiscal_year_month) < new Date(2024, 7, 1)), {
        x: "fiscal_year_month",
        y: "persons",
        tip: true
      },),
  ]}))}
</div>
