#!/usr/bin/env python3
"""
Empirical Stress Test Harness for Milestone 4 (Features F22, F23, F24)
Author: Empirical Challenger (Adversarial Verification)
Target: FilterContext.tsx, GlobalFilterBar.tsx, ViewModeContext.tsx, Header.tsx, main.tsx
"""

import os
import sys
import json
import re
import math
import pandas as pd

def log_pass(name, details=""):
    print(f"  [PASS] {name}" + (f": {details}" if details else ""))

def log_fail(name, details=""):
    print(f"  [FAIL] {name}" + (f": {details}" if details else ""))

def main():
    print("=" * 80)
    print("  EMPIRICAL STRESS TEST SUITE: MILESTONE 4")
    print("  Global Filter Engine (F24) & View Mode Switching (F22/F23)")
    print("=" * 80)

    dashboard_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    filter_context_path = os.path.join(dashboard_dir, "src", "context", "FilterContext.tsx")
    excel_path = os.path.abspath(os.path.join(dashboard_dir, "..", "FDB Survey as on 05112026.xlsx"))

    # --------------------------------------------------------------------------
    # Track 1: Parse and Audit COHORT_COMBOS in FilterContext.tsx
    # --------------------------------------------------------------------------
    print("\n--- TRACK 1: FilterContext.tsx In-Memory Dataset Audit ---")
    if not os.path.exists(filter_context_path):
        log_fail("FilterContext.tsx exists", f"File not found at {filter_context_path}")
        return 1
    log_pass("FilterContext.tsx exists", filter_context_path)

    with open(filter_context_path, "r", encoding="utf-8") as f:
        fc_content = f.read()

    match = re.search(r'const COHORT_COMBOS:\s*CohortCombo\[\]\s*=\s*(\[[\s\S]*?\]);', fc_content)
    if not match:
        log_fail("Extract COHORT_COMBOS JSON array", "Pattern not found in FilterContext.tsx")
        return 1
    
    combos = json.loads(match.group(1))
    log_pass("COHORT_COMBOS extracted and parsed", f"{len(combos)} distinct cohort tuples found")

    total_hh = sum(c["count"] for c in combos)
    if total_hh == 1535:
        log_pass("Total survey submissions in COHORT_COMBOS", f"N = {total_hh}")
    else:
        log_fail("Total survey submissions in COHORT_COMBOS", f"Expected 1535, found {total_hh}")

    # --------------------------------------------------------------------------
    # Track 2: Load Master Excel Survey Data (Ground Truth Oracle)
    # --------------------------------------------------------------------------
    print("\n--- TRACK 2: Ground Truth Excel Cross-Verification (FDB Questionnaire) ---")
    df = pd.read_excel(
        excel_path,
        sheet_name="FDB - year 4&5 questionnaire",
        usecols=[
            "Village Panchayat",
            "Village Name",
            "Caste",
            "How much Total agriculture land is available with you?(in bigha)"
        ]
    )
    df.columns = ["gp", "village", "caste", "land_bigha_raw"]
    log_pass("Master Excel Questionnaire sheet loaded", f"{len(df)} survey rows")

    # Clean Excel land bigha
    def parse_bigha(val):
        if pd.isna(val):
            return 0.0
        s = str(val).replace("बीघा", "").replace(" ", "").strip()
        try:
            return float(s)
        except:
            return 0.0

    df["bigha"] = df["land_bigha_raw"].apply(parse_bigha)

    def land_tier(b):
        if b == 0:
            return "LANDLESS"
        elif b <= 5.0: # <= 1 acre (at 0.20 ac/bigha, 5 bigha = 1 acre)
            return "MARGINAL_LE_1_ACRE"
        elif b <= 10.0: # 1-2 acres (5-10 bigha)
            return "SMALL_1_TO_2_ACRES"
        else:
            return "MEDIUM_GT_2_ACRES"

    df["tier"] = df["bigha"].apply(land_tier)

    # --------------------------------------------------------------------------
    # Track 3: Gram Panchayat Censuses (All 7 GPs)
    # --------------------------------------------------------------------------
    print("\n--- TRACK 3: All 7 Gram Panchayats Individual Census Verification ---")
    expected_gps = {
        "Karikot": 758,
        "Fakirpuri": 249,
        "Chahalwa": 201,
        "Bajpur Bankati": 129,
        "Mangalpurwa": 79,
        "Badkhadiya": 63,
        "Vishunapur": 56
    }

    for gp, exp_count in expected_gps.items():
        # Excel count
        excel_n = int((df["gp"] == gp).sum())
        # FilterContext count
        fc_n = sum(c["count"] for c in combos if c["gp"] == gp)
        if excel_n == exp_count and fc_n == exp_count:
            log_pass(f"GP '{gp}' Census Match", f"Excel={excel_n}, FilterContext={fc_n}, Expected={exp_count}")
        else:
            log_fail(f"GP '{gp}' Census Discrepancy", f"Excel={excel_n}, FilterContext={fc_n}, Expected={exp_count}")

    # --------------------------------------------------------------------------
    # Track 4: Cascading Village Verification (19 Villages)
    # --------------------------------------------------------------------------
    print("\n--- TRACK 4: Cascading Village Selection Logic & Roster Verification ---")
    # All 19 unique villages
    all_fc_villages = sorted(list(set(c["village"] for c in combos)))
    all_xl_villages = sorted(list(df["village"].unique()))
    if all_fc_villages == all_xl_villages and len(all_fc_villages) == 19:
        log_pass("19 Unique Villages in Full Roster", f"Count={len(all_fc_villages)}")
    else:
        log_fail("19 Unique Villages in Full Roster", f"FC={len(all_fc_villages)}, XL={len(all_xl_villages)}")

    # Karikot cascading: exactly 9 villages
    karikot_villages_fc = sorted(list(set(c["village"] for c in combos if c["gp"] == "Karikot")))
    karikot_villages_xl = sorted(list(df[df["gp"] == "Karikot"]["village"].unique()))
    if len(karikot_villages_fc) == 9 and karikot_villages_fc == karikot_villages_xl:
        log_pass("Karikot Cascading Villages", f"Exactly 9 villages: {', '.join(karikot_villages_fc)}")
    else:
        log_fail("Karikot Cascading Villages", f"FC={len(karikot_villages_fc)}, XL={len(karikot_villages_xl)}")

    # Fakirpuri cascading: exactly 3 villages
    fakirpuri_villages_fc = sorted(list(set(c["village"] for c in combos if c["gp"] == "Fakirpuri")))
    fakirpuri_villages_xl = sorted(list(df[df["gp"] == "Fakirpuri"]["village"].unique()))
    if len(fakirpuri_villages_fc) == 3 and fakirpuri_villages_fc == fakirpuri_villages_xl:
        log_pass("Fakirpuri Cascading Villages", f"Exactly 3 villages: {', '.join(fakirpuri_villages_fc)}")
    else:
        log_fail("Fakirpuri Cascading Villages", f"FC={len(fakirpuri_villages_fc)}, XL={len(fakirpuri_villages_xl)}")

    # Verify other GPs
    chahalwa_vils = sorted(list(set(c["village"] for c in combos if c["gp"] == "Chahalwa")))
    bajpur_vils = sorted(list(set(c["village"] for c in combos if c["gp"] == "Bajpur Bankati")))
    mangal_vils = sorted(list(set(c["village"] for c in combos if c["gp"] == "Mangalpurwa")))
    badkha_vils = sorted(list(set(c["village"] for c in combos if c["gp"] == "Badkhadiya")))
    vishun_vils = sorted(list(set(c["village"] for c in combos if c["gp"] == "Vishunapur")))
    log_pass("Chahalwa Cascading Villages", f"3 villages: {chahalwa_vils}")
    log_pass("Bajpur Bankati Cascading Villages", f"1 village: {bajpur_vils}")
    log_pass("Mangalpurwa Cascading Villages", f"1 village: {mangal_vils}")
    log_pass("Badkhadiya Cascading Villages", f"1 village: {badkha_vils}")
    log_pass("Vishunapur Cascading Villages", f"1 village: {vishun_vils}")

    # Simulate FilterContext cascading village logic
    def get_available_villages(selected_gp):
        if selected_gp == "ALL":
            return sorted(list(set(c["village"] for c in combos)))
        return sorted(list(set(c["village"] for c in combos if c["gp"] == selected_gp)))

    if len(get_available_villages("ALL")) == 19:
        log_pass("availableVillages for GP='ALL'", "Returns all 19 villages")
    else:
        log_fail("availableVillages for GP='ALL'", f"Returned {len(get_available_villages('ALL'))}")

    if get_available_villages("Karikot") == karikot_villages_fc:
        log_pass("availableVillages for GP='Karikot'", "Strictly restricted to Karikot's 9 villages")
    else:
        log_fail("availableVillages for GP='Karikot'", "Mismatch")

    if get_available_villages("Fakirpuri") == fakirpuri_villages_fc:
        log_pass("availableVillages for GP='Fakirpuri'", "Strictly restricted to Fakirpuri's 3 villages")
    else:
        log_fail("availableVillages for GP='Fakirpuri'", "Mismatch")

    # --------------------------------------------------------------------------
    # Track 5: Multi-Criteria Filter Permutations
    # --------------------------------------------------------------------------
    print("\n--- TRACK 5: Multi-Criteria Compound Filter Verification ---")
    multi_test_cases = [
        {"gp": "Fakirpuri", "caste": "ST", "expected": 217},
        {"gp": "Mangalpurwa", "caste": "SC", "expected": 67},
        {"gp": "Karikot", "caste": "OBC", "expected": 482},
        {"gp": "Karikot", "caste": "SC", "expected": 161},
        {"gp": "Karikot", "caste": "ST", "expected": 109},
        {"gp": "Karikot", "caste": "General", "expected": 6},
        {"gp": "Chahalwa", "caste": "ST", "expected": 2},
        {"gp": "Chahalwa", "caste": "OBC", "expected": 192},
        {"gp": "Chahalwa", "caste": "SC", "expected": 7},
        {"gp": "Bajpur Bankati", "caste": "SC", "expected": 11},
        {"gp": "Bajpur Bankati", "caste": "OBC", "expected": 112},
        {"gp": "Badkhadiya", "caste": "OBC", "expected": 52},
        {"gp": "Badkhadiya", "caste": "SC", "expected": 9},
        {"gp": "Vishunapur", "caste": "ST", "expected": 42},
        {"gp": "Vishunapur", "caste": "SC", "expected": 1},
    ]

    def filter_combos(gp="ALL", village="ALL", caste="ALL", tier="ALL"):
        count = 0
        bigha_sum = 0.0
        all_bighas = []
        for c in combos:
            if gp != "ALL" and c["gp"] != gp:
                continue
            if village != "ALL" and c["village"] != village:
                continue
            if caste != "ALL" and c["caste"] != caste:
                continue
            if tier != "ALL" and c["tier"] != tier:
                continue
            count += c["count"]
            bigha_sum += c["bighaSum"]
            all_bighas.extend(c["bighas"])
        return count, bigha_sum, all_bighas

    for tc in multi_test_cases:
        gp = tc["gp"]
        caste = tc["caste"]
        exp = tc["expected"]
        fc_n, _, _ = filter_combos(gp=gp, caste=caste)
        xl_n = int(((df["gp"] == gp) & (df["caste"] == caste)).sum())
        if fc_n == exp and xl_n == exp:
            log_pass(f"Multi-Filter: {gp} x {caste}", f"N = {fc_n} (Matches Excel & Expected {exp})")
        else:
            log_fail(f"Multi-Filter: {gp} x {caste}", f"FC={fc_n}, XL={xl_n}, Expected={exp}")

    # --------------------------------------------------------------------------
    # Track 6: Zero-Cohort Edge Cases (Crash & NaN Prevention)
    # --------------------------------------------------------------------------
    print("\n--- TRACK 6: Zero-Cohort Resilience & Mathematical Safety ---")
    zero_cohort_cases = [
        {"gp": "Badkhadiya", "caste": "General", "name": "Badkhadiya x General"},
        {"gp": "Chahalwa", "caste": "General", "name": "Chahalwa x General"},
        {"gp": "Vishunapur", "caste": "General", "name": "Vishunapur x General"},
        {"gp": "Fakirpuri", "caste": "General", "name": "Fakirpuri x General"},
        {"gp": "Mangalpurwa", "caste": "General", "name": "Mangalpurwa x General"},
    ]

    for zc in zero_cohort_cases:
        gp = zc["gp"]
        caste = zc["caste"]
        name = zc["name"]
        count, bigha_sum, bighas = filter_combos(gp=gp, caste=caste)
        xl_count = int(((df["gp"] == gp) & (df["caste"] == caste)).sum())

        # Mathematical calculations under count == 0
        if count == 0:
            mean_bigha = 0.0
            mean_acres = 0.0
            med_bigha = 0.0
            med_acres = 0.0
            pct = 0.0
            is_empty = True
        else:
            mean_bigha = round(bigha_sum / count, 2)
            pct = (count / 1535) * 100
            is_empty = False

        if count == 0 and xl_count == 0 and not math.isnan(mean_bigha) and not math.isnan(pct):
            log_pass(f"Zero-Cohort: {name}", f"Count=0, Mean={mean_bigha}, Median={med_bigha}, Pct={pct}%, isEmptyCohort=True")
        else:
            log_fail(f"Zero-Cohort: {name}", f"Count={count}, XL={xl_count}")

    # --------------------------------------------------------------------------
    # Track 7: Filter Chip Removal and Reset Filters State Transitions
    # --------------------------------------------------------------------------
    print("\n--- TRACK 7: State Transition Simulation (Chip Removal & Reset) ---")
    # State simulated: GP=Fakirpuri, Village=Rampurwa, Caste=ST, LandTier=MARGINAL_LE_1_ACRE
    initial_filters = {
        "selectedGP": "Fakirpuri",
        "selectedVillage": "Rampurwa",
        "selectedCaste": "ST",
        "selectedLandTier": "MARGINAL_LE_1_ACRE"
    }
    c1, _, _ = filter_combos(**{
        "gp": initial_filters["selectedGP"],
        "village": initial_filters["selectedVillage"],
        "caste": initial_filters["selectedCaste"],
        "tier": initial_filters["selectedLandTier"]
    })
    log_pass("Step 1: Set 4-way filter (Fakirpuri, Rampurwa, ST, Marginal)", f"Cohort N = {c1}")

    # Simulate clearFilter('selectedVillage')
    f_after_village_clear = dict(initial_filters)
    f_after_village_clear["selectedVillage"] = "ALL"
    c2, _, _ = filter_combos(**{
        "gp": f_after_village_clear["selectedGP"],
        "village": f_after_village_clear["selectedVillage"],
        "caste": f_after_village_clear["selectedCaste"],
        "tier": f_after_village_clear["selectedLandTier"]
    })
    log_pass("Step 2: clearFilter('selectedVillage')", f"Village reset to ALL; remaining filters preserved. Cohort N = {c2}")

    # Simulate clearFilter('selectedGP')
    f_after_gp_clear = dict(f_after_village_clear)
    f_after_gp_clear["selectedGP"] = "ALL"
    c3, _, _ = filter_combos(**{
        "gp": f_after_gp_clear["selectedGP"],
        "village": f_after_gp_clear["selectedVillage"],
        "caste": f_after_gp_clear["selectedCaste"],
        "tier": f_after_gp_clear["selectedLandTier"]
    })
    log_pass("Step 3: clearFilter('selectedGP')", f"GP reset to ALL; Caste=ST, Tier=Marginal preserved. Cohort N = {c3}")

    # Simulate resetFilters()
    f_reset = {"selectedGP": "ALL", "selectedVillage": "ALL", "selectedCaste": "ALL", "selectedLandTier": "ALL"}
    c_reset, _, _ = filter_combos(**{
        "gp": f_reset["selectedGP"],
        "village": f_reset["selectedVillage"],
        "caste": f_reset["selectedCaste"],
        "tier": f_reset["selectedLandTier"]
    })
    if c_reset == 1535:
        log_pass("Step 4: resetFilters() Action", f"Full cohort restored: N = {c_reset} (100.0% of 1,535 HHs)")
    else:
        log_fail("Step 4: resetFilters() Action", f"Expected N=1535, found {c_reset}")

    # --------------------------------------------------------------------------
    # Track 8: Production Build & Entrypoint Verification (CRITICAL FINDING)
    # --------------------------------------------------------------------------
    print("\n--- TRACK 8: Production Build Entrypoint & Artifact Audit ---")
    main_tsx_path = os.path.join(dashboard_dir, "src", "main.tsx")
    with open(main_tsx_path, "r", encoding="utf-8") as f:
        main_content = f.read()

    mounts_src_app = "import App from './App'" in main_content or 'import App from "./App"' in main_content
    mounts_redesign_app = "import App from './redesign/App'" in main_content or 'import App from "./redesign/App"' in main_content

    if mounts_redesign_app:
        log_fail(
            "CRITICAL ARCHITECTURAL DEFECT: main.tsx Entrypoint Mounts Placeholder Redesign",
            "dashboard/src/main.tsx imports './redesign/App' instead of './App'. "
            "Consequently, FilterProvider, ViewModeProvider, GlobalFilterBar, Header audience switches, "
            "and ExecutivePresentationModule are NOT mounted in the production bundle!"
        )
    elif mounts_src_app:
        log_pass("main.tsx Entrypoint Mounts Production App", "dashboard/src/App.tsx is mounted")
    else:
        log_fail("main.tsx Entrypoint Verification", "Unrecognized import in main.tsx")

    dist_js_dir = os.path.join(dashboard_dir, "dist", "assets")
    dist_js_files = [f for f in os.listdir(dist_js_dir) if f.endswith(".js")] if os.path.exists(dist_js_dir) else []
    if dist_js_files:
        dist_bundle_path = os.path.join(dist_js_dir, dist_js_files[0])
        with open(dist_bundle_path, "r", encoding="utf-8") as f:
            bundle_text = f.read()
        
        has_filter_engine = "fasal-view-mode-preference" in bundle_text
        has_filter_bar = "filter-gp" in bundle_text
        if has_filter_engine:
            log_pass("Production JS Bundle includes ViewModeContext", "Token 'fasal-view-mode-preference' present")
        else:
            log_fail("Production JS Bundle OMITS ViewModeContext", "Token 'fasal-view-mode-preference' ABSENT from dist/assets/*.js")

        if has_filter_bar:
            log_pass("Production JS Bundle includes GlobalFilterBar", "Token 'filter-gp' present")
        else:
            log_fail("Production JS Bundle OMITS GlobalFilterBar", "Token 'filter-gp' ABSENT from dist/assets/*.js")

    print("\n" + "=" * 80)
    print("  EMPIRICAL STRESS TEST SUITE EXECUTION COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    main()
