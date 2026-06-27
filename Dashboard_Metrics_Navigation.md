# Dashboard Metrics Master Navigation

This document explains the sources and calculation logic for all metrics displayed on the dashboard. It serves as a master guide for tracing any dashboard figure back to its raw database file.

## 1. Overview Tab Metrics

### Total Net Income
* **UI Location:** Overview Tab > KPI Cards
* **Source Files:** `DEHAT_Dash.xlsx`, `crop_economics.json`
* **Calculation:** The sum of all net incomes across all adopted crops per year. Originally calculated as (Gross Sales Income - Input Costs), but now directly uses the provided net income figures from the raw data files.
* **Caveat:** Hardcoded target metrics (e.g. ₹1.50 Cr) are used for progress indication.

### Total Income Generated (Leverage)
* **UI Location:** Overview Tab > KPI Cards
* **Source Files:** `leverage.json`, parsed from Leverage AASs tracking sheets.
* **Calculation:** Cumulative sum of government schema disbursements and entitlements generated for the enrolled community.

### Year-wise RF Progression — Combined Net Income
* **UI Location:** Overview Tab > Bar Chart
* **Source Files:** `income_security.json`, `DEHAT_Dash.xlsx`
* **Calculation:** Year-on-year total net income of all program-enrolled farmers.

## 2. Agriculture Tab Metrics

### Crop-wise Cost vs Income vs Net Income
* **UI Location:** Agriculture Tab > "Cost vs Income vs Net Income by Year" Bar Chart
* **Source Files:** `crop_economics.json` (Parsed from `Updated_Fasal Crop wise details_Update _2025.xlsx`)
* **Calculation:**
  - **Income:** Extracted directly from raw logs (divided by 1 Lakh for charting).
  - **Net Income:** Equal to the Income figure (cost is no longer deducted as the data itself is entered deducting cost).
  - **Cost:** Extracted from raw logs.
* **Note on Bilingual / Duplicate Crops:**
  - `Bhindi` is programmatically mapped to `Okra`.
  - `Haldi` and `हल्दी` are programmatically mapped to `Turmeric`.
  - *Note: These mappings are enforced during raw data ingestion.*
* **Excluded Crops:** "Cumin", "Fennel", and "Mixed Cropping" have been removed due to lack of recorded data / blank graphs.

### Household Crop Economics (Avg Per Farmer)
* **UI Location:** Agriculture Tab > "Household Crop Economics" Bar Chart
* **Source Files:** `crop_economics.json`
* **Calculation:** Total Income for the crop divided by the number of adopting farmers for that year.
  - `avgNet = Total Net Income / Adopting Farmers`

### Adopting Farmers by Year
* **UI Location:** Agriculture Tab > "Adopting Farmers by Year" Bar Chart
* **Source Files:** `crop_economics.json`
* **Calculation:** Count of unique farmers who actively cultivated the selected crop in the given year.

## 3. Demographics and Evidence

### Total Farmers Reached
* **UI Location:** Overview Tab > Demographics
* **Source Files:** `farmers.json` (Parsed from `Training data_FASAL MIS` files)
* **Calculation:** Distinct count of farmer IDs cross-referenced across years.

### Entitlements & Rights
* **UI Location:** Rights & Leverage Tab
* **Source Files:** `entitlements.json`, `leverage.json`
* **Calculation:** Aggregation of distinct entitlement claims, segregated by claim status (e.g. Approved vs Pending).

## 4. Institutions & Capacity Tab Metrics

### Capacity Intensity (Avg Sessions/Household)
* **UI Location:** Institutions & Capacity Tab > Line Chart
* **Source Files:** `training.json` (Parsed from `Training Dashboard.xlsx`)
* **Calculation:** Total annual training participants divided by 1329 (the total number of participating families).
  - `sessionsPerHousehold = Total Annual Participants / 1329`

### Training History
* **UI Location:** Institutions & Capacity Tab > Table
* **Source Files:** `training.json` (Parsed from `Training Dashboard.xlsx`)
* **Calculation:** Raw training records grouped and aggregated by Year and Training Title. The table shows the total participants per session type.
