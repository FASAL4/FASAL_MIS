# Inbox: Overhaul Active-to-Baseline Matching & Land Unit Scalings
## Status: PENDING USER REVIEW / ASSIGNED

**Task Assigned on 2026-06-29:**

The following tasks have been delegated to Cline to remediate the matching bugs and land unit scaling factors in the FASAL MIS data pipeline.

---

### Task 1: Fix Triangulation Bugs in `scripts/triangulate_land.ts`
*   **Goal:** Correct matching errors that caused multiple Shanti Devis to match the same active record and bypass group/village checks.
*   **Action:** Modify [triangulate_land.ts](file:///c:/Users/bentn/antigravity/Untitled/scripts/triangulate_land.ts).
*   **Requirements:**
    1.  **Prevent Empty Group Matches:** Skip the group matching check if either `cGroup` (CSV AAS Name) or `fGroup` (Registry AAS Group Name) is empty or blank. (Avoid `fGroup.includes('') === true`).
    2.  **Village/Panchayat Filtering:** Verify that the village name or panchayat in the active CSV (column `Village Panchayat` or `Village Name`) corresponds to the active registry's village/panchayat.
    3.  **Fuzzy Score Sorting:** When finding candidates, sort the matching array descending by the name similarity ratio and select the best candidate (`matches[0]`), rather than picking the first row in raw CSV layout order.

---

### Task 2: Standardize Unit Divisors in `scripts/triangulate_baseline_full.cjs`
*   **Goal:** Align baseline land size calculations to use the same Kutcha Bigha divisor (5.0) as the active CSV.
*   **Action:** Modify [triangulate_baseline_full.cjs](file:///c:/Users/bentn/antigravity/Untitled/scripts/triangulate_baseline_full.cjs).
*   **Requirements:**
    1.  Update the bigha-to-acre conversion divisor from `1.6` to `5.0` for all land variables (`cultivableLandAcres` and `leaseLandAcres`).
    2.  This standardizes baseline and active land to the same Kutcha standard ($1\text{ Acre} = 5\text{ Bighas}$).

---

### Task 3: Database Reconstruction & Verification
*   **Goal:** Rerun the data pipeline with the fixed code and verify that no multiple matches occur.
*   **Action:** Execute the scripts in order:
    1.  `npx tsx scripts/triangulate_land.ts` (updates active land sizes in `farmers.json`).
    2.  `node scripts/triangulate_baseline_full.cjs` (updates baseline details in `farmers.json`).
    3.  `node scripts/caste_outcomes_triangulation.cjs` (updates caste outcomes).
*   Ensure that `npm run lint` and `npm run build` run successfully after the build.
