#!/usr/bin/env python3
"""
ADVERSARIAL EMPIRICAL CHALLENGE HARNESS - REVISED & RIGOROUS
Independent, zero-trust verification of all headline quantitative figures against:
'FDB Survey as on 05112026.xlsx'
"""

import openpyxl
import re
from collections import Counter

def run_adversarial_challenge():
    print("=" * 80)
    print("ADVERSARIAL EMPIRICAL CHALLENGE: VERIFYING HEADLINE FIGURES")
    print("=" * 80)
    
    wb = openpyxl.load_workbook('FDB Survey as on 05112026.xlsx', read_only=True, data_only=True)
    
    # -------------------------------------------------------------------------
    # TEST 1: The Row 1488 Slice Identity & Naive Sum Doubling
    # -------------------------------------------------------------------------
    print("\n[CHALLENGE 1] The Row 1488 Slice Identity & Naive Sum Doubling")
    ws_inc = wb['Income Data']
    inc_rows = list(ws_inc.iter_rows(values_only=True))
    
    # Physical structure
    header1 = inc_rows[0]
    header2 = inc_rows[1]
    header3 = inc_rows[2]
    farmer_rows = inc_rows[3:1490]  # Rows 4 to 1490 (1,487 records)
    spacer_row = inc_rows[1490]     # Row 1491
    gt_row = inc_rows[1491]         # Row 1492
    
    assert len(inc_rows) == 1492, f"Expected 1492 rows, got {len(inc_rows)}"
    assert len(farmer_rows) == 1487, f"Expected 1487 farmer records, got {len(farmer_rows)}"
    assert gt_row[0] == 'Grand Total', f"Expected 'Grand Total' in row 1492 col 0, got {gt_row[0]}"
    
    # Check all 168 numeric columns for exact match
    discrepant_cols = []
    for c in range(1, 169):
        col_sum = sum(float(r[c]) if r[c] is not None else 0.0 for r in farmer_rows)
        row1492_val = float(gt_row[c]) if gt_row[c] is not None else 0.0
        diff = abs(col_sum - row1492_val)
        if diff > 0.001:
            discrepant_cols.append((c, col_sum, row1492_val, diff))
            
    print(f"  Total columns checked: 168 (cols 1..168)")
    print(f"  Discrepant columns (> 0.001): {len(discrepant_cols)}")
    assert len(discrepant_cols) == 0, f"Found {len(discrepant_cols)} discrepancies!"
    print(f"  => CONFIRMED: Row 4..1490 sum matches Row 1492 Grand Total with exactly ₹0.00 difference across ALL 168 columns.")
    
    # Macro cost & gross values
    c25_slice = sum(float(r[165] or 0) for r in farmer_rows)
    c26_slice = sum(float(r[166] or 0) for r in farmer_rows)
    g25_slice = sum(float(r[167] or 0) for r in farmer_rows)
    g26_slice = sum(float(r[168] or 0) for r in farmer_rows)
    
    print(f"  Slice Cost 2025  : ₹{c25_slice:,.2f}")
    print(f"  Row 1492 Cost 2025: ₹{float(gt_row[165]):,.2f} (Diff: ₹{abs(c25_slice - float(gt_row[165])):.2f})")
    print(f"  Slice Gross 2025 : ₹{g25_slice:,.2f}")
    print(f"  Row 1492 Gross 2025: ₹{float(gt_row[167]):,.2f} (Diff: ₹{abs(g25_slice - float(gt_row[167])):.2f})")
    
    # Naive sum (rows 4 to 1492 inclusive)
    naive_c25 = sum(float(r[165] or 0) for r in inc_rows[3:1492])
    naive_g25 = sum(float(r[167] or 0) for r in inc_rows[3:1492])
    print(f"  Naive Cost 2025  : ₹{naive_c25:,.2f} (doubles to ~₹6.04 Cr: {naive_c25 == 2 * c25_slice})")
    print(f"  Naive Gross 2025 : ₹{naive_g25:,.2f} (doubles to ~₹22.25 Cr: {naive_g25 == 2 * g25_slice})")
    assert naive_c25 == 60428384.00, f"Naive cost mismatch: {naive_c25}"
    assert naive_g25 == 222493544.00, f"Naive gross mismatch: {naive_g25}"
    print("  => CONFIRMED: Naive sum exactly doubles cost to ₹6.04 Cr and gross to ₹22.25 Cr.")

    # -------------------------------------------------------------------------
    # TEST 2: Crop Economics (2025 vs 2026)
    # -------------------------------------------------------------------------
    print("\n[CHALLENGE 2] Crop Economics Totals, Means, and Delta")
    net_2025 = g25_slice - c25_slice
    net_2026 = g26_slice - c26_slice
    mean_net_2025 = net_2025 / 1487
    mean_net_2026 = net_2026 / 1487
    growth_rate = ((net_2026 - net_2025) / net_2025) * 100.0
    
    print(f"  2025 Total Cost : ₹{c25_slice:,.2f} (Target: ₹3,02,14,192.00)")
    assert c25_slice == 30214192.00
    print(f"  2025 Gross      : ₹{g25_slice:,.2f} (Target: ₹11,12,46,772.00)")
    assert g25_slice == 111246772.00
    print(f"  2025 Net Profit : ₹{net_2025:,.2f} (Target: ₹8,10,32,580.00)")
    assert net_2025 == 81032580.00
    print(f"  2025 Mean Net   : ₹{mean_net_2025:,.2f} (Target: ₹54,494.00)")
    assert abs(mean_net_2025 - 54494.00) < 0.01
    
    print(f"  2026 Total Cost : ₹{c26_slice:,.2f} (Target: ₹3,31,24,177.00)")
    assert c26_slice == 33124177.00
    print(f"  2026 Gross      : ₹{g26_slice:,.2f} (Target: ₹12,81,70,176.00)")
    assert g26_slice == 128170176.00
    print(f"  2026 Net Profit : ₹{net_2026:,.2f} (Target: ₹9,50,45,999.00)")
    assert net_2026 == 95045999.00
    print(f"  2026 Mean Net   : ₹{mean_net_2026:,.2f} (Target: ₹63,917.95)")
    assert abs(mean_net_2026 - 63917.95) < 0.01
    
    print(f"  Net Growth Rate : {growth_rate:.4f}% (Target: +17.29%)")
    assert round(growth_rate, 2) == 17.29
    print("  => CONFIRMED: Crop economics figures match published values to the penny and percentage point.")

    # -------------------------------------------------------------------------
    # TEST 3: Turmeric Commercial Value Chain
    # -------------------------------------------------------------------------
    print("\n[CHALLENGE 3] Turmeric Commercial Value Chain")
    # Col 133: Cost 2025, Col 134: Cost 2026, Col 135: Income 2025, Col 136: Income 2026
    growers_25 = [r for r in farmer_rows if (r[133] and float(r[133]) > 0) or (r[135] and float(r[135]) > 0)]
    growers_26 = [r for r in farmer_rows if (r[134] and float(r[134]) > 0) or (r[136] and float(r[136]) > 0)]
    
    turm_c25 = sum(float(r[133] or 0) for r in farmer_rows)
    turm_c26 = sum(float(r[134] or 0) for r in farmer_rows)
    turm_g25 = sum(float(r[135] or 0) for r in farmer_rows)
    turm_g26 = sum(float(r[136] or 0) for r in farmer_rows)
    
    turm_net_25 = turm_g25 - turm_c25
    turm_net_26 = turm_g26 - turm_c26
    
    print(f"  Turmeric Growers 2025: {len(growers_25)} (Target: 333)")
    assert len(growers_25) == 333
    print(f"  Turmeric Growers 2026: {len(growers_26)} (Target: 328)")
    assert len(growers_26) == 328
    
    print(f"  Turmeric Cost 2025   : ₹{turm_c25:,.2f}")
    print(f"  Turmeric Gross 2025  : ₹{turm_g25:,.2f}")
    print(f"  Turmeric Net 2025    : ₹{turm_net_25:,.2f} (Target: ₹93,08,860.00)")
    assert turm_net_25 == 9308860.00
    
    print(f"  Turmeric Cost 2026   : ₹{turm_c26:,.2f}")
    print(f"  Turmeric Gross 2026  : ₹{turm_g26:,.2f}")
    print(f"  Turmeric Net 2026    : ₹{turm_net_26:,.2f} (Target: ₹98,38,392.00)")
    assert turm_net_26 == 9838392.00
    print("  => CONFIRMED: Turmeric grower counts and net profits verified with 100% precision.")

    # -------------------------------------------------------------------------
    # TEST 4: Demographics & Caste
    # -------------------------------------------------------------------------
    print("\n[CHALLENGE 4] Demographics & Caste")
    ws_q = wb['FDB - year 4&5 questionnaire']
    q_iter = ws_q.iter_rows(values_only=True)
    q_header = next(q_iter)
    q_rows = list(q_iter)
    
    print(f"  Total questionnaire rows: {len(q_rows)} (Target: 1,535)")
    assert len(q_rows) == 1535
    print(f"  Total questionnaire columns: {len(q_header)} (Target: 3,291)")
    assert len(q_header) == 3291
    
    # Caste column idx 12
    caste_counts = Counter(str(r[12]).strip() for r in q_rows)
    print(f"  Caste breakdown: {dict(caste_counts)}")
    assert caste_counts['OBC'] == 891
    assert caste_counts['ST'] == 377
    assert caste_counts['SC'] == 259
    assert caste_counts['General'] == 8
    assert sum(caste_counts.values()) == 1535
    print(f"  OBC: {caste_counts['OBC']} (58.05%)")
    print(f"  ST : {caste_counts['ST']} (24.56%)")
    print(f"  SC : {caste_counts['SC']} (16.87%)")
    print(f"  Gen: {caste_counts['General']} (0.52%)")
    print("  => CONFIRMED: Caste distributions match exactly.")

    # -------------------------------------------------------------------------
    # TEST 5: Field Administration & Surveyors (Payment Status)
    # -------------------------------------------------------------------------
    print("\n[CHALLENGE 5] Field Administration & Payment Status Sheet")
    ws_pay = wb['Payment Status']
    pay_rows = list(ws_pay.iter_rows(values_only=True))
    assert len(pay_rows) == 21, f"Expected 21 rows in Payment Status, got {len(pay_rows)}"
    
    surveyor_rows = pay_rows[1:20] # rows 2 to 20 (19 surveyors)
    row21 = pay_rows[20]           # row 21 (Grand Total)
    
    # True column mappings based on sheet layout:
    # Col 0: S.No
    # Col 1: Surveyor Name
    # Col 2: Visible Kobo submissions
    # Col 3: Incomplete surveys
    # Col 4: Duplicate surveys
    # Col 5: Completed surveys
    # Col 6: Physical books deposited
    # Col 7: Payments disbursed
    # Col 8: Payments pending
    
    print(f"  Row 21 label: '{row21[0]}'")
    assert row21[0] == 'Total'
    
    vis_gt = row21[2]
    inc_gt = row21[3]
    dup_gt = row21[4]
    com_gt = row21[5]
    bks_gt = row21[6]
    pad_gt = row21[7]
    pnd_gt = row21[8]
    
    vis_calc = sum(int(r[2] or 0) for r in surveyor_rows)
    inc_calc = sum(int(r[3] or 0) for r in surveyor_rows)
    dup_calc = sum(int(r[4] or 0) for r in surveyor_rows)
    com_calc = sum(int(r[5] or 0) for r in surveyor_rows)
    bks_calc = sum(int(r[6] or 0) for r in surveyor_rows)
    pad_calc = sum(int(r[7] or 0) for r in surveyor_rows)
    pnd_calc = sum(int(r[8] or 0) for r in surveyor_rows)
    
    print(f"  Visible   : Row 21 = {vis_gt} | Sum of 19 surveyors = {vis_calc} (Target: 1535)")
    assert vis_gt == 1535 and vis_calc == 1535
    print(f"  Incomplete: Row 21 = {inc_gt} | Sum of 19 surveyors = {inc_calc} (Target: 14)")
    assert inc_gt == 14 and inc_calc == 14
    print(f"  Duplicate : Row 21 = {dup_gt} | Sum of 19 surveyors = {dup_calc} (Target: 15)")
    assert dup_gt == 15 and dup_calc == 15
    print(f"  Complete  : Row 21 = {com_gt} | Sum of 19 surveyors = {com_calc} (Target: 1506)")
    assert com_gt == 1506 and com_calc == 1506
    print(f"  Books     : Row 21 = {bks_gt} | Sum of 19 surveyors = {bks_calc} (Target: 1520)")
    assert bks_gt == 1520 and bks_calc == 1520
    print(f"  Paid      : Row 21 = {pad_gt} | Sum of 19 surveyors = {pad_calc} (Target: 1102)")
    assert pad_gt == 1102 and pad_calc == 1102
    print(f"  Pending   : Row 21 = {pnd_gt} | Sum of 19 surveyors = {pnd_calc} (Target: 408)")
    assert pnd_gt == 408 and pnd_calc == 408
    
    # Internal consistency identity: Visible - Incomplete - Duplicate = Complete
    assert vis_gt - inc_gt - dup_gt == com_gt
    print("  => CONFIRMED: Payment Status Row 21 sums and 19 surveyors match with 100% fidelity.")

    # -------------------------------------------------------------------------
    # TEST 6: Landholdings (Numeric-only vs Regex-parsed with Biswa conversion)
    # -------------------------------------------------------------------------
    print("\n[CHALLENGE 6] Landholdings Numeric vs Regex Parsing")
    raw_land = [r[21] for r in q_rows]
    assert len(raw_land) == 1535
    
    # 1. Basic numeric-only sum (pure numeric types or pure numeric strings)
    num_only_sum = 0.0
    num_only_count = 0
    for v in raw_land:
        if isinstance(v, (int, float)):
            num_only_sum += float(v)
            num_only_count += 1
        elif isinstance(v, str):
            try:
                num_only_sum += float(v.strip())
                num_only_count += 1
            except ValueError:
                pass
                
    print(f"  Numeric-only entries: {num_only_count}")
    print(f"  Numeric-only sum: {num_only_sum:.2f} local bigha (Target: 3,623.50)")
    assert abs(num_only_sum - 3623.50) < 0.01
    
    # 2. Comprehensive regex parser with biswa token conversion
    def parse_land(v):
        if v is None:
            return 0.0
        s = str(v).strip().lower()
        if s in ['नहीं', 'नही', 'no', '0 जमीन नहीं है', 'oo', 'o0', 'none', 'nan', 'अ',
                 'how much total agriculture land is available with you?(in bigha)']:
            return 0.0
        plus_m = re.match(r'^([0-9\.]+)\+([0-9\.]+)', s)
        if plus_m:
            return float(plus_m.group(1)) + float(plus_m.group(2))
        # 20 biswa = 1 local bigha
        m_biswa = re.search(r'([0-9\.]+)\s*(?:बिसवा|बिसुवा|बिशुवा|vishwa)', s)
        if m_biswa:
            return float(m_biswa.group(1)) / 20.0
        m_num = re.search(r'([0-9\.]+)', s)
        if m_num:
            return float(m_num.group(1))
        return 0.0

    parsed_bigha = sum(parse_land(v) for v in raw_land)
    parsed_acres = parsed_bigha * 0.20
    
    print(f"  Regex-parsed sum: {parsed_bigha:.2f} local bigha (Target: 5,233.84)")
    assert abs(parsed_bigha - 5233.84) < 0.05
    print(f"  Parsed acres (@ 0.20): {parsed_acres:.2f} acres (Target: 1,046.77)")
    assert abs(parsed_acres - 1046.77) < 0.05
    print("  => CONFIRMED: Landholding calculations verified under both basic numeric and linguistic regex parsers.")

    wb.close()
    print("\n" + "=" * 80)
    print("ADVERSARIAL VERDICT: APPROVE (Correctness Confirmed)")
    print("=" * 80)

if __name__ == "__main__":
    run_adversarial_challenge()
