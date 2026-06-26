#!/usr/bin/env python3
"""Phase 3: Extract key document content and remaining data."""
import sqlite3, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DB = r"c:\Users\bentn\antigravity\Untitled\master_context.db"
conn = sqlite3.connect(DB)
cur = conn.cursor()

# ============================================================
# Key narrative documents - extract summaries
# ============================================================
key_docs = [
    "Results_Snapshot_Improvement_Table.md",
    "Results_Snapshot_Source_Register.md",
    "Evidence_Mapping.md",
    "Master.md",
    "Midterm self evaluation.md",
    "HY4 Fluxx Part-I Report.md",
    "DEHAT Breif Presentation.md",
    "fdb.txt",
]

for doc in key_docs:
    print("=" * 80)
    print(f"DOCUMENT: {doc}")
    print("=" * 80)
    cur.execute("SELECT content FROM documents WHERE filename=?", (doc,))
    row = cur.fetchone()
    if row:
        content = row[0]
        # Print first 3000 chars
        print(content[:3000])
        if len(content) > 3000:
            print(f"\n... [TRUNCATED - total {len(content)} chars]")
    else:
        print("NOT FOUND")
    print()

# ============================================================
# FDB RF Traceability Map tables
# ============================================================
print("=" * 80)
print("FDB RF TRACEABILITY MAP - ALL TABLES")
print("=" * 80)

for sub in ["Dashboard_Cards", "RF_Items", "Grant_Report_Crosswalk", "Summary"]:
    table = f"fasal_fdb_rf_traceability_map_{sub}"
    cur.execute(f'PRAGMA table_info("{table}")')
    cols = [c[1] for c in cur.fetchall()]
    cur.execute(f'SELECT * FROM "{table}"')
    rows = cur.fetchall()
    print(f"\n--- {sub} ({len(rows)} rows) ---")
    print(f"Columns: {cols}")
    for i, row in enumerate(rows):
        non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
        if non_null:
            print(f"  Row {i+1}: {non_null}")

# FDB Field Map - sample
print(f"\n--- FDB_Field_Map (2999 rows, sample) ---")
cur.execute('PRAGMA table_info("fasal_fdb_rf_traceability_map_FDB_Field_Map")')
cols = [c[1] for c in cur.fetchall()]
print(f"Columns: {cols}")
cur.execute('SELECT * FROM "fasal_fdb_rf_traceability_map_FDB_Field_Map" LIMIT 10')
rows = cur.fetchall()
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    if non_null:
        print(f"  Row {i+1}: {non_null}")

# ============================================================
# Leverage aggregation queries
# ============================================================
print("\n" + "=" * 80)
print("LEVERAGE AGGREGATION")
print("=" * 80)

# 2023 leverage types
cur.execute("""
    SELECT unnamed_4, COUNT(*) as cnt 
    FROM "levrage_january_to_december_2023_Sheet1" 
    WHERE unnamed_4 IS NOT NULL AND unnamed_4 != 'Type of Leverage '
    GROUP BY unnamed_4 ORDER BY cnt DESC
""")
rows = cur.fetchall()
print("Leverage 2023 - By Type:")
for r in rows:
    print(f"    {r[0]}: {r[1]}")

# 2024 leverage types
cur.execute("""
    SELECT unnamed_4, COUNT(*) as cnt 
    FROM "t_00047338_levrage_january_2024_to_december_2024_Leveraged_2024" 
    WHERE unnamed_4 IS NOT NULL 
    AND unnamed_4 NOT LIKE '%Type%'
    GROUP BY unnamed_4 ORDER BY cnt DESC
""")
rows = cur.fetchall()
print("\nLeverage 2024 - By Type:")
for r in rows:
    print(f"    {r[0]}: {r[1]}")

# 2025 leverage types
cur.execute("""
    SELECT unnamed_4, COUNT(*) as cnt 
    FROM "t_1._leverage_aass_2025_Sheet1" 
    WHERE unnamed_4 IS NOT NULL 
    AND unnamed_4 NOT LIKE '%Type%'
    AND unnamed_4 NOT LIKE '%leverage%'
    GROUP BY unnamed_4 ORDER BY cnt DESC
""")
rows = cur.fetchall()
print("\nLeverage 2025 - By Type:")
for r in rows:
    print(f"    {r[0]}: {r[1]}")

# ============================================================
# AAS INFO table details
# ============================================================
print("\n" + "=" * 80)
print("AAS INFO TABLE")
print("=" * 80)
cur.execute('PRAGMA table_info("updated_fasal_crop_wise_details_update_2025_AAS_INFO")')
cols = [c[1] for c in cur.fetchall()]
print(f"Columns: {cols}")
cur.execute('SELECT * FROM "updated_fasal_crop_wise_details_update_2025_AAS_INFO"')
rows = cur.fetchall()
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    if non_null:
        print(f"  Row {i+1}: {non_null}")

# AASINFOR sample
print("\n--- AASINFOR (1363 rows, sample 10) ---")
cur.execute('PRAGMA table_info("updated_fasal_crop_wise_details_update_2025_AASINFOR")')
cols = [c[1] for c in cur.fetchall()]
print(f"Columns: {cols}")
cur.execute('SELECT * FROM "updated_fasal_crop_wise_details_update_2025_AASINFOR" LIMIT 10')
rows = cur.fetchall()
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(len(cols)) if row[j] is not None}
    if non_null:
        print(f"  Row {i+1}: {non_null}")

# ============================================================
# MIS Activity data (deeper dive)
# ============================================================
print("\n" + "=" * 80)
print("FASAL MIS - ACTIVITY DETAILS")
print("=" * 80)
cur.execute('SELECT * FROM "fasal_mis_consolidated_MIS" WHERE unnamed_1 IS NOT NULL LIMIT 40')
cols_q = cur.description
cols = [c[0] for c in cols_q]
rows = cur.fetchall()
for i, row in enumerate(rows):
    activity = row[1]  # unnamed_1 is the activity/indicator
    target_y1 = row[2]  # unnamed_2 proposed target
    achieve = row[3]  # unnamed_3 achievement
    if activity and str(activity).strip():
        print(f"  [{row[0]}] {activity}")
        if target_y1:
            print(f"      Target: {target_y1}, Achievement: {achieve}")

# Crop details sample
print("\n" + "=" * 80)
print("CROP DETAILS SAMPLE")
print("=" * 80)
cur.execute('PRAGMA table_info("updated_fasal_crop_wise_details_update_2025_Crop_details")')
cols = [c[1] for c in cur.fetchall()]
print(f"Total columns: {len(cols)}")
print(f"First 40: {cols[:40]}")
cur.execute('SELECT * FROM "updated_fasal_crop_wise_details_update_2025_Crop_details" LIMIT 3')
rows = cur.fetchall()
for i, row in enumerate(rows):
    non_null = {cols[j]: row[j] for j in range(min(40, len(cols))) if row[j] is not None}
    print(f"  Row {i+1}: {non_null}")

conn.close()
print("\n\nDONE.")
