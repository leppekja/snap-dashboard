---
toc: true
theme: dashboard
---

```js
import {
  applicationProcessingTimelinessChart,
  totalStatesTimelyChart,
  enrollmentAgainstTimeliness,
} from "./components/applicationProcessingTimeliness.js";
```

```js
const aptData = FileAttachment("data/aptData.csv").csv({ typed: true });
const enrollmentData = FileAttachment("data/snap-monthly.csv").csv({
  typed: true,
});
```

# Application Processing Timeliness

If a household is eligible for SNAP benefits, states agencies are required to process your case within 30 days of application, or within 7 days for households eligible for expedited service.

The [Application Processing Timeliness Rate](https://www.fns.usda.gov/snap/qc/timeliness) compares how many applications are approved within the time limit out of the total number of received applications. The USDA reports these rates annually.

States are expected to process 95% of applications within the time limit to remain in compliance with USDA standards. This processing time can be delayed by both the state and the applicant; the USDA gives the example of an applicant missing an interview as an instance where the state was in compliance even as a delay occurs. The USDA also notes that cases where the applicant does not provide required materials (as long as they are properly encoded) should not appear in this measure.

Very few states consistently meet the timeliness guidelines that the USDA sets.

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

While the USDA publishes these annual APT rates for each state from the Quality Control data, in practice they also seem to [track monthly and quarterly rates from the states](https://www.fns.usda.gov/snap/admin/improving-state-timeliness-rates-escalation-process-guidance) for their review process. This reporting lag alongside the difference in time periods used to measure compliance versus public reporting limits the usefulness of these annual numbers. These more frequent reports may [also be calculated slightly differently](https://fns-prod.azureedge.us/sites/default/files/resource-files/updated_apt_escalation_procedures.pdf#page=10) with respect to pending cases, since Quality Control data may have more information about a case.

For example, a USDA notice released April 1, 2025 to state agencies indicated 33 states are currently out of compliance; knowing this as a member of the public only seems to occur when the USDA sends one of these official notices. Are state agencies releasing quality control data more frequently to the public? I have not been able to find it for Michigan or Illinois.

What causes such consistently low timeliness rates across the U.S.?

We can check if there is a relationship between higher numbers of cases and more late cases.

<div class="card">
  <h2>Higher SNAP enrollment doesn't entirely explain states' lower timeliness rates</h2>
  <h3>Highlighting <span style="color: #80cdc1; font-weight: bold;">2023</span> rates, with <span style="color: #dfc27d; font-weight: bold;">previous years</span> for context suggests we need to explore additional factors for not meeting USDA's expectations.</h3>
  ${resize((width) => enrollmentAgainstTimeliness(enrollmentData, aptData, width))}
</div>
