---
toc: true
theme: dashboard
---

```js
import {
  applicationProcessingTimelinessChart,
  totalStatesTimelyChart,
} from "./components/applicationProcessingTimeliness.js";
```

```js
const aptData = FileAttachment("data/aptData.csv").csv({ typed: true });
```

# Application Processing Timeliness

If a household is eligible for SNAP benefits, states agencies are required to process your case within 30 days of application, or within 7 days for households eligible for expedited service.

The [Application Processing Timeliness Rate](https://www.fns.usda.gov/snap/qc/timeliness) compares how many applications are approved within the time limit out of the total number of received applications.

<div class="card">
  ${resize((width) => totalStatesTimelyChart(aptData, width))}
</div>

Not meeting these guidelines may result in losing federal funding.

<div class="card">
<h2>Published annual Application Timeliness Rates for each state are consistently under the 95% benchmark for timeliness.</h2>
${resize((width) => applicationProcessingTimelinessChart(aptData, width))}
</div>

<details>
  <summary>Notes on <i>Application Timeliness By Year and State</i>
  </summary>

Note again the missing data from 2020 and 2021, where this reporting requirement was suspended.

FNS [provides a disclaimer](https://www.fns.usda.gov/snap/qc/timeliness/fy23) about using this as a regulatory compliance measure: A case may be coded as untimely even if the delay was caused by the applicant, unless the status of the case is properly flagged.

</details>

While the USDA publishes these annual APT rates for each state, in practice they seem to [track quarterly rates](https://www.fns.usda.gov/snap/admin/improving-state-timeliness-rates-escalation-process-guidance) for their review process. This reporting lag alongside the difference in time periods used to measure compliance versus public reporting limits the usefulness of these annual numbers.

For example, a USDA notice released April 1, 2025 to state agencies indicated 33 states are currently out of compliance; knowing this as a member of the public only seems to occur when the USDA sends one of these official notices. Are state agencies releasing quality control data more frequently to the public?
