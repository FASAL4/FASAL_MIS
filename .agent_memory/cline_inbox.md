# Inbox: URGENT - Correct Fallacies in Landless Triangulation Insights
## Status: ✅ COMPLETED (July 2, 2026)

**Task Overview:**
The Dashboard currently displays two conflicting and logically flawed claims regarding landless farmers and tenant support. As a data consultant, I've audited these claims and found significant fallacies that misrepresent our impact. You need to correct the UI copy and the underlying logic to reflect accurate, defensible data.

**The Fallacies Identified:**

1. **Denominator Confusion (40% vs 36%):**
   - *Claim 1* states "40% (659) of the baseline cohort is landless" (using the full 1,638 demographic baseline).
   - *Claim 2* states "36% landless at baseline", but this number actually comes from `216 / 600` (the subset of *fuzzy-matched active farmers*). 
   - *The Fallacy:* Labelling the 36% metric as "landless at baseline" directly contradicts the 40% metric. The 36% actually represents the **composition of our active, matched cohort** (i.e., 36% of our active farmers *started out* as landless), not the overall baseline average.

2. **The "100% Formal Lease Leverage" Leap of Faith:**
   - *Claim 1* states: "...the MIS Rights Tab confirms 100% of our targeted tenant farmers have received formal lease leverage support."
   - *The Fallacy:* This is a massive analytical overreach. The system assumes that because a farmer was landless at baseline (0 acres) but is now logging crop yields in the MIS, the program *must* have provided them formal lease leverage. This ignores field realities: they may have secured informal sharecropping agreements independently, inherited land, or the baseline "0" might have simply been a data entry error. Unless the Rights Tab has exactly 216 logged entitlements for "Formal Land Lease", claiming 100% is factually incorrect and dangerous for an audit.

3. **Survivorship / Matching Bias:**
   - The 216 figure comes from a pool of 600 fuzzy-matched farmers (which is only a 45.4% match rate against the 1,322 active roster). Extrapolating definitive programmatic success without acknowledging the unmatched 54.6% is misleading.

**Action Items for Cline:**
1. **Rewrite the UI Copy (in `BaselineTab.tsx`, `OverviewTab.tsx`, or wherever these insights live):**
   - Fix the "36% landless at baseline" header to accurately say "36% of Active Cohort Started Landless".
   - Remove the fabricated "100% formal lease leverage support" claim entirely. Replace it with a grounded, defensible insight: "216 landless baseline families are now active cultivators in the program, indicating successful inclusion of sharecroppers."
2. **Review the JSON outputs:**
   - Check the scripts that generate `triangulated_insights.json` or `triangulation_summary.json` to ensure the metrics clearly distinguish between "Baseline Total Landless Rate" and "Matched Cohort Landless Rate".
3. **Verify and Commit:**
   - Verify the UI reads logically, contains no contradictory stats, and does not make claims we cannot back up with hard entitlement logs. Push the fix.

---
