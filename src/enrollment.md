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
const notes = [
  [
    {
      year: new Date(2005, 9, 1),
      rate: 32,
      note: "The Gulf Coast Hurricanes in 2005 \ncaused a large short-term increase.↴",
    },
  ],
  [
    {
      year: new Date(2017, 10, 1),
      rate: 40,
      note: "More hurricanes ↑",
    },
  ],
  [
    {
      year: new Date(2020, 4, 1),
      rate: 35,
      note: "↑ The impact of \nthe COVID-19 pandemic",
    },
  ],
];
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
<!-- https://talk.observablehq.com/t/is-there-a-way-to-associate-hyperlink-to-plot-text/7881/4 -->
${resize((width) => Plot.plot({
  width,
  x: { label: "Year" },
  y: { label: "millions of people", grid: true },
  title: "Monthly SNAP participation data shows the effect of short-term disasters on enrollment",
  subtitle: "February 2019 saw benefits be distributed in Jan 2019 to avoid a government shutdown, causing an aberration in the data.",
  marks: [
    Plot.lineY(snapMonthly.filter(d => new Date(d.fiscal_year_month) < new Date(2024, 7, 1)).map(d => {
      return {...d, personsInMils: d.persons / 1000000}
    }), {
        x: "fiscal_year_month",
        y: "personsInMils",
        tip: true
      },),
      Plot.text(notes[0], {
        x: "year",
        y: "rate",
        text: "note",
        textAnchor: "end",
        href: d => `https://www.ers.usda.gov/publications/pub-details/?pubid=45758`
      }),
      Plot.text(notes[1], {
        x: "year",
        y: "rate",
        text: "note",
        textAnchor: "end",
        href: d => `https://frac.org/research/resource-library/snap-monthly-data-2017`
      }),
      Plot.text(notes[2], {
        x: "year",
        y: "rate",
        text: "note",
        textAnchor: "start",
      })
  ]}))}
</div>

<details>
<summary>Official USDA note on the drop in Feb. 2019</summary>
<i>Due to the partial Federal government shutdown, most of the February 2019 SNAP benefits were issued early in the month of January 2019. This was done to ensure SNAP recipients would receive their February 2019 benefits in a timely manner.  As a result, January 2019's benefits will show a significant increase over the previous month and February 2019's benefits will show significantly less than January 2019.		</i>			  
</details>
