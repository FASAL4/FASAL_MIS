# Inbox: Data Triangulation & Integrity Auditing
## Status: PENDING USER REVIEW / ASSIGNED

**Task Assigned on 2026-06-29:**

The following tasks have been delegated to Cline to support the FASAL MIS data integrity overhaul.

---

### Task 1: Land Discrepancy Audit Script
*   **Goal:** Audit the 600 matched active farmers to verify land size reporting consistency (Acres vs. Bigha).
*   **Action:** Create `scripts/audit_land_discrepancies.cjs`.
*   **Requirements:**
    1.  Load `src/data/farmers.json`.
    2.  For each farmer where `matched === true`:
        *   Retrieve baseline land (Sum of `baselineCultivableLandBigha` and `baselineLeaseLandBigha` if present).
        *   Retrieve active land (`totalLand` in Acres).
        *   Convert active acres to local Bighas: `activeBighas = activeAcres * 1.6` (regional standard for Eastern UP).
        *   Compare `activeBighas` against baseline total bighas.
        *   If the absolute difference is greater than **20%** of the baseline land, flag it as a discrepancy.
    3.  Save the report to `src/data/land_discrepancies.json` with the following structure:
        ```json
        {
          "summary": {
            "totalAudited": 600,
            "totalDiscrepancies": 0,
            "matchAccuracyPct": 100.0
          },
          "outliers": [
            {
              "id": "DHODEKTA1",
              "name": "Anurudh",
              "village": "Dhodhepurwa",
              "activeAcres": 0.40,
              "convertedBighas": 0.64,
              "baselineBighas": 3.0,
              "deviationPct": 78.6
            }
          ]
        }
        ```

---

### Task 2: Create Active Caste Outcome Triangulation
*   **Goal:** Group active training participation and leverage by matched baseline caste categories.
*   **Action:** Create `scripts/caste_outcomes_triangulation.cjs`.
*   **Requirements:**
    1.  Load `src/data/farmers.json`.
    2.  Process leverage mobilization:
        *   Group matched farmers by baseline `category` (SC, ST, OBC).
        *   (Optional if matching available) Associate active leverage files/amounts to these categories.
    3.  Process training sessions:
        *   Map matching farmers who attended training logs to baseline demographics.
    4.  Save output to `src/data/caste_outcomes.json` for UI visualization.

---

*Please ensure all scripts run without syntax errors and verify builds using `npm run lint` before completing.*
