You are designing an evidence-disciplined, donor-facing dashboard for the FASAL five-year phase implemented by DEHAT with support from APPI.

This dashboard is for the final donor visit of the five-year phase. It must show everything DEHAT can credibly demonstrate, but it must not overclaim, hallucinate, or create unsupported impact statements.

Use only the files attached in this session. Do not use outside information.

Attached evidence package:

(read the directory)

Core task:

Read every file line by line, sheet by sheet, column by column, and indicator by indicator. Build a rigorous mapping that shows:

A. Which FDB fields correspond to RF Activities, RF Outputs, and RF Outcomes.
B. Which FDB fields do not correspond directly to the RF but are important for showing DEHAT’s family-centred, rights-based, and intersectional approach.
C. Which MIS/training/crop-wise fields verify RF activities, outputs, or outcomes.
D. Which Grant Report claims are supported, partially supported, or unsupported by raw data.
E. Which household-level baseline-to-endline insights can validly be produced.
F. Which dashboard cards can be safely created, and which claims must be avoided.

Important evidence rules:

1. Do not hallucinate.
2. Do not infer achievement from intention.
3. Do not infer outcome from activity.
4. Do not merge “training conducted” with “practice adopted.”
5. Do not merge “participant attended” with “participant changed behaviour.”
6. Do not merge “AAS formed” with “AAS active.”
7. Do not merge “AAS active” with “AAS effective.”
8. Do not merge “claim raised” with “claim resolved.”
9. Do not merge “scheme awareness” with “scheme application.”
10. Do not merge “scheme facilitated” with “scheme approved.”
11. Do not merge “scheme approved” with “benefit received.”
12. Do not merge “Krishi Mitra trained” with “Krishi Mitra providing farmer support.”
13. Do not merge “crop cultivated” with “income increased.”
14. Do not display any number as achievement unless source-verified.
15. If a source is missing, label the result as “Source not found” or “Evidence pending.”
16. If a number is reported in the Grant Report but not found in raw data, label it as “Reported only.”
17. If raw data supports part of a claim, label it as “Partially verified.”
18. If FDB supports an outcome but not causality, label it as “FDB outcome evidence, causality not established.”
19. Do not assume that household-level data is baseline-to-endline. First test whether baseline-to-endline comparison is structurally possible.
20. Sensitive household/person-level data must be anonymised and aggregated.

Step 1: Extract RF architecture

From the RF Template, extract every Activity, Output, Outcome, indicator, target, unit, and timeline.

Create a table with these columns:

RF_ID
RF_Level: Activity / Output / Outcome
RF_Text
Indicator_Text
Target
Unit
Theme
Dashboard_Pillar
Source_File
Sheet_or_Page
Source_Location
Notes

Step 2: Extract Grant Report claims

From each Grant Report, extract every claim, achievement, number, case, narrative result, and progress statement.

Create a table with these columns:

Grant_Claim_ID
Grant_Report_Period
Claim_Text
Number_Reported
Unit
Theme
Corresponding_RF_ID
Evidence_Type: Quantitative / Qualitative / Narrative / Case / Process / Financial
Raw_Data_Source_Found: Yes / No / Partial
Raw_Data_Source_Name
Verification_Status: Verified / Partially verified / Reported only / Source not found
Dashboard_Use: Use / Use with caveat / Hold
Caution

Step 3: Understand the FDB Booklet

Use the FDB Booklet to interpret the purpose of each FDB section before analysing the cleaned dataset.

Create a table with these columns:

FDB_Booklet_Section
Purpose_of_Section
Household_or_Individual_Level
Likely_RF_Relevance
Likely_Intersectional_Relevance
How_It_Should_Be_Used_in_Dashboard
Caution

Step 4: Classify every FDB cleaned dataset field

For every FDB field/column, classify whether it corresponds to RF Activity, Output, Outcome, or is outside the RF.

Create a table with these columns:

FDB_Field_ID
FDB_Field_Name
FDB_Section
Field_Description
Data_Type
Household_or_Individual_Level
Corresponding_RF_ID
Corresponding_RF_Level: Activity / Output / Outcome / None
Correspondence_Type: Direct RF match / Indirect RF match / Triangulation support / Contextual support / FDB-only intersectional / Not relevant
Theme
Dashboard_Pillar
Can_Be_Used_For_Dashboard_Card: Yes / No / Maybe
Recommended_Card_Name
Calculation_Logic
Disaggregation_Possible: Year / Village / Gender / AAS / Krishi Mitra / Household type / Caste / Landholding / Vulnerability
Evidence_Strength: Strong / Medium / Weak
Caution
What_Can_Be_Safely_Claimed
What_Cannot_Be_Claimed

Step 5: Test whether household-level baseline-to-endline analysis is possible

Do not assume that the FDB cleaned dataset contains baseline-to-endline data.

For every FDB indicator/theme, check whether the dataset contains:

1. Unique household ID or stable household identifier
2. Baseline value
3. Endline/latest value
4. Date, year, round, or phase marker
5. Same indicator definition across time
6. Sufficient non-missing values
7. Clear unit of measurement
8. Ability to compare the same household over time

Create a table with these columns:

Indicator_or_Field
Household_ID_Available: Yes / No
Baseline_Value_Available: Yes / No
Endline_Value_Available: Yes / No
Date_or_Round_Available: Yes / No
Same_Household_Comparable: Yes / No
Same_Indicator_Definition: Yes / No
Baseline_Endline_Analysis_Possible: Yes / No / Partial
Reason
Caution

Step 6: Produce household-level baseline-to-endline insights only where valid

Where valid baseline-to-endline comparison is possible, calculate:

1. Number of households with valid baseline and endline data
2. Baseline value
3. Endline value
4. Absolute change
5. Percentage change
6. Number of households improved
7. Number of households unchanged
8. Number of households worsened
9. Number of households with missing/incomplete data
10. Disaggregation by village, gender of household head, AAS, Krishi Mitra linkage, landholding, vulnerability category, and farmer type, if available

Create a table with these columns:

Insight_ID
Indicator
RF_ID
Dashboard_Pillar
Total_Households
Households_With_Valid_Baseline_Endline
Baseline_Value
Endline_Value
Absolute_Change
Percentage_Change
Improved_Count
Unchanged_Count
Worsened_Count
Missing_or_Incomplete_Count
Disaggregation_Possible
Evidence_Status
Safe_Donor_Wording
Caution
Recommended_Visual_Type

If baseline-to-endline comparison is not valid, do not calculate change. Instead classify it as:

* Current household status
* Household vulnerability profile
* Endline-only evidence
* FDB-only intersectional evidence
* Contextual evidence
* Not suitable for dashboard

Use safe wording such as:

“Households currently reporting…”
“Households recorded with…”
“FDB captures household status on…”
“Current FDB evidence shows…”

Do not use wording such as “improved,” “increased,” “reduced,” “changed,” “moved from baseline to endline,” or “impact achieved” unless valid baseline-to-endline comparison exists.

Step 7: Classify all training/MIS files

Analyse the year-wise FASAL MIS/training files for 2022, 2023, 2024, and 2025.

For every training/event/activity record, create a table with these columns:

MIS_Record_ID
Year
Date
Activity_or_Training_Name
Theme
Village
AAS_Linkage
Krishi_Mitra_Linkage
Participant_Count
Women_Count
Men_Count
Farmer_Count
Staff_Count
Training_Topic
Corresponding_RF_ID
RF_Level_Verified: Activity / Output / None
Can_Verify_Activity: Yes / No
Can_Verify_Output: Yes / No
Can_Verify_Outcome: No unless triangulated
Dashboard_Card
Evidence_Status
Caution

Step 8: Analyse FASAL MIS - Consolidated

Use the consolidated MIS to check whether it confirms, duplicates, corrects, or conflicts with the year-wise MIS files.

Create a table with these columns:

Consolidated_Record_ID
Year_or_Period
Indicator_or_Activity
Reported_Value
Unit
Corresponding_RF_ID
Matches_Yearwise_MIS: Yes / No / Partial / Not applicable
Difference_Observed
Preferred_Source_for_Dashboard
Reason_for_Source_Choice
Caution

Step 9: Analyse crop-wise details

Use the Updated FASAL Crop-wise Details 2025 file to assess whether agriculture outcome cards can be created.

Create a table with these columns:

Crop_Record_ID
Year
Village
Household_or_Farmer_ID
Crop
Area
Production
Input_Cost
Gross_Income
Net_Income
Own_Consumption
Market_Sale
Practice_Used
Corresponding_RF_ID
Outcome_Indicator_Supported
Calculation_Logic
Can_Support_Productivity_Card: Yes / No / Maybe
Can_Support_Income_Card: Yes / No / Maybe
Can_Support_Food_Security_Card: Yes / No / Maybe
Evidence_Status
Caution
What_Can_Be_Safely_Claimed
What_Cannot_Be_Claimed

Step 10: Triangulate RF, Grant Reports, FDB, MIS, crop-wise data, and household baseline/endline evidence

Create a master triangulation table.

Each row should represent one possible dashboard indicator/card.

Columns:

Dashboard_Card_ID
Dashboard_Card_Name
Dashboard_Pillar
RF_ID
RF_Level: Activity / Output / Outcome / FDB-only
RF_Target
Grant_Report_Claim
MIS_Source
FDB_Source
Crop_Source
Training_Source
Household_Baseline_Endline_Source
Actual_Value_Available: Yes / No / Partial
Actual_Value
Unit
Calculation_Logic
Triangulation_Strength: Strong / Medium / Weak / None
Evidence_Status: Verified / Partially verified / Reported only / Training verified only / FDB triangulated / Crop data verified / Household baseline-endline verified / Source not found
Safe_Donor_Wording
What_Not_To_Claim
Recommended_Visual_Type
Dashboard_Decision: Show / Show with caveat / Drill-down only / Hold

Step 11: Separate RF-linked and FDB-only dashboard cards

Create two groups of dashboard cards.

Group A: RF-linked FASAL cards
These should reflect commitments in the RF and Grant Reports.

For each card, provide:

Card_Name
RF_ID
RF_Level
Metric
Target
Actual
Unit
Calculation_Logic
Source_File
Evidence_Status
Disaggregation
Safe_Interpretation
What_Not_To_Claim
Recommended_Visual_Type

Group B: FDB-only / intersectional DEHAT cards
These should reflect important household realities captured in FDB but not directly committed in the RF.

For each card, provide:

Card_Name
FDB_Field_or_Theme
Intersectional_Domain: Health / Education / Sanitation / Identity documentation / Social protection / Gender / Children / Elderly / Disability / Migration / Household vulnerability / Other
Why_Not_Direct_RF
Relationship_To_FASAL: Directly linked / Indirectly linked / Outside RF but relevant to DEHAT approach
Metric
Calculation_Logic
Source_File
Evidence_Status
Safe_Interpretation
What_Not_To_Claim
Recommended_Visual_Type

Step 12: Build dashboard screen structure

Design the dashboard one screen at a time. It must be minimal, uncluttered, and donor-friendly.

Required screens:

Screen 1: Five-Year Results Snapshot
Screen 2: Collective Farmer Institutions and Local Governance
Screen 3: Training, Capacity Building, and Participation
Screen 4: Agriculture Practice Adoption and Food Security
Screen 5: Crop Production, Cost, and Income
Screen 6: Krishi Mitra and Community Extension System
Screen 7: Rights, Entitlements, and Leverage
Screen 8: Household Baseline-to-Endline Insights
Screen 9: FDB Household Outcomes and Vulnerabilities
Screen 10: DEHAT Intersectional Contribution Beyond RF
Screen 11: Evidence Audit and Source Gaps

For every screen, provide:

Screen_Title
Question_Answered
Maximum_Number_of_Cards
Cards_to_Show
Cards_to_Avoid
Filters
Evidence_Rules
Safe_Donor_Interpretation
Caution_Text
Recommended_Visual_Layout

Step 13: Final dashboard build rules

The dashboard must follow these principles:

1. One screen should answer one question.
2. No screen should be overloaded.
3. Every card should have a source and evidence status.
4. Every metric should distinguish target, actual, and evidence status.
5. Every outcome claim should show whether it is verified, partially verified, or reported only.
6. FDB-only data should not be forced into RF. It should be shown separately as DEHAT’s intersectional contribution.
7. Training data should verify activities and outputs, not outcomes unless triangulated.
8. Crop-wise data should be used cautiously and only with clear calculation logic.
9. Grant Report claims should be triangulated with raw data before being displayed as achievements.
10. Household-level baseline-to-endline claims should be made only where true comparison is structurally valid.
11. Sensitive household/person-level data must be anonymised and aggregated.
12. The dashboard should show applications, approvals, and benefit receipt separately.
13. The dashboard should show formation, functionality, claims raised, and claims resolved separately.
14. The dashboard should show training, adoption, and outcome separately.

Final output required:

1. Executive summary
2. RF architecture table
3. Grant Report claims table
4. FDB booklet interpretation table
5. FDB field-to-RF mapping table
6. Household baseline-to-endline feasibility table
7. Household baseline-to-endline insight table, only where valid
8. FDB-only intersectional field table
9. Training/MIS-to-RF mapping table
10. Consolidated MIS reconciliation table
11. Crop-wise outcome analysis table
12. Master dashboard card list
13. Dashboard screen-by-screen design
14. Evidence gaps still remaining
15. Claims that must not be made
16. Final instructions for dashboard development

Important sequencing instruction:

First return only the evidence mapping tables, triangulation logic, dashboard-card list, and evidence gaps. Do not design the visual dashboard until the mapping is complete and reviewed.

Remember: this is for a donor visit at the end of the five-year phase. The dashboard must be simple to understand but analytically rigorous. It must show both FASAL’s RF-linked achievements and DEHAT’s wider family-centred, intersectional contribution, while leaving no room for misinterpretation, unsupported claims, or inflated impact statements.