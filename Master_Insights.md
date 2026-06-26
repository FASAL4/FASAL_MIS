# DEHAT FASAL Master Insights Document
## Exhaustive Data Intelligence for Dashboard & Reporting

> **Programme**: Farmers' Action for Sustainable Agro-based Livelihoods (FASAL)
> **Implementing Organisation**: Developmental Association for Human Advancement (DEHAT)
> **Funder**: Azim Premji Philanthropic Initiatives (APPI)
> **Grant Period**: 5-Year Phase (2022–2027)
> **Geography**: District Bahraich, Block Mihinpurwa, Uttar Pradesh
> **Database Source**: `master_context.db` (58 tables, ~64 MB)

---

## Table of Contents

1. [Programme Architecture & RF Overview](#1-programme-architecture--rf-overview)
2. [Geographic & Demographic Profile](#2-geographic--demographic-profile)
3. [Outcome 1: Community Organisation & Institution Building](#3-outcome-1-community-organisation--institution-building)
4. [Outcome 2: Food Security, Nutrition & Agricultural Income](#4-outcome-2-food-security-nutrition--agricultural-income)
5. [Outcome 3: Community Resource Persons (Krishi Mitras)](#5-outcome-3-community-resource-persons-krishi-mitras)
6. [Outcome 4: Rights, Entitlements & Government Schemes](#6-outcome-4-rights-entitlements--government-schemes)
7. [Outcome 5: Organisational Strengthening](#7-outcome-5-organisational-strengthening)
8. [Leverage & Convergence Data (2023–2025)](#8-leverage--convergence-data-20232025)
9. [Training & Capacity Building Data (2022–2025)](#9-training--capacity-building-data-20222025)
10. [Crop Economics & Production Data](#10-crop-economics--production-data)
11. [FDB (Family Development Booklet) Field Architecture](#11-fdb-family-development-booklet-field-architecture)
12. [Evidence Audit & Dashboard Safety Rules](#12-evidence-audit--dashboard-safety-rules)
13. [Grant Report Claims vs Raw Data Verification](#13-grant-report-claims-vs-raw-data-verification)
14. [Intersectional Data Beyond RF](#14-intersectional-data-beyond-rf)
15. [Data Gaps & Open Questions](#15-data-gaps--open-questions)
16. [Quick Reference: Key Numbers](#16-quick-reference-key-numbers)

---

## 1. Programme Architecture & RF Overview

### 1.1 Programme Summary

DEHAT's FASAL programme is a 5-year, rights-based, agro-livelihoods intervention targeting **1,500 marginal farmer families** in **20 villages** across **7 Gram Panchayats** in Block Mihinpurwa, District Bahraich, Uttar Pradesh. The programme is funded by APPI and structured around a **5-Outcome Results Framework**.

### 1.2 Five-Outcome RF Structure

| RF Objective | Theme | Grant-End Target (HH) |
|---|---|---|
| **Outcome 1**: Community Organisation & Institution Building | AAS formation, cluster/block federations, stakeholder interface | 1,500 HH |
| **Outcome 2**: Food & Nutrition Security + Agricultural Income Increase | 12-month food security, income from ₹10K to ₹60K/acre/annum | 1,500 HH |
| **Outcome 3**: Network of 80 Community Resource Persons (Krishi Mitras) | CASCADE model, on-farm mentoring | 1,600 individuals |
| **Outcome 4**: Citizens' Access to Rights, Entitlements & Govt. Schemes | FRC, digital access, scheme facilitation | 1,500 HH |
| **Outcome 5**: Organisational Strengthening | Team capacity, policy, compliance, sustainability | Internal |

### 1.3 RF Items Extracted from Template

From the RF Template (`RF Template (5year) Ver.2.0 16th Aug.xlsx`), **89 RF items** were structurally extracted:

| RF Level | Count |
|---|---|
| Outcome Indicators | 8 |
| Output Indicators | 38 |
| Activity Items | 43 |

### 1.4 Three-Tier Institutional Structure

1. **AAS (Aajeevika Adhikaar Sangathan)**: Village-level groups of 15–20 farmers. Target: 80 groups. Achieved: 82 formed (74 active per 2025 report).
2. **Cluster Federations**: 1 cluster per ~16 AAS groups. Target: 5. Formed: 5.
3. **Block Level Federation (BLF)**: 1 BLF ("Sangharsh") consisting of 40 individuals. Formed: 1.

---

## 2. Geographic & Demographic Profile

### 2.1 Coverage Area

| Dimension | Value | Source |
|---|---|---|
| District | Bahraich | DEHAT Cleaned Data |
| Block | Mihinpurwa | DEHAT Cleaned Data |
| Gram Panchayats | 7 (6 active) | DEHAT Cleaned Data / AAS INFO |
| Villages | 20 | AAS INFO Table |
| Total Households in FDB | 1,329 | DEHAT Cleaned Data (row count) |
| Total Farmer Records (Crop Data) | 1,866 | Crop Details Table |

### 2.2 Gram Panchayat Distribution

| Gram Panchayat | Households (FDB) |
|---|---|
| Karikot | 602 (45.3%) |
| Fakirpuri | 229 (17.2%) |
| Chahalwa | 183 (13.8%) |
| Bajpur Bankati | 113 (8.5%) |
| Mangalpurwa | 88 (6.6%) |
| Vishunapur | 73 (5.5%) |
| Badkhadiya | 41 (3.1%) |

### 2.3 Family Demographics

| Metric | Value |
|---|---|
| Average Family Size | 4.4 members |
| Min Family Size | 0 (data quality flag) |
| Max Family Size | 11 |
| Modal Family Size | 4–5 members (637 families, 47.9%) |
| Families with 1 member | 24 (1.8%) |
| Families with 6+ members | 300 (22.6%) |

**Family Size Distribution**:

| Members | Count | % |
|---|---|---|
| 0 | 4 | 0.3% |
| 1 | 24 | 1.8% |
| 2 | 175 | 13.2% |
| 3 | 189 | 14.2% |
| 4 | 323 | 24.3% |
| 5 | 314 | 23.6% |
| 6 | 181 | 13.6% |
| 7 | 75 | 5.6% |
| 8 | 28 | 2.1% |
| 9 | 9 | 0.7% |
| 10 | 6 | 0.5% |
| 11 | 1 | 0.1% |

### 2.4 Land Ownership

Land data is in text format (mixed Hindi and English), primarily measured in **bigha**. The most common land holdings are **1–5 bigha** (small and marginal farmers), confirming the programme's target demographic of marginal landholders.

| Land (Bigha) | Approx. Count |
|---|---|
| 1 bigha | ~122 (combined Hindi/English entries) |
| 2 bigha | ~159 |
| 3 bigha | ~63 |
| 4 bigha | ~40 |
| 5 bigha | ~51 |
| 10 bigha | ~27 |
| "Bari" (homestead only) | 15 |

> **Data Quality Note**: Land data has inconsistent encoding (Hindi "बीघा", English "bigha", variations like "vigha+", "1vigha+"). Needs standardisation for dashboard use.

### 2.5 Self-Help Group (SHG) Linkage

- **68 distinct SHG names** recorded
- **78.7% of respondents** (1,047) reported "No" SHG membership
- The remaining ~282 households are distributed across 67 SHG names, with highest being Rani (8), Khushi (4), Santi (3)
- **Implication**: Low SHG linkage — FASAL's AAS model operates independently of the SHG ecosystem

---

## 3. Outcome 1: Community Organisation & Institution Building

### 3.1 AAS Groups

| Metric | RF Target | Achieved | Source |
|---|---|---|---|
| AAS Groups Formed | 80 | 82 | FASAL MIS / Grant Reports |
| Active AAS Groups (2025) | 80 | 74 | Grant Report 2025 |
| Cluster Federations | 5 | 5 | Grant Reports |
| Block Level Federation | 1 | 1 ("Sangharsh") | Grant Reports |
| Individuals in AAS | 1,500 | 1,329 (FDB count) | DEHAT Cleaned Data |

### 3.2 AAS Group Listing (from AAS INFO Table)

**88 AAS groups** are listed in the AAS INFO table across 7 Gram Panchayats and 20 villages. Each group has 12–22 members. Sample:

| GP | Village | AAS Name | Members |
|---|---|---|---|
| Badkhadiya | Dhodhepurwa | Ekta AAS | 16 |
| Badkhadiya | Dhodhepurwa | Jyoti AAS | 15 |
| Badkhadiya | Dhodhepurwa | Laxmi AAS | 18 |
| Bajpur Bankati | Bajpur Bankati | Champa | 16 |
| Bajpur Bankati | Bajpur Bankati | Gaytri | 15 |
| Chahalwa | Ghoorepurwa | Tara | 20 |
| Chahalwa | Ghoorepurwa | Seetal | 20 |
| Chahalwa | Mangalpurwa | Arti | 20 |
| Chahalwa | Sirsiyanpurwa | Ambe | 20 |
| Fakirpuri | Rajaram Tanda | Asha | 20 |
| Karikot | Bhattha Bargadaha | Ujala | 17 |

> **Note**: 88 AAS groups in the INFO table vs. 82 reported as "formed" — the discrepancy may include sub-groups, re-formations, or data entry variance.

### 3.3 Institutional Training (RF Outputs)

| Output Indicator | Target | Unit |
|---|---|---|
| Leadership & group management training | 960 | individuals |
| Gender-based discrimination training | 960 | individuals |
| District-level interface meetings | 320 | participants |
| Block-level interface meetings | 360 | participants |
| Village-level interface meetings | 1,500 | farmers |

### 3.4 RF Outcome Indicators for Obj. 1

| Outcome Indicator | Unit | Year-wise Targets | End Target |
|---|---|---|---|
| Farmers receive leverage/govt. support through community negotiations | Households | Y2: 200, Y3: 300, Y4: 500, Y5: 500 | 1,500 |
| AAS groups claiming entitlements via Gram Sabha | Households | Y2: 200, Y3: 300, Y4: 500, Y5: 500 | 1,500 |

---

## 4. Outcome 2: Food Security, Nutrition & Agricultural Income

### 4.1 RF Outcome Indicators for Obj. 2

| Outcome Indicator | Unit | End Target |
|---|---|---|
| 1,500 HH have 12-month food security (production: 5 → 12 quintals/year) via Zaid + Rabi + Kharif | Households | 1,500 |
| Avg agricultural income increase from ₹10,000/acre/annum to ₹60,000/acre/annum | Households | 1,500 |

### 4.2 RF Output Indicators for Obj. 2

| Output Indicator | Target | Unit |
|---|---|---|
| NRM & LEISA training participants | 400 | individuals |
| Multi-layer farming training | 300 | individuals |
| Multi-layer farming practice (project + self-adoption) | 420 | individuals |
| Mixed farming training | 300 | individuals |
| Inter/mix cropping practice | 560 | individuals |
| Organic pest management training | 400 | individuals |
| Organic manuring practice | 1,040 | individuals |
| Line sowing & distancing practice | 900 | individuals |
| Turmeric & ginger cultivation training | 400 | individuals |
| Turmeric/ginger cultivation practice | 220 | individuals |
| Rooftop farming & nutrition garden | 1,040 | individuals |
| Fruit cultivation (banana, jamun) | 140 | individuals |
| Cross-learning exposure visits | 100 | individuals |

### 4.3 Food Consumption Tracking (FDB)

The FDB contains **1,260 food consumption fields** tracking **white, green, and yellow food group consumption** on a **monthly basis** from January 2022 onward. This is the **tricolour (tiranga) nutrition tracking** system.

**Food Groups Tracked**:

| Colour | Category | Items Tracked |
|---|---|---|
| **White** | Protein/Dairy | Milk, Cheese (Paneer), Egg, Cauliflower, Rice |
| **Green** | Vegetables/Fibre | Bitter gourd, Bottle gourd, Drumstick leaf, Greens (Saag), Ladyfinger, Lemon, Banana, Cowpea, Pumpkin, Ridge gourd, Jackfruit, Pointed gourd, Kundru, Cucumber |
| **Yellow** | Pulses/Grains | Pigeon pea, Chickpea, Peas dal, Lentil, Soybean, Wheat, Maize, Muskmelon, Banana |

**Source Tracking**: Each item is tracked for whether it was "self-grown" or "bought from market" — enabling calculation of food self-sufficiency and economic value of home production.

**Coverage**: Monthly data for 2022, 2023, and 2024 (January through December for each year).

### 4.4 Quantitative Evidence from MIS & DEHAT_Dash (Corrected)

| Metric | Old Value (MIS Only) | Corrected Value (Raw Data) | Source |
|---|---|---|---|
| Turmeric Adopters | 137 farmers | **112 farmers** (Crop Details Sheet3) / **129 farmers** (Sheet2 cost/income) | DEHAT_Dash.xlsx |
| Turmeric Total Net Income | ₹46,17,245 | **₹23,16,000** (Sheet3) / **₹21,01,022** (Sheet2) | DEHAT_Dash.xlsx |
| Avg Net Income (Turmeric) | ₹34,202 per farmer | **₹20,679** (Sheet3) / **₹16,287** (Sheet2) per farmer | DEHAT_Dash.xlsx |
| Turmeric Cultivation Area | — | **6.91 acres** | DEHAT_Dash.xlsx Sheet3 |
| Turmeric Income per Acre | — | **₹3,35,166** per acre | DEHAT_Dash.xlsx Sheet3 |
| Multi-Layer Farming Adopters | 152 farmers | 152 farmers | FASAL MIS |
| LEISA Training Participants | 296 | 296 | FASAL MIS |
| Vegetable Cultivation | 966 farmers | 966 farmers | FASAL MIS |
| Nutritional Garden Instances | 3,306 | 3,306 | FASAL MIS |

> **Note on Turmeric Data Discrepancy**: The old MIS figure of 137 farmers / ₹34,202 avg income came from a single reported row. The corrected figures are extracted directly from DEHAT_Dash.xlsx — Sheet3 (Crop Details, turmeric column at unnamed_104–107) and Sheet2 (farmer-wise cost/income). The 112–129 range reflects different deduplication: Sheet3 tracks crop-instance level, Sheet2 tracks farmer-level. The **combined turmeric + ginger reach is 178 farmers** with ₹27,06,000 total income.

### 4.5 DEHAT_Dash Income Security Dashboard (from Master Sheet)

| KPI Metric | Target | Achieved | Achievement % | Source |
|---|---|---|---|---|
| Income per Acre (Rs) | ₹60,000 | **₹1,31,977** | **220%** | DEHAT_Dash Income Security Dashboard |
| Total Net Income (Rs Lakhs) | ₹150L | **₹169.78L** | **113%** | DEHAT_Dash Income Security Dashboard |
| Farmers with Income Data (2025) | 500 | **734** | **147%** | DEHAT_Dash Income Security Dashboard |
| Total Cultivated Area (Acres) | 100 | **128.65** | **129%** | DEHAT_Dash Income Security Dashboard |
| Crops Tracked | 20 | **26** | **130%** | DEHAT_Dash Income Security Dashboard |
| No. of Crop Varieties | 12 | **26** | **217%** | DEHAT_Dash Year-wise RF Progression |

---

## 5. Outcome 3: Community Resource Persons (Krishi Mitras)

### 5.1 RF Targets

| Indicator | Target |
|---|---|
| Krishi Mitras identified | 80 |
| Krishi Mitras trained (NRM/LEISA) | 80 |
| Krishi Mitras trained (crop rotation) | 80 |
| Krishi Mitras trained (organic methods) | 80 |
| Krishi Mitra exposure visits | 40 |
| Krishi Mitra monthly meetings | Ongoing |
| Krishi Mitras impacting farmers (CASCADE) | 1,600 individuals (80 KM × 20 farmers each) |

### 5.2 Achievement Evidence

| Metric | Value | Source |
|---|---|---|
| Krishi Mitras Trained | 48 (from MIS) / 75 (from Grant Report 2024) | MIS + Grant Report |
| KM–Household Linkage | Available in FDB (name + WhatsApp) | DEHAT Cleaned Data |
| CRP Training Programs | 34 conducted, 643 participants | Training Summary Data |

> **Evidence Caveat**: FDB proves household linkage to a Krishi Mitra, but **cannot prove** training completion, active monthly meetings, or farmer impact. Use RF reports and attendance records for training counts.

---

## 6. Outcome 4: Rights, Entitlements & Government Schemes

### 6.1 RF Targets

| Indicator | Target |
|---|---|
| Farmers Resource Center (FRC) — 1 per block | 1 (Jan Seva Kendra) |
| Families accessing FRC | 1,600 |
| Individuals trained on govt. schemes | 200 |
| Digital accessibility training | 320 |
| Farmers registered on govt. portals | 1,500 |

### 6.2 Entitlements Tracked in FDB

The FDB tracks **1,203 entitlement/service fields** across a comprehensive set of schemes, with a **three-stage funnel**: Awareness → Facilitation (Leading Done) → Receipt.

**Key Scheme Categories (from FDB)**:

| Category | Examples |
|---|---|
| **Sanitation** | Community toilets, Private toilets, School toilets, Compost pit/Ghoor Gaddha, Drains, Community soak pits, Sanitary pads |
| **Water** | Hand pumps, Piped water supply, Anganwadi RO/drinking water |
| **Nutrition** | Ration cards (BPL/Antyodaya), Pregnant women nutrition, Student nutrition, Infant (7 months–3 years) nutrition, Child (3–6 years) nutrition, Adolescent girl nutrition, Mid-Day Meal |
| **Health** | ANM visits, ASHA visits, Anganwadi worker visits, Immunisation, Pre/post-natal care, Malnourished children (NRC referral), Medicine distribution (iron/folic acid/calcium) |
| **Education** | Anganwadi (3–6), Primary school, Junior school, Composite school, High school, Inter college, School water supply, Pupil-teacher ratio, Teacher attendance |
| **Housing & Infrastructure** | PM Awas Yojana, Interlocking roads, RCC roads, Solar lights |
| **Livelihoods** | MNREGA job cards, Kisan Credit Card, Widow pension, Old age pension |

### 6.3 Total Validated Leverage

| Year | Total Leverage Amount | Source |
|---|---|---|
| Through HY4 (cumulative) | ₹3.04 Crore+ | HY4 Report |
| 2022–2025 (cumulative total) | ₹8.25 Crore (₹82,500,000) | Evidence Mapping |
| 2024–25 (single year) | ₹2.8 Crore | Grant Report Claim (triangulated) |

---

## 7. Outcome 5: Organisational Strengthening

### 7.1 RF Items

| Activity | Description |
|---|---|
| Team Induction | 4-day residential training + 4 annual refreshers for 8 DEHAT-APPI team |
| Leadership Training | Training for Director and Programme Coordinator with resource persons |
| Technical Training | LEISA practices for cluster-level team |
| Exposure Visits | Visits with Gagan Sethi |
| Youth Leaders | Selection of potential leaders from existing youth cadre |
| DEHAT Fellows | Induction, orientation and training of 5 DEHAT Fellows |
| Policy | Revise policies for inclusiveness; GSM-sensitive policies |
| Compliance | SOPs, active committees, programme compliance practices |

### 7.2 Project Team Capacity Building (from MIS)

**77 entries** in the Project Team CB table tracking team training activities across all years.

---

## 8. Leverage & Convergence Data (2023–2025)

### 8.1 Leverage 2023

**263 individual leverage entries** across 10 columns (Sheet1).

| Leverage Type | Count |
|---|---|
| House PM Awas (Housing) | 151 |
| Toilet | 66 |
| Latrine | 16 |
| Road Interlocking | 9+ |
| RCC | 5 |
| Road Maintenance | 3+ |

**Sub-datasets**: Sheet2 (74 rows) and Sheet3 (46 rows) contain additional categorisation/summary data.

### 8.2 Leverage 2024

**167 individual entries** covering January–December 2024.

| Leverage Type | Count |
|---|---|
| PM Aawas (Housing) | 63 |
| Sokhta (Soak Pit) | 29 |
| Shouchalay (Toilet) | 20 |
| Interlocking | 9 |
| Ghoor Gaddha NADEP (Compost) | 6 |
| Dammal | 4 |
| Widow Pension | 3 |
| PM Aawas + Sokhta | 3 |
| Road Construction | 2 |
| Drain Construction | 2+ |
| Solar Light | 1 |
| Seeds (Tomato, Onion, Cucumber, Cauliflower, Chilli, Bottle Gourd, Bitter Melon) | 1 each |

**New in 2024**: Horticulture/seed distribution leverage and NADEP compost pits appear as new entitlements.

### 8.3 Leverage 2025

**167 entries** covering January–December 2025.

| Leverage Type (Hindi) | English Equivalent | Count |
|---|---|---|
| शौचालय | Toilet | 72 |
| PM आवास | PM Housing | 44 |
| प्रधान मंत्री आवास | PM Housing (variant) | 19 |
| Har Ghar Pipe/Nal | Water pipe/tap | 3+ |
| Widow Pension | Widow Pension | 3 |
| RCC Road | RCC Road | 3 |
| Pakki Nali | Paved Drain | 3 |
| Kachchi Sadak Marmmat | Unpaved Road Repair | 2 |
| Hand Pump Repair | Hand Pump | 1 |
| High Mast Light | Street Light | 1 |
| Solar Light | Solar Light | 1 |
| Pani Ki Nikasi | Water Drainage | 1 |
| Anganwadi Centre | Anganwadi | 1 |

### 8.4 Leverage Trend Analysis

| Year | Total Entries | Dominant Category | Notable Shift |
|---|---|---|---|
| 2023 | 263 | PM Housing (57%) | Heavily housing-focused |
| 2024 | 167 | PM Housing (38%) + Toilets (12%) + Soak Pits (17%) | Diversification into sanitation infrastructure; new seed distribution |
| 2025 | 167 | Toilets (43%) + PM Housing (26%) | Toilet construction becomes dominant; community infrastructure (drains, roads, lights) grows |

> **Insight**: Clear evolution from housing-only leverage toward diversified WASH and infrastructure entitlements, indicating maturation of community advocacy capacity.

---

## 9. Training & Capacity Building Data (2022–2025)

### 9.1 Year-wise Training Summary

| Year | Entries | Key Training Types | Total Participants (Sample) | Gender Split |
|---|---|---|---|---|
| **2022** | 102 | Leadership & Group Management (Dec 2022) | 126, 129, 56 per session | Heavily female (80%+) |
| **2023** | 102 | Machan Cultivation, LEISA, Mixed Crop Farming | 30–47 per session | Mixed |
| **2024** | 102 | CRP Exposure Visits | 16–29 per session | Heavily female (75%+) |
| **2025** | 114 | Multilayer Farming | 27–29 per session | Heavily female (85%+) |

### 9.2 Training Data Detailed Records

| Year | Table | Rows | Columns |
|---|---|---|---|
| 2022 | training_data_fasal_mis_2022 | 2,541 | 88 |
| 2023 | training_data_fasal_mis_2023 | 2,016 | 100 |
| 2024 | training_data_fasal_mis_2024 | 3,548 | 111 |
| 2025 | training_data_fasal_mis_2025 | 2,104 | 133 |

> **Note**: These are participant-level records, not summary counts. Column count increasing each year indicates expanding data capture (more variables being tracked).

### 9.3 Headline Training Numbers (from Evidence Mapping)

| Metric | Value |
|---|---|
| CRP Training Programs Conducted | 34 |
| CRP Training Participants | 643 |
| Direct Training Participation | 659 |
| Krishi Mitras Trained | 48 |

---

## 10. Crop Economics & Production Data

### 10.1 Crop-wise Details (2025)

The `updated_fasal_crop_wise_details_update_2025` dataset contains:

| Table | Rows | Columns | Description |
|---|---|---|---|
| Crop_details | 1,366 | 117 | Farmer-level crop economics |
| AASINFOR | 1,363 | 21 | AAS-linked farmer information |
| AAS_INFO | 88 | 9 | AAS group master list |
| Sheet2 | 489 | 116 | Additional crop calculations |

### 10.2 Key Agricultural Metrics

| Metric | Value | Source |
|---|---|---|
| Total Farmer Outreach | 1,866 farmers | Crop Details row count |
| AAS Collectives | 82 formed / 74 active | MIS + Grant Report |
| Turmeric Adopters | 137 | MIS |
| Turmeric Total Value | ₹46,17,245 | MIS |
| Turmeric Avg Net Income | ₹34,202/farmer | MIS |
| Multi-Layer Farming Adopters | 152 | MIS |
| Vegetable Cultivation Farmers | 966 | MIS |
| Nutritional Garden Instances | 3,306 | MIS |

### 10.3 FASAL MIS Consolidated

The MIS tracks **122 activity/indicator rows** across **8 Half-Years (HY1–HY8)** with monthly granularity (Jan 2022 to Dec 2025). Each HY has Target and Achievement columns plus month-by-month breakdown.

**Structure**: S.No → Activity/Indicator → Proposed Target → Achievement → HY1 (Target/Achievement/Monthly) → HY2 ... → HY8.

---

## 11. FDB (Family Development Booklet) Field Architecture

### 11.1 FDB Scale

| Metric | Value |
|---|---|
| Total FDB Columns Assessed | 2,999 |
| Household Records | 1,329 |
| Database Parts | Part 1 (1,900 cols) + Part 2 (1,102 cols) |

### 11.2 FDB Domain Distribution

| FDB Domain | Field Count | % |
|---|---|---|
| Food consumption / nutrition diversity | 1,260 | 42.0% |
| Entitlements / services / Jan Suvidha tracking | 1,203 | 40.1% |
| Livestock / allied livelihood | 185 | 6.2% |
| Crop economics / agricultural income | 126 | 4.2% |
| Migration / livelihood vulnerability | 125 | 4.2% |
| Intersectional service access | 33 | 1.1% |
| PII / household identifiers | 18 | 0.6% |
| Survey metadata | 13 | 0.4% |
| Household income contribution | 10 | 0.3% |
| Geography | 4 | 0.1% |
| Household profile / landholding | 4 | 0.1% |
| AAS / institutional linkage | 1 | 0.03% |

### 11.3 FDB → RF Correspondence

| RF Level | FDB Fields Supporting It | % of Total |
|---|---|---|
| Outcome evidence | 1,386 | 46.2% |
| FDB-only / intersectional | 845 | 28.2% |
| Outcome evidence / output proxy | 358 | 11.9% |
| FDB-only / related context | 185 | 6.2% |
| FDB-only context | 135 | 4.5% |
| Intersectional / partial RF | 33 | 1.1% |
| Disaggregation / data management | 18 | 0.6% |

### 11.4 Dashboard Card Specifications (from FDB-RF Traceability Map)

| Dashboard Screen | Card | RF Link | FDB Proves | FDB Cannot Prove | Status |
|---|---|---|---|---|---|
| Coverage | Target HH coverage + filters | All RF outcomes | Geographic/household profile | Achievement vs targets unless deduplicated | Use as filter |
| Institutions | AAS representation | Outcome 1 | HH-AAS linkage | AAS formation, meetings, leadership, collective claims | Use with caveat |
| Krishi Mitra | HH mapped to KM | Outcome 3 | HH-KM linkage | Training, monthly meetings, farmer impact | Use with caveat |
| Food Security | 12-month food availability | Outcome 2 | Seasonality, consumption diversity | Production increase causality | Use |
| Agriculture Income | Crop-wise cost/sales/income | Outcome 2 | Crop economics trend | Per-acre income (needs area validation) | Use with caveat |
| Entitlements | Awareness → Facilitation → Receipt | Outcomes 1 & 4 | HH-reported service access | AAS collective claim process | Use with caveat |
| Village Development | Village service gains | Outcome 1/4 | HH/service benefit receipt | Exact leverage amount or official sanction | Use with report triangulation |
| Intersectional | Education, health, nutrition, sanitation, migration | Outside narrow RF | DEHAT intersectional family profile | Core FASAL output/outcome achievement | Optional / separate dashboard |
| Evidence Audit | RF activities NOT tracked in FDB | All RF activities | Nothing directly | Training, meeting, organisational counts | Do NOT use FDB for activity achievement |

---

## 12. Evidence Audit & Dashboard Safety Rules

### 12.1 Critical Evidence Rules

These rules are extracted from the Master.md evidence protocol and must be enforced in any dashboard or report:

1. **Do not hallucinate**. Every number must be source-verified.
2. **Do not infer achievement from intention**.
3. **Do not infer outcome from activity**.
4. **Do not merge** "training conducted" with "practice adopted."
5. **Do not merge** "participant attended" with "participant changed behaviour."
6. **Do not merge** "AAS formed" with "AAS active."
7. **Do not merge** "AAS active" with "AAS effective."
8. **Do not merge** "claim raised" with "claim resolved."
9. **Do not merge** "scheme awareness" with "scheme application."
10. **Do not merge** "scheme facilitated" with "scheme approved."
11. **Do not merge** "scheme approved" with "benefit received."
12. **Do not merge** "Krishi Mitra trained" with "Krishi Mitra providing farmer support."
13. **Do not merge** "crop cultivated" with "income increased."
14. **Do not display** any number as achievement unless source-verified.
15. If a source is missing, label as **"Source not found"** or **"Evidence pending."**
16. If a number is in the Grant Report but not in raw data, label as **"Reported only."**
17. If raw data partially supports a claim, label as **"Partially verified."**
18. If FDB supports an outcome but not causality, label as **"FDB outcome evidence, causality not established."**
19. **Do not assume** baseline-to-endline comparison unless structurally validated.
20. **Anonymise and aggregate** all person-level data before donor display.

### 12.2 What Each Source Can and Cannot Prove

| Source | Can Prove | Cannot Prove |
|---|---|---|
| **FDB (DEHAT Cleaned Data)** | HH demographics, food diversity, crop economics, entitlement receipt status, KM/AAS linkage | Training counts, meeting counts, AAS functionality, causality |
| **FASAL MIS** | Activity/output tracking, HY-wise progress, training summaries | Household-level outcome change, causality |
| **Leverage Sheets** | Individual entitlement receipts, village-wise distribution, leverage type | Total amount verification (needs official records) |
| **Training Data (year-wise)** | Participant-level attendance, gender split, training type | Practice adoption, behaviour change |
| **Grant Reports** | Narrative claims, aggregated achievements | Independent verification (needs triangulation) |
| **RF Template** | Targets, indicators, timeline, theory of change | Actual achievement |

---

## 13. Grant Report Claims vs Raw Data Verification

### 13.1 Verified Claims

| Claim | Number Reported | Verification Status | Source |
|---|---|---|---|
| Turmeric adopters generated high income | 137 adopters | ✅ Verified via MIS | MIS Turmeric row |
| AAS groups formed | 82 (74 active) | ✅ Triangulated | MIS + AAS INFO + Grant Report |
| High convergence of public funds | ₹2.8 Cr (2024–25) | ✅ Triangulated (Total ₹8.25 Cr) | Leverage sheets + Grant Report |

### 13.2 Claims Requiring Triangulation

| Claim | Source | Verification Note |
|---|---|---|
| 6 Village Development Plans for 20 hamlets with 1,712 citizens | Grant Report 2024 | FDB shows service distribution but cannot prove VDP preparation |
| Gender training 218 participants, Leadership training 221 participants | Grant Report 2024 | FDB has no training participation fields; use attendance records |
| 304 farmers accessing government schemes; ₹2,29,93,200 leveraged | Grant Report 2024 | FDB entitlement fields can triangulate types; leverage amounts need official records |
| 75 Krishi Mitras trained on pest management | Grant Report 2024 | FDB has KM linkage but no training fields |
| 603 farmers trained in LEISA/mixed cropping/turmeric-ginger | Grant Report 2024 | Training data tables for verification |
| 80 AAS, 05 clusters, 01 BLF consolidated to 74 AAS | Grant Report 2025 | AAS INFO has 88 entries — reconciliation needed |

---

## 14. Intersectional Data Beyond RF

### 14.1 FDB-Only Fields (Not Directly in RF)

The FDB captures extensive household-level data **beyond the narrow RF mandate**. These fields demonstrate DEHAT's **family-centred, rights-based, intersectional approach**:

| Domain | Fields | Examples |
|---|---|---|
| **Livestock** | 185 fields | Types of livestock, income from livestock |
| **Migration** | 125 fields | Migration patterns, duration, destination, income |
| **Education** | 33+ fields | School enrolment, attendance, pupil-teacher ratio |
| **Health** | Multiple | ANM/ASHA/Anganwadi visits, immunisation, pre/post-natal care |
| **Household Income** | 10 fields | Income contributions from various sources |

### 14.2 Case Studies (Qualitative Evidence)

Two detailed case studies are available in the database:

1. **Manju (Fellow Leader Case Story)** — 4,197 chars
2. **Shanti Devi (Fellow Leader 2025-26)** — 4,104 chars

Additionally, Hindi case studies:
- **अनारकली जी की केस स्टडी** — 12,222 chars
- **केस स्टडी राजकुमारी जी** — 540,184 chars (very detailed)

---

## 15. Data Gaps & Open Questions

### 15.1 Identified Data Gaps

| Gap | Impact | Recommended Action |
|---|---|---|
| **Unique HH deduplication** | Cannot confirm whether 1,329 FDB records = 1,329 unique HH | Validate using phone number / father-husband name dedup |
| **Land data standardisation** | Mixed Hindi/English/variant entries for land | Clean and convert all entries to numeric bigha |
| **Baseline-to-endline structure** | Not confirmed whether FDB enables baseline vs. endline comparison | Test structural possibility of HY1 vs HY8 comparison |
| **Per-acre income calculation** | Requires validated crop area denominators | Cross-reference land data with crop data |
| **Food savings monetary value** | FDB tracks self-grown vs. bought but not monetary value | Calculate using local market prices |
| **GP-wise income & food savings** | Partial data available | Aggregate by GP from crop economics and food consumption data |
| **AAS group count reconciliation** | 88 in INFO table vs. 82 reported vs. 74 active | Clarify with DEHAT team |
| **SHG name encoding** | Hindi names display as garbled text in some contexts | Re-encode with UTF-8 handling |
| **Household Economic Value** | Pending calculation (Net Farming Income + Food Savings + Verified Entitlements) | Requires cross-source calculation |

### 15.2 Open Questions for Dashboard Design

1. Should the dashboard show **all 88 AAS groups** or **only the 74 confirmed active**?
2. Should **intersectional data** (education, health, migration) get a separate dashboard tab or be integrated?
3. What **local market prices** should be used for food savings calculation?
4. Should the dashboard track **leverage amounts per household** or only aggregate per village/GP?
5. Should **training data** use MIS summary counts or participant-level records for gender disaggregation?

---

## 16. Quick Reference: Key Numbers

| Metric | Value | Confidence |
|---|---|---|
| Target Households | 1,500 | RF Target |
| FDB Household Records | 1,329 | Verified (row count) |
| Farmer Records (Crop Data) | 1,866 | Verified |
| AAS Groups Formed | 82 | Verified (MIS) |
| AAS Groups Active (2025) | 74 | Reported (Grant Report) |
| Cluster Federations | 5 | Verified |
| Block Level Federation | 1 | Verified |
| Gram Panchayats | 7 | Verified (FDB data) |
| Villages | 20 | Verified (AAS INFO) |
| Krishi Mitras Trained | 48 | Verified (MIS) |
| CRP Training Programs | 34 | Verified |
| Training Participants | 659 | Verified |
| Turmeric Adopters | 137 | Verified |
| Turmeric Avg Net Income | ₹34,202 | Verified |
| Total Leverage (cumulative) | ₹8.25 Crore | Triangulated |
| FDB Total Fields | 2,999 | Verified |
| FDB RF-linked Fields | 1,744 (58%) | Calculated |
| FDB Intersectional Fields | 1,198 (40%) | Calculated |
| Average Family Size | 4.4 | Verified |
| Dominant GP (Karikot) | 45.3% of HH | Verified |
| Women Training Participation | 75–85%+ | Estimated from samples |

---

## Appendix A: Database Table Inventory

| # | Table Name | Rows | Cols | Data Domain |
|---|---|---|---|---|
| 1 | compressed_dehat_cleaned_data_part1 | 1,329 | 1,900 | FDB (Part 1) |
| 2 | compressed_dehat_cleaned_data_part2 | 1,329 | 1,099 | FDB (Part 2) |
| 3 | dehat_cleaned_data_with_acres_part1 | 1,329 | 1,900 | FDB with Acres (Part 1) |
| 4 | dehat_cleaned_data_with_acres_part2 | 1,329 | 1,102 | FDB with Acres (Part 2) |
| 5 | documents | 47 | 4 | All text documents |
| 6 | fasal_fdb_rf_traceability_map_Dashboard_Cards | 9 | 7 | Dashboard specifications |
| 7 | fasal_fdb_rf_traceability_map_FDB_Field_Map | 2,999 | 11 | FDB-RF field mapping |
| 8 | fasal_fdb_rf_traceability_map_Grant_Report_Crosswalk | 8 | 5 | Grant claim verification |
| 9 | fasal_fdb_rf_traceability_map_RF_Items | 89 | 8 | RF architecture |
| 10 | fasal_fdb_rf_traceability_map_Summary | 36 | 2 | Summary statistics |
| 11 | fasal_mis_consolidated_MIS | 122 | 69 | MIS Activity Tracker |
| 12 | fasal_mis_consolidated_Project_Team_CB | 77 | 16 | Team Capacity Building |
| 13 | fasal_mis_consolidated_Sheet1 | 47 | 10 | Supplementary |
| 14-17 | fasal_mis_consolidated_Training_Summary_20XX | 102–114 | 9 | Training Summaries (2022–2025) |
| 18-27 | levrage_* + t_00047338_* + t_1.*_leverage_* | 46–263 | 4–10 | Leverage Data (2023–2025) |
| 28 | rf_template_Activity_Details | 78 | 38 | RF Activities |
| 29 | rf_template_ME_Plan | 57 | 1 | M&E Plan |
| 30 | rf_template_Outcome_Indicators | 76 | 24 | RF Outcomes |
| 31 | rf_template_Output_Indicators | 78 | 39 | RF Outputs |
| 32 | rf_template_Results_Table | 91 | 21 | Results Summary |
| 33 | rf_template_Step_By_Step_Guide | 103 | 16 | RF Guide |
| 34-41 | training_data_fasal_mis_20XX_* | 2,012–3,548 | 70–133 | Participant-level Training (2022–2025) |
| 42-49 | updated_fasal_crop_wise_details_* | 88–1,366 | 9–117 | Crop Details + AAS INFO |

---

## Appendix B: Source File Inventory

| Source ID | Filename | Type | Primary Evidence Function |
|---|---|---|---|
| SRC_01 | FASAL MIS - Consolidated.xlsx | MIS | Activity/output tracking, crop production, area, farmers |
| SRC_02 | Updated_Fasal Crop wise details_Update _2025.xlsx | MIS | 2025 crop-wise updates |
| SRC_03 | Training data_FASAL MIS 2022–2025.xlsx | MIS | Year-wise training participant data |
| SRC_04 | Family Development Booklet-DEHAT.pdf | Qualitative | FDB logic and household tracking methodology |
| SRC_05 | DEHAT_Cleaned_Data_with_Acres.csv | Data | Full FDB dataset (1,329 HH × 3,002 fields) |
| SRC_06 | Leverage AASs 2023/2024/2025.xlsx | Financial | Entitlement and convergence data |
| SRC_07 | Grant Report Jan–Dec 2024.pdf | Narrative | Claim extraction and context |
| SRC_08 | Grant Report Jan–Dec 2025.pdf/md | Narrative | Latest programme status |
| SRC_09 | RF Template (5year) Ver.2.0.xlsx | Framework | Targets, indicators, timeline |
| SRC_10 | Baseline Report - Jaykar.md | Evaluation | Baseline data |
| SRC_11 | Midline_FASAL_Jaykar.md | Evaluation | Midline assessment |
| SRC_12 | HY4 Fluxx Part-I Report.md | Report | Half-year progress narrative |
| SRC_13 | Grant Application APPI_DEHAT V2.0.md | Proposal | Programme design and theory of change |
| SRC_14 | Evidence_Mapping.md | Analysis | Pre-existing evidence spine |
| SRC_15 | entitlements.json / entitlements_trend.json | Data | Entitlement dashboard data |
| SRC_16 | farmers.json / leverage.json | Data | Farmer and leverage dashboard data |

---

*Document generated by Orchestrator Agent from `master_context.db` on 2026-06-26. All insights are derived from the unified database and cross-referenced with source documents. This document is designed to serve as the single reference for all downstream dashboard, reporting, and insight extraction tasks.*
