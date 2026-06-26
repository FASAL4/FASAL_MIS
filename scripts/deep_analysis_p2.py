#!/usr/bin/env python3
"""
Deep Database Analysis Script - Phase 2
Queries master_context.db for RF, training, leverage, crop, and food data insights.
"""
import sqlite3
import sys
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DB = r"c:\Users\bentn\antigravity\Untitled\master_context.db"
conn = sqlite3.connect(DB)
cur = conn.cursor()

# ============================================================
# SECTION 3: DEHAT DEMOGRAPHICS (from part1)
# ============================================================
print("=" * 80)
print("SECTION 3: DEHAT DEMOGRAPHICS")
print("=" * 80)

# District distribution
cur.execute('SELECT district, COUNT(*) as cnt FROM "dehat_cleaned_data_with_acres_part1" WHERE district IS NOT NULL GROUP BY district ORDER BY cnt DESC')
rows = cur.fetchall()
print(f"District distribution ({len(rows)} districts):")
for r in rows:
    print(f"    {r[0]}: {r[1]}")

# Block distribution
cur.execute('SELECT block_name, COUNT(*) as cnt FROM "dehat_cleaned_data_with_acres_part1" WHERE block_name IS NOT NULL GROUP BY block_name ORDER BY cnt DESC')
rows = cur.fetchall()
print(f"\nBlock distribution ({len(rows)} blocks):")
for r in rows:
    print(f"    {r[0]}: {r[1]}")

# Village Panchayat distribution
cur.execute('SELECT COUNT(DISTINCT village_panchayat) FROM "dehat_cleaned_data_with_acres_part1" WHERE village_panchayat IS NOT NULL')
total_vp = cur.fetchone()[0]
cur.execute('SELECT village_panchayat, COUNT(*) as cnt FROM "dehat_cleaned_data_with_acres_part1" WHERE village_panchayat IS NOT NULL GROUP BY village_panchayat ORDER BY cnt DESC LIMIT 25')
rows = cur.fetchall()
print(f"\nVillage Panchayat distribution (top 25 of {total_vp}):")
for r in rows:
    print(f"    {r[0]}: {r[1]}")

# Family size
cur.execute('SELECT AVG(number_of_family_members), MIN(number_of_family_members), MAX(number_of_family_members), COUNT(number_of_family_members) FROM "dehat_cleaned_data_with_acres_part1" WHERE number_of_family_members IS NOT NULL')
r = cur.fetchone()
print(f"\nFamily size: avg={r[0]:.1f}, min={r[1]}, max={r[2]}, count={r[3]}")

# Family size distribution
cur.execute('SELECT number_of_family_members, COUNT(*) as cnt FROM "dehat_cleaned_data_with_acres_part1" WHERE number_of_family_members IS NOT NULL GROUP BY number_of_family_members ORDER BY number_of_family_members')
rows = cur.fetchall()
print("Family size distribution:")
for r in rows:
    print(f"    {r[0]} members: {r[1]} families")

# AAS distribution
cur.execute('SELECT aas_name, COUNT(*) as cnt FROM "dehat_cleaned_data_with_acres_part1" WHERE aas_name IS NOT NULL GROUP BY aas_name ORDER BY cnt DESC')
rows = cur.fetchall()
print(f"\nAAS distribution ({len(rows)} AAS groups):")
for r in rows[:30]:
    print(f"    {r[0]}: {r[1]}")

# Village count
cur.execute('SELECT COUNT(DISTINCT village_name) FROM "dehat_cleaned_data_with_acres_part1" WHERE village_name IS NOT NULL')
print(f"\nDistinct villages: {cur.fetchone()[0]}")

# SHG distribution
cur.execute('SELECT self_help_group_shg_name, COUNT(*) as cnt FROM "dehat_cleaned_data_with_acres_part1" WHERE self_help_group_shg_name IS NOT NULL GROUP BY self_help_group_shg_name ORDER BY cnt DESC LIMIT 20')
rows = cur.fetchall()
cur.execute('SELECT COUNT(DISTINCT self_help_group_shg_name) FROM "dehat_cleaned_data_with_acres_part1" WHERE self_help_group_shg_name IS NOT NULL')
total_shg = cur.fetchone()[0]
print(f"\nSHG distribution (top 20 of {total_shg}):")
for r in rows:
    print(f"    {r[0]}: {r[1]}")

# Land ownership
cur.execute('SELECT how_much_total_agriculture_land_is_available_with_you_in_bigha, COUNT(*) as cnt FROM "dehat_cleaned_data_with_acres_part1" WHERE how_much_total_agriculture_land_is_available_with_you_in_bigha IS NOT NULL GROUP BY how_much_total_agriculture_land_is_available_with_you_in_bigha ORDER BY cnt DESC LIMIT 20')
rows = cur.fetchall()
print(f"\nLand (bigha) distribution (top 20):")
for r in rows:
    print(f"    {r[0]}: {r[1]}")

# ============================================================
# SECTION 4: RF TEMPLATE DATA
# ============================================================
print("\n" + "=" * 80)
print("SECTION 4: RESULTS FRAMEWORK (RF) TEMPLATE")
print("=" * 80)

# Results Table
cur.execute('PRAGMA table_info("rf_template_(5year)_ver.2.0_16th_aug_Results_Table")')
cols = [c[1] for c in cur.fetchall()]
print(f"Results_Table columns ({len(cols)}):")
for c in cols:
    print(f"    {c}")

cur.execute('SELECT * FROM "rf_template_(5year)_ver.2.0_16th_aug_Results_Table" LIMIT 30')
rows = cur.fetchall()
print(f"\nResults_Table sample data ({len(rows)} rows shown):")
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    if non_null:
        print(f"  Row {i+1}: {non_null}")

# Outcome Indicators
cur.execute('PRAGMA table_info("rf_template_(5year)_ver.2.0_16th_aug_Outcome_Indicators")')
cols = [c[1] for c in cur.fetchall()]
print(f"\nOutcome_Indicators columns ({len(cols)}):")
for c in cols:
    print(f"    {c}")

cur.execute('SELECT * FROM "rf_template_(5year)_ver.2.0_16th_aug_Outcome_Indicators" LIMIT 30')
rows = cur.fetchall()
print(f"\nOutcome_Indicators data ({len(rows)} rows):")
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    if non_null:
        print(f"  Row {i+1}: {non_null}")

# Output Indicators
cur.execute('PRAGMA table_info("rf_template_(5year)_ver.2.0_16th_aug_Output_Indicators")')
cols = [c[1] for c in cur.fetchall()]
print(f"\nOutput_Indicators columns ({len(cols)}):")
for c in cols[:20]:
    print(f"    {c}")

cur.execute('SELECT * FROM "rf_template_(5year)_ver.2.0_16th_aug_Output_Indicators" LIMIT 20')
rows = cur.fetchall()
print(f"\nOutput_Indicators data ({len(rows)} rows):")
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    if non_null:
        print(f"  Row {i+1}: {non_null}")

# Activity Details
cur.execute('PRAGMA table_info("rf_template_(5year)_ver.2.0_16th_aug_Activity_Details")')
cols = [c[1] for c in cur.fetchall()]
print(f"\nActivity_Details columns ({len(cols)}):")
for c in cols[:20]:
    print(f"    {c}")

cur.execute('SELECT * FROM "rf_template_(5year)_ver.2.0_16th_aug_Activity_Details" LIMIT 20')
rows = cur.fetchall()
print(f"\nActivity_Details data ({len(rows)} rows):")
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    if non_null:
        print(f"  Row {i+1}: {non_null}")

# ============================================================
# SECTION 5: LEVERAGE DATA
# ============================================================
print("\n" + "=" * 80)
print("SECTION 5: LEVERAGE DATA (2023 & 2024 & 2025)")
print("=" * 80)

# 2023 leverage
cur.execute('PRAGMA table_info("levrage_january_to_december_2023_Sheet1")')
cols = [c[1] for c in cur.fetchall()]
print(f"Leverage 2023 Sheet1 columns: {cols}")
cur.execute('SELECT * FROM "levrage_january_to_december_2023_Sheet1" LIMIT 10')
rows = cur.fetchall()
for i, row in enumerate(rows):
    print(f"  Row {i+1}: {row}")

# 2024 leverage
cur.execute('PRAGMA table_info("t_00047338_levrage_january_2024_to_december_2024_Leveraged_2024")')
cols = [c[1] for c in cur.fetchall()]
print(f"\nLeverage 2024 columns: {cols}")
cur.execute('SELECT * FROM "t_00047338_levrage_january_2024_to_december_2024_Leveraged_2024" LIMIT 10')
rows = cur.fetchall()
for i, row in enumerate(rows):
    print(f"  Row {i+1}: {row}")

# 2025 leverage
cur.execute('PRAGMA table_info("t_1._leverage_aass_2025_Sheet1")')
cols = [c[1] for c in cur.fetchall()]
print(f"\nLeverage 2025 columns: {cols}")
cur.execute('SELECT * FROM "t_1._leverage_aass_2025_Sheet1" LIMIT 10')
rows = cur.fetchall()
for i, row in enumerate(rows):
    print(f"  Row {i+1}: {row}")

# ============================================================
# SECTION 6: FASAL MIS CONSOLIDATED
# ============================================================
print("\n" + "=" * 80)
print("SECTION 6: FASAL MIS CONSOLIDATED")
print("=" * 80)

cur.execute('PRAGMA table_info("fasal_mis_consolidated_MIS")')
cols = [c[1] for c in cur.fetchall()]
print(f"MIS columns ({len(cols)}):")
for c in cols:
    print(f"    {c}")
cur.execute('SELECT * FROM "fasal_mis_consolidated_MIS" LIMIT 5')
rows = cur.fetchall()
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    print(f"  Row {i+1}: {non_null}")

# Training program summaries
for year in [2022, 2023, 2024, 2025]:
    table = f"fasal_mis_consolidated_Training_program_Summary_{year}"
    cur.execute(f'PRAGMA table_info("{table}")')
    cols = [c[1] for c in cur.fetchall()]
    cur.execute(f'SELECT COUNT(*) FROM "{table}"')
    cnt = cur.fetchone()[0]
    print(f"\nTraining Summary {year} ({cnt} rows): cols = {cols}")
    cur.execute(f'SELECT * FROM "{table}" LIMIT 5')
    rows = cur.fetchall()
    for i, row in enumerate(rows):
        non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
        print(f"  Row {i+1}: {non_null}")

# ============================================================
# SECTION 7: TRAINING DATA YEAR-WISE
# ============================================================
print("\n" + "=" * 80)
print("SECTION 7: TRAINING DATA YEAR-WISE COLUMN OVERVIEW")
print("=" * 80)
for table in [
    "training_data_fasal_mis_2022_Training_related_data_2022",
    "training_data_fasal_mis_2023_(old)_Training_related_data_2023",
    "training_data_fasal_mis_2024.xlsx__Training_related_data",
    "training_data_fasal_mis_2025_Training_related_data_2025",
]:
    cur.execute(f'PRAGMA table_info("{table}")')
    cols = [c[1] for c in cur.fetchall()]
    cur.execute(f'SELECT COUNT(*) FROM "{table}"')
    cnt = cur.fetchone()[0]
    print(f"\n{table} ({cnt} rows, {len(cols)} cols)")
    print(f"  Columns: {cols[:30]}")
    if len(cols) > 30:
        print(f"  ... +{len(cols)-30} more")

# ============================================================
# SECTION 8: CROP DETAILS
# ============================================================
print("\n" + "=" * 80)
print("SECTION 8: CROP DETAILS & AAS INFO")
print("=" * 80)

cur.execute('PRAGMA table_info("updated_fasal_crop_wise_details_update_2025_Crop_details")')
cols = [c[1] for c in cur.fetchall()]
print(f"Crop_details ({len(cols)} cols):")
for c in cols[:40]:
    print(f"    {c}")
if len(cols) > 40:
    print(f"    ... +{len(cols)-40} more")

cur.execute('SELECT * FROM "updated_fasal_crop_wise_details_update_2025_Crop_details" LIMIT 3')
rows = cur.fetchall()
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    print(f"  Row {i+1}: {dict(list(non_null.items())[:20])}")

# AAS INFO
cur.execute('PRAGMA table_info("updated_fasal_crop_wise_details_update_2025_AAS_INFO")')
cols = [c[1] for c in cur.fetchall()]
print(f"\nAAS_INFO ({len(cols)} cols): {cols}")
cur.execute('SELECT * FROM "updated_fasal_crop_wise_details_update_2025_AAS_INFO" LIMIT 10')
rows = cur.fetchall()
for i, row in enumerate(rows):
    print(f"  Row {i+1}: {row}")

# AASINFOR
cur.execute('PRAGMA table_info("updated_fasal_crop_wise_details_update_2025_AASINFOR")')
cols = [c[1] for c in cur.fetchall()]
print(f"\nAASINFOR ({len(cols)} cols): {cols}")
cur.execute('SELECT * FROM "updated_fasal_crop_wise_details_update_2025_AASINFOR" LIMIT 5')
rows = cur.fetchall()
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    print(f"  Row {i+1}: {non_null}")

# ============================================================
# SECTION 9: FASAL FDB RF TRACEABILITY MAP
# ============================================================
print("\n" + "=" * 80)
print("SECTION 9: FASAL FDB RF TRACEABILITY MAP")
print("=" * 80)
for sub in ["Dashboard_Cards", "FDB_Field_Map", "Grant_Report_Crosswalk", "RF_Items", "Summary"]:
    table = f"fasal_fdb_rf_traceability_map_{sub}"
    cur.execute(f'PRAGMA table_info("{table}")')
    cols = [c[1] for c in cur.fetchall()]
    cur.execute(f'SELECT COUNT(*) FROM "{table}"')
    cnt = cur.fetchone()[0]
    print(f"\n{sub} ({cnt} rows, {len(cols)} cols): {cols}")
    limit = 10 if cnt <= 50 else 5
    cur.execute(f'SELECT * FROM "{table}" LIMIT {limit}')
    rows = cur.fetchall()
    for i, row in enumerate(rows):
        non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
        print(f"  Row {i+1}: {non_null}")

conn.close()
print("\n\nDONE.")
