---
toc: true
theme: dashboard
---

```js
import { responseToRecessions } from "./components/responseToRecessions.js";
import { CboProjectionRelativeDivergingBar } from "./components/CboProjectionRelativeDivergingBar.js";
import { monthlyPersonsEnrollmentAllTimeChart } from "./components/monthlyPersonsEnrollmentAllTime.js";
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
console.log(snapMonthly);
```

# How does SNAP enrollment change after economic downturns?

Ongoing debate is focused around policies that intentionally decrease enrollment, such as employment requirements, and cut costs, like limiting benefit amounts. How should we expect enrollment to change naturally during periods when the economy improves?

SNAP is a <i>countercyclical</i> assistance program, meaning that the enrollment will likely rise in response to disasters or economic recessions. The USDA released a report in September 2012 entitled [How Economic Conditions Affect Participation in USDA Nutrition Assistance Programs](https://www.ers.usda.gov/publications/pub-details/?pubid=43668) that we'll use as a starting point.

> A 1-percentage point increase in the unemployment rate is associated with an additional 2 million–3 million additional SNAP participants. Changes in program policy and administrative practices tend to augment the rise in SNAP participation during economic downturns and contribute to the continued rise in participation during the early stages of economic recovery. ([USDA](https://www.ers.usda.gov/topics/food-nutrition-assistance/supplemental-nutrition-assistance-program-snap/key-statistics-and-research/)).

For example, during the COVID-19 pandemic, the [time limit restricting enrollment for able-bodied adults without dependents was suspended](https://www.fns.usda.gov/snap/expiration-program-flexibilities-covid-19) and was reinstituted June 30th, 2023. So while we shouldn't expect enrollment to drop quickly, enrollment continues to rise for longer than I expected after the designated onset of the downturn.

The officially designated end of recent recessions don't align with SNAP enrollment dropping; enrollment continues to rise
The 2001 recession's designation was for 8 months; the Great Recession's was 1.5 years, and the COVID-19 recession for 2 months.

<div class="card">
${resize((width) => responseToRecessions(snapCostsAndParticipation, width))}
</div>
<div>

<!-- - Projections for SNAP enrollment & spending diverge, with spending increasing yearly from a higher baseline while enrollment is expected to steadily decrease.

<div class="card">
${resize((width) => CboProjectionRelativeDivergingBar(snapCostsAndParticipation, width))}
</div> -->

So we shouldn't expect SNAP enrollment to immediately drop after economic crises. One exception to this is natural disasters, which we can see in the monthly participation data.

<div class="card">
${resize((width) => monthlyPersonsEnrollmentAllTimeChart(snapMonthly, width))}
</div>

<details>
<summary>Official USDA note on the drop in Feb. 2019</summary>
<i>Due to the partial Federal government shutdown, most of the February 2019 SNAP benefits were issued early in the month of January 2019. This was done to ensure SNAP recipients would receive their February 2019 benefits in a timely manner.  As a result, January 2019's benefits will show a significant increase over the previous month and February 2019's benefits will show significantly less than January 2019.		</i>			  
</details>
