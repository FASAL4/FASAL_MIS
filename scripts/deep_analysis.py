#!/usr/bin/env python3
"""
Deep Database Analysis Script for Master Insights
===================================================
Queries master_context.db exhaustively to extract all insights
needed for the master insights document.
"""
import sqlite3
import json
import sys

DB = r"c:\Users\bentn\antigravity\Untitled\master_context.db"
conn = sqlite3.connect(DB)
cur = conn.cursor()

# ============================================================
# SECTION 1: Full Table Inventory
# ============================================================
print("=" * 80)
print("SECTION 1: TABLE INVENTORY")
print("=" * 80)
cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [r[0] for r in cur.fetchall()]
print(f"Total tables: {len(tables)}")
for t in tables:
    cur.execute(f'SELECT COUNT(*) FROM "{t}"')
    cnt = cur.fetchone()[0]
    cur.execute(f'PRAGMA table_info("{t}")')
    cols = cur.fetchall()
    print(f"  {t}: {cnt} rows, {len(cols)} cols")

# ============================================================
# SECTION 2: Documents Table Analysis
# ============================================================
print("\n" + "=" * 80)
print("SECTION 2: DOCUMENTS TABLE")
print("=" * 80)
if "documents" in tables:
    cur.execute("SELECT id, filename, type, LENGTH(content) as content_len FROM documents ORDER BY filename")
    docs = cur.fetchall()
    print(f"Total documents: {len(docs)}")
    for d in docs:
        print(f"  [{d[2]}] {d[1]} ({d[3]} chars)")

# ============================================================
# SECTION 3: DEHAT Cleaned Data Analysis (the big dataset)
# ============================================================
print("\n" + "=" * 80)
print("SECTION 3: DEHAT CLEANED DATA")
print("=" * 80)
dehat_tables = [t for t in tables if t.startswith("compressed_dehat") or t.startswith("dehat")]
for dt in dehat_tables:
    cur.execute(f'SELECT COUNT(*) FROM "{dt}"')
    cnt = cur.fetchone()[0]
    cur.execute(f'PRAGMA table_info("{dt}")')
    cols = [(c[1], c[2]) for c in cur.fetchall()]
    print(f"\nTable: {dt} ({cnt} rows, {len(cols)} cols)")
    # Print first 30 column names to understand structure
    for c in cols[:30]:
        print(f"    {c[0]} ({c[1]})")
    if len(cols) > 30:
        print(f"    ... +{len(cols)-30} more columns")

# Key demographics from DEHAT
for dt in dehat_tables:
    if "part1" in dt:
        print(f"\n--- Demographics from {dt} ---")
        # District distribution
        try:
            cur.execute(f'SELECT district, COUNT(*) as cnt FROM "{dt}" WHERE district IS NOT NULL GROUP BY district ORDER BY cnt DESC')
            rows = cur.fetchall()
            print(f"District distribution ({len(rows)} districts):")
            for r in rows:
                print(f"    {r[0]}: {r[1]}")
        except: pass
        
        # Block distribution
        try:
            cur.execute(f'SELECT block_name, COUNT(*) as cnt FROM "{dt}" WHERE block_name IS NOT NULL GROUP BY block_name ORDER BY cnt DESC')
            rows = cur.fetchall()
            print(f"\nBlock distribution ({len(rows)} blocks):")
            for r in rows:
                print(f"    {r[0]}: {r[1]}")
        except: pass
        
        # Village Panchayat distribution
        try:
            cur.execute(f'SELECT village_panchayat, COUNT(*) as cnt FROM "{dt}" WHERE village_panchayat IS NOT NULL GROUP BY village_panchayat ORDER BY cnt DESC LIMIT 20')
            rows = cur.fetchall()
            cur.execute(f'SELECT COUNT(DISTINCT village_panchayat) FROM "{dt}" WHERE village_panchayat IS NOT NULL')
            total_vp = cur.fetchone()[0]
            print(f"\nVillage Panchayat distribution (top 20 of {total_vp}):")
            for r in rows:
                print(f"    {r[0]}: {r[1]}")
        except: pass
        
        # Family size stats
        try:
            cur.execute(f'SELECT AVG(number_of_family_members), MIN(number_of_family_members), MAX(number_of_family_members) FROM "{dt}" WHERE number_of_family_members IS NOT NULL')
            r = cur.fetchone()
            print(f"\nFamily size: avg={r[0]:.1f}, min={r[1]}, max={r[2]}")
        except: pass

        # AAS Name distribution
        try:
            cur.execute(f'SELECT aas_name, COUNT(*) as cnt FROM "{dt}" WHERE aas_name IS NOT NULL GROUP BY aas_name ORDER BY cnt DESC')
            rows = cur.fetchall()
            print(f"\nAAS (Adarsh Agriculture Sahiya) distribution ({len(rows)} AAS):")
            for r in rows[:20]:
                print(f"    {r[0]}: {r[1]}")
            if len(rows) > 20:
                print(f"    ... +{len(rows)-20} more")
        except: pass

        # Land ownership
        try:
            cur.execute(f'SELECT how_much_total_agriculture_land_is_available_with_you_in_bigha, COUNT(*) as cnt FROM "{dt}" WHERE how_much_total_agriculture_land_is_available_with_you_in_bigha IS NOT NULL GROUP BY how_much_total_agriculture_land_is_available_with_you_in_bigha ORDER BY cnt DESC LIMIT 15')
            rows = cur.fetchall()
            print(f"\nLand ownership distribution (top 15):")
            for r in rows:
                print(f"    {r[0]} bigha: {r[1]}")
        except: pass
        break

# ============================================================
# SECTION 4: TRAINING DATA / FASAL MIS TABLES
# ============================================================
print("\n" + "=" * 80)
print("SECTION 4: TRAINING DATA / FASAL MIS")
print("=" * 80)
training_tables = [t for t in tables if "training" in t.lower() or "fasal" in t.lower() or "crop" in t.lower()]
for tt in training_tables:
    cur.execute(f'SELECT COUNT(*) FROM "{tt}"')
    cnt = cur.fetchone()[0]
    cur.execute(f'PRAGMA table_info("{tt}")')
    cols = [(c[1], c[2]) for c in cur.fetchall()]
    print(f"\nTable: {tt} ({cnt} rows, {len(cols)} cols)")
    for c in cols[:20]:
        print(f"    {c[0]} ({c[1]})")
    if len(cols) > 20:
        print(f"    ... +{len(cols)-20} more columns")

# ============================================================
# SECTION 5: LEVERAGE TABLES
# ============================================================
print("\n" + "=" * 80)
print("SECTION 5: LEVERAGE DATA")
print("=" * 80)
leverage_tables = [t for t in tables if "levr" in t.lower() or "lever" in t.lower()]
for lt in leverage_tables:
    cur.execute(f'SELECT COUNT(*) FROM "{lt}"')
    cnt = cur.fetchone()[0]
    cur.execute(f'PRAGMA table_info("{lt}")')
    cols = [(c[1], c[2]) for c in cur.fetchall()]
    print(f"\nTable: {lt} ({cnt} rows, {len(cols)} cols)")
    for c in cols[:30]:
        print(f"    {c[0]} ({c[1]})")
    if len(cols) > 30:
        print(f"    ... +{len(cols)-30} more columns")
    # Sample data
    cur.execute(f'SELECT * FROM "{lt}" LIMIT 3')
    sample = cur.fetchall()
    if sample:
        print(f"  Sample row 1: {sample[0][:10]}...")

# ============================================================
# SECTION 6: RF TEMPLATE TABLE
# ============================================================
print("\n" + "=" * 80)
print("SECTION 6: RESULTS FRAMEWORK (RF) TEMPLATE")
print("=" * 80)
rf_tables = [t for t in tables if "rf" in t.lower() or "result" in t.lower() or "template" in t.lower()]
for rt in rf_tables:
    cur.execute(f'SELECT COUNT(*) FROM "{rt}"')
    cnt = cur.fetchone()[0]
    cur.execute(f'PRAGMA table_info("{rt}")')
    cols = [(c[1], c[2]) for c in cur.fetchall()]
    print(f"\nTable: {rt} ({cnt} rows, {len(cols)} cols)")
    for c in cols[:40]:
        print(f"    {c[0]} ({c[1]})")
    if len(cols) > 40:
        print(f"    ... +{len(cols)-40} more columns")
    # All data for RF tables (they tend to be small)
    if cnt <= 50:
        cur.execute(f'SELECT * FROM "{rt}"')
        all_rows = cur.fetchall()
        col_names = [c[0] for c in cols]
        for i, row in enumerate(all_rows):
            print(f"  Row {i+1}:")
            for cn, val in zip(col_names, row):
                if val is not None:
                    print(f"    {cn}: {val}")

conn.close()
print("\n\nDONE.")
