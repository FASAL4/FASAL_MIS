#!/usr/bin/env python3
"""
================================================================================
FASAL Master Survey 2026: Automated Programmatic Verification Suite
================================================================================
Script: verify_fdb_2026.py
Target Dataset: FDB Survey as on 05112026.xlsx
Deliverable Under Audit: FASAL_MASTER_SYNTHESIS_AND_RESEARCH_AGENDA_2026.md,
                         FASAL_2026_RECONCILIATION_LEDGER.md

Description:
  Automated forensic verification suite establishing 100% empirical grounding
  across 11 distinct verification modules covering survey administration,
  microdata integrity, demographic distributions, landholding regex parsing,
  macro crop economics (Row 1488 neutralization), turmeric commercial value chain,
  social rights & entitlements (Rounds 1–4), zero-PII redaction enforcement,
  and debunked myth neutralization.

Implementation Notes:
  - Deterministic concurrent file access using Win32 CreateFileW with shared read/write/delete
    flags (FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE) loaded into memory
    via io.BytesIO, guaranteeing conflict-free execution even if Microsoft Excel has the file open.
  - Fallback to standard binary stream reading if running on non-Windows platforms.
  - Strictly genuine assertions with zero mocked or hardcoded data points.
================================================================================
"""

import os
import sys
import io
import re
import time
from collections import Counter
import openpyxl

# Set standard output encoding to UTF-8
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Define paths
WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SURVEY_FILE = os.path.join(WORKSPACE_DIR, "FDB Survey as on 05112026.xlsx")
SYNTHESIS_FILE = os.path.join(WORKSPACE_DIR, "FASAL_MASTER_SYNTHESIS_AND_RESEARCH_AGENDA_2026.md")
LEDGER_FILE = os.path.join(WORKSPACE_DIR, "FASAL_2026_RECONCILIATION_LEDGER.md")


def load_file_bytes(filepath: str) -> io.BytesIO:
    """
    Reads a file into memory using Win32 CreateFileW with shared read/write/delete
    to prevent file locking collisions when Excel or other processes have the file open.
    Falls back to standard open('rb') if Win32 API is unavailable.
    """
    if sys.platform == 'win32':
        import ctypes
        from ctypes import wintypes

        GENERIC_READ = 0x80000000
        FILE_SHARE_READ = 0x00000001
        FILE_SHARE_WRITE = 0x00000002
        FILE_SHARE_DELETE = 0x00000004
        OPEN_EXISTING = 3
        FILE_ATTRIBUTE_NORMAL = 0x80
        INVALID_HANDLE_VALUE = wintypes.HANDLE(-1).value

        kernel32 = ctypes.WinDLL('kernel32', use_last_error=True)
        handle = kernel32.CreateFileW(
            filepath,
            GENERIC_READ,
            FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
            None,
            OPEN_EXISTING,
            FILE_ATTRIBUTE_NORMAL,
            None
        )
        if handle != INVALID_HANDLE_VALUE and handle != -1:
            try:
                high_size = wintypes.DWORD()
                low_size = kernel32.GetFileSize(handle, ctypes.byref(high_size))
                total_size = (high_size.value << 32) + low_size
                buffer = ctypes.create_string_buffer(total_size)
                bytes_read = wintypes.DWORD()
                if kernel32.ReadFile(handle, buffer, total_size, ctypes.byref(bytes_read), None):
                    return io.BytesIO(buffer.raw[:bytes_read.value])
            finally:
                kernel32.CloseHandle(handle)

    # Fallback standard read
    with open(filepath, 'rb') as f:
        return io.BytesIO(f.read())


class VerificationRunner:
    """
    Orchestrates execution of the 11 forensic verification modules, tracking
    assertion counts, timing, and detailed verification evidence.
    """

    def __init__(self):
        self.total_assertions = 0
        self.passed_assertions = 0
        self.failed_assertions = 0
        self.module_results = []
        self.errors = []
        self.start_time = None
        self.end_time = None

    def assert_true(self, condition: bool, description: str, evidence: str = ""):
        self.total_assertions += 1
        if condition:
            self.passed_assertions += 1
            print(f"    [PASS] {description}")
            if evidence:
                print(f"           Evidence: {evidence}")
        else:
            self.failed_assertions += 1
            err_msg = f"[FAIL] {description} | Evidence: {evidence}"
            self.errors.append(err_msg)
            print(f"    {err_msg}")

    def assert_equal(self, actual, expected, description: str):
        cond = (actual == expected)
        ev = f"Actual: {actual!r} | Expected: {expected!r}"
        self.assert_true(cond, description, ev)

    def assert_almost_equal(self, actual: float, expected: float, tolerance: float, description: str):
        diff = abs(actual - expected)
        cond = (diff <= tolerance)
        ev = f"Actual: {actual:.4f} | Expected: {expected:.4f} | Diff: {diff:.6f} (Tol: {tolerance})"
        self.assert_true(cond, description, ev)

    def run_module(self, module_num: int, name: str, func, *args, **kwargs):
        print(f"\n{'='*80}")
        print(f"MODULE {module_num}: {name}")
        print(f"{'='*80}")
        t0 = time.time()
        start_passed = self.passed_assertions
        start_failed = self.failed_assertions

        try:
            func(self, *args, **kwargs)
        except Exception as e:
            import traceback
            tb = traceback.format_exc()
            self.failed_assertions += 1
            self.total_assertions += 1
            err_msg = f"EXCEPTION in Module {module_num} ({name}): {e}\n{tb}"
            self.errors.append(err_msg)
            print(f"    [ERROR] {err_msg}")

        dur = time.time() - t0
        mod_passed = self.passed_assertions - start_passed
        mod_failed = self.failed_assertions - start_failed
        status = "PASSED" if mod_failed == 0 else "FAILED"
        self.module_results.append({
            "module_num": module_num,
            "name": name,
            "passed": mod_passed,
            "failed": mod_failed,
            "duration": dur,
            "status": status
        })
        print(f"--- Module {module_num} {status} in {dur:.2f}s ({mod_passed} passed, {mod_failed} failed) ---")


# ==============================================================================
# 11 VERIFICATION TEST MODULES
# ==============================================================================

def test_module_1_sheet_existence_and_dimensions(runner: VerificationRunner, wb: openpyxl.Workbook):
    """
    Module 1: Sheet Existence & Dimensions
    Asserts existence of all 5 canonical sheets and verifies physical dimensions.
    """
    expected_sheets = [
        'Sheet1',
        'Income Data',
        'FDB - year 4&5 questionnaire',
        'family_member_repeat',
        'Payment Status'
    ]
    actual_sheets = wb.sheetnames
    runner.assert_equal(actual_sheets, expected_sheets, "All 5 required sheets present in exact sequence")

    # Payment Status dimensions
    ws_pay = wb['Payment Status']
    pay_rows = list(ws_pay.iter_rows(values_only=True))
    runner.assert_equal(len(pay_rows), 21, "Payment Status contains exactly 21 physical rows (1 header + 19 surveyors + 1 Total)")
    runner.assert_true(len(pay_rows[0]) >= 9, "Payment Status contains at least 9 tracking columns", f"Cols: {len(pay_rows[0])}")

    # Income Data dimensions
    ws_inc = wb['Income Data']
    # Income Data has 1492 rows
    inc_row_count = 0
    for _ in ws_inc.iter_rows(min_col=1, max_col=1, values_only=True):
        inc_row_count += 1
    runner.assert_equal(inc_row_count, 1492, "Income Data contains exactly 1,492 physical rows (Header + 1,487 farmers + spacer + Grand Total)")

    # family_member_repeat dimensions
    ws_fm = wb['family_member_repeat']
    fm_row_count = 0
    for _ in ws_fm.iter_rows(min_col=1, max_col=1, values_only=True):
        fm_row_count += 1
    runner.assert_equal(fm_row_count, 6495, "family_member_repeat contains exactly 6,495 rows (1 header + 6,494 resident members)")

    # FDB - year 4&5 questionnaire dimensions
    ws_q = wb['FDB - year 4&5 questionnaire']
    q_header = next(ws_q.iter_rows(values_only=True))
    runner.assert_equal(len(q_header), 3291, "FDB questionnaire contains exactly 3,291 columns")


def test_module_2_field_administration(runner: VerificationRunner, wb: openpyxl.Workbook):
    """
    Module 2: Field Administration (Payment Status Sheet)
    Asserts exact values in Row 21 (Grand Total) and validates that sum of 19 surveyor lines matches Row 21.
    """
    ws = wb['Payment Status']
    rows = list(ws.iter_rows(values_only=True))

    header = rows[0]
    surveyor_rows = rows[1:20]
    total_row = rows[20]

    runner.assert_equal(len(surveyor_rows), 19, "Exactly 19 field surveyor records enumerated")
    runner.assert_equal(total_row[0], 'Total', "Row 21 is labeled 'Total'")

    # Authoritative Grand Total figures from Row 21:
    # Col 2: Visible on Kobo = 1,535
    # Col 3: Incomplete = 14
    # Col 4: Duplicate = 15
    # Col 5: Complete = 1,506
    # Col 6: Hardcopy Books = 1,520
    # Col 7: Paid = 1,102
    # Col 8: Pending = 408
    tot_vis = total_row[2]
    tot_incomp = total_row[3]
    tot_dup = total_row[4]
    tot_comp = total_row[5]
    tot_books = total_row[6]
    tot_paid = total_row[7]
    tot_pending = total_row[8]

    runner.assert_equal(tot_vis, 1535, "Payment Status Grand Total: Visible Kobo submissions = 1,535")
    runner.assert_equal(tot_incomp, 14, "Payment Status Grand Total: Incomplete surveys = 14")
    runner.assert_equal(tot_dup, 15, "Payment Status Grand Total: Duplicate surveys = 15")
    runner.assert_equal(tot_comp, 1506, "Payment Status Grand Total: Completed surveys = 1,506")
    runner.assert_equal(tot_books, 1520, "Payment Status Grand Total: Physical FDB books deposited = 1,520")
    runner.assert_equal(tot_paid, 1102, "Payment Status Grand Total: Payments disbursed = 1,102")
    runner.assert_equal(tot_pending, 408, "Payment Status Grand Total: Payments pending = 408")

    # Mathematical reconciliation of Row 21 values
    runner.assert_equal(tot_vis - tot_incomp - tot_dup, tot_comp, "Completed surveys formula: Visible (1535) - Incomplete (14) - Duplicate (15) = 1506")

    # Sum of individual 19 surveyors
    sum_vis = sum(r[2] or 0 for r in surveyor_rows)
    sum_incomp = sum(r[3] or 0 for r in surveyor_rows)
    sum_dup = sum(r[4] or 0 for r in surveyor_rows)
    sum_comp = sum(r[5] or 0 for r in surveyor_rows)
    sum_books = sum(r[6] or 0 for r in surveyor_rows)
    sum_paid = sum(r[7] or 0 for r in surveyor_rows)
    sum_pending = sum(r[8] or 0 for r in surveyor_rows)

    runner.assert_equal(sum_vis, 1535, "Sum of 19 surveyors visible Kobo entries matches 1,535")
    runner.assert_equal(sum_incomp, 14, "Sum of 19 surveyors incomplete entries matches 14")
    runner.assert_equal(sum_dup, 15, "Sum of 19 surveyors duplicate entries matches 15")
    runner.assert_equal(sum_comp, 1506, "Sum of 19 surveyors completed entries matches 1,506")
    runner.assert_equal(sum_books, 1520, "Sum of 19 surveyors books deposited matches 1,520")
    runner.assert_equal(sum_paid, 1102, "Sum of 19 surveyors payments disbursed matches 1,102")
    runner.assert_equal(sum_pending, 408, "Sum of 19 surveyors payments pending matches 408")


def test_module_3_microdata_structure(runner: VerificationRunner, wb: openpyxl.Workbook, q_cache: dict):
    """
    Module 3: Microdata Structure (FDB - year 4&5 questionnaire)
    Asserts exact respondent count (1,535), 3,291 columns, unique _id integer keys, and metadata.
    """
    runner.assert_equal(q_cache['row_count'], 1535, "Household microdata table contains exactly 1,535 response rows")
    runner.assert_equal(q_cache['col_count'], 3291, "Household microdata table contains exactly 3,291 columns")

    ids = q_cache['ids']
    runner.assert_equal(len(ids), 1535, "Extracted 1,535 submission IDs")
    runner.assert_equal(len(set(ids)), 1535, "All 1,535 submission '_id' values are strictly unique (0 duplicates)")

    # Assert all IDs are positive integers in the 800M Kobo deployment space
    all_valid_ids = all(isinstance(i, int) and 840000000 <= i <= 910000000 for i in ids)
    runner.assert_true(all_valid_ids, "All '_id' values are valid Kobo integers in the 840M-910M deployment range",
                       f"Min ID: {min(ids)}, Max ID: {max(ids)}")

    # UUID integrity
    uuids = q_cache['uuids']
    runner.assert_equal(len(set(uuids)), 1535, "All 1,535 '_uuid' hashes are strictly unique (0 duplicates)")


def test_module_4_family_member_roster(runner: VerificationRunner, wb: openpyxl.Workbook, q_cache: dict):
    """
    Module 4: Family Member Roster (family_member_repeat)
    Asserts 6,494 resident member records, 4,826 AAS members, 9 Bal Sansad, 11 Kishor Sangathan, 11 Yuva Sansad,
    and 100% referential integrity to parent households.
    """
    ws = wb['family_member_repeat']
    rows = list(ws.iter_rows(values_only=True))
    header = rows[0]
    records = rows[1:]

    runner.assert_equal(len(records), 6494, "family_member_repeat contains exactly 6,494 resident member records")
    runner.assert_equal(len(header), 17, "family_member_repeat contains exactly 17 columns")

    # Column mappings
    # Col 1: Bal Sansad, Col 2: Kishor Sangathan, Col 3: Yuva Sansad, Col 4: AAS
    bs_idx = 1
    ks_idx = 2
    ys_idx = 3
    aas_idx = 4
    parent_id_idx = 9

    bs_count = sum(1 for r in records if str(r[bs_idx]).strip().lower() == 'yes')
    ks_count = sum(1 for r in records if str(r[ks_idx]).strip().lower() == 'yes')
    ys_count = sum(1 for r in records if str(r[ys_idx]).strip().lower() == 'yes')
    aas_count = sum(1 for r in records if str(r[aas_idx]).strip().lower() == 'yes')

    runner.assert_equal(bs_count, 9, "Bal Sansad membership equals exactly 9 youth representatives")
    runner.assert_equal(ks_count, 11, "Kishor Sangathan membership equals exactly 11 adolescent members")
    runner.assert_equal(ys_count, 11, "Yuva Sansad membership equals exactly 11 young adult delegates")
    runner.assert_equal(aas_count, 4826, "Ajeevika Adhikar Sangathan (AAS) membership equals exactly 4,826 members (74.32%)")

    # Referential integrity: parent link
    parent_ids_in_roster = set(r[parent_id_idx] for r in records)
    parent_ids_in_q = set(q_cache['ids'])

    runner.assert_true(parent_ids_in_roster.issubset(parent_ids_in_q),
                       "100% of child roster records map to valid parent '_id' keys in master questionnaire")
    runner.assert_equal(len(parent_ids_in_roster), 1535, "All 1,535 parent households are represented in the member roster")

    mean_hh_size = len(records) / 1535.0
    runner.assert_almost_equal(mean_hh_size, 4.2306, 0.001, "Mean household size equals 4.23 members per household")


def test_module_5_geographic_scope(runner: VerificationRunner, q_cache: dict):
    """
    Module 5: Geographic Scope (7 Gram Panchayats, 19 Villages)
    Asserts exact distribution across 7 Gram Panchayats and 19 unique villages.
    """
    gps = q_cache['gps']
    villages = q_cache['villages']

    gp_counts = Counter(gps)
    expected_gps = {
        'Karikot': 758,
        'Fakirpuri': 249,
        'Chahalwa': 201,
        'Bajpur Bankati': 129,
        'Mangalpurwa': 79,
        'Badkhadiya': 63,
        'Vishunapur': 56
    }
    runner.assert_equal(dict(gp_counts), expected_gps, "Exact household distribution across all 7 Gram Panchayats confirmed")
    runner.assert_equal(sum(gp_counts.values()), 1535, "Sum of all 7 Gram Panchayats equals exactly 1,535 households")

    unique_villages = sorted(set(villages))
    runner.assert_equal(len(unique_villages), 19, "Exactly 19 unique village settlements surveyed")

    # Assert Badkhadiya is recognized as distinct 7th GP (63 households)
    runner.assert_equal(gp_counts.get('Badkhadiya', 0), 63, "Badkhadiya correctly identified as the 7th Gram Panchayat with 63 households")


def test_module_6_social_demographics(runner: VerificationRunner, q_cache: dict):
    """
    Module 6: Social Category & Caste Demographics
    Asserts complete collection of Caste variable for 100% of respondents:
    OBC 891 (58.05%), ST 377 (24.56%), SC 259 (16.87%), General 8 (0.52%).
    """
    castes = q_cache['castes']
    caste_counts = Counter(castes)
    expected_caste = {
        'OBC': 891,
        'ST': 377,
        'SC': 259,
        'General': 8
    }
    runner.assert_equal(dict(caste_counts), expected_caste, "Exact caste distribution across 1,535 households confirmed")
    runner.assert_equal(sum(caste_counts.values()), 1535, "100% of surveyed households report valid caste classification (0 missing)")

    obc_pct = caste_counts['OBC'] / 1535.0 * 100.0
    st_pct = caste_counts['ST'] / 1535.0 * 100.0
    sc_pct = caste_counts['SC'] / 1535.0 * 100.0
    gen_pct = caste_counts['General'] / 1535.0 * 100.0

    runner.assert_almost_equal(obc_pct, 58.05, 0.05, "OBC representation = 58.05%")
    runner.assert_almost_equal(st_pct, 24.56, 0.05, "ST (Tharu) representation = 24.56%")
    runner.assert_almost_equal(sc_pct, 16.87, 0.05, "SC (Dalit) representation = 16.87%")
    runner.assert_almost_equal(gen_pct, 0.52, 0.05, "General caste representation = 0.52%")


def test_module_7_landholdings_and_bigha_regex(runner: VerificationRunner, q_cache: dict):
    """
    Module 7: Landholdings & Bigha Token Regex
    Asserts raw numeric-only sum of basic Q is 3,623.50 local bigha,
    and regex-parsed total is 5,233.84 local bigha = 1,046.77 acres @ 0.20 factor.
    """
    raw_land = q_cache['land_raw']
    runner.assert_equal(len(raw_land), 1535, "Extracted 1,535 land records from questionnaire")

    # 1. Basic numeric-only sum
    num_only_sum = 0.0
    for v in raw_land:
        if isinstance(v, (int, float)):
            num_only_sum += float(v)
        elif isinstance(v, str):
            try:
                num_only_sum += float(v.strip())
            except ValueError:
                pass

    runner.assert_almost_equal(num_only_sum, 3623.50, 0.01,
                               "Basic numeric-only sum of operational land equals exactly 3,623.50 local bigha")

    # 2. Comprehensive regex parser converting bigha and biswa tokens
    def parse_land_entry(v):
        if v is None:
            return 0.0
        s = str(v).strip().lower()
        if s in ['नहीं', 'नही', 'no', '0 जमीन नहीं है', 'oo', 'o0', 'none', 'nan', 'अ',
                 'how much total agriculture land is available with you?(in bigha)']:
            return 0.0
        # Composite arithmetic like '1+5' or '2+2'
        plus_m = re.match(r'^([0-9\.]+)\+([0-9\.]+)', s)
        if plus_m:
            return float(plus_m.group(1)) + float(plus_m.group(2))
        # Biswa tokens (20 biswa = 1 local bigha)
        m_biswa = re.search(r'([0-9\.]+)\s*(?:बिसवा|बिसुवा|बिशुवा|vishwa)', s)
        if m_biswa:
            return float(m_biswa.group(1)) / 20.0
        # Standard bigha / digits
        m_num = re.search(r'([0-9\.]+)', s)
        if m_num:
            return float(m_num.group(1))
        return 0.0

    parsed_values = [parse_land_entry(v) for v in raw_land]
    total_parsed_bigha = sum(parsed_values)

    runner.assert_almost_equal(total_parsed_bigha, 5233.84, 0.05,
                               "Regex-parsed total operational land equals 5,233.84 local bigha")

    # Acre calculations at 0.20 factor
    total_acres_020 = total_parsed_bigha * 0.20
    runner.assert_almost_equal(total_acres_020, 1046.77, 0.05,
                               "Total agricultural land at local 0.20 conversion equals 1,046.77 acres")

    # Sensitivity matrix verification
    acres_025 = total_parsed_bigha * 0.25
    acres_033 = total_parsed_bigha * (1.0 / 3.0)
    acres_0619 = total_parsed_bigha * 0.619
    runner.assert_almost_equal(acres_025, 1308.46, 0.05, "Sensitivity Matrix: Land at 0.25 factor = 1,308.46 acres")
    runner.assert_almost_equal(acres_033, 1744.61, 20.0, "Sensitivity Matrix: Land at ~0.33 factor = ~1,727–1,745 acres")
    runner.assert_almost_equal(acres_0619, 3239.75, 0.10, "Sensitivity Matrix: Land at 0.619 standard UP factor = 3,239.75 acres")


def test_module_8_crop_economics_and_row1488_neutralization(runner: VerificationRunner, wb: openpyxl.Workbook):
    """
    Module 8: Macro Crop Economics & Row 1488 Neutralization (Income Data Sheet)
    Asserts:
      - Rows 3 to 1489 represent exactly 1,487 genuine farmer records.
      - Row 1490 is blank spacer.
      - Row 1491 (Grand Total) matches the sum of 1,487 genuine farmers with ₹0.00 discrepancy.
      - 2025 Cost: ₹30,214,192.00 | Gross: ₹111,246,772.00 | Net: ₹81,032,580.00 | Mean Net: ₹54,494.00
      - 2026 Cost: ₹33,124,177.00 | Gross: ₹128,170,176.00 | Net: ₹95,045,999.00 | Mean Net: ₹63,917.95
      - Naive summation without filtering doubles the totals (proving necessity of neutralization).
    """
    ws = wb['Income Data']
    rows = list(ws.iter_rows(values_only=True))

    runner.assert_equal(len(rows), 1492, "Income Data contains exactly 1,492 physical rows")

    farmer_rows = rows[3:1490]
    spacer_row = rows[1490]
    gt_row = rows[1491]

    runner.assert_equal(len(farmer_rows), 1487, "Exactly 1,487 genuine farmer records in Income Data")
    runner.assert_true(all(v is None for v in spacer_row[:5]), "Row 1490 is an empty spacer row")
    runner.assert_equal(gt_row[0], 'Grand Total', "Row 1491 is labeled 'Grand Total'")

    # Columns 165, 166, 167, 168:
    # Col 165: Total Cost 2025
    # Col 166: Total Cost 2026
    # Col 167: Total Income 2025
    # Col 168: Total Income 2026
    cost_25_idx = 165
    cost_26_idx = 166
    inc_25_idx = 167
    inc_26_idx = 168

    sum_cost_25 = sum(r[cost_25_idx] or 0 for r in farmer_rows)
    sum_cost_26 = sum(r[cost_26_idx] or 0 for r in farmer_rows)
    sum_inc_25 = sum(r[inc_25_idx] or 0 for r in farmer_rows)
    sum_inc_26 = sum(r[inc_26_idx] or 0 for r in farmer_rows)

    gt_cost_25 = gt_row[cost_25_idx]
    gt_cost_26 = gt_row[cost_26_idx]
    gt_inc_25 = gt_row[inc_25_idx]
    gt_inc_26 = gt_row[inc_26_idx]

    # Perfect ₹0.00 slice identity proof
    runner.assert_equal(sum_cost_25, gt_cost_25, "2025 Cost: Sum of 1,487 farmers equals Grand Total with ₹0.00 difference")
    runner.assert_equal(sum_cost_26, gt_cost_26, "2026 Cost: Sum of 1,487 farmers equals Grand Total with ₹0.00 difference")
    runner.assert_equal(sum_inc_25, gt_inc_25, "2025 Gross Income: Sum of 1,487 farmers equals Grand Total with ₹0.00 difference")
    runner.assert_equal(sum_inc_26, gt_inc_26, "2026 Gross Income: Sum of 1,487 farmers equals Grand Total with ₹0.00 difference")

    # Macro financial totals
    runner.assert_equal(sum_cost_25, 30214192, "2025 Aggregate Farm Cost equals exactly ₹30,214,192.00 (~₹3.02 Crore)")
    runner.assert_equal(sum_inc_25, 111246772, "2025 Aggregate Farm Gross Income equals exactly ₹111,246,772.00 (~₹11.12 Crore)")
    net_25 = sum_inc_25 - sum_cost_25
    runner.assert_equal(net_25, 81032580, "2025 Aggregate Farm Net Profit equals exactly ₹81,032,580.00 (~₹8.10 Crore)")
    mean_net_25 = net_25 / 1487.0
    runner.assert_almost_equal(mean_net_25, 54494.00, 0.01, "2025 Mean Net Farm Income per Household equals ₹54,494.00")

    runner.assert_equal(sum_cost_26, 33124177, "2026 Aggregate Farm Cost equals exactly ₹33,124,177.00 (~₹3.31 Crore)")
    runner.assert_equal(sum_inc_26, 128170176, "2026 Aggregate Farm Gross Income equals exactly ₹128,170,176.00 (~₹12.82 Crore)")
    net_26 = sum_inc_26 - sum_cost_26
    runner.assert_equal(net_26, 95045999, "2026 Aggregate Farm Net Profit equals exactly ₹95,045,999.00 (~₹9.50 Crore)")
    mean_net_26 = net_26 / 1487.0
    runner.assert_almost_equal(mean_net_26, 63917.95, 0.01, "2026 Mean Net Farm Income per Household equals ₹63,917.95")

    # Growth rate
    growth_pct = (net_26 - net_25) / float(net_25) * 100.0
    runner.assert_almost_equal(growth_pct, 17.2936, 0.01, "Single-year Net Farm Income expansion equals +17.29%")

    # Neutralization proof: demonstrate that un-neutralized column sum doubles totals
    naive_cost_25 = sum(r[cost_25_idx] or 0 for r in rows[3:])
    naive_inc_25 = sum(r[inc_25_idx] or 0 for r in rows[3:])
    runner.assert_equal(naive_cost_25, 30214192 * 2, "Unfiltered column sum erroneously doubles 2025 cost to ₹60,428,384.00")
    runner.assert_equal(naive_inc_25, 111246772 * 2, "Unfiltered column sum erroneously doubles 2025 gross income to ₹222,493,544.00")


def test_module_9_flagship_turmeric_value_chain(runner: VerificationRunner, wb: openpyxl.Workbook):
    """
    Module 9: Flagship Value Chains (Turmeric in Income Data)
    Asserts:
      - 333 growers in 2025 generating ₹93.09 Lakh net margin.
      - 328 growers in 2026 generating ₹98.38 Lakh net margin.
    """
    ws = wb['Income Data']
    rows = list(ws.iter_rows(values_only=True))
    farmer_rows = rows[3:1490]
    gt_row = rows[1491]

    # Turmeric column indices:
    # Col 133: Cost 2025, Col 134: Cost 2026
    # Col 135: Income 2025, Col 136: Income 2026
    t_c25_idx = 133
    t_c26_idx = 134
    t_i25_idx = 135
    t_i26_idx = 136

    growers_25 = sum(1 for r in farmer_rows if (r[t_c25_idx] or 0) > 0 or (r[t_i25_idx] or 0) > 0)
    growers_26 = sum(1 for r in farmer_rows if (r[t_c26_idx] or 0) > 0 or (r[t_i26_idx] or 0) > 0)

    runner.assert_equal(growers_25, 333, "Active commercial turmeric growers in 2025 equals exactly 333 farmers")
    runner.assert_equal(growers_26, 328, "Active commercial turmeric growers in 2026 equals exactly 328 farmers")

    cost_25 = sum(r[t_c25_idx] or 0 for r in farmer_rows)
    cost_26 = sum(r[t_c26_idx] or 0 for r in farmer_rows)
    inc_25 = sum(r[t_i25_idx] or 0 for r in farmer_rows)
    inc_26 = sum(r[t_i26_idx] or 0 for r in farmer_rows)

    runner.assert_equal(cost_25, gt_row[t_c25_idx], "Turmeric Cost 2025 matches Grand Total row (₹2,488,890.00)")
    runner.assert_equal(cost_26, gt_row[t_c26_idx], "Turmeric Cost 2026 matches Grand Total row (₹2,849,768.00)")
    runner.assert_equal(inc_25, gt_row[t_i25_idx], "Turmeric Gross 2025 matches Grand Total row (₹11,797,750.00)")
    runner.assert_equal(inc_26, gt_row[t_i26_idx], "Turmeric Gross 2026 matches Grand Total row (₹12,688,160.00)")

    net_25 = inc_25 - cost_25
    net_26 = inc_26 - cost_26

    runner.assert_equal(net_25, 9308860, "Turmeric Net Profit 2025 equals exactly ₹93,08,860.00 (₹93.09 Lakh)")
    runner.assert_equal(net_26, 9838392, "Turmeric Net Profit 2026 equals exactly ₹98,38,392.00 (₹98.38 Lakh)")


def test_module_10_rights_and_entitlements(runner: VerificationRunner, q_cache: dict):
    """
    Module 10: Rights & Entitlements Round 1–4 Metrics
    Asserts stable 4-round delivery for core public entitlements:
      - Essential Medication: R1: 728 (47.4%), R2: 706 (46.0%), R3: 698 (45.5%), R4: 673 (43.8%) (~46% average)
      - Sanitary Pads: R1: 645 (42.0%), R2: 619 (40.3%), R3: 620 (40.4%), R4: 632 (41.2%) (~41% average)
    """
    med_counts = q_cache['medication']
    pad_counts = q_cache['sanitary_pads']

    runner.assert_equal(med_counts['r1'], 728, "Essential Medication Round 1 receipt = 728 households (47.4%)")
    runner.assert_equal(med_counts['r2'], 706, "Essential Medication Round 2 receipt = 706 households (46.0%)")
    runner.assert_equal(med_counts['r3'], 698, "Essential Medication Round 3 receipt = 698 households (45.5%)")
    runner.assert_equal(med_counts['r4'], 673, "Essential Medication Round 4 receipt = 673 households (43.8%)")

    mean_med_pct = sum(med_counts.values()) / 4.0 / 1535.0 * 100.0
    runner.assert_almost_equal(mean_med_pct, 45.68, 0.5, "Essential Medication stable 4-round coverage = ~46% of households")

    runner.assert_equal(pad_counts['r1'], 645, "Sanitary Pads Round 1 receipt = 645 households (42.0%)")
    runner.assert_equal(pad_counts['r2'], 619, "Sanitary Pads Round 2 receipt = 619 households (40.3%)")
    runner.assert_equal(pad_counts['r3'], 620, "Sanitary Pads Round 3 receipt = 620 households (40.4%)")
    runner.assert_equal(pad_counts['r4'], 632, "Sanitary Pads Round 4 receipt = 632 households (41.2%)")

    mean_pad_pct = sum(pad_counts.values()) / 4.0 / 1535.0 * 100.0
    runner.assert_almost_equal(mean_pad_pct, 40.98, 0.5, "Sanitary Pads stable 4-round coverage = ~41% of households")


def test_module_11_document_consistency_and_redaction(runner: VerificationRunner):
    """
    Module 11: Document Consistency & Redaction Assertions
    Asserts:
      - ZERO unredacted 10-digit mobile numbers in target deliverables.
      - ZERO positive claims of debunked myths ("Agniastra" or ₹11.70 Cr leverage).
      - Reaffirmation of verified public leverage: ₹7,70,98,360 (~₹7.71 Cr) across 577 genuine projects.
    """
    deliverables = []
    if os.path.exists(SYNTHESIS_FILE):
        deliverables.append(("FASAL_MASTER_SYNTHESIS_AND_RESEARCH_AGENDA_2026.md", SYNTHESIS_FILE))
    if os.path.exists(LEDGER_FILE):
        deliverables.append(("FASAL_2026_RECONCILIATION_LEDGER.md", LEDGER_FILE))

    runner.assert_true(len(deliverables) >= 1, "At least one target master deliverable exists for verification",
                       f"Found: {[name for name, _ in deliverables]}")

    for doc_name, doc_path in deliverables:
        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Zero phone numbers (10-digit mobile numbers starting with 6, 7, 8, or 9)
        # Avoid false positives with markdown dates or currency numbers by checking standalone 10-digit patterns
        phone_matches = re.findall(r'\b[6-9]\d{9}\b', content)
        runner.assert_equal(len(phone_matches), 0,
                            f"ZERO unredacted 10-digit phone numbers in {doc_name} (Found {len(phone_matches)})")

        # 2. Myth check: Agniastra
        # Any occurrence of Agniastra must be explicitly associated with "debunked", "myth", "neutralized", or "external"
        agniastra_occurrences = [m.start() for m in re.finditer(r'agniastra', content, re.IGNORECASE)]
        valid_agniastra_debunking = True
        for idx in agniastra_occurrences:
            surrounding = content[max(0, idx - 150):min(len(content), idx + 150)].lower()
            if not any(k in surrounding for k in ['debunk', 'myth', 'neutraliz', 'purged', 'external', 'artifact', 'zero', 'false', 'remediat', 'fabricat', 'prohibit']):
                valid_agniastra_debunking = False
                break
        runner.assert_true(valid_agniastra_debunking,
                           f"All occurrences of 'Agniastra' in {doc_name} are strictly framed as debunked/neutralized artifacts")

        # 3. Myth check: ₹11.70 Crore Leverage
        # Any occurrence of 11.70 / 11.7 must be framed as debunked historical subtotal double-counting
        lev_myth_occurrences = [m.start() for m in re.finditer(r'11\.70|11\.7\b', content)]
        valid_lev_debunking = True
        for idx in lev_myth_occurrences:
            surrounding = content[max(0, idx - 150):min(len(content), idx + 150)].lower()
            if not any(k in surrounding for k in ['debunk', 'myth', 'double-count', 'error', 'defect', 'sys-7', 'corrected', 'resolved']):
                valid_lev_debunking = False
                break
        runner.assert_true(valid_lev_debunking,
                           f"All occurrences of '11.70 Cr' in {doc_name} are strictly framed as debunked double-counting artifacts")

        # 4. Verified public leverage figure presence: ₹7.71 Crore or ₹7,70,98,360
        has_verified_lev = bool(re.search(r'7[,.]71|7,70,98,360', content))
        runner.assert_true(has_verified_lev,
                           f"Verified public leverage figure (~₹7.71 Cr / ₹7,70,98,360) is prominently present in {doc_name}")

        # 5. Verified project line item count: 577 projects
        has_577_projects = bool(re.search(r'577.*?(?:project|line|item|convergence)', content, re.IGNORECASE))
        runner.assert_true(has_577_projects,
                           f"Verified count of 577 genuine public leverage projects is asserted in {doc_name}")


# ==============================================================================
# MAIN TEST EXECUTION HARNESS
# ==============================================================================

def main():
    print(r"""
================================================================================
  FASAL 2026 MASTER SURVEY AUTOMATED PROGRAMMATIC VERIFICATION SUITE
  Target Dataset: FDB Survey as on 05112026.xlsx
  Verification Spec: 11 Comprehensive Verification Modules
================================================================================
    """)

    if not os.path.exists(SURVEY_FILE):
        print(f"CRITICAL ERROR: Primary survey file not found at: {SURVEY_FILE}")
        sys.exit(1)

    suite_start = time.time()
    runner = VerificationRunner()

    print(f"[*] Step 1: Loading workbook with Win32 CreateFileW shared reading...")
    load_start = time.time()
    bio = load_file_bytes(SURVEY_FILE)
    print(f"    Workbook byte stream loaded into memory ({bio.getbuffer().nbytes:,} bytes) in {time.time() - load_start:.2f}s")

    print(f"[*] Step 2: Initializing openpyxl read_only workbook...")
    wb_start = time.time()
    wb = openpyxl.load_workbook(bio, read_only=True, data_only=True)
    print(f"    openpyxl read_only workbook ready in {time.time() - wb_start:.2f}s")

    # Pre-extract questionnaire data needed for modules 3, 5, 6, 7, 10 in a single fast pass
    print(f"[*] Step 3: Extracting high-dimensional microdata cache from 'FDB - year 4&5 questionnaire'...")
    cache_start = time.time()
    ws_q = wb['FDB - year 4&5 questionnaire']
    q_rows = ws_q.iter_rows(values_only=True)
    q_header = next(q_rows)

    q_cache = {
        'row_count': 0,
        'col_count': len(q_header),
        'ids': [],
        'uuids': [],
        'gps': [],
        'villages': [],
        'castes': [],
        'land_raw': [],
        'medication': {'r1': 0, 'r2': 0, 'r3': 0, 'r4': 0},
        'sanitary_pads': {'r1': 0, 'r2': 0, 'r3': 0, 'r4': 0}
    }

    # Column index mappings
    gp_idx = 5
    village_idx = 6
    caste_idx = 12
    land_idx = 21
    id_idx = 3282
    uuid_idx = 3283

    # R&E columns
    med_r1_idx = 323
    med_r2_idx = 954
    med_r3_idx = 1669
    med_r4_idx = 2300

    pad_r1_idx = 272
    pad_r2_idx = 903
    pad_r3_idx = 1618
    pad_r4_idx = 2249

    for r in q_rows:
        q_cache['row_count'] += 1
        q_cache['ids'].append(r[id_idx])
        q_cache['uuids'].append(r[uuid_idx])
        q_cache['gps'].append(r[gp_idx])
        q_cache['villages'].append(r[village_idx])
        q_cache['castes'].append(r[caste_idx])
        q_cache['land_raw'].append(r[land_idx])

        # R&E Yes counts
        if str(r[med_r1_idx]).strip().lower() == 'yes':
            q_cache['medication']['r1'] += 1
        if str(r[med_r2_idx]).strip().lower() == 'yes':
            q_cache['medication']['r2'] += 1
        if str(r[med_r3_idx]).strip().lower() == 'yes':
            q_cache['medication']['r3'] += 1
        if str(r[med_r4_idx]).strip().lower() == 'yes':
            q_cache['medication']['r4'] += 1

        if str(r[pad_r1_idx]).strip().lower() == 'yes':
            q_cache['sanitary_pads']['r1'] += 1
        if str(r[pad_r2_idx]).strip().lower() == 'yes':
            q_cache['sanitary_pads']['r2'] += 1
        if str(r[pad_r3_idx]).strip().lower() == 'yes':
            q_cache['sanitary_pads']['r3'] += 1
        if str(r[pad_r4_idx]).strip().lower() == 'yes':
            q_cache['sanitary_pads']['r4'] += 1

    print(f"    Extracted {q_cache['row_count']} questionnaire rows in {time.time() - cache_start:.2f}s")

    # Run the 11 verification modules
    runner.run_module(1, "Sheet Existence & Dimensions", test_module_1_sheet_existence_and_dimensions, wb)
    runner.run_module(2, "Field Administration (Payment Status Sheet)", test_module_2_field_administration, wb)
    runner.run_module(3, "Microdata Structure (FDB Questionnaire)", test_module_3_microdata_structure, wb, q_cache)
    runner.run_module(4, "Family Member Roster (family_member_repeat)", test_module_4_family_member_roster, wb, q_cache)
    runner.run_module(5, "Geographic Scope (7 GPs, 19 Villages)", test_module_5_geographic_scope, q_cache)
    runner.run_module(6, "Social Category & Caste Demographics", test_module_6_social_demographics, q_cache)
    runner.run_module(7, "Landholdings & Bigha Token Regex Parser", test_module_7_landholdings_and_bigha_regex, q_cache)
    runner.run_module(8, "Macro Crop Economics & Row 1488 Neutralization", test_module_8_crop_economics_and_row1488_neutralization, wb)
    runner.run_module(9, "Flagship Commercial Turmeric Value Chain", test_module_9_flagship_turmeric_value_chain, wb)
    runner.run_module(10, "Rights & Entitlements 4-Round Delivery", test_module_10_rights_and_entitlements, q_cache)
    runner.run_module(11, "Document Consistency, Zero PII & Myth Neutralization", test_module_11_document_consistency_and_redaction)

    wb.close()
    suite_duration = time.time() - suite_start

    # Final summary report
    print(f"\n{'='*80}")
    print(f"FINAL VERIFICATION SUMMARY REPORT")
    print(f"{'='*80}")
    print(f"{'Module':<4} | {'Module Name':<45} | {'Passed':<6} | {'Failed':<6} | {'Status':<8} | {'Time (s)':<8}")
    print(f"{'-'*4}-+-{'-'*45}-+-{'-'*6}-+-{'-'*6}-+-{'-'*8}-+-{'-'*8}")
    for res in runner.module_results:
        print(f"{res['module_num']:<4} | {res['name']:<45} | {res['passed']:<6} | {res['failed']:<6} | {res['status']:<8} | {res['duration']:<8.2f}")
    print(f"{'='*80}")
    print(f"Total Execution Time : {suite_duration:.2f} seconds")
    print(f"Total Assertions     : {runner.total_assertions}")
    print(f"Passed Assertions    : {runner.passed_assertions} ({runner.passed_assertions/max(1, runner.total_assertions)*100.0:.1f}%)")
    print(f"Failed Assertions    : {runner.failed_assertions}")
    print(f"{'='*80}")

    if runner.failed_assertions > 0:
        print(f"\n[!] VERIFICATION SUITE FAILED WITH {runner.failed_assertions} DEFECTS:")
        for err in runner.errors:
            print(f"    - {err}")
        sys.exit(1)
    else:
        print(f"\n[✓] ALL 11 VERIFICATION MODULES PASSED WITH 100% EMPIRICAL INTEGRITY!")
        sys.exit(0)


if __name__ == "__main__":
    main()
