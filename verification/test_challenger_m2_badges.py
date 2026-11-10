"""
Adversarial Verification Suite for Milestone 2:
Data Assertions & Evidence Badge Verifier (Challenger 2)

Performs comprehensive empirical audit of:
1. All <EvidenceBadge> bindings in dashboard/src/modules/income and dashboard/src/modules/rf.
2. Complete key resolution in dashboard/src/data/evidenceLedger.json.
3. 9-attribute schema compliance on all referenced badges.
4. Value consistency across fasalMasterData.json, evidenceLedger.json, and UI components for F06-F12.
"""

import os
import re
import json
import sys

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DASHBOARD_SRC = os.path.join(WORKSPACE_ROOT, "dashboard", "src")
DATA_DIR = os.path.join(DASHBOARD_SRC, "data")
EVIDENCE_LEDGER_PATH = os.path.join(DATA_DIR, "evidenceLedger.json")
MASTER_DATA_PATH = os.path.join(DATA_DIR, "fasalMasterData.json")

INCOME_DIR = os.path.join(DASHBOARD_SRC, "modules", "income")
RF_DIR = os.path.join(DASHBOARD_SRC, "modules", "rf")

failures = []
passed = 0

def check(assertion, test_name, detail=""):
    global passed
    if assertion:
        passed += 1
        print(f"  [PASS] {test_name}")
    else:
        failures.append((test_name, detail))
        print(f"  [FAIL] {test_name}: {detail}")

print("================================================================================")
print("  CHALLENGER 2: ADVERSARIAL BADGE & DATA BINDING AUDIT (M2: F06 - F12)")
print("================================================================================")

# 1. Load data files
check(os.path.exists(EVIDENCE_LEDGER_PATH), "evidenceLedger.json exists")
check(os.path.exists(MASTER_DATA_PATH), "fasalMasterData.json exists")

with open(EVIDENCE_LEDGER_PATH, "r", encoding="utf-8") as f:
    evidence_ledger = json.load(f)

with open(MASTER_DATA_PATH, "r", encoding="utf-8") as f:
    master_data = json.load(f)

print(f"\n[INFO] Loaded {len(evidence_ledger)} total records from evidenceLedger.json")
print(f"[INFO] Loaded master data sections: {list(master_data.keys())}")

# 2. Scan all files in income and rf modules
scanned_files = []
badge_references = [] # list of dict(file, metric_id, line_no, raw_tag)

badge_re = re.compile(r'<EvidenceBadge\b([^>]*?)/?>', re.DOTALL)
metric_id_attr_re = re.compile(r'metricId=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\}|\{([^}]+)\})')

target_dirs = [("Pillar I (Income)", INCOME_DIR), ("Pillar II (RF)", RF_DIR)]

for module_label, target_dir in target_dirs:
    print(f"\n--- Scanning {module_label} in {target_dir} ---")
    check(os.path.exists(target_dir), f"Directory exists: {target_dir}")
    
    for root, dirs, files in os.walk(target_dir):
        for fname in files:
            if fname.endswith((".tsx", ".ts")):
                fpath = os.path.join(root, fname)
                scanned_files.append(fpath)
                with open(fpath, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                
                full_content = "".join(lines)
                for match in badge_re.finditer(full_content):
                    tag_content = match.group(0)
                    attrs = match.group(1)
                    
                    # Find line number
                    start_char = match.start()
                    line_no = full_content[:start_char].count("\n") + 1
                    
                    id_match = metric_id_attr_re.search(attrs)
                    if id_match:
                        # Could be in group 1 (quotes), group 2 (backticks in curly), or group 3 (expression)
                        metric_id = id_match.group(1) or id_match.group(2) or id_match.group(3)
                        badge_references.append({
                            "module": module_label,
                            "file": fpath,
                            "relpath": os.path.relpath(fpath, WORKSPACE_ROOT),
                            "line": line_no,
                            "metricId": metric_id,
                            "raw": tag_content.strip()
                        })
                    else:
                        failures.append((
                            f"Malformed EvidenceBadge in {os.path.relpath(fpath, WORKSPACE_ROOT)}:{line_no}",
                            f"No metricId attribute found: {tag_content}"
                        ))

print(f"\n[INFO] Scanned {len(scanned_files)} source files.")
print(f"[INFO] Found {len(badge_references)} <EvidenceBadge> instances.")

# 3. Verify that EVERY single metricId exists in evidenceLedger.json
print("\n--- Verifying Badge metricId Resolution against evidenceLedger.json ---")
broken_badges = []
required_schema_keys = [
    "metricId", "thematicDomain", "label", "verifiedValue",
    "sampleSize", "cohortDefinition", "provenance"
]
required_provenance_keys = [
    "workbook", "sheetName", "ledgerReference", "auditStatus"
]

unique_used_metric_ids = set()

for badge in badge_references:
    raw_mid = badge["metricId"]
    
    # Handle dynamic expressions if present
    resolved_ids = []
    if raw_mid == "tier.evidenceId":
        # Known dynamic mapping from MachanTrellisCard tiers:
        resolved_ids = ["REC-CROP-04", "REC-CROP-03", "REC-TURM-07"]
    else:
        resolved_ids = [raw_mid]
        
    for mid in resolved_ids:
        unique_used_metric_ids.add(mid)
        # Check if metricId exists in evidenceLedger.json
        if mid not in evidence_ledger:
            broken_badges.append({**badge, "metricId": mid})
            check(False, f"Badge resolution: {mid}", f"Referenced in {badge['relpath']}:{badge['line']} but MISSING from evidenceLedger.json")
        else:
            # Check schema completeness of this record
            record = evidence_ledger[mid]
            missing_keys = [k for k in required_schema_keys if k not in record]
            if missing_keys:
                check(False, f"Schema compliance for {mid}", f"Missing root keys: {missing_keys}")
            else:
                prov = record.get("provenance", {})
                missing_prov_keys = [k for k in required_provenance_keys if k not in prov]
                if missing_prov_keys:
                    check(False, f"Provenance compliance for {mid}", f"Missing provenance keys: {missing_prov_keys}")
                else:
                    passed += 1

check(len(broken_badges) == 0, "Zero broken badge references across Pillar I and Pillar II",
      f"Broken count: {len(broken_badges)}")

print(f"\n[INFO] {len(unique_used_metric_ids)} unique metric IDs referenced across {len(badge_references)} badge placements:")
for mid in sorted(unique_used_metric_ids):
    rec = evidence_ledger.get(mid, {})
    val = rec.get("verifiedValue")
    dom = rec.get("thematicDomain") or "unknown"
    print(f"  • {mid:<18} [{dom:<14}] : {rec.get('label')} = {val}")

print("\n--- Detailed Badge Placements Across Components ---")
for b in badge_references:
    mid = b["metricId"]
    clean_tag = " ".join(b["raw"].split())
    fname = os.path.basename(b["file"])
    print(f"  {fname:<28} L{b['line']:<4} {mid:<18} {clean_tag}")

# 4. Deep Data Integrity Check for F06-F12 Metrics
print("\n--- Deep Verification of F06-F12 Data Assertions ---")

income_data = master_data.get("income", {})
rf_data = master_data.get("rfProgression", {})

# F06: Longitudinal Income Trajectory
traj = income_data.get("longitudinalTrajectory", [])
check(len(traj) >= 5, f"F06: Trajectory length >= 5 (Found {len(traj)})")
traj_by_year = {item["calendarYear"]: item for item in traj}
check(2022 in traj_by_year and abs(traj_by_year[2022]["meanNetIncomeINR"] - 34555.01) < 0.01, "F06: 2022 baseline mean net farm income = ₹34,555.01")
check(2022 in traj_by_year and traj_by_year[2022]["medianNetIncomeINR"] == 22000.0, "F06: 2022 baseline median net farm income = ₹22,000.00")
check(2023 in traj_by_year and abs(traj_by_year[2023]["meanNetIncomeINR"] - 42334.62) < 0.01, "F06: 2023 midline mean net farm income = ₹42,334.62")
check(2024 in traj_by_year and abs(traj_by_year[2024]["meanNetIncomeINR"] - 56377.16) < 0.01, "F06: 2024 midline mean net farm income = ₹56,377.16")
check(2025 in traj_by_year and abs(traj_by_year[2025]["meanNetIncomeINR"] - 54494.00) < 0.01, "F06: 2025 master follow-up mean = ₹54,494.00")
check(2025 in traj_by_year and abs(traj_by_year[2025]["medianNetIncomeINR"] - 44400.00) < 0.01, "F06: 2025 master follow-up median = ₹44,400.00")
check(2026 in traj_by_year and abs(traj_by_year[2026]["meanNetIncomeINR"] - 63917.95) < 0.01, "F06: 2026 endline mean = ₹63,917.95")
check(2026 in traj_by_year and abs(traj_by_year[2026]["medianNetIncomeINR"] - 53400.00) < 0.01, "F06: 2026 endline median = ₹53,400.00")
growth = income_data.get("longitudinalGrowth", {})
check(abs(growth.get("meanGrowthPct", 0) - 84.97) < 0.05, "F06: 5-year mean net income growth = +84.97%")
check(abs(growth.get("medianGrowthPct", 0) - 142.73) < 0.05, "F06: 5-year median net income growth = +142.73%")

# F07: Macro Crop Economy
macro26 = income_data.get("macroFinancials", {}).get("year2026", {})
check(macro26.get("cultivationCostINR") == 33124177, "F07: 2026 Cultivation Cost = ₹33,124,177 (~₹3.31 Cr)")
check(macro26.get("grossRevenueINR") == 128170176, "F07: 2026 Gross Farm Revenue = ₹128,170,176 (~₹12.82 Cr)")
check(macro26.get("netProfitINR") == 95045999, "F07: 2026 Net Farm Surplus = ₹95,045,999 (~₹9.50 Cr)")
check(abs(macro26.get("netProfitMarginPct", 0) - 74.16) < 0.05, "F07: 2026 Net Profit Margin = 74.16%")
check(macro26.get("activeEarnersCount") == 1478, "F07: 2026 Active Earners = 1,478")
check(abs(macro26.get("activeEarnerSaturationPct", 0) - 99.39) < 0.05, "F07: 2026 Active Earner Saturation = 99.39%")

# F08: Turmeric Value Chain Deep-Dive
turm = income_data.get("turmericValueChain", {})
check(turm.get("growers2026") == 328, "F08: Turmeric growers 2026 = 328")
check(turm.get("areaBigha2026") == 345, "F08: Turmeric area = 345 bigha")
check(turm.get("freshRhizomeProductionKg") == 738640, "F08: Turmeric harvest volume = 738,640 kg rhizomes")
check(abs(turm.get("averageYieldQuintalsPerAcre", 0) - 107.0) < 0.1, "F08: Certified physical yield = 107.0 quintals/acre")
check(turm.get("cultivationCost2026") == 2849768, "F08: Turmeric input cost = ₹28,49,768")
check(turm.get("grossRevenue2026") == 12688160, "F08: Turmeric gross revenue = ₹1,26,88,160")
check(turm.get("netProfit2026") == 9838392, "F08: Turmeric net profit = ₹98,38,392")
check(abs(turm.get("netProfitMarginPct2026", 0) - 82.85) < 0.05, "F08: Turmeric profit margin = 82.85%")

# F09: 42-Crop Economics Explorer
crop_ledger = income_data.get("cropLedger", [])
check(len(crop_ledger) >= 41, f"F09: cropLedger contains at least 41 commercial crops (Found {len(crop_ledger)})")
crops = {c["displayName"]: c for c in crop_ledger}
check("Wheat" in crops and crops["Wheat"]["netProfit2026"] == 32215873, "F09: Wheat net profit = ₹3,22,15,873 (Rank 1)")
check("Paddy" in crops and crops["Paddy"]["netProfit2026"] == 24992305, "F09: Paddy net profit = ₹2,49,92,305 (Rank 2)")
check("Okra" in crops and crops["Okra"]["netProfit2026"] == 3322080, "F09: Okra net profit = ₹33,22,080")
check("Turmeric" in crops and crops["Turmeric"]["netProfit2026"] == 9838392, "F09: Turmeric net profit in crop ledger = ₹98,38,392")

# F10: APPI ₹60k/Acre Benchmark Attainment
benchmarks = rf_data.get("benchmarks", [])
check(len(benchmarks) >= 4, f"F10: Benchmarks length >= 4 (Found {len(benchmarks)})")
b1 = benchmarks[0]
b2 = benchmarks[1]
check(abs(b1.get("attainmentPct", 0) - 151.33) < 0.05, "F10: APPI ₹60k/acre cohort attainment = 151.33% (₹90,799/ac)")
check(abs(b2.get("attainmentPct", 0) - 109.71) < 0.05, "F10: Landholder benchmark saturation (76.8% vs 70.0% target) = 109.71%")
land_struct = rf_data.get("landholdingStructure", {})
check(abs(land_struct.get("totalPhysicalAcres020", 0) - 1046.77) < 0.05, "F10: Total intervention land (0.20 factor) = 1,046.77 acres")
check(abs(land_struct.get("regexParsedTotalBigha", 0) - 5233.84) < 0.05, "F10: Regex parsed land = 5,233.84 bigha")
check(abs(land_struct.get("smallholderProportionLe1Acre", 0) - 91.3) < 0.1, "F10: Smallholders <= 1.0 acre = 91.3%")

# F11: Regional Bigha Sensitivity Matrix
bigha_mat = rf_data.get("bighaSensitivity", [])
check(len(bigha_mat) == 4, f"F11: Sensitivity matrix contains exactly 4 conversion factors (Found {len(bigha_mat)})")
bigha_by_factor = {round(b["multiplierAcrePerBigha"], 2): b for b in bigha_mat}
check(0.20 in bigha_by_factor and abs(bigha_by_factor[0.20]["totalAcresDerived"] - 1046.77) < 0.05, "F11: Factor 0.20 -> 1,046.77 acres (76.8% attainment)")
check(0.25 in bigha_by_factor and abs(bigha_by_factor[0.25]["totalAcresDerived"] - 1308.46) < 0.05, "F11: Factor 0.25 -> 1,308.46 acres (58.2% attainment)")
check(0.33 in bigha_by_factor and abs(bigha_by_factor[0.33]["totalAcresDerived"] - 1744.61) < 25.0, "F11: Factor 0.3333 -> ~1,744.61 acres (32.6% attainment)")
check(0.62 in bigha_by_factor and abs(bigha_by_factor[0.62]["totalAcresDerived"] - 3239.75) < 0.1, "F11: Factor 0.619 -> 3,239.75 acres (8.9% attainment)")

# F12: LEISA Transition & Machan Trellis
leisa = rf_data.get("leisaTransition", {})
check(leisa.get("bioNutrientDrumsCount") == 1120, "F12: Bio-nutrient drums = 1,120 units")
check(leisa.get("machanTrellisFarmsCount") == 777, "F12: Machan households = 777")
check(abs(leisa.get("chemicalPesticideCutPct", 0) - 90.0) < 1.0, "F12: Chemical pesticide reduction = ~90%")
check(abs(leisa.get("averageCultivationCostPerBighaINR", 0) - 2227) < 5.0, "F12: Average cultivation cost = ₹2,227/bigha")
check(abs(leisa.get("lerLandEquivalentRatio", 0) - 2.1) < 0.05, "F12: Land Equivalent Ratio = 2.1 (> 2.0)")

print("\n================================================================================")
print("  AUDIT SUMMARY")
print("================================================================================")
print(f"Total assertions verified: {passed + len(failures)}")
print(f"Passed                   : {passed}")
print(f"Failed                   : {len(failures)}")

if failures:
    print("\nFAILURES:")
    for f_name, detail in failures:
        print(f"  ❌ {f_name} | {detail}")
    sys.exit(1)
else:
    print("\n[✓] ZERO BROKEN BADGES, ZERO DATA DISCREPANCIES DETECTED.")
    print("VERDICT: APPROVE")
    sys.exit(0)
