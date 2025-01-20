---
toc: true
theme: dashboard
---

```js
import {
  averageMonthlyParticipation,
  yearlyCostsLineChart,
} from "./components/costsOfSnap.js";
import { enrollmentByState } from "./components/enrollmentByState.js";
```

```js
const snapCostsAndParticipation = FileAttachment(
  "data/snap_participation_and_spending_with_projections.csv"
).csv({ typed: true });
```

```js
const snapByState = FileAttachment("data/state_participation_rate_map.csv").csv(
  { typed: true }
);

const grid = FileAttachment("data/grid.csv").csv({ typed: true });
```

```js
const snapParticipation2023 = snapCostsAndParticipation.filter(
  (d) => d["Fiscal year"] === 2023
)[0]["Average monthly participation (Millions of people)"];
const snapCost2023 = snapCostsAndParticipation.filter(
  (d) => d["Fiscal year"] === 2023
)[0]["Inflation-adjusted annual spending (Billions of 2023 dollars)"];
```

<div class="hero">
  <h1>Visualizing SNAP Performance Indicators</h1>
</div>

**work-in-progress as of 1-20-25**

The [Supplemental Nutrition Assistance Program](https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program) implements a [quality control system](https://www.fns.usda.gov/snap/qc) with the following aims, which are, according to the USDA,

- to measure the accuracy of states’ SNAP eligibility and benefit determinations,
- and to identify and correct errors in eligibility and benefit calculations.

Let's start with a quick overview of SNAP for context. We'll update some charts from the [USDA economic Research Service Key Statistics page](https://www.ers.usda.gov/topics/food-nutrition-assistance/supplemental-nutrition-assistance-program-snap/key-statistics-and-research/) to start with.

## The Benefits & Costs of SNAP

As of writing this in the Fall of 2024, debate continues on renewing the 2018 Farm Bill, of which SNAP funding accounts for the majority of the costs.

<div class="grid grid-cols-2">
<div class="card">
<h1>${snapParticipation2023}</h1> million average monthly participants benefited from SNAP in 2023
</div>
<div class="card">
<h1>$${snapCost2023}</h1> billion dollars spent on SNAP in 2023 (in 2023 dollars)
</div>
</div>
<div class="grid grid-cols-2">
<div class="card">
${resize((width) => averageMonthlyParticipation(snapCostsAndParticipation, width))}
</div>
<div class="card">
${resize((width) => yearlyCostsLineChart(snapCostsAndParticipation, width))}
</div>
</div>
</div>

It's hard to ignore that projections for SNAP enrollment & spending diverge, with spending increasing yearly from a higher baseline while enrollment is expected to steadily decrease.

This is partially due to [changes in how the Thrifty Food Plan is calculated during the Biden administration](https://www.usda.gov/media/press-releases/2021/08/16/usda-modernizes-thrifty-food-plan-updates-snap-benefits) to better reflect increases in the cost of food and modern diet recommendations.

Note that the cost of SNAP benefits are funded by the federal government, but administration costs are split with each state. Each state also has descretion to adjust eligibity past minimum guidelines that the federal goverment sets.

---

</div>
<details>
  <summary>Notes on <i>Average Monthly Participation Each Year in SNAP</i> and <i>Yearly Spending on SNAP</i> charts
  </summary>

<i>USDA Note for data from 2000 to 2023</i>: figures are "based on preliminary data from the September 2023 Program Information Report (Keydata) released by USDA, Food and Nutrition Service (FNS) in December 2023. FY 2019 average monthly participants excludes January and February 2019 counts, which were affected by a partial Federal Government shutdown.

Spending is noted in billions of 2023 dollars, adjusted using the Personal Consumption Expenditures price index, U.S. Department of Commerce, Bureau of Economic Analysis. Source: USDA, Economic Research Service using USDA, FNS data"; see "SNAP average monthly participation and inflation-adjusted annual program spending, FY 2000–23" at [USDA Key Statistics page](https://www.ers.usda.gov/topics/food-nutrition-assistance/supplemental-nutrition-assistance-program-snap/key-statistics-and-research/).

<i>Author Note (data from 2024 to 2034)</i>: Figures use estimated average monthly participation and outlays from [Congressional Budget Office Baseline Projections, released June 2024.](https://www.cbo.gov/system/files/2024-06/51312-2024-06-snap.pdf) I chose to use outlays to align with spending data from the USDA, compared to the budget authority, as described in the [CBO's Budgetary Terms Explained page](https://www.cbo.gov/publication/57660).

See the [How does SNAP enrollment change after economic downturns](http://127.0.0.1:3000/enrollment) page in this website for more explanation about the USDA's decision to exclude January and February 2019 counts, as well.

</details>

---

## Where are SNAP benefits distributed to?

<div class="grid grid-cols-3" style="grid-auto-rows: auto;">

Participation in the SNAP program varies by state. Utah had the [lowest enrollment rate nationally](https://kslnewsradio.com/utah/thousands-of-eligible-older-utahns-not-enrolled-for-snap/2130363/), while New Mexico stands out with nearly 1 in 4 people receiving SNAP benefits at some point in 2023.<br><br> In general, the mid-northwest region of the United States holds lower participation rates than the rest of the country.<br><br>The [Center on Budget and Policy Priorities also provides state-by-state fact sheets](https://www.cbpp.org/research/a-closer-look-at-who-benefits-from-snap-state-by-state-fact-sheets), although only up to FY 2022 SNAP data.

<div class="card grid-colspan-2">
  ${resize((width) => enrollmentByState(snapByState, grid))}
</div>
</div>

---

</div>
<details>
  <summary>Notes on <i>SNAP participation rate by state in fiscal year 2023</i>
  </summary>

Data comes from the [USDA Key Statistics page](https://www.ers.usda.gov/topics/food-nutrition-assistance/supplemental-nutrition-assistance-program-snap/key-statistics-and-research). USDA also credits the Economic Research Service using data from USDA, Food and Nutrition Service and U.S. Department of Commerce, Bureau of the Census for the original map, entitled "Percent of population receiving SNAP benefits in fiscal year 2023".

</details>

---

## The Quality Control Process

With the SNAP program reaching tens of millions of Americans each year, and the costs increasing, how does the USDA make sure that the program runs well?

We'll walk through three quality control measurements that the USDA publishes: payment error rates, case and procedural error rates, and application processing timeliness rates.

These are determined through sampling about 75,000 cases per year - if you're interested, you can [download quality control data](https://www.fns.usda.gov/snap/qc/database) from the USDA.
