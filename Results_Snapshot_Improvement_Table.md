# Results Snapshot Improvement Table

| Insight_or_Card | Current_Display | Improved_Display | Source_File | Source_Sheet_or_Field | Calculation_Logic | Can_Calculate_Now | Missing_Data | Safe_Donor_Wording |
|---|---|---|---|---|---|---|---|---|
| Card 1: Farmer Reach | 1866 farmers | 1866 farmers / 1289 HHs (RF 1.1) | Updated_Fasal Crop wise details | Row Count / Unique HH | Count of farmers | Partial | Unique HH deduplication needs validation | Farmers covered under FASAL |
| Card 2: Farmer Institutions | 82 AAS | 82 AAS (RF 1.1.1) | FASAL MIS - Consolidated | Row 1.1.1 | Direct extraction | Yes | None | AAS collectives formed against RF target |
| Card 3: Training Reach | 659 participants | 659 participants (RF 3.1) | FASAL MIS / Training Logs | Row 3.1 | Sum of direct participants | Yes | Unique individuals | Community members reached through capacity-building activities |
| Card 4: Agriculture Outcome | 137 farmers | 137 Turmeric farmers (₹34,202 Avg Net Income) (RF 2.6) | FASAL MIS - Consolidated | Turmeric row | Count of farmers & Avg Income | Yes | Baseline crop diversity / Income for all crops | Crop diversity and income outcomes calculated from crop-wise data |
| Card 5: Household Economic Value | Pending calculation | Net Farming Income + Food Savings + Verified Entitlements | FDB / Leverage AASs | Multiple | Sum of monetizable value | No (Pending source calculation) | Food savings value, per-HH entitlement amounts | Household Economic Value: Calculation pending source validation |
| Six GP Snapshot | Access / Advocacy conversion | GP-wise: Valid HHs, Entitlements Received, Income (Pending), Food Savings (Pending) | entitlements_trend.json | byGP array | Aggregation by GP | Partial | GP-wise Income & Food Savings | Verified entitlement received counts and valid data coverage per GP |
