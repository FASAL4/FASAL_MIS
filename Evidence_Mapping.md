# FASAL 2022-2025: Evidence Mapping and Extraction Register

This document serves as the comprehensive evidence spine for the DEHAT FASAL project dashboard. It maps the quantitative and qualitative outcomes extracted from project files against the Results Framework (RF) and broader intersectional goals.

## 1. Executive Summary of Quantitative Evidence
- **AAS Groups Formed**: 82 (Target: 80)
- **Krishi Mitras Trained**: 48 (Target: 48)
- **CRP Trainings Conducted**: 34 with 643 total participants.
- **Direct Training Participation**: 659 participants across capacity-building programs.
- **Total Validated Convergence/Leverage**: ₹8.25 Cr (₹82,500,000)
- **Agriculture - Multi-Layer Farming**: 152 adopting farmers tracked.
- **Agriculture - LEISA Training**: 296 participants tracked.
- **Agriculture - Vegetable Cultivation**: 966 farmers tracked.
- **Agriculture - Nutritional Gardens**: 3,306 instances recorded.
- **Income - Turmeric Adoption**: 137 adopters generating ₹46,17,245 in total value (Average Net Income: ₹34,202).

## 2. Source Inventory
| Source_ID | Source_File_Name | File_Type | Primary_Evidence_Function | Data_Level |
|---|---|---|---|---|
| SRC_01 | FASAL MIS - Consolidated.md | MIS/Data | Crop-wise production, Area, Farmers | Farmer/Crop |
| SRC_02 | Updated_Fasal Crop wise details_Update _2025.md | MIS/Data | 2025 Crop-wise updates | Farmer/Crop |
| SRC_03 | Training data_FASAL MIS 2025.md | MIS/Data | 2025 Trainings | Training/Village |
| SRC_04 | FDB Booklet.md | Qualitative | FDB Logic & Household tracking | Household |
| SRC_05 | all_cols.txt | Data Schema | FDB Dataset Columns | Household |
| SRC_06 | 1. Leverage AASs 2025.xlsx | Financial | Entitlements and Convergence | GP/Block |
| SRC_07 | Grant Report January to December 2024.pdf | Narrative | Claim extraction & Context | Programme |

## 3. RF and Grant Application Skeleton
| RF_ID | RF_Level | Indicator_Text | Target | Achieved | Dashboard_Pillar |
|---|---|---|---|---|---|
| RF_1.1.1 | Output | AAS groups formed | 80 | 82 | Institutions |
| RF_3.1 | Output | No of CRP training programs | 48 | 48 | Capacity Building |
| RF_4.1 | Outcome | Natural Mgmt & LEISA Technique | N/A | 296 trained | Agriculture |

## 4. Grant Report Claim Extraction
| Grant_Claim_ID | Claim_Text | Number_Reported | Verification_Status | Dashboard_Use |
|---|---|---|---|---|
| GC_01 | Turmeric Adopters generated high income | 137 adopters | Verified via MIS | Production Tab Headline |
| GC_02 | AAS Groups consolidated for active engagement | 74 active (82 formed) | Triangulated | Institutions Tab |
| GC_03 | High convergence of public funds | 2.8 Cr (2024-25) | Triangulated (Total 8.25 Cr) | Economic Tab Headline |

## 5. Agriculture, Crop Diversity, and Income Analysis
| Crop_Category | Farmers_Tracked | Evidence_Label | Dashboard_Use |
|---|---|---|---|
| Multi-Layer | 152 | Directly calculated from raw MIS data | Agriculture Tab |
| Nutritional Gardens | 3,306 | Directly calculated from raw MIS data | Agriculture Tab |
| Vegetable Cultivation | 966 | Directly calculated from raw MIS data | Agriculture Tab |
| LEISA / Natural Farming | 296 | Triangulated from training logs | Agriculture Tab |

## 6. Dashboard Screen Structure
The dashboard is structured into 13 distinct analytic views, mapping directly to the 14 requested screens (with "Stories of Change" as a global navigational element):
1. **Results Snapshot**: High-level program overview.
2. **RF Achievement**: Tabular view of targets vs. achievements.
3. **Farmer Institutions**: Deep-dive into AAS structures.
4. **Training & Capacity**: Participation and capacity-building metrics.
5. **Agriculture Adoption**: Practice adoption tracked via MIS.
6. **Production & Income**: Turmeric and cash-crop economic value.
7. **Household Economic**: Convergence and entitlement scaling.
8. **Community Extension**: Krishi Mitra and CRP training reach.
9. **Rights & Leverage**: FDB tracked rights access.
10. **Baseline vs Current**: Longitudinal insights (Under Construction).
11. **FDB Outcomes**: Tiranga food model and household resilience.
12. **Intersectional Impact**: DEHAT's holistic approach to development.
13. **Evidence Audit**: Transparency on data sources and calculation logic.

*Note: For the exhaustive line-by-line FDB dataset mapping (Tables 10A-10C, 12, 14), raw processing scripts (`run_crop.cjs`, `extract_mis_data.cjs`) are executed in the Node environment to feed the dynamic React state.*
