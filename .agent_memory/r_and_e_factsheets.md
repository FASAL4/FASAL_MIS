# R&E Factsheets & Case Studies — Data Audit

**Date:** 2026-07-03
**Analyst:** Cline (research subagent)
**Scope:** Read and report on the four qualitative-impact JSON datasets used by the dashboard.

---

## 1. File Inventory

| # | File | Size | Records | Top-level type |
|---|------|------|---------|----------------|
| 1 | src/data/extracted_fact_sheets.json | 26,420 bytes (~26 KB) | 18 factsheet records | Array of objects |
| 2 | src/data/extracted_case_studies.json | 43,362 bytes (~42 KB) | 18 case-study records | Array of objects |
| 3 | src/data/extracted_grant_reports.json | 9,397 bytes (~9 KB) | 5 reports + 8 images + financial blobs | Single object (not an array) |
| 4 | src/data/stories_of_change.json | 47,385 bytes (~46 KB) | 20 stories inside {stories:[...]} | Object with stories array |

NOTE: extracted_grant_reports.json is a single JSON object (not an array) containing keys: source, processed_date, reports_processed, images_processed, financial_data, program_metrics, key_achievements, stories_of_change, cross_references. It contains 7 short stories-of-change summaries in a nested array, not 18/20 like the other files.

## 2. Top-Level Structure of Each File

### 2.1 extracted_fact_sheets.json (18 records)
Per-record keys: sourceFile, type (factsheet), farmerName (+ farmerNameEn), husbandName (+ husbandNameEn), aasGroup, village (+ villageEn), block, district, state, crop (+ cropEn), variety, areaRaw, areaAcres, dates, production (quintals, kg), costs (sub-cost lines + totalInput), income (totalIncome, netProfit), testimonial (+ testimonialEn), netProfitPerAcre, incomePerAcre, optional factsheetNumber.

### 2.2 extracted_case_studies.json (18 records)
Per-record keys: sourceFile, type (casestudy), title (Hindi narrative), optional author, optional gramPanchayat or village, themes (string array), interventions (string array), summary (long Hindi paragraph).
Some records are duplicates of the same source file (e.g. the Fakirpuri electricity-relief case study appears twice, and the Anshu-justice study appears twice - likely the same .docx picked up from two folders).

### 2.3 extracted_grant_reports.json (1 root object, 5 reports + 8 images)
Root keys: source, processed_date, reports_processed (5 PDFs), images_processed (8 items: 3 Hindi news clippings + 5 photos), financial_data (grant number, year-wise budget, HY leverage), program_metrics (income/acre before->after, LEISA training numbers, etc.), key_achievements (14 bullets), stories_of_change (7 short entries), cross_references (Vaagdhara exposure visit Oct 2023).

### 2.4 stories_of_change.json (20 stories)
Object with stories array. Each story has: id (e.g. cs_fakirpuri_electricity), type (advocacy / transformation / vulnerability / factsheet_story), title (Hindi), titleEn (English), village, gp, themes (array), summary, impact, sourceFile, and sections (5 fixed sections: Background, The Challenge, Programme Intervention, Outcome & Impact, Conclusion & Way Forward).

## 3. Sample Records (5 per file)

### 3.1 Fact Sheets - 5 samples
1. Ram Vachan - Ram Purwa, Mihinpurwa, Bahraich (UP). Onion, Agrifound, 0.05 ac -> 2 q (200 kg), Rs.1,700 cost, Rs.5,000 income, Rs.3,300 net profit. Testimonial: good profit at low cost in less time.
2. Kamla Devi (husband Khushi Ram) - Fakirpuri. Onion, 0.02 ac, 50 kg, Rs.100 cost, Rs.1,150 net profit; first time growing onions in kitchen garden.
3. Mamta Devi (husband Satya Prakash) - Badhiyanpurwa Karikot. Onion, 0.02 ac, 55 kg organic, Rs.1,275 net profit; explicitly says meri aarthik sthiti kamzor (my family income is weak - could not afford to buy onions from the market daily).
4. Arpana (husband Pavan Kumar) - Vishunapur. Tomato, Abhilash variety, 0.02 ac, 300 kg, Rs.10,300 net profit; Rs.10,000 profit after feeding the family all season.
5. Geeta Devi (husband Kishori) - Bhedhan Purwa. Onion Bhima Lal, 0.05 ac, 4 kg, Rs.350 cost, Rs.6,850 net profit - thanks to DEHAT organization.

### 3.2 Case Studies - 5 samples
1. Anirudh Kumar - Dhodhepurwa, Badkhadiya GP. Themes: organic_farming, education, crop_diversification, income_transformation, asset_building. Age ~40, education 8th class, aarthik abhav (financial constraints), 6-member family, transformed from paddy-wheat to organic vegetables, doubled land 1.2->2.4 ac, built pucca house, children in English-medium school.
2. Ram Chandra - Hajaripurwa, Chahalwa GP. 18-member family, 4 bigha land, earlier wage labour, multi-layer farming (bitter gourd on trellis over onion), earned Rs.35,000 from 10 biswa.
3. Kallu - Bhedhan Purwa, Chahalwa GP. 9-member family, Dalit/Muslim/OBC village, UP ka sabse garib zila (UP poorest district), used to farm others land on traditional share-cropping.
4. Kalawati - Bhedhan Purwa, Karikot GP. Widow, husband died of alcohol-related illness, sold all land/property, single mother of 3 sons + 1 daughter, aarthik sthiti lagatar bigadti chali gayi (economic situation kept deteriorating).
5. Sudama Devi (57) - Bhattha Bargadaha, Karikot GP. Widow, husband died untreated, lost Rs.600 to fake MNREGA job cards, leaking thatch roof, no toilet, son migrated to Kannauj as contract labourer. Themes: widow_vulnerability, mnrega_corruption.

### 3.3 Grant Reports - 5 samples
1. Grant Report Jan-Dec 2024 - covered Jan-Dec 2024, Rs.2.16 Cr approved (Y1: 34.89 L, Y2: 44.70 L, Y3: 50.31 L).
2. Sampurna Samadhan Divas (news clipping) - Block-level interface at Bahraich/Shravasti; 328 applications received, 31 disposed on-spot at block, 127 at tehsil (8 on-spot).
3. Seed distribution (news clipping) - DEHAT distributed 200 plants + spinach/brinjal/coriander/tomato/cucumber/chilli/desi-bhindi seeds to women in Sisay, Jamranwa, Bichhiya blocks.
4. Sujauli advocacy (news clipping) - Rs.10,000 fraudulently withdrawn from womans husband via fake e-KYC.
5. Photograph - Govt official visiting village - ~20 women farmers addressed by official, evidence of block-level interface meetings.

### 3.4 Stories of Change - 5 samples
1. cs_fakirpuri_electricity (advocacy) - 70 Tharu families in Fakirpuri got Rs.6,00,000 in wrongful electricity bills waived through AAS collective action.
2. cs_anshu_justice (advocacy) - Anshu Kumari, young Tharu widow, secured widow entitlements through court-guided advocacy.
3. cs_anirudh (transformation) - 1.2 ac -> 2.4 ac, pucca house, children in English-medium school.
4. cs_kalawati (vulnerability) - Widowed, 0.4 ac, wild-animal crop loss, 3 sons + 1 daughter.
5. cs_kaushalya_turmeric (factsheet_story) - Kaushalya, 0.8 ac desi Sugandha turmeric, 90 quintals, Rs.1,71,000 income, Rs.92,500 net profit (3-4x paddy-wheat).

## 4. Direct Answer to User Specific Questions

### Q1. How many case studies mention BPL families vs. APL/non-BPL families?
Answer: ZERO. None of the 18 case-study records in extracted_case_studies.json contain the literal strings BPL, APL, antodyaya, Below Poverty Line, Above Poverty Line, or Antodaya. Same for the 20 stories in stories_of_change.json - they use English wording like widow_vulnerability, extreme poverty, multidimensional poverty, socio-economic barriers, but never the formal bpl / apl / antodyaya tags. The 18 fact sheets likewise never use these formal classifications. The terms BPL/APL/antodyaya DO exist in the project (verified in baseline_farmers.json, farmers_updated.json, yearly_entitlements.json, nutrition.json) - but NOT in any of the four qualitative-impact files the user asked about.

### Q2. What economic profiles are described in the case studies?
The case studies describe FOUR distinct economic profiles, all on the lower end of the spectrum (no APL-style wealthy family is described):

| Profile | Count | Defining features |
|---|---|---|
| A. Wage-labour / landless marginal | 5-6 | Earlier majdoor mehnat (wage labour), Dalit/Muslim/OBC village, sabse garib zila, earn half the harvest after paying cost share-cropping. Examples: Kallu, Gangiya Devi, Sunil Kumar |
| B. Small/marginal farmer (0.05-0.5 ac) | 4-5 | Own 1-4 bigha, often organic-vegetable adopters. Examples: Anirudh, Ram Chandra, Geeta Devi |
| C. Widow-headed, alcohol-affected family | 3 | Husband died alcohol-related; 0.4 ac; wild-animal crop loss; MNREGA/PDS corruption. Examples: Kalawati, Bindu Devi, Sudama Devi |
| D. Tribal Tharu + entitlement-denied family | 3-4 | Tharu janajati bahul, far from district HQ, denied PDS/electricity/MNREGA. Examples: Fakirpuri 70 families, Anshu Kumari, Fair-price shop case |

There is NO profile of an APL (Above Poverty Line) or otherwise well-off family in any of the 18 case studies or 20 stories. Every protagonist is described as poor, vulnerable, or in the act of escaping poverty.

### Q3. Are the families described as BPL (poor) or non-BPL (better off)?
EVERY family described is implicitly BPL / poor / vulnerable. Explicit Hindi language used in the source files:
- garib parivaron (poor families) - appears in titles of two case studies (samay par jankari, vakalat aur parokari se garib parivaron ko lakhon ki rahat)
- aarthik abhav (financial deprivation) - Anirudh Kumar, Reena Kumari
- aarthik sthiti kamzor (weak economic condition) - Rajkumari Devi, Mamta Devi
- aarthik sthiti theek nahi (economic condition not good) - Kumari Kavita, Kumari Chandani
- aarthik sthiti lagatar bigadti chali gayi (economic condition kept deteriorating) - Kalawati
- UP ka sabse garib zila (UP poorest district) - Kallu, Gangiya Devi
- mere maa-bap bahut garib hain (my parents are very poor) - Kumari Kavita, Kumari Chandani
- garib parivar mein hui (raised in a poor family) - Reena Kumari
- Dalit, alpasankhyak aur pichhadi jati - Chahalwa GP description
- bahu aarthik garibi - Sudama Devi
- English: widow_vulnerability, extreme poverty, multidimensional poverty, socio-economic barriers

Not a single case study or story describes a family as better-off, APL, middle-income, or non-vulnerable.

## 5. Coverage of vulnerable families / economic status themes

| Theme tag (English) | Files where it appears | Approx count |
|---|---|---|
| widow_vulnerability | extracted_case_studies.json | 5 records (Anshu, Kalawati, Bindu, Sudama, plus dup) |
| women_empowerment | case studies + stories | 9 case studies, 9 stories |
| social_issue_alcohol | case studies | 3 (Kalawati, Bindu, Fakirpuri fair-price) |
| mnrega_corruption | case studies | 2 (Bindu, Sudama) |
| organic_farming | case studies + fact sheets + stories | 11 case studies, 14 stories, all 18 fact sheets |
| crop_diversification | case studies + fact sheets | 8 case studies, 9 stories, all 18 fact sheets |
| income_transformation | case studies + stories | 9 case studies, 7 stories |
| collective_advocacy | case studies + stories | 5 case studies, 3 stories |
| advocacy_electricity | case studies + stories | 5 |
| education (esp. girl-child marriage) | case studies + stories | 5 (Kavita, Chandani, Reena, Anirudh, Rajkumari) |
| sanitation (toilets, ODF) | case studies | 3 (Arti, Bindu, Sudama) |
| asset_building (pucca house, motorcycle) | stories | 2 (Anirudh, Ram Chandra) |

There is NO economic-status classification field (BPL/APL/antodyaya/SC/ST/OBC/landless) embedded in any record across the four files. The stories rely on narrative descriptors instead of categorical tags. The only place those categorical tags exist in the project is farmers.json / farmers_updated.json / baseline_farmers.json, and they are exposed through the family_eligibility.json matrix (600 matched cohort, all 600 of whom are flagged bpl:true and antodyaya:true per the 2026-07-03 audit).

## 6. Data-Quality Observations

1. Duplicate source files in extracted_case_studies.json. The Fakirpuri electricity case study and the Anshu-justice case study each appear TWICE (identical Hindi title, same sourceFile name). Effective unique case studies = 16, not 18.
2. One fact-sheet record is a template stub. The record sourced from FACT SHEET Haldi Formate.docx has farmerName: null, village: null, cropEn: (Template) and empty production/costs - it is the turmeric-cultivation template, not an actual farmer. Effective unique factsheets = 17.
3. State typos. Some UP factsheets spell the state as Uttar Porodesh (typo). Only an aesthetic issue.
4. One factsheet is suspiciously low: Factsheet of Onion and bitter guard, Geeta devi lists production quintals: 0.04, kg: 4 for Rs.7,200 income - the quintal/kg fields look transposed; should likely read 4 quintals (400 kg) for Rs.7,200. Flag for manual review.
5. stories_of_change.json and extracted_case_studies.json overlap heavily - 14 of the 20 stories in stories_of_change.json re-tell the same Hindi narratives found in extracted_case_studies.json, but add an English titleEn, a structured 5-section sections block, and an impact bullet. The two files are not duplicates - the stories file is the dashboard-ready English version; the case-studies file preserves the raw Hindi DOCX extraction.
6. extracted_grant_reports.json is structurally different - single object, no per-farmer records, 5 PDFs + 8 images metadata only, plus 7 short stories-of-change entries that OVERLAP with the longer stories in stories_of_change.json (Sanjaywati, Rajkumari, Guddi Devi, Bhakuri, Shanti Devi, Deventi Devi, Reena Kumari).

## 7. Bottom-Line Answer (1-paragraph)

Across all four qualitative-impact files, NOT A SINGLE record carries a BPL/APL/antodyaya classification - those tags live in farmers.json and its derivatives, not here. Every family described in the 18 case studies, 20 stories-of-change, and 18 fact sheets is portrayed as poor, vulnerable, or transitioning out of poverty. The dominant profiles are (a) small-marginal tribal Tharu families in Fakirpuri/Chahalwa, (b) Dalit/OBC wage-labour families in Karikot, (c) widow-headed alcohol-affected households, and (d) women farmers escaping subsistence through organic vegetable cultivation. There are NO APL / non-BPL / better-off families represented in any of the four files. For categorising families by economic class, the dashboard should continue to use the bpl / antodyaya / landless / caste flags from family_eligibility.json (600 matched cohort) - not the qualitative files - but it is safe to narratively characterise 100% of the families in these four files as belonging to the BPL / vulnerable / poor segment.

---

## 8. Relevant file paths

- c:\Users\bentn\antigravity\Untitled\src\data\extracted_fact_sheets.json
- c:\Users\bentn\antigravity\Untitled\src\data\extracted_case_studies.json
- c:\Users\bentn\antigravity\Untitled\src\data\extracted_grant_reports.json
- c:\Users\bentn\antigravity\Untitled\src\data\stories_of_change.json
- c:\Users\bentn\antigravity\Untitled\src\data\family_eligibility.json (where the actual BPL/APL/antodyaya tags live - not part of this audit but referenced for context)
- c:\Users\bentn\antigravity\Untitled\src\data\farmers.json (matched cohort source of 600 records; all bpl:true / antodyaya:true)
- c:\Users\bentn\antigravity\Untitled\.agent_memory\changelog.md (prior audit context, esp. 2026-07-03 entry on family-eligibility audit)
- c:\Users\bentn\antigravity\Untitled\.agent_memory\r_and_e_factsheets.md (this report)
