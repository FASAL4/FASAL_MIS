# Comprehensive Test Infrastructure Specification (TEST_INFRA)
**Project**: Farmers Action for Sustainable Agro-based Livelihoods (FASAL) Comprehensive Workspace Synthesis & Research Agenda  
**Grant Reference**: Azim Premji Philanthropic Initiatives (APPI) Grant G-2110-10970  
**Implementing Agency**: Developmental Association for Human Advancement (DEHAT)  
**Author**: E2E Testing Orchestrator / Test Writer  
**Location**: `c:\Users\bentn\OneDrive\Desktop\FASAL Information\TEST_INFRA.md`  
**Status**: APPROVED & ACTIVE  

---

## 1. Executive Summary & Test Architecture

This document defines the formal, automated 4-Tier verification architecture and test harness for the FASAL Comprehensive Workspace Synthesis project. The mission of this test infrastructure is to enforce uncompromising empirical rigor, 100% data and document coverage, mathematical fidelity, and econometric viability across the master synthesis deliverable (`FASAL_MASTER_SYNTHESIS_AND_RESEARCH_AGENDA.md`).

The test suite operates as an independent audit oracle. It derives its expected values directly from primary workspace microdata (1,329-household Family Development Booklet survey, 2025 Crop Schedules, Multi-Year Leverage Workbooks, CSC Registries, Training MIS, Grant Reports, Evaluation Dossiers, and 28 Monthly Review PPTX presentations).

### 1.1 Architecture & Component Layout

```
c:\Users\bentn\OneDrive\Desktop\FASAL Information\
├── TEST_INFRA.md                                  <-- Master Test Infrastructure Specification (This File)
├── TEST_READY.md                                  <-- Test Suite Execution & Verification Readiness Report
├── FASAL_MASTER_SYNTHESIS_AND_RESEARCH_AGENDA.md   <-- Master Deliverable Under Test (Integration Output)
├── .agents/teamwork/
│   ├── e2e_test_orchestrator/
│   │   ├── verify_synthesis_e2e.py                <-- Automated Standalone Python E2E Verification Engine
│   │   ├── BRIEFING.md                            <-- Test Orchestrator Persistent Working Memory
│   │   ├── DISPATCH.md                            <-- Dispatch Log & Task Instructions
│   │   ├── progress.md                            <-- Liveness Heartbeat
│   │   └── handoff.md                             <-- 5-Component Handoff Protocol Report
│   └── explorer_survey_1/
│       └── workspace_inventory.json               <-- Ground-Truth 90-File Non-Agent Workspace Inventory
```

---

## 2. The 4-Tier Test Design Methodology

The test harness implements the Project Pattern 4-Tier testing hierarchy, ensuring comprehensive verification from raw file inventory accounting to advanced econometric feasibility:

```
+---------------------------------------------------------------------------------------------------+
| TIER 4: REAL-WORLD RESEARCH ACCEPTANCE SCENARIOS                                                  |
| 35+ Grounded Research Questions, 7 Thematic Pillars, Microdata Variable Proofs, Econometric Models|
+---------------------------------------------------------------------------------------------------+
                                            ▲
+---------------------------------------------------------------------------------------------------+
| TIER 3: CROSS-DATASET & CROSS-YEAR CONSISTENCY                                                    |
| Multi-Source Reconciliation (FDB vs Crop 2025 vs Leverage vs CSC vs Training MIS vs Results FW) |
+---------------------------------------------------------------------------------------------------+
                                            ▲
+---------------------------------------------------------------------------------------------------+
| TIER 2: BOUNDARY & CORNER CASES (DATA ANOMALIES & AUDIT)                                          |
| Detection & Treatment of Outliers (Tally rani ₹70Cr, Lakshmi 1.93B ac, Sheet2 Tranche, Scripts)  |
+---------------------------------------------------------------------------------------------------+
                                            ▲
+---------------------------------------------------------------------------------------------------+
| TIER 1: FEATURE & FILE COVERAGE                                                                   |
| 100% of 90 Workspace Files Verified in Synthesis & Traceability Index; 16 Feature Domains x 5     |
+---------------------------------------------------------------------------------------------------+
```

---

### Tier 1: Feature & File Coverage

Tier 1 guarantees that zero workspace assets are left unexamined and that every programmatic and analytical domain is represented with deep, verifiable factual content.

#### 1. Complete 90-File Workspace Inventory Verification
The test harness validates that **every single one of the 90 non-agent workspace files** is explicitly cited, analyzed, and mapped within the synthesis document and its Traceability Index:
- **Government Convergence & Leverage Registers (3 files)**:
  1. `Levrage January to December 2023.xlsx`
  2. `00047338-Levrage January 2024 to December 2024.xlsx`
  3. `1. Leverage AASs 2025.xlsx`
- **Primary Crop Production & Yield Data (2 files)**:
  4. `Updated_Fasal Crop wise details_Update _2025.xlsx`
  5. `2025_crop_copy.xlsx`
- **Primary Quantitative Household Databases (5 files)**:
  6. `Family_Development_Book_-_Dehat_Dec24_-_all_versions_-_English_en_-_2026-06-22-14-05-16.xlsx`
  7. `DEHAT_Cleaned_Data_with_Acres.csv`
  8. `DEHAT_Cleaned_Data.csv`
  9. `DEHAT_Cleaned_Data.xlsx`
  10. `DEHAT_Cleaned_Data.json`
- **M&E, Traceability & Analytical Dashboards (5 files)**:
  11. `DEHAT_Dash.xlsx`
  12. `FASAL_FDB_RF_Traceability_Map.xlsx`
  13. `FASAL_2024/Data sheet_HY & HY6 FASAL.xlsx`
  14. `Project_RF_Baseline_Midline_ Self assessment/Copy of NRM Livelihoods KPI.xlsx`
  15. `Project_RF_Baseline_Midline_ Self assessment/RF Template (5year) Ver.2.0 16th Aug.xlsx`
- **Operations, Service Delivery & Training Registers (2 files)**:
  16. `Jan Suvidha kendra Data 2022,23,24 -25.xlsx`
  17. `FASAL Training data.xlsx`
- **Synthesized Analysis & Converted Reports (10 files)**:
  18. `DEHAT India x VAAGHDHARA Exposure Visit Report 2025-Rectified.md`
  19. `DEHAT.md`
  20. `DEHAT_Crop_Data_2022_2025_Report.md`
  21. `DEHAT_Crop_Data_Report_Presentable.md`
  22. `DEHAT_Data_Assessment_Report.md`
  23. `FASAL_Program_Analysis_Report.md`
  24. `Grant Report January to December 2025.md`
  25. `MASTER_CONTEXT.md`
  26. `Project_RF_Baseline_Midline_ Self assessment/Copy of NRM Livelihoods KPI.md`
  27. `Project_RF_Baseline_Midline_ Self assessment/RF Template (5year) Ver.2.0 16th Aug.md`
- **Data Processing & Analysis Scripts (5 files)**:
  28. `assess_dehat_data.py`
  29. `consolidate_crop_data.py`
  30. `fasal_program_analysis.py`
  31. `inspect_land_columns.py`
  32. `investigate_anomalies.py`
- **Institutional Cross-Learning & Exposure Report (1 file)**:
  33. `DEHAT India x VAAGHDHARA Exposure Visit Report 2025-Rectified.pdf`
- **Annual / Periodic Grant Narrative & Evaluation Reports (7 files)**:
  34. `DEHAT.pdf`
  35. `Family Development Booklet-DEHAT.pdf`
  36. `Grant Report January to December 2024.pdf`
  37. `Grant Report January to December 2025.pdf`
  38. `HY4 Report-Remaining Aspects.pdf` (root)
  39. `FASAL 2022/Narrative Report HY2.pdf`
  40. `FASAL_2023/HY4 Report-Remaining Aspects.pdf`
- **Periodic Narrative Reporting & Templates (2 files)**:
  41. `FASAL_2023/HY4 Fluxx Part-I Report.docx`
  42. `FASAL_2024/Grant Report template_Draft 1.docx`
- **External & Mid-term Evaluations, Proposals & Concept Decks (5 files)**:
  43. `Project_RF_Baseline_Midline_ Self assessment/Baseline Report - Jaykar.pdf`
  44. `Project_RF_Baseline_Midline_ Self assessment/Midline_FASAL_Jaykar (1).docx`
  45. `Project_RF_Baseline_Midline_ Self assessment/Midterm self evaluation.docx`
  46. `Project_RF_Baseline_Midline_ Self assessment/Grant Application APPI_DEHAT V2.0 31st Aug.docx`
  47. `Project_RF_Baseline_Midline_ Self assessment/DEHAT Breif Presentation.pdf`
- **Qualitative Case Study Dossiers (4 files)**:
  48. `FASAL_2025/Case stories/Manju _ Fellow leader _Case story_Final_.docx`
  49. `FASAL_2025/Case stories/Shanti Devi_Fellow leader_2025-26_Final.docx`
  50. `FASAL_2025/Case stories/अनारकली जी की केस स्टडी.pdf`
  51. `FASAL_2025/Case stories/केस स्टडी राजकुमारी जी_Final.docx`
- **Monthly Field Review Slide Presentations (28 PPTX files)**:
  - 11 Decks from 2024 (`FASAL_2024/Presentations FASAL_2024/`):
    52. `12. NRM_DEHAT_जनवरी २०२५.pptx`
    53. `6. NRM_DEHAT_30 May  2024.pptx`
    54. `7. NRM_DEHAT_June_ 2024.pptx`
    55. `8. NRM_DEHAT_August_ 2024.pptx`
    56. `8. NRM_DEHAT_July_ 2024 (1).pptx`
    57. `8. NRM_DEHAT_July_ 2024.pptx`
    58. `9. NRM_DEHAT_September_ 2024.pptx`
    59. `APPI_DEHAT_04 December, 2023.pptx`
    60. `APPI_DEHAT_05 February 2024.pptx`
    61. `NRM_DEHAT_04 April 2024.pptx`
    62. `NRM_DEHAT_04 March 2024.pptx`
  - 17 Decks from 2025–2026 (`FASAL_2025/Presentations FASAL_2025/`):
    63. `01. NRM_DEHAT_Januaery 2025.pptx`
    64. `02. NRM_DEHAT_5 March  २०२५.pptx`
    65. `03.NRM_DEHAT_7 अप्रेल 2025.pptx`
    66. `04. NRM_DEHAT_5 May  २०२५.pptx`
    67. `05. NRM_DEHAT_4 मई  २०२५.pptx`
    68. `06. NRM_DEHAT_9 जुलाई  २०२५.pptx`
    69. `07. NRM_DEHAT_6 August,  2025.pptx`
    70. `08. NRM_DEHAT_ 6 September 2025.pptx`
    71. `09. NRM_DEHAT_ 4 Oct 2025.pptx`
    72. `10. NRM_DEHAT_ 8 Nov 2025.pptx`
    73. `11. NRM_DEHAT_ 04 DEC 2025.pptx`
    74. `12. NRM_DEHAT_  10 January 2026.pptx`
    75. `12. NRM_DEHAT_ 6 September 2025.pptx`
    76. `12. NRM_DEHAT_ 8 Nov 2025.pptx`
    77. `12. NRM_DEHAT_5 May  २०२५.pptx`
    78. `12. NRM_DEHAT_9 जुलाई  २०२५.pptx`
    79. `NRM_DEHAT_5 March  २०२५.pptx`
- **Photographic Field Evidence (11 JPG files)**:
  80. `FASAL_2025/AAS Meeting.jpg`
  81. `FASAL_2025/AAS Meeting_Jamuniha.jpg`
  82. `FASAL_2025/AAS meeting_Karikhot.jpg`
  83. `FASAL_2025/Chilli transplantation.jpg`
  84. `FASAL_2025/Cluster office inauguration.jpg`
  85. `FASAL_2025/CRP meeting at office.jpg`
  86. `FASAL_2025/Govt official visiting village.jpg`
  87. `FASAL_2025/Machan Cultivation.jpg`
  88. `FASAL_2025/Machan cultivation_Farmer 1.jpg`
  89. `FASAL_2025/Onion plants distribution_from Nursery.jpg`
  90. `FASAL_2025/Palak seed preparation.jpg`

#### 2. Feature Domain Coverage (Minimum 5 Distinct Verification Checks per Domain)
The test suite validates 16 comprehensive domains with at least 5 strict assertion checks per domain:

| Domain # | Domain Name | Minimum Verification Checks |
|:---:|:---|:---|
| **D01** | Program Architecture & Theory of Change | (1) APPI Grant G-2110-10970, (2) DEHAT history since 2000–01, (3) 5 Core Objectives & Outcomes, (4) Target Geography: 6 GPs, 20 villages, (5) Demographic focus: Tharu ST (26%), SC, OBC, single women. |
| **D02** | Institutional Federation Governance | (1) 3-tier federation model, (2) 74–80 AAS groups, (3) 5 cluster federations, (4) Sangharsh Block Level Federation, (5) "Jiska Mudda Uski Agwai" philosophy & GPDP advocacy. |
| **D03** | Chronological Implementation (2021–2026) | (1) Year 1: Inception & Katarniaghat crises, (2) Year 2: Anti-extortion battles (*Begari*/*Tihai*), (3) Year 3: GPDP planning & 1,712 citizens, (4) Year 4: Midline evaluation & organizational restructuring, (5) Year 5: VAAGDHARA exposure visit (Jan 2026). |
| **D04** | Package of Practices (PoP) & Agronomy | (1) LEISA bio-formulations (Jeevamrit, Ghanjeevamrit, Char Chatni, 10 Parani Ark, Neemastra, Agniastra), (2) CIS / SRI line sowing, (3) Machan vertical trellis farming, (4) Zaid summer crop introduction, (5) Bund agroforestry & soil conservation. |
| **D05** | Operational Crises & Shocks | (1) Katarniaghat human-wildlife encounters & staff attrition, (2) Forest Department conflict & Kailashnagar FIRs, (3) Caritas & She's the First withdrawal (₹52 Lakh deficit), (4) Retrenchment of 13 staff & consolidation to 74 AAS, (5) Feminist collective governance restructuring under Gagan Sethi. |
| **D06** | Qualitative Biographical Profiles | (1) Manju: SHG leadership & floodland sugarcane, (2) Shanti Devi: child marriage resilience & Kasturba school, (3) Rajkumari Devi: wage worker to award-winning turmeric entrepreneur, (4) Anarkali Devi: Tharu tribal leader & Sadhana Azadi AAS, (5) Cross-case leadership synthesis. |
| **D07** | Monthly Field Review Syntheses | (1) Coverage of 28 monthly PPTX decks, (2) Panchayat-level staff performance tracking, (3) CM Helpline 1076 grievance redressal, (4) Local media coverage clipping analysis, (5) Monthly behavior change matrices. |
| **D08** | Household Survey Microdata (FDB) | (1) 1,329 households sample size, (2) 3,002 variables in cleaned schema, (3) 11 functional domains categorization, (4) Kobo Collect digital pipeline, (5) 100% Bahraich / Mihinpurwa geographic verification. |
| **D09** | Raw Kobo Export & Family Roster | (1) 4,467 columns in raw export, (2) Cascading select branch structure (22 village cols, 83 AAS cols), (3) 5,797 family member repeat records, (4) Bal Sansad, Kishor, Yuva Sansad membership tracking, (5) `_submission__uuid` relational linkage. |
| **D10** | Landholding Structure & Tenure | (1) 886.04 acres aggregate cultivated land, (2) 1,160 households with valid land data, (3) Mean land: 0.764 acres, Median: 0.500 acres, (4) Tenure split: 84.9% owned (752.3 ac) vs 15.1% leased (133.7 ac), (5) Landless tenant cohort identification. |
| **D11** | Longitudinal Crop Economics | (1) 44 crops tracked across 3 years, (2) Net income progression: ₹14,554 (2022) -> ₹39,601 (2023) -> ₹49,328 (2024), (3) 2025 season: 26 crops, 1,361 farmers, (4) Per-acre plot productivity vs whole-holding return, (5) 68.1% of farmers reaching >=₹60,000/acre target. |
| **D12** | Turmeric Value Chain | (1) 137 smallholder commercial producers, (2) ₹46,17,245 total net income, (3) ₹34,202 average net profit per farmer, (4) 0.5–1.0 Bigha micro-plots, (5) Institutional market linkages (Department of Horticulture & Patanjali). |
| **D13** | Tricolor Food Security & Nutrition | (1) 1,260 columns tracking 36 consecutive months, (2) White, Green, and Yellow food category definitions, (3) Pulse / legume intake expansion (+11.27%), (4) Reduction in seasonal lean period starvation, (5) Home-grown vegetable consumption transition. |
| **D14** | Multi-Year Leverage & Convergence | (1) ₹11.70 Cr primary register leverage across 2023–2025, (2) 2023 leverage: ₹3.84 Cr (260 items), (3) 2024 leverage: ₹2.30 Cr (163 items), (4) 2025 leverage: ₹5.56 Cr (160 items), (5) Scheme breakdown: PMAY, Har Ghar Nal tap networks, roads, toilets, soak pits. |
| **D15** | Citizen Services & Training MIS | (1) 1,118 CSC service applications across 4 sheets, (2) 394 toilet applications & 352 tube-well boring schemes, (3) 151 PM Kisan registrations, (4) 214 training sessions with 12,500+ participants, (5) 14 training curriculum modules (LEISA, gender, turmeric, governance). |
| **D16** | Data Hygiene & Anomaly Audit | (1) Tally rani ₹70 Cr outlier, (2) Lakshmi 1.93B acre entry, (3) 100% missing demographic data in `AASINFOR`, (4) 470-farmer unmerged tranche in `Sheet2`, (5) Script bifurcation & transliteration barriers. |

---

### Tier 2: Boundary & Corner Cases (Data Anomalies & Outliers)

Tier 2 verifies that the synthesis does not merely reproduce unvetted raw data, but identifies, isolates, and resolves the 10 critical data anomalies and boundary conditions present in the workspace:

```
+-------------------------------------------------------------------------------------------------------------+
| DATA ANOMALY & BOUNDARY AUDIT MATRIX                                                                        |
+----+---------------------------------------+------------------------+---------------------------------------+
| ID | Anomaly / Corner Case                 | Affected File & Field  | Empirical Ground Truth & Correction   |
+----+---------------------------------------+------------------------+---------------------------------------+
| A1 | ₹70 Crore Okra Single-Cell Outlier    | DEHAT_Cleaned_Data.csv | Tally rani row 842: ₹70,00,75,173.00. |
|    |                                       | Col: Okra net inc 2024 | Cleaned 2024 net inc: ₹49,328.10 mean.|
+----+---------------------------------------+------------------------+---------------------------------------+
| A2 | 1.93 Billion Acre Land Corruption     | DEHAT_Cleaned_Data.csv | Lakshmi row 1211: 1,934,180,102.8 ac. |
|    |                                       | Owned_Land_(Acres)     | True owned land: 1.0 acre.            |
+----+---------------------------------------+------------------------+---------------------------------------+
| A3 | Pure Landless & Tenant Producers      | DEHAT_Cleaned_Data.csv | Min total land: 0.000 acres.          |
|    |                                       | Total_Land_(Acres)     | Leased-only cultivators identified.   |
+----+---------------------------------------+------------------------+---------------------------------------+
| A4 | 100% Missingness in AASINFOR          | Updated_Fasal Crop     | AASINFOR Cols 9–22: 0% populated.     |
|    |                                       | wise details 2025      | Gender, caste, land 100% missing.     |
+----+---------------------------------------+------------------------+---------------------------------------+
| A5 | Unmerged 470-Farmer Field Tranche     | Updated_Fasal Crop     | Sheet2: 470 rows without headers.     |
|    |                                       | wise details 2025      | 448 farmers absent from Crop details. |
+----+---------------------------------------+------------------------+---------------------------------------+
| A6 | Devanagari / Latin Script Split       | FDB vs 2025 Crop Data  | FDB: 48.3% Devanagari Hindi names.    |
|    |                                       | Farmer Names & IDs     | 2025: 100% Latin. Join match = 214.   |
+----+---------------------------------------+------------------------+---------------------------------------+
| A7 | Zero-Area Positive-Income Instances   | 2025 Crop details      | 383 records: Area=0.0 ac, Inc > ₹0.   |
|    |                                       | Area vs Net Income     | Methi, coriander kitchen boundary.    |
+----+---------------------------------------+------------------------+---------------------------------------+
| A8 | Land & Income Arithmetic Violations   | DEHAT_Cleaned_Data.csv | 15 rows: Owned + Leased != Total Land |
|    |                                       | Land & Financials      | 10 rows: Net Income < Gross - Cost.   |
+----+---------------------------------------+------------------------+---------------------------------------+
| A9 | Cascading Select Branch Null Illusion | Raw Kobo vs Cleaned    | 22 village cols, 83 AAS cols condensed|
|    |                                       | Village / AAS Names    | 93.4% null illusion in single col.    |
+----+---------------------------------------+------------------------+---------------------------------------+
| A10| Per-Acre Metric Dissonance            | DEHAT_Dash vs Holdings | Dashboard: ₹1,31,973/acre (on 124.5ac)|
|    |                                       | Acreage Base           | Whole-farm: ₹19,162/acre (on 886ac).  |
+----+---------------------------------------+------------------------+---------------------------------------+
```

---

### Tier 3: Cross-Dataset & Cross-Year Consistency

Tier 3 executes multi-source triangulation across 5 distinct data streams to ensure absolute consistency across years and reporting instruments:

1. **FDB Household Panel vs Results Framework Targets**:
   - Compares the empirical longitudinal net income progression (Baseline ₹14,554.15 in 2022 -> Midline ₹39,601.20 in 2023 -> Cleaned ₹49,328.10 in 2024) against the APPI Results Framework target of ₹60,000/acre/year across 1,500 families.
2. **2025 Crop Schedule vs FDB Panel & Endline Dashboard**:
   - Reconciles 1,361 farmers in `Crop details`, 734 active vegetable producers, 124.502 physical cultivated acres, and ₹1,69,78,270 aggregate net income against `DEHAT_Dash.xlsx` Sheet3.
3. **Primary Leverage Registers vs Narrative Reports vs Endline Dashboard**:
   - Primary Registers:
     * 2023 Register: ₹3,83,78,400.00 (260 items)
     * 2024 Register: ₹2,29,93,200.00 (163 items)
     * 2025 Register: ₹5,56,49,920.00 (160 items)
     * Primary Total: **₹11,70,21,520.00** (₹11.70 Cr across 583 items)
   - Narrative & Dashboard Harmonization:
     * `DEHAT_Dash.xlsx` records ₹8,25,13,000 (₹8.25 Cr) because it filters out certain community-level civil road projects.
     * `Grant Report January to December 2025.md` records ₹2,79,80,960 (₹2.80 Cr) for Year 4 audited leverage.
     * The test validates that the synthesis explains the exact source and methodology behind each figure without contradiction.
4. **Jan Suvidha Kendra CSC Registers vs AAS Village Geography**:
   - Validates that 1,118 CSC service applications (394 toilets, 352 subsidized borewells, 151 PM Kisan, 66 income certificates) map directly into the 6 target Gram Panchayats (Karikot, Chahalwa, Fakirpuri, Bajpur Bankati, Vishunapur, Badkhadiya).
5. **FASAL Training MIS vs Capacity Building Outcomes**:
   - Reconciles 214 training sessions and 12,500+ participant attendances across 14 curriculum tracks with Results Framework Outcome 3 (Krishi Mitra cadre building).

---

### Tier 4: Real-World Research Acceptance Scenarios

Tier 4 subjects the synthesis to rigorous academic and empirical research acceptance criteria:

#### 1. Research Question Repository Completeness
The deliverable must contain a structured repository of **at least 35 distinct primary data-grounded research questions**, organized into 7 thematic pillars (minimum 5 questions per pillar):
1. **Pillar 1: Agro-Ecological & Agronomic Systems**: Multi-layer machan cropping, LEISA bio-inputs vs soil fertility, Zaid season transition, turmeric-ginger intercropping.
2. **Pillar 2: Land Tenure, Poverty & Mobility**: Landless tenant agricultural returns, farm size vs net return skew, income graduation trajectories (<₹50k to >₹50k), bigha-to-acre land tenure dynamics.
3. **Pillar 3: Nutrition & Health Dynamics**: Tricolor dietary diversity seasonality, household pulse consumption expansion (+11.27%), kitchen gardens vs child dietary diversity, homestead production vs market purchases.
4. **Pillar 4: Collective Action & Local Governance**: AAS membership density vs public scheme leverage, Gram Sabha/GPDP resolution conversion rates, female leadership trajectories in AAS/Federations, Forest Rights Act legal mobilization.
5. **Pillar 5: Digital Intermediation & Entitlement Delivery**: Jan Suvidha Kendra conversion rates, subsidized tube-well boring adoption bottlenecks, PM Kisan Aadhaar-seeding compliance, administrative responsiveness.
6. **Pillar 6: Migration, Gender & Rural Labor Markets**: Male out-migration seasonality, husband remittances (₹87.56L aggregate; ₹41,497 mean) vs farm reinvestment, female-headed farm management under male absence.
7. **Pillar 7: Survey Methodology & Field Econometrics**: Retrospective survey recall decay, Kobo cascading select branch inflation (4,467 cols), multi-script entity resolution barriers (Devanagari vs Latin), unmerged field tranche integration.

#### 2. Mandated 5-Part Structural Contract for Every Research Question
Every single research question must strictly follow this 5-part specification:
- **Title**: Descriptive, academic title.
- **Core Research Question**: Precisely phrased empirical research question.
- **Underlying Data Sources & Specific Variables**: Exact file paths, sheet names, and raw variable names (e.g. `Total_Land_(Acres)`, `Income received by the farmer from selling the crop-turmeric in 2024`, `Did you Receive PM Awas in First six Months`, `_submission__uuid`).
- **Primary Data Evidence & Observed Baseline/Midline Metrics**: Concrete quantitative or qualitative values cited directly from the workspace data.
- **Empirical Methodology & Econometric Model**: Formal statistical specification (e.g., Panel Fixed Effects, Difference-in-Differences, Probit/Logit, Tobit model for zero-censored crop outputs, Heckman selection model).

#### 3. Complete 90-File Traceability Matrix
The deliverable must include an exhaustive Markdown matrix table linking every one of the 90 non-agent workspace files to:
- Relative File Path & File Name
- Workspace Category
- Primary Synthesis Section(s) Where Examined
- Derived Research Question ID(s)
- Key Metrics & Evidentiary Artifacts Extracted

---

## 3. Automated Test Runner & Verification Engine

The verification engine is implemented in `verify_synthesis_e2e.py` located at:
`c:\Users\bentn\OneDrive\Desktop\FASAL Information\.agents\teamwork\e2e_test_orchestrator\verify_synthesis_e2e.py`

### 3.1 Invocation Commands

```powershell
# Run the complete 4-Tier verification test suite:
python ".agents/teamwork/e2e_test_orchestrator/verify_synthesis_e2e.py"

# Run with verbose diagnostic output:
python ".agents/teamwork/e2e_test_orchestrator/verify_synthesis_e2e.py" --verbose

# Run specific tier verification:
python ".agents/teamwork/e2e_test_orchestrator/verify_synthesis_e2e.py" --tier 1
python ".agents/teamwork/e2e_test_orchestrator/verify_synthesis_e2e.py" --tier 2
python ".agents/teamwork/e2e_test_orchestrator/verify_synthesis_e2e.py" --tier 3
python ".agents/teamwork/e2e_test_orchestrator/verify_synthesis_e2e.py" --tier 4

# Run in pre-flight mode (validating primary dataset oracles before master doc generation):
python ".agents/teamwork/e2e_test_orchestrator/verify_synthesis_e2e.py" --preflight
```

### 3.2 Exit Codes & Automated Pass/Fail Standards

| Exit Code | Meaning | Action Required |
|:---:|:---|:---|
| **0** | **PASS** — All 4 tiers verified with 100% compliance. | Proceed to master document finalization. |
| **1** | **FAIL** — File coverage deficiency (< 90 workspace files). | Escalate missing file crosswalk to integration worker. |
| **2** | **FAIL** — Feature domain check failure (< 5 checks in any of 16 domains). | Expand domain synthesis in relevant draft section. |
| **3** | **FAIL** — Data anomaly or outlier omitted or unaddressed. | Add explicit anomaly resolution section. |
| **4** | **FAIL** — Cross-dataset numerical contradiction detected. | Reconcile divergent metrics across data streams. |
| **5** | **FAIL** — Research question grounding or structural defect. | Enforce 5-part format and verify exact variable names. |

---

## 4. Authoritative Oracle Sources

To eliminate facade testing, all expected values are derived from authoritative ground-truth sources:
- **File Manifest**: `.agents/teamwork/explorer_survey_1/workspace_inventory.json` (90 non-agent files).
- **Household Microdata**: `DEHAT_Cleaned_Data_with_Acres.csv` (1,329 rows x 3,002 columns).
- **Raw Kobo Export**: `Family_Development_Book...xlsx` (1,329 rows x 4,467 cols; 5,797 family repeats).
- **2025 Crop Data**: `Updated_Fasal Crop wise details_Update _2025.xlsx` (1,361 farmers x 26 crops).
- **Multi-Year Leverage**: `Levrage January to December 2023.xlsx`, `00047338-Levrage January 2024 to December 2024.xlsx`, `1. Leverage AASs 2025.xlsx` (₹11.70 Cr total).
- **CSC Applications**: `Jan Suvidha kendra Data 2022,23,24 -25.xlsx` (1,118 records across 4 sheets).
- **Training MIS**: `FASAL Training data.xlsx` (214 sessions, 12,500+ participants).
- **Results Framework**: `RF Template (5year) Ver.2.0 16th Aug.xlsx`, `Copy of NRM Livelihoods KPI.xlsx`.
- **Narratives & Evaluations**: `Grant Application APPI_DEHAT V2.0 31st Aug.docx`, `Baseline Report - Jaykar.pdf`, `Midline_FASAL_Jaykar (1).docx`, `Grant Report January to December 2025.md`.

---
*Signed by: E2E Testing Orchestrator / Test Writer (Teamwork Agent Track)*

