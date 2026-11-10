# DEHAT FASAL Program — Master Context & Data Analysis Document

> **Generated:** 2026-06-24  
> **Workspace:** `c:/Users/bentn/OneDrive/Desktop/FASAL Information`

---

## 1. PROJECT OVERVIEW

### Organization
**Developmental Association for Human Advancement (DEHAT)**  
A rights-based, youth-led grassroots organization working in Bahraich district, Uttar Pradesh, along the Indo-Nepal border. DEHAT works with marginalized Tharu/SC communities in forest-fringe villages near Katarniaghat Wildlife Sanctuary.

- **Website:** dehatindia.org  
- **Contact:** 8789554459, 7234012736, 8750398900  
- **Email:** contact@dehatindia.org  
- **Founder passed away:** May 5, 2021 (COVID-19) → transition to young, female, feminist collective leadership  
- **Current Executive Director:** Devyani Chaturvedi  
- **Board Members (from Apr 2026):** Jahnvi Andharia, Jayesh Joshi

### Program: FASAL (Farmers' Action for Sustainable Agro-based Livelihoods)
- **Funder:** APPI (Grant #2110-10970)  
- **Duration:** 2022-01-01 to 2026-12-31  
- **Budget:** ₹2.16 Cr total  
- **Geography:** 6 Gram Panchayats, 20 villages, Mihinpurwa Block, Bahraich District  
- **Target:** 1,500 marginal farmer families  
- **Themes:** Land & Forest Dependant VG

### Program Goal
> Increase agricultural income of at least 50% households from **₹10,000/acre/annum → ₹60,000/acre/annum** through:
- LEISA (Low Input Ecological Sustainable Agriculture / LIESA)
- Multi-layer farming (machan/trellis systems)
- Crop diversification (monoculture → mixed cropping)
- Line sowing, mulching, raised-bed nurseries
- Convergence with Horticulture Department (GoUP)
- LIESA-based Natural Farming (Ghanjeevamrit, Jeevamrit, Char Chatni, 10 Parani)

### Key 2025 Achievements
- ₹2.8 Cr leverage across 6 Gram Panchayats (PM Awas, toilets, roads, water, drainage, solar lights, Anganwadi)
- 74 active AAS groups, 5 clusters, 1 Block Level Federation
- Horticulture convergence: ₹1,58,500 (garlic seed, gladiolus, rose plants, karonda, apple ber, marigold)
- District-level interface meetings
- Women peer-led facilitation emerging

---

## 2. DATA ARCHITECTURE

### 2.1 Data Collection Pipeline

```
Paper FDB (Hindi booklet)
  → Filled by CRPs/Krishi Mitras with farmers
    → Digitized via Kobo Collect application
      → DEHAT_Cleaned_Data.json (raw export)
        → DEHAT_Cleaned_Data_with_Acres.csv (with acre conversions)
```

### 2.2 Files in the Workspace

| File | Type | Records | Columns | Description |
|------|------|---------|---------|-------------|
| `DEHAT_Cleaned_Data_with_Acres.csv` | CSV | 1,329 | 3,002 | Primary cleaned dataset with acre-converted land columns |
| `DEHAT_Cleaned_Data.json` | JSON | 1,329 | 2,999 | Raw Kobo Collect export (same data, no acre columns) |
| `DEHAT_Cleaned_Data.xlsx` | Excel | 1,329 | 3,002 | Same data in Excel format |
| `Updated_Fasal Crop wise details_Update _2025.xlsx` | Excel | 1,361 | 117 | 2025 crop-wise data (area/seed/yield/net income per crop) |
| `Family_Development_Book_-_Dehat_Dec24_-_all_versions_-_English_en_-_2026-06-22-14-05-16.xlsx` | Excel | 1,330 | 4,467 | Raw FDB digitized data (English labels, 4,467 columns!) |
| `Family Development Booklet-DEHAT.pdf` | PDF | — | — | Hindi FDB paper template (the original data collection tool) |
| `DEHAT.md` | MD | — | — | Self-assessment report for APPI |
| `DEHAT.pdf` | PDF | — | — | Same as DEHAT.md |
| `Grant Report January to December 2025.md` | MD | — | — | 39-page annual grant report |
| `DEHAT India x VAAGHDHARA Exposure Visit Report 2025-Rectified.md` | MD | — | — | Cross-learning visit report |

### 2.3 Land Units
- **2022-2024 data:** Land in **bigha** (columns 18-20), converted to **acres** in extra columns
- **2025 data:** Land in **acres** directly
- **Conversion:** 1 bigha ≈ 0.619 acres (Uttar Pradesh context)

### 2.4 The Family Development Booklet (FDB) Structure

The FDB is a comprehensive household tracking tool with these sections:

| Section | Content | Digitized? |
|---------|---------|-----------|
| **Family Profile** | Name, father, phone, AAS code, village, GP, block, district, SHG, Krishi Mitra, Panchayat Assistant | ✅ 100% |
| **Tricolor Food Consumption** | Monthly tracking (Jan-Dec) of White (milk, cheese, egg, cauliflower, rice), Green (13+ vegetables), Yellow (pulses, grains, fruits) foods — with source: self-grown vs market-purchased | ✅ 100% |
| **Crop Income (Kharif/Rabi/Zaid)** | Per crop: area, cost incurred, income from selling, income from home consumption, total net income | ✅ 100% |
| **Government Schemes** | 31+ schemes tracked across 6 half-yearly periods: MNREGA, Ayushman, pension, PM Awas, toilet, ration card, Aadhar, caste certificate, income certificate, birth/death certificate, disability, widow pension, marriage grant, driving license, BOCW registration, education scholarship, electricity connection, water connection | ✅ 100% |
| **Governance Participation** | Gram Sabha attendance, School Management Committee, Health Committee, Child Welfare Committee | ✅ 100% |
| **Livestock** | Buffalo, cow, goat, sheep, pig, hen, duck, horse — ownership and income from sale of animal/animal products | ✅ 100% |
| **Migration** | Family member migration: where, what work, income contribution, months migrated | ✅ 100% |
| **Family Members** | Repeat table: name, Bal Sansad, Kishor Sangathan, Yuva Sansad, AAS membership | ✅ 100% |

**Total digitized fields:** 2,345+ across all sections

---

## 3. ANALYSES PERFORMED & SCRIPTS CREATED

### 3.1 `assess_dehat_data.py`
**Purpose:** Initial inconsistency audit of the cleaned 2022-2024 dataset

**What it checks:**
- Land calculation math (Owned + Leased = Total?)
- Net income math (Is Net Income ≥ Sell - Cost?)
- Missing/null value patterns (columns with >90% nulls)
- Logical contradictions (income on zero land, cost=0 with income>0)
- Duplicate/overlapping crop columns (case mismatches)
- Categorical consistency (District, Block, Village, AAS names)
- Duplicate records (by phone, by UUID)
- Per-acre income by year with outlier detection

**Output:** `DEHAT_Data_Assessment_Report.md`  
**Command:** `python assess_dehat_data.py`

### 3.2 `consolidate_crop_data.py`
**Purpose:** Parse 2025 Excel, extract 2022-2024 crop data, link farmers, produce year-wise summary

**What it does:**
- Parses multi-row header from 2025 Excel (Crop details sheet)
- Parses AASINFOR (farmer master data) sheet
- Audits 2025 data (negative incomes, zero-area-with-income, total income column mismatches, duplicate farmer codes)
- Extracts 2022-2024 crop data from CSV
- Links farmers by name+father matching
- Maps 2025 crop names to 2022-2024 naming conventions
- Generates year-wise comparison tables

**Output:** `DEHAT_Crop_Data_2022_2025_Report.md`  
**Command:** `python consolidate_crop_data.py`

### 3.3 `investigate_anomalies.py`
**Purpose:** Deep-dive into key anomalies flagged by assess_dehat_data.py

**Investigations:**
- Tally rani outlier (₹700M tomato income — data entry error, should be ~₹7,000)
- Phone number default values ("Phone No" placeholder)
- Zero-land-with-income patterns
- Land math mismatch patterns
- Per-acre income stats excluding extreme outlier
- Top crops by frequency
- Village name missing analysis

**Command:** `python investigate_anomalies.py`

### 3.4 `fasal_program_analysis.py`
**Purpose:** 5-step program analysis connecting data to program goals

**Steps:**
1. **FDB→Dataset Mapping** — Confirm all FDB sections digitized
2. **Program Dashboard** — Income trends, diversification index, food security, scheme access
3. **Farmer-Level Profiles** — Build 1,312 unique farmer profiles with year-by-year data
4. **₹60K/Acre Threshold** — Flag farmers crossing program target
5. **Most Profitable Crops per Season** — Kharif/Rabi/Zaid profitability rankings

**Output:** `FASAL_Program_Analysis_Report.md`  
**Command:** `python fasal_program_analysis.py`

---

## 4. KEY FINDINGS SUMMARY

### 4.1 Data Quality Issues

| Issue | Severity | Count | Details |
|-------|----------|-------|---------|
| Income on zero land | 🔴 High | 163 farmers | Reported crop income but no land data |
| Impossible net income | 🔴 High | 171 cases | Net Income < (Sell - Cost) |
| Zero-area-with-income (2025) | 🔴 High | 383 cases | Methi crop area column blank |
| Extreme outlier | 🔴 High | 1 (Tally rani) | ₹70Cr tomato income on 3 ac — should be ~₹7K |
| Land math errors | 🟡 Medium | 158 | Owned + Leased ≠ Total |
| Duplicate crop columns | 🟡 Medium | 15 groups | Case mismatches: Wheat/wheat, Cauliflower/cauliflower, Paddy/paddy |
| Missing village names | 🟡 Medium | 1,241/1,329 (93%) | Village Name column largely empty |
| 2025 duplicate farmer codes | 🟡 Medium | 40 codes | SIRSKRISHI series appears twice each |
| 2025 code mismatch | 🟡 Medium | 1,318 orphaned | Crop details codes don't match AASINFOR |
| Columns >90% null | 🟢 Low | 244 | Migration module (mother/sister/brother) unused |

### 4.2 Program Performance Against Targets

| Indicator | 2022 | 2023 | 2024 | Target | Status |
|-----------|------|------|------|--------|--------|
| Median Income/Acre | ₹20,317 | ₹59,854 | **₹74,000** | ₹60,000 | ✅ **Exceeded** |
| Farmers crossed ₹60K/acre | 115 (10%) | 554 (50%) | **755 (68%)** | 750 (50%) | ✅ **Exceeded** |
| Mean Crops/Farmer | 6.3 | 9.2 | **11.2** | ↑ Diversification | ✅ **Diversifying** |
| Food data coverage | — | — | **99.9%** | Universal | ✅ |
| Farmers in all 3 years | — | — | 1,246 | — | ✅ |
| Consistent high-performers | — | — | **108** | — | Crossed ₹60K all 3 years |

### 4.3 Crop Profitability by Season

| Season | Top Crop | Avg ₹/Acre | Notes |
|--------|----------|-----------|-------|
| **Kharif** | Sugarcane | ₹31,272 | Highest value kharif crop |
| **Kharif** | Paddy | ₹20,307 | Most widely grown (1,082 farmers) |
| **Rabi** | Wheat | ₹21,843 | Most widely grown (1,093 farmers) |
| **Rabi** | Potato | ₹4,640 | |
| **Rabi** | Mustard | ₹3,540 | |
| **Zaid** | Tomato | ₹443,152 | Skewed by outlier; typical ~₹2,000/ac |
| **Zaid** | Bitter Gourd | ₹1,786 | |
| **Zaid** | Okra | ₹1,568 | 968 farmers |
| **Zaid** | Cowpea | ₹1,533 | |

### 4.4 Farmer Matching Across Years
- **2022-2024 profiles:** 1,312 unique (by name+father)
- **2025 profiles:** 1,335 unique (by name+father)
- **Exact matches:** 107 (mostly due to Hindi/English transliteration differences and 93% missing village names)
- **Challenge:** No universal farmer ID across datasets

---

## 5. REPORTS GENERATED

| Report | Lines | Content |
|--------|-------|---------|
| `DEHAT_Data_Assessment_Report.md` | 298 | Full inconsistency audit for 2022-2024 data |
| `DEHAT_Crop_Data_2022_2025_Report.md` | 212 | Year-wise crop data integrating 2025 |
| `DEHAT_Crop_Data_Report_Presentable.md` | ~200 | Cleaned presentable version |
| `FASAL_Program_Analysis_Report.md` | 204 | 5-step program-level analysis |

---

## 6. PYTHON SCRIPTS

| Script | Purpose | Dependencies |
|--------|---------|-------------|
| `assess_dehat_data.py` | Initial data inconsistency audit | csv, json, re, statistics, collections |
| `consolidate_crop_data.py` | 2022-2025 crop data consolidation | csv, re, statistics, collections, **openpyxl** |
| `investigate_anomalies.py` | Deep-dive anomaly investigation | csv, statistics |
| `fasal_program_analysis.py` | Program-level 5-step analysis | csv, re, statistics, collections |
| `inspect_land_columns.py` | (Original inspection script) | — |

**Note:** `consolidate_crop_data.py` requires `openpyxl` to read Excel files.  
Install with: `pip install openpyxl`

---

## 7. DATA DICTIONARY (Key Columns)

### Farmer Identification
| Column | Description |
|--------|-------------|
| `Name of the Farmers/AAS Members` | Farmer name (Hindi/English) |
| `Name of Father/Husband` | Father or husband name |
| `your phone number` | Contact number |
| `AAS Name` | Aajeevika Adhikar Sangathan group name |
| `Village Name` | Village (93% empty in 2022-2024) |
| `District` | Always "Bahraich" |
| `Block Name` | Always "Mihinpurwa" |

### Land
| Column | Unit |
|--------|------|
| `How much Owned Agriculture land is available with you?` | Bigha |
| `How much leased agriculare land is available with you?` | Bigha |
| `How much Total agriculture land is available with you?(in bigha)` | Bigha |
| `Owned_Land_(Acres)` | Acres (computed) |
| `Leased_Land_(Acres)` | Acres (computed) |
| `Total_Land_(Acres)` | Acres (computed) |

### Crop Income Pattern
```
Total net income received by the farmer (selling the crop + crop kept for consumption)-{Crop} in {Year}
Total cost incurred by the farmer in growing the crop-{Crop} in {Year}
Income received by the farmer from selling the crop-{Crop} in {Year}
```

### Food Consumption Pattern
```
What are {color} food did you consumed in {month}{year}
What are {color} food did you consumed in {month}{year}/{FoodItem}
```
- Colors: white, green, yellow
- Months: january, february, march, april, may, june, july, august, september, october, november, december
- Years: 2022, 2023, 2024

### Scheme Access Pattern
```
Is Leading done for {scheme} in {period} six Months     (Yes/No)
Did you Received {scheme} in {period} six Months        (Yes/No)
```
- Periods: First, third, fifth (half-years)
- Schemes: private toilet, community toilet, school toilet, Ration Card, MNREGA job card, Ayushman Card, Aadhar card, old age pension, widow pension, disability pension, etc.

### 2025 Excel Crop Columns
```
{Crop Name} / Area in Acre
{Crop Name} / Total Quantity seed used(kg)
{Crop Name} / Yield (Quintal)
{Crop Name} / Total Net Income(Rs)
```
- Crops: Onion, Bitter gourd, Coriender, Raddish, Palak, Matar, Methi, Carrot, Dill seeds, Beetroot, Lentils, Turmeric, Ginger, Cauliflower, Ridge gourd, Lobhiya, Bhindi, Sem, Chilly, Tomato, Cabbage, Cucumber, Brinjal, Mix Cropping

---

## 8. KNOWN ISSUES & RECOMMENDATIONS

### Urgent Data Fixes Needed
1. **Tally rani tomato income:** ₹700,176,223 should likely be ~₹7,000 (check FDB paper)
2. **Zero-land farmers:** 163 farmers with income but no land — likely missing data entry
3. **Village names:** 93% missing — can be backfilled from AAS/village mapping
4. **Deduplicate SIRSKRISHI codes:** 40 codes appear twice in 2025 data

### Recommended Next Analysis Steps
1. **Food security scoring:** Calculate dietary diversity score per farmer/month from the tricolor food data
2. **Scheme success rate:** Compare "Is Leading done" vs "Did you Received" to calculate scheme conversion rate
3. **Cross-reference 2025 codes:** The Crop details codes and AASINFOR codes share 0 matches — investigate why
4. **Season-wise income breakdown:** Calculate income per farmer per season (Kharif vs Rabi vs Zaid)
5. **Multi-layer farming verification:** Check if farmers growing turmeric+bitter gourd or onion+radish combinations show higher per-acre income
6. **Fuzzy name matching:** Implement fuzzy matching (Levenshtein) to improve cross-year farmer linkage beyond the current 107/1335

---

## 9. HOW TO REPRODUCE ALL ANALYSES

```bash
cd "c:/Users/bentn/OneDrive/Desktop/FASAL Information"

# Step 1: Initial audit
python assess_dehat_data.py

# Step 2: 2025 consolidation
python consolidate_crop_data.py

# Step 3: Anomaly investigation
python investigate_anomalies.py

# Step 4: Program analysis
python fasal_program_analysis.py
```

---

## 10. CONTACT

- **Program Director:** Divyanshu Chaturvedi (divyanshu@dehatindia.org)
- **Data/MIS:** Managed through Kobo Collect by field team
- **Workspace location:** `c:/Users/bentn/OneDrive/Desktop/FASAL Information`

---

*End of Master Context Document*