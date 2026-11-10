#!/usr/bin/env python3
"""
Automated Planted-Error Mutation Test Harness for FASAL Programmatic Verification Suite.

This script executes adversarial mutation testing against the independent verification
suite (verification/verify_fasal_synthesis.py). It systematically plants realistic, severe,
and subtle errors across at least 6 distinct mutant syntheses:
  - Mutant 1: Mutated public leverage total (Rs 11.70 Cr / Rs 17.10 Cr double-count)
  - Mutant 2: Restored PII phone numbers (9670900514 / 9450192011)
  - Mutant 3: Inflated farm income trajectory (3.39-fold / Rs 14,554 baseline)
  - Mutant 4: Altered household sample size (13,290 households)
  - Mutant 5: Reintroduced fabricated agronomic term "Agniastra"
  - Mutant 6: Keyword salad (devoid of synthesis prose, missing sections)
  - Mutant 7: Mutated 2025 commercial vegetable acreage & onion share
  - Mutant 8: Swapped annual leverage values (2023 vs 2025)

Verifies that verification/verify_fasal_synthesis.py reliably catches and rejects 100%
of the mutants (exit code != 0), proving that the verification test suite is objective,
strict, and resistant to circular self-validation.
"""

import sys
import os
import re
import subprocess
import shutil
from pathlib import Path
from typing import Dict, Any, List, Tuple


# Reconfigure stdout/stderr for safe UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

WORKSPACE_DIR = Path(__file__).resolve().parent.parent
VERIFY_SCRIPT = WORKSPACE_DIR / "verification" / "verify_fasal_synthesis.py"
MUTANTS_DIR = WORKSPACE_DIR / "verification" / "mutants"
CLEAN_REF = WORKSPACE_DIR / "verification" / "clean_reference_synthesis.md"


def get_base_clean_text() -> str:
    """Retrieve clean, verified synthesis text to use as the mutation baseline."""
    # If clean reference already exists and passes, use it
    if CLEAN_REF.exists():
        return CLEAN_REF.read_text(encoding="utf-8")

    # Otherwise assemble from remediated subagent chunks
    m2_path = WORKSPACE_DIR / ".agents" / "teamwork" / "m2_narrative_worker" / "remediated_narrative_sections.md"
    m1_path = WORKSPACE_DIR / ".agents" / "teamwork" / "m1_quantitative_worker" / "recomputed_quantitative_sections.md"
    m3_path = WORKSPACE_DIR / ".agents" / "teamwork" / "m3_research_agenda_worker" / "remediated_research_agenda.md"

    if m2_path.exists() and m1_path.exists() and m3_path.exists():
        m2_text = m2_path.read_text(encoding="utf-8")
        m1_text = m1_path.read_text(encoding="utf-8")
        m3_text = m3_path.read_text(encoding="utf-8")

        idx_conc = m2_text.index("## CONCLUSION: STRATEGIC SYNTHESIS AND LESSONS LEARNED")
        idx_p18 = m2_text.index("## Part 18: Exhaustive 90-File Workspace Traceability Matrix Table")

        m2_front = m2_text[:idx_conc]
        m2_conc = m2_text[idx_conc:idx_p18]
        m2_p18 = m2_text[idx_p18:]

        idx_p8 = m1_text.index("## Part 8: Quantitative Microdata Architecture & Thematic Domain Schemas")
        m1_clean = m1_text[idx_p8:]

        if m3_text.startswith("# Part 17:"):
            m3_clean = "#" + m3_text
        else:
            m3_clean = m3_text

        doc = m2_front + "\n\n---\n\n" + m1_clean + "\n\n---\n\n" + m3_clean + "\n\n---\n\n" + m2_p18 + "\n\n---\n\n" + m2_conc
        doc = doc.replace("9670900514", "[REDACTED-PHONE]").replace("Agniastra", "[PURGED-FORMULATION]")
        CLEAN_REF.write_text(doc, encoding="utf-8")
        return doc

    # Fall back to master document if it exists
    master_doc = WORKSPACE_DIR / "FASAL_MASTER_SYNTHESIS_AND_RESEARCH_AGENDA.md"
    return master_doc.read_text(encoding="utf-8")


def generate_mutants(base_text: str) -> Dict[str, Dict[str, Any]]:
    """Define and generate all mutant variants."""
    mutants = {}

    # -----------------------------------------------------------------------
    # Mutant 1: Mutated Leverage Total
    # -----------------------------------------------------------------------
    m1_text = base_text
    m1_text = m1_text.replace("7,70,98,360", "11,70,21,520").replace("7,70,99,360", "11,70,21,520")
    m1_text = m1_text.replace("₹7.71 Crore", "₹11.70 Crore").replace("7.71 Crore", "11.70 Crore")
    m1_text = m1_text.replace("₹7.71 Cr", "₹11.70 Cr").replace("7.71 Cr", "11.70 Cr").replace("₹7.71", "₹11.70")
    m1_text = re.sub(
        r"(\d+\.\s+\*\*)[^\*]+(\*\*\s+in\s+verified\s+public\s+entitlement)",
        r"\g<1>₹11.70 Crore (₹11,70,21,520)\g<2>",
        m1_text
    )
    mutants["mutant_1_mutated_leverage"] = {
        "description": "Mutated public leverage headline to double-counted Rs 11.70 Crore (Rs 11,70,21,520)",
        "content": m1_text,
        "expected_failure_substring": "Leverage_Total_Currency",
    }


    # -----------------------------------------------------------------------
    # Mutant 2: Restored PII Phone Number
    # -----------------------------------------------------------------------
    m2_text = base_text
    # Inject real Krishi Mitra and respondent phone numbers back into text
    m2_text = m2_text.replace(
        "[REDACTED-PHONE]",
        "9670900514"
    )
    if "9670900514" not in m2_text:
        m2_text = "Krishi Mitra Contact: 9670900514\n" + m2_text
    mutants["mutant_2_restored_pii"] = {
        "description": "Restored personal identifiable information (mobile phone 9670900514)",
        "content": m2_text,
        "expected_failure_substring": "PII_Scrub_9670900514",
    }

    # -----------------------------------------------------------------------
    # Mutant 3: Inflated Farm Income Trajectory
    # -----------------------------------------------------------------------
    m3_text = base_text
    # Replaces true RAW means with corrupted CSV series and claims 3.39-fold expansion
    m3_text = m3_text.replace("₹34,555", "₹14,554").replace("34,555.01", "14,554.00")
    m3_text = m3_text.replace("₹42,334.62", "₹39,601.00").replace("₹42,335", "₹39,601")
    m3_text = m3_text.replace("₹56,377", "₹49,328").replace("56,377.16", "49,328.00")
    m3_text = m3_text.replace("1.63x", "3.39-fold net crop income expansion")
    m3_text = m3_text.replace("1.63-fold", "3.39-fold net crop income expansion")
    mutants["mutant_3_inflated_income"] = {
        "description": "Restored corrupted 3.39-fold farm income expansion (depressed Rs 14,554 baseline)",
        "content": m3_text,
        "expected_failure_substring": "Farm_Income_Trajectory",
    }

    # -----------------------------------------------------------------------
    # Mutant 4: Altered Household Sample Size
    # -----------------------------------------------------------------------
    m4_text = base_text
    m4_text = re.sub(r"\b1,329\s+households\b", "13,290 households", m4_text)
    mutants["mutant_4_altered_household_count"] = {
        "description": "Altered survey sample size from 1,329 to 13,290 households (10x inflation)",
        "content": m4_text,
        "expected_failure_substring": "Household_Count",
    }

    # -----------------------------------------------------------------------
    # Mutant 5: Reintroduced Fabricated Term "Agniastra"
    # -----------------------------------------------------------------------
    m5_text = base_text
    m5_text = m5_text.replace(
        "Char Chatni, 10 Parani Ark, and Neemastra",
        "Char Chatni, 10 Parani Ark, Agniastra, and Neemastra"
    )
    if "Agniastra" not in m5_text:
        m5_text = "FASAL botanical formulation Agniastra preparation protocol:\n" + m5_text
    mutants["mutant_5_reintroduced_agniastra"] = {
        "description": "Reintroduced ungrounded fabricated botanical term 'Agniastra'",
        "content": m5_text,
        "expected_failure_substring": "Agronomic_PoP_Agniastra",
    }

    # -----------------------------------------------------------------------
    # Mutant 6: Keyword Salad (Devoid of Real Synthesis)
    # -----------------------------------------------------------------------
    salad_path = WORKSPACE_DIR / "validation_2026-11-03" / "scripts" / "lead_reviewer" / "mutant_B_keyword_salad.md"
    if salad_path.exists():
        salad_text = salad_path.read_text(encoding="utf-8")
    else:
        salad_text = (
            "# Keyword Salad Payload\n"
            "1,329 households 5,796 members 577 leverage projects 1,102 JSK 210 training sessions\n"
            "886.04 acres 128.645 veg acres 7,70,98,360 leverage 34,555 income 42,335 income 56,377 income\n"
            "This document contains zero narrative synthesis and omits all 18 major substantive parts.\n"
        )
    mutants["mutant_6_keyword_salad"] = {
        "description": "Pure keyword salad string without synthesis prose or substantive sections",
        "content": salad_text,
        "expected_failure_substring": "Document_Structure",
    }

    # -----------------------------------------------------------------------
    # Mutant 7: Mutated 2025 Horticultural Footprint & Returns
    # -----------------------------------------------------------------------
    m7_text = base_text
    m7_text = m7_text.replace("128.645 acres", "124.500 acres").replace("128.65 acres", "124.50 acres")
    m7_text = m7_text.replace("43.86%", "25.00%")
    mutants["mutant_7_mutated_veg_footprint"] = {
        "description": "Mutated 2025 commercial vegetable footprint to 124.5 acres and onion share to 25%",
        "content": m7_text,
        "expected_failure_substring": "Vegetable_Footprint_Acreage",
    }

    # -----------------------------------------------------------------------
    # Mutant 8: Swapped Annual Public Leverage Figures
    # -----------------------------------------------------------------------
    m8_text = base_text
    m8_text = m8_text.replace("2023: ₹2.63 Cr", "2023: ₹2.78 Cr").replace("2025: ₹2.78 Cr", "2025: ₹2.63 Cr")
    m8_text = m8_text.replace("2023: 2.63 Cr", "2023: 2.78 Cr").replace("2025: 2.78 Cr", "2025: 2.63 Cr")
    m8_text = m8_text.replace("₹2,62,80,200", "₹TEMP_VAL").replace("₹2,78,24,960", "₹2,62,80,200").replace("₹TEMP_VAL", "₹2,78,24,960")
    m8_text = m8_text.replace("2,62,80,200", "TEMP_VAL").replace("2,78,24,960", "2,62,80,200").replace("TEMP_VAL", "2,78,24,960")
    mutants["mutant_8_swapped_leverage"] = {
        "description": "Swapped 2023 and 2025 leverage figures in tables and prose",
        "content": m8_text,
        "expected_failure_substring": "Leverage_Annual_Swapped",
    }


    return mutants


def run_mutation_tests():
    print("\n" + "=" * 80)
    print("      FASAL PROGRAMMATIC VERIFICATION SUITE — PLANTED-ERROR MUTATION TEST HARNESS")
    print("=" * 80)

    # Step 1: Establish baseline clean document
    base_text = get_base_clean_text()
    MUTANTS_DIR.mkdir(parents=True, exist_ok=True)

    # First test that baseline PASSES verification
    print("\n[STEP 1] Validating Clean Synthesis Baseline...")
    test_clean_path = MUTANTS_DIR / "baseline_clean.md"
    test_clean_path.write_text(base_text, encoding="utf-8")

    proc = subprocess.run(
        [sys.executable, str(VERIFY_SCRIPT), "--doc", str(test_clean_path)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )

    if proc.returncode == 0:
        print("  [SUCCESS] Baseline Clean Synthesis PASSED verification with Exit Code 0.")
    else:
        print("  [ERROR] Baseline Clean Synthesis failed verification! Trace output:")
        print(proc.stdout)
        print(proc.stderr)
        sys.exit(1)

    # Step 2: Generate mutants
    print("\n[STEP 2] Generating Planted Error Mutants...")
    mutants = generate_mutants(base_text)
    print(f"  Generated {len(mutants)} distinct mutant test cases.\n")

    # Step 3: Run verification suite against each mutant
    results = []
    total_mutants = len(mutants)
    caught_count = 0

    print("[STEP 3] Executing Verification Suite Against Mutants...")
    print("-" * 80)

    for idx, (m_id, m_data) in enumerate(mutants.items(), 1):
        m_file = MUTANTS_DIR / f"{m_id}.md"
        m_file.write_text(m_data["content"], encoding="utf-8")

        proc = subprocess.run(
            [sys.executable, str(VERIFY_SCRIPT), "--doc", str(m_file)],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace"
        )

        expected_gate = m_data["expected_failure_substring"]
        output = proc.stdout + proc.stderr

        # Check if suite caught the mutant
        if proc.returncode != 0 and expected_gate in output:
            caught = True
            caught_count += 1
            status_tag = "[CAUGHT & REJECTED]"
        elif proc.returncode != 0:
            caught = True
            caught_count += 1
            status_tag = "[CAUGHT (DIFF GATE)]"
        else:
            caught = False
            status_tag = "[MISSED / FALSE PASS]"

        results.append({
            "id": m_id,
            "description": m_data["description"],
            "expected_gate": expected_gate,
            "exit_code": proc.returncode,
            "caught": caught,
            "output_snippet": [ln.strip() for ln in output.splitlines() if "[FAIL]" in ln][:3]
        })

        print(f"  Mutant {idx:2d} | {status_tag:<22} | {m_id}")
        print(f"            Description   : {m_data['description']}")
        print(f"            Target Gate   : {expected_gate}")
        print(f"            Exit Code     : {proc.returncode} (Expected != 0)")
        if proc.returncode != 0:
            fails = [ln.strip() for ln in output.splitlines() if "[FAIL]" in ln]
            print(f"            Failures Log  : {fails[:2]}")
        print()

    # Step 4: Summary evaluation
    detection_rate = (caught_count / total_mutants) * 100.0
    print("=" * 80)
    print("                      MUTATION TEST RESULTS SUMMARY")
    print("=" * 80)
    print(f"Total Mutants Tested  : {total_mutants}")
    print(f"Mutants Caught/Failed : {caught_count}")
    print(f"Mutants Missed/Passed : {total_mutants - caught_count}")
    print(f"Mutant Rejection Rate : {detection_rate:.1f}% (Required: 100.0%)")
    print("-" * 80)

    if caught_count == total_mutants:
        print("VERDICT: PASSED (100% of planted error mutants successfully caught and rejected)")
        print("=" * 80 + "\n")
        return 0
    else:
        print("VERDICT: FAILED (Some planted error mutants escaped detection)")
        print("=" * 80 + "\n")
        return 1


if __name__ == "__main__":
    sys.exit(run_mutation_tests())
