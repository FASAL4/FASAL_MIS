# Evidence index (generated from src/data/evidenceLedger.json)

Use these ids with <Src id>, <Stat src>, <Figure src>, <SourceLink id>.

| id | domain | label | value | baseline | N | cells |
|---|---|---|---|---|---|---|
| REC-ADM-01 | governance | Total Household Survey Submissions | 1535 | 1,329 households | 1535 | FDB - year 4&5 questionnaire, Rows 2:1536 (_id Col 3283) |
| REC-ADM-02 | governance | Complete Validated Surveys | 1506 | 1,329 cleaned records | 1535 | Payment Status, Cell F21 |
| REC-ADM-03 | governance | Incomplete Survey Submissions | 14 | 0 (unrecorded in cleaned CSV) | 1535 | Payment Status, Cell D21 |
| REC-ADM-04 | governance | Duplicate Re-entries | 15 | 0 (deduplicated prior to export) | 1535 | Payment Status, Cell E21 |
| REC-ADM-05 | governance | Physical FDB Booklets Deposited | 1520 | Not systematically logged | 1535 | Payment Status, Cell G21 |
| REC-ADM-06 | governance | Enumerator Payments Disbursed | 1102 | Not tracked in research file | 1535 | Payment Status, Cell H21 |
| REC-ADM-07 | governance | Enumerator Payments Pending | 408 | Not tracked in research file | 1535 | Payment Status, Cell I21 |
| REC-ADM-08 | governance | Frontline Enumerator Cadre Size | 19 | Not specified | 1535 | Payment Status, Rows 2:20, Col B |
| REC-GEO-01 | governance | Total Gram Panchayats Covered | 7 | 6 Gram Panchayats | 1535 | FDB - year 4&5 questionnaire, Col 6 (Village Panchayat) |
| REC-GEO-02 | governance | Karikot GP Household Submissions | 758 | 602 households (45.30%) | 1535 | FDB - year 4&5 questionnaire, Col 6 = 'Karikot' |
| REC-GEO-03 | governance | Fakirpuri GP Household Submissions | 249 | 229 households (17.23%) | 1535 | FDB - year 4&5 questionnaire, Col 6 = 'Fakirpuri' |
| REC-GEO-04 | governance | Chahalwa GP Household Submissions | 201 | 183 households (13.77%) | 1535 | FDB - year 4&5 questionnaire, Col 6 = 'Chahalwa' |
| REC-GEO-05 | governance | Bajpur Bankati GP Submissions | 129 | 113 households (8.50%) | 1535 | FDB - year 4&5 questionnaire, Col 6 = 'Bajpur Bankati' |
| REC-GEO-06 | governance | Mangalpurwa GP Submissions | 79 | 88 households (6.62%) | 1535 | FDB - year 4&5 questionnaire, Col 6 = 'Mangalpurwa' |
| REC-GEO-07 | governance | Badkhadiya GP Submissions | 63 | 41 households (3.09%) | 1535 | FDB - year 4&5 questionnaire, Col 6 = 'Badkhadiya' |
| REC-GEO-08 | governance | Vishunapur GP Submissions | 56 | 73 households (5.49%) | 1535 | FDB - year 4&5 questionnaire, Col 6 = 'Vishunapur' |
| REC-DEMO-01 | governance | Total Enumerated Family Members | 6494 | 5,796 resident individuals | 6494 | family_member_repeat, Rows 2:6495, Col A (Name of Family Mem |
| REC-DEMO-02 | governance | Mean Household Size | 4.23 | 4.36 members / household | 1535 | Computed: 6,494 ÷ 1,535 HHs (Median: 4.0, Min: 1, Max: 11) |
| REC-DEMO-03 | governance | Nuclear Households (3–4 Members) | 826 | ~52.1% of households | 1535 | family_member_repeat, grouped by _submission__id |
| REC-DEMO-04 | governance | Small Households (1–2 Members) | 158 | ~11.4% of households | 1535 | family_member_repeat, grouped by _submission__id |
| REC-DEMO-05 | governance | Medium Households (5–6 Members) | 470 | ~31.2% of households | 1535 | family_member_repeat, grouped by _submission__id |
| REC-DEMO-06 | governance | Large Households (7+ Members) | 81 | ~5.3% of households | 1535 | family_member_repeat, grouped by _submission__id |
| REC-SOC-01 | governance | OBC Household Representation | 891 | Uncollected / Missing (0%) | 1535 | FDB - year 4&5 questionnaire, Col 13 (Caste) = 'OBC' |
| REC-SOC-02 | governance | ST (Tharu) Household Representation | 377 | Uncollected / Missing (0%) | 1535 | FDB - year 4&5 questionnaire, Col 13 (Caste) = 'ST' |
| REC-SOC-03 | governance | SC (Dalit) Household Representation | 259 | Uncollected / Missing (0%) | 1535 | FDB - year 4&5 questionnaire, Col 13 (Caste) = 'SC' |
| REC-SOC-04 | governance | General Category Representation | 8 | Uncollected / Missing (0%) | 1535 | FDB - year 4&5 questionnaire, Col 13 (Caste) = 'General' |
| REC-SOC-05 | governance | Marginalized Inclusivity Rate (SC/ST/OBC) | 1527 | Unverified assertion (claimed ~95%) | 1535 | Sum of REC-SOC-01, 02, 03: (891 + 377 + 259) ÷ 1,535 |
| REC-LAND-01 | rf_progression | Total Intervention Land (Bigha) | 5233.84 | 4,430.20 local bigha | 1535 | FDB - year 4&5 questionnaire, Col 22 (Total agriculture land |
| REC-LAND-02 | rf_progression | Total Intervention Land (Acres @ 0.20) | 1046.77 | 886.04 acres (at 0.20 factor) | 1535 | Computed: 5,233.84 bigha × 0.20 acre/bigha |
| REC-LAND-03 | rf_progression | Mean Operational Land per HH | 0.6819 | 0.7638 acres (3.82 bigha) | 1535 | Computed: 1,046.77 ac ÷ 1,535 total households |
| REC-LAND-04 | rf_progression | Median Operational Land per HH | 0.6 | 0.5000 acres (2.50 bigha) | 1535 | Median of parsed land across N=1,535 |
| REC-LAND-05 | rf_progression | Landless Farming Households (0 bigha) | 88 | 36 households (2.76%) | 1535 | FDB - year 4&5 questionnaire, Col 22 parsed == 0.0 |
| REC-LAND-06 | rf_progression | Unparsed Raw Landless Response | 574 | 169 missing land rows (12.7%) | 1535 | FDB - year 4&5 questionnaire, Col 22 raw string in ('नहीं',  |
| REC-LAND-07 | rf_progression | Owned Agricultural Land | 1019.01 | 871.82 acres (4,359.1 bigha) | 1535 | FDB - year 4&5 questionnaire, Col 20 (Owned Agriculture land |
| REC-LAND-08 | rf_progression | Leased / Sharecropped Land | 43.14 | 133.74 acres (668.7 bigha) | 1535 | FDB - year 4&5 questionnaire, Col 21 (leased agriculare land |
| REC-LAND-09 | rf_progression | Landholding ≤ 1.0 Acre (5 Bigha) | 828 | 83.3% of landholders | 1535 | FDB - year 4&5 questionnaire, Col 22 parsed ≤ 5.0 bigha |
| REC-ECON-01 | income | 2022 Mean Net Farm Income | Maintained as Baseline Anchor | ₹34,555.01 (RAW N=1,329) | 1487 | N/A (Wave 1 Retrospective recall anchor) |
| REC-ECON-02 | income | 2023 Mean Net Farm Income | Maintained as Midline 1 Anchor | ₹42,334.62 (RAW N=1,329) | 1487 | N/A (Wave 1 Retrospective recall anchor) |
| REC-ECON-03 | income | 2024 Mean Net Farm Income | Maintained as Midline 2 Anchor | ₹56,377.16 (RAW N=1,328) | 1487 | N/A (Wave 1 Retrospective recall anchor) |
| REC-ECON-04 | income | 2025 Aggregate Farm Production Cost | 30214192 | Not aggregated at cohort | 1487 | Income Data, Col 166, Cell FF1492 (Sum of rows 4:1490) |
| REC-ECON-05 | income | 2025 Aggregate Farm Gross Revenue | 111246772 | Not aggregated at cohort | 1487 | Income Data, Col 168, Cell FH1492 (Sum of rows 4:1490) |
| REC-ECON-06 | income | 2025 Aggregate Farm Net Margin | 81032580 | ₹7,48,68,868.51 (2024 RAW) | 1487 | Derived: Income Data!FH1492 − Income Data!FF1492 |
| REC-ECON-07 | income | 2025 Mean Net Farm Income per HH | 54494 | ₹56,377.16 (2024 RAW Mean) | 1487 | Computed: ₹81,032,580.00 ÷ 1,487 genuine farmers |
| REC-ECON-08 | income | 2025 Median Net Farm Income | 44400 | ₹38,700.00 (2024 RAW Median) | 1487 | Median across rows 4:1490 in Income Data (Col FH − Col FF) |
| REC-ECON-09 | income | 2026 Aggregate Farm Production Cost | 33124177 | Not available (unobserved) | 1487 | Income Data, Col 167, Cell FG1492 (Sum of rows 4:1490) |
| REC-ECON-10 | income | 2026 Aggregate Farm Gross Revenue | 128170176 | Not available (unobserved) | 1487 | Income Data, Col 169, Cell FI1492 (Sum of rows 4:1490) |
| REC-ECON-11 | income | 2026 Aggregate Farm Net Margin | 95045999 | Not available (unobserved) | 1487 | Derived: Income Data!FI1492 − Income Data!FG1492 |
| REC-ECON-12 | income | 2026 Mean Net Farm Income per HH | 63917.95 | Not available (unobserved) | 1487 | Computed: ₹95,045,999.00 ÷ 1,487 genuine farmers |
| REC-TURM-01 | income | Active Commercial Turmeric Growers | 333 | 112 (register) / 137 (grant rep) | 1487 | Income Data, Col ED/EE non-zero counts across rows 4:1490 |
| REC-TURM-02 | income | Turmeric Cultivation Cost (2025) | 2488890 | Not cleanly disaggregated | 1487 | Income Data, Col 134 (Col ED), Cell ED1492 |
| REC-TURM-03 | income | Turmeric Cultivation Cost (2026) | 2849768 | Not available | 1487 | Income Data, Col 135 (Col EE), Cell EE1492 |
| REC-TURM-04 | income | Turmeric Gross Revenue (2025) | 11797750 | ₹23,16,000 (net in register) | 1487 | Income Data, Col 136 (Col EF), Cell EF1492 |
| REC-TURM-05 | income | Turmeric Gross Revenue (2026) | 12688160 | Not available | 1487 | Income Data, Col 137 (Col EG), Cell EG1492 |
| REC-TURM-06 | income | Turmeric Net Profit (2025) | 9308860 | ₹23,16,000 (register) / ₹46.17 L | 1487 | Derived: Income Data!EF1492 − Income Data!ED1492 |
| REC-TURM-07 | income | Turmeric Net Profit (2026) | 9838392 | Not available | 1487 | Derived: Income Data!EG1492 − Income Data!EE1492 |
| REC-TURM-08 | income | 2026 Fresh Turmeric Harvest Volume | 738640 | 1,279.0 quintals (parsed 2025) | 1487 | FDB - year 4&5 questionnaire, Section 11 turmeric production |
| REC-CROP-01 | rf_progression | Wheat Net Income (2025 / 2026) | 2.68 | ₹2.17 Cr (2024 RAW) | 1535 | Income Data, Wheat columns (1,369 active growers in 2026) |
| REC-CROP-02 | rf_progression | Paddy Net Income (2025 / 2026) | 2.04 | ₹1.87 Cr (2024 RAW) | 1535 | Income Data, Paddy columns (1,381 active growers in 2026) |
| REC-CROP-03 | rf_progression | Okra / Bhindi Net Income (2026) | 3322080 | ₹13.46 Lakh (2024 RAW) | 1535 | Income Data, Okra columns (873 active growers in 2026) |
| REC-CROP-04 | rf_progression | Bitter Gourd Net Income (2026) | 3077957 | ₹16.74 Lakh (2024 combined) | 1535 | Income Data, Bitter Gourd columns (777 active growers in 202 |
| REC-CROP-05 | rf_progression | Cucumber / Kheera Net Income (2026) | 2575942 | Dropped in CSV (SYS-1) | 1535 | Income Data, Cucumber columns (665 active growers in 2026) |
| REC-CROP-06 | rf_progression | Cauliflower Net Income (2026) | 2568808 | ₹12.22 Lakh (2025 Register) | 1535 | Income Data, Cauliflower columns (610 active growers in 2026 |
| REC-CROP-07 | rf_progression | Chili / Mirch Net Income (2026) | 2454525 | ₹7.42 Lakh (2024 RAW) | 1535 | Income Data, Chili columns (692 active growers in 2026) |
| REC-CROP-08 | rf_progression | Pumpkin / Kaddu Net Income (2026) | 1723887 | ₹5.89 Lakh (2024 RAW) | 1535 | Income Data, Pumpkin columns (587 active growers in 2026) |
| REC-CROP-09 | rf_progression | Garlic / Lahsun Net Income (2026) | 1542467 | Dropped in CSV (SYS-1) | 1535 | Income Data, Garlic columns (368 active growers in 2026) |
| REC-CROP-10 | rf_progression | Mustard / Sarson Net Income (2026) | 1409515 | ₹11.78 Lakh (2024 RAW) | 1535 | Income Data, Mustard columns (162 active growers in 2026) |
| REC-INST-01 | governance | Ajeevika Adhikar Sangathan (AAS) Members | 4826 | 141 roster flags | 1535 | family_member_repeat, Col 5 (Is this member part of AAS?) =  |
| REC-INST-02 | governance | Bal Sansad (Children's Parliament) | 9 | 50 members | 1535 | family_member_repeat, Col 2 (Is this member part of Bal Sans |
| REC-INST-03 | governance | Kishor Sangathan (Adolescent Union) | 11 | 7 members | 1535 | family_member_repeat, Col 3 (Is this member part of Kishor.. |
| REC-INST-04 | governance | Yuva Sansad (Youth Parliament) | 11 | 10 members | 1535 | family_member_repeat, Col 4 (Is this member part of Yuva San |
| REC-INST-05 | governance | AAS Affinity Village Groups | 64 | 66 affinity groups | 1535 | FDB - year 4&5 questionnaire, Col 8 (AAS Name) |
| REC-INST-06 | governance | Women's Self-Help Groups (SHGs) | 39 | Qualitative narrative | 1535 | FDB - year 4&5 questionnaire, Col 14 (Self Help Group (SHG)  |
| REC-INST-07 | governance | Baghmitra / Gajmitra Volunteers | 1531 | Case study narratives | 1535 | FDB - year 4&5 questionnaire, Col 15 (Baghmitra/Gajmitra nam |
| REC-INST-08 | governance | Krishi Mitra Extension Linkages | 1532 | Qualitative narrative | 1535 | FDB - year 4&5 questionnaire, Col 18 (Name of Krishi Mitra.. |
| REC-RNE-01 | rights | Total Public Schemes Tracked | 77 | 77 schemes (unremediated: 75) | 1535 | FDB - year 4&5 questionnaire, Sections 3, 6, 9, 10 (Cols 253 |
| REC-RNE-02 | rights | Essential Medicines Receipt (R1–R4) | 47.4 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, Essential medicine receipt fla |
| REC-RNE-03 | rights | Adolescent Sanitary Pads Receipt | 42 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, Sanitary pad receipt flags acr |
| REC-RNE-04 | rights | Teacher Daily Presence in School | 41.6 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, Primary education monitoring f |
| REC-RNE-05 | rights | Mid-Day Meal (MDM) School Service | 39.7 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, School MDM delivery flags acro |
| REC-RNE-06 | rights | Aadhaar Card Enrolment / Updation | 39.5 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, Aadhaar service receipt flags  |
| REC-RNE-07 | rights | Junior School Functional Access | 34.9 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, Junior school facility access  |
| REC-RNE-08 | rights | Ration Card (BPL / Antyodaya) | 34.8 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, NFSA ration card receipt flags |
| REC-RNE-09 | rights | School Desks & Benches Upgrades | 34 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, School furniture infrastructur |
| REC-RNE-10 | rights | GP Family Register (Kutumb Register) | 33.6 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, Family register certification  |
| REC-RNE-11 | rights | Active School Sanitation / Toilets | 30 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, School toilet functionality fl |
| REC-RNE-12 | rights | MGNREGA Job Card Active Work | 23.3 | Unaggregated | 1535 | FDB - year 4&5 questionnaire, MGNREGA work participation fla |
| REC-LEV-01 | rights | 3-Year Verified Scheme Leverage | Maintained at ₹7.71 Crore | ₹7,70,98,360 across 577 projects | 577 | Multi-workbook registers; FASAL_REMEDIATION_AUDIT_REPORT, SY |
| REC-LEV-02 | rights | Year 2023 Public Leverage Total | Maintained at ₹2.63 Crore | ₹2,62,80,200 (259 projects) | 577 | Primary register row audit |
| REC-LEV-03 | rights | Year 2024 Public Leverage Total | Maintained at ₹2.30 Crore | ₹2,29,93,200 (160 projects) | 577 | Primary register row audit |
| REC-LEV-04 | rights | Year 2025 Public Leverage Total | Maintained at ₹2.78 Crore | ₹2,78,24,960 (158 projects) | 577 | Primary register row audit |
| REC-LEV-05 | rights | PMAY Rural Housing Leverage | Maintained at ₹3.36 Crore | ₹3,36,00,000 (280 sanctioned units) | 577 | Standard unit norm: ₹1,20,000 per pucca housing unit |
| REC-LEV-06 | rights | Village Roads & Drainage Projects | Maintained at ₹2.86 Crore | ₹2,86,48,200 (60 civil works) | 1535 | Interlocking roads, CC pavements, brick-soling, RCC drains |
| REC-LEV-07 | rights | Har Ghar Nal (Jal Jeevan Mission) | Maintained at ₹94.50 Lakh | ₹94,50,000 (665 tap connections) | 1535 | Standard normative tap connection valuation |
| REC-LEV-08 | rights | Individual Household Latrines (SBM) | Maintained at ₹33.60 Lakh | ₹33,60,000 (280 sanitation units) | 1535 | Standard SBM incentive: ₹12,000 per completed latrine |
| REC-JSK-01 | rights | JSK Verified Citizen Applications | Maintained at 1,102 records | 1,102 genuine service transactions | 1535 | Historical JSK service register |
| REC-JSK-02 | rights | Individual Latrine Applications | Maintained at 394 records | 394 applications | 1535 | Verified CSC transaction logs |
| REC-JSK-03 | rights | Subsidized Tube-Well Applications | Maintained at 352 records | 352 borewell applications | 1535 | Verified CSC transaction logs |
| REC-JSK-04 | rights | PM-Kisan Registrations | Maintained at 12 records | 12 registrations (+10 blank serials) | 1535 | Verified CSC transaction logs |
| REC-TRN-01 | governance | FASAL Training Sessions Conducted | Maintained at 210 sessions | 210 conducted sessions | 1535 | Training MIS register |
| REC-TRN-02 | governance | Cumulative Training Attendances | Maintained at 13,510 attendances | 13,510 participant attendances | 1535 | Training MIS register |
| REC-TRN-03 | governance | Specialized Training Curricula | 9 | 14 distinct session titles | 1535 | Training MIS register |
| REC-NUTR-01 | nutrition | Continuous Recall Time-Series | 60 | 36 Months (Jan 2022 – Dec 2024) | 1535 | FDB - year 4&5 questionnaire, Sections 2 & 6 |
| REC-NUTR-02 | nutrition | Green Leafy Vegetable Peak Season | Peak in June/July (67.2% – 70.4%) | Claimed "Summer Hunger Gap (31.4%)" | 1535 | FDB - year 4&5 questionnaire, Green food consumption cols |
| REC-NUTR-03 | nutrition | Winter Green Vegetable Trough | Trough in Dec/Feb (33.1% – 41.8%) | Claimed "Winter Peak (88.6%)" | 1535 | FDB - year 4&5 questionnaire, Green food consumption cols |
| REC-NUTR-04 | nutrition | Pulse Intake Expansion (Tricolor) | Sustained +11.8% to +13.2% | +11.27% (Midline) / +12.61% (Doc) | 1535 | FDB - year 4&5 questionnaire, Yellow food category cols |
| REC-MIGR-01 | governance | Seasonal Male Out-Migration Trend | Slight increase (+8.9% to +9.2%) | Claimed "Fell 38.6%" | 1535 | FDB - year 4&5 questionnaire, Sections 4 & 7 |
| REC-MIGR-02 | governance | Mean Remittance per Migrant HH | 25029 | ₹41,497.63 (corrupted by outlier) | 1535 | FDB - year 4&5 questionnaire, Migration remittance cols |
| REC-HYG-01 | forensic | Row 1488/1492 Grand Total Neutralization | Neutralized: ₹0.00 discrepancy | Undisclosed spreadsheet hazard | 1535 | Income Data, Row 1492 vs sum of Rows 4:1490 |
| REC-HYG-02 | forensic | Negative Paddy Net Income Overwrite | Fully positive (+₹2.04 Cr / +₹2.50 Cr) | Corrupted to −₹85.13 Lakh in CSV | 1535 | Income Data, Paddy gross and cost columns |
| REC-HYG-03 | forensic | Extreme Outlier Isolation (Tomato) | Cleaned / Excluded from models | ₹70,00,75,173 in Row 1206 (2024) | 1535 | Income Data, all farmer entries validated |
| REC-HYG-04 | forensic | Land Measurement Unit Definition | Explicitly defined as local bigha | Ambiguous; assumed 0.619 ac/bigha | 1535 | FDB - year 4&5 questionnaire, Col 22 header (in bigha) |
| REC-PII-01 | forensic | Beneficiary Telephone Numbers | 1535 | 1,329 personal numbers exposed | 1535 | FDB - year 4&5 questionnaire, Col 12, 17, 19 |
| REC-PII-02 | forensic | Respondent Personal Names | Redacted / Synthetic keys | Raw Devanagari names exposed | 1535 | FDB - year 4&5 questionnaire, Col 9, 10, 11 |
| REC-PII-03 | forensic | Family Member Names in Roster | 6494 | 5,796 personal names exposed | 1535 | family_member_repeat, Col 1 (Name of Family Member) |
| REC-RES-01 | forensic | Caste Stratification Feasibility | Re-classified "Empirically Feasible" | Categorized "Methodologically Infeasible" | 1535 | FDB - year 4&5 questionnaire, Col 13 (Caste) |
| REC-RES-02 | forensic | Panel vs Retrospective Recall Design | Re-anchored to 2-wave recall | Misrepresented as 3-wave panel | 1535 | Survey administration timestamps across both waves |
| METRIC-INC-001 | income | 2026 Aggregate Net Farm Profit | 95045999 | 81032580 | 1487 | Derived: FI1492 - FG1492 |
| METRIC-INC-002 | income | 2026 Median Net Farm Income per Household | 53400 | 22000 | 1487 | Income Data Rows 4:1490 Median |
| METRIC-SOC-001 | governance | Marginalized Community Inclusivity Rate | 99.48% | 99.20% | 1535 | Col 13 (Caste) |
| METRIC-RGHT-001 | rights | Cumulative Verified Public Scheme Leverage | 77098360 | 0 | 577 | Verified line items sum (577 projects) |
