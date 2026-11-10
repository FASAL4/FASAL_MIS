#!/usr/bin/env python3
"""
Adversarial Challenge & Novel Mutant Attack Harness.
Author: Mutation & Adversarial Challenger (Challenger 2)

This harness executes 8 novel adversarial mutant attacks against
verification/verify_fasal_synthesis.py to test both its rejection power
and its boundary vulnerabilities:

Caught & Rejected Attack Vectors:
1. Novel Mutant 1 (Subtle Currency Perturbation): 2024 leverage mutated to Rs 2.35 Cr / Rs 2,35,00,000.
2. Novel Mutant 2B (Completely Dropped Section): Part 17 stripped from TOC, crosswalk, and document body.
3. Novel Mutant 3 (Subtle Acreage Perturbation): Farmland acreage mutated from 886.04 to 886.50 acres.
4. Novel Mutant 6 (Subtle Percentage Perturbation): Commercial onion income share mutated from 43.86% to 43.50%.

Surfaced Boundary Vulnerabilities (Escaped / False Passes):
5. Novel Mutant 2A (TOC Shadowing Bypass): Dropped body of Part 17, but TOC entry 'Part 17:' shadowed the check.
6. Novel Mutant 4A (Hyphenated PII Bypass): Injected '96709-00514' bypassed literal string search count("9670900514").
7. Novel Mutant 4B (Spaced PII Bypass): Injected '96709 00514' bypassed literal string search.
8. Novel Mutant 5 (Disjunctive Table Corruption Bypass): Corrupted table to Rs 5 Cr, but '2.63 Cr' in prose satisfied gate.
"""

import sys
import os
import re
import subprocess
from pathlib import Path

# Safe Unicode output
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

WORKSPACE_DIR = Path(__file__).resolve().parent.parent
VERIFY_SCRIPT = WORKSPACE_DIR / "verification" / "verify_fasal_synthesis.py"
CLEAN_DOC = WORKSPACE_DIR / "FASAL_MASTER_SYNTHESIS_AND_RESEARCH_AGENDA.md"
MUTANTS_DIR = WORKSPACE_DIR / "verification" / "mutants"

def run_challenge():
    print("=" * 80)
    print("  ADVERSARIAL MUTANT ATTACK HARNESS — EMPIRICAL ROBUSTNESS TESTING")
    print("=" * 80)

    if not CLEAN_DOC.exists():
        print(f"[FATAL] Clean document not found at {CLEAN_DOC}")
        sys.exit(1)

    base_text = CLEAN_DOC.read_text(encoding="utf-8")
    MUTANTS_DIR.mkdir(parents=True, exist_ok=True)

    attacks = []

    # 1. Subtle Currency Perturbation
    m1_text = base_text
    m1_text = m1_text.replace("2,29,93,200", "2,35,00,000")
    m1_text = m1_text.replace("₹2.30 Cr", "₹2.35 Cr").replace("2.30 Cr", "2.35 Cr")
    attacks.append({
        "id": "novel_mutant_1_subtle_currency",
        "name": "Novel Mutant 1: Subtle Currency Perturbation (2024 Leverage -> Rs 2.35 Cr)",
        "content": m1_text,
        "target_gate": "Leverage_2024_Currency",
        "description": "Mutates 2024 public leverage from Rs 2,29,93,200 (~Rs 2.30 Cr) to Rs 2,35,00,000 (~Rs 2.35 Cr) across all text and tables."
    })

    # 2. Dropped Section with TOC Shadowing (Vulnerability Test)
    m2a_text = base_text
    p17_idx = m2a_text.find("## Part 17:")
    if p17_idx == -1:
        p17_idx = m2a_text.find("# Part 17:")
    p18_idx = m2a_text.find("## Part 18:")
    if p18_idx == -1:
        p18_idx = m2a_text.find("# Part 18:")
    if p17_idx != -1 and p18_idx != -1:
        m2a_text = m2a_text[:p17_idx] + m2a_text[p18_idx:]
    attacks.append({
        "id": "novel_mutant_2a_toc_shadowing",
        "name": "Novel Mutant 2A: Dropped Body with TOC Shadowing (Boundary Vulnerability)",
        "content": m2a_text,
        "target_gate": "Document_Structure",
        "description": "Drops Part 17 body (~60,000 chars) while leaving TOC entry intact to test if naive 'in text' check gets shadowed."
    })

    # 3. Completely Dropped Section (Removed from TOC and Body)
    m2b_text = base_text
    m2b_text = m2b_text.replace("Part 17:", "Section 17 [PURGED]:")
    attacks.append({
        "id": "novel_mutant_2b_completely_dropped_section",
        "name": "Novel Mutant 2B: Completely Dropped Section (Part 17 stripped from TOC and Body)",
        "content": m2b_text,
        "target_gate": "Document_Structure",
        "description": "Purges all occurrences of 'Part 17:' from TOC, section headers, and crosswalk."
    })

    # 4. Subtle Farmland Acreage Mutation
    m3_text = base_text
    m3_text = m3_text.replace("886.04 acres", "886.50 acres").replace("886.04", "886.50")
    attacks.append({
        "id": "novel_mutant_3_farmland_acreage",
        "name": "Novel Mutant 3: Subtle Farmland Acreage Mutation (886.04 -> 886.50 acres)",
        "content": m3_text,
        "target_gate": "Farmland_Acreage",
        "description": "Mutates verified aggregate farmland from 886.04 acres to 886.50 acres (+0.46 ac perturbation)."
    })

    # 5. Adversarial PII Formatting Attack (Dashes)
    m4a_text = "Krishi Mitra Emergency Contact: 96709-00514 (DEHAT Project Representative)\n\n" + base_text
    attacks.append({
        "id": "novel_mutant_4a_hyphenated_pii",
        "name": "Novel Mutant 4A: Adversarial Hyphenated PII Attack (96709-00514)",
        "content": m4a_text,
        "target_gate": "PII_Scrub_9670900514",
        "description": "Injects real Krishi Mitra PII phone formatted with hyphens (96709-00514) to test literal string search robustness."
    })

    # 6. Adversarial PII Formatting Attack (Spaces)
    m4b_text = "Krishi Mitra Emergency Contact: 96709 00514 (DEHAT Project Representative)\n\n" + base_text
    attacks.append({
        "id": "novel_mutant_4b_spaced_pii",
        "name": "Novel Mutant 4B: Adversarial Spaced PII Attack (96709 00514)",
        "content": m4b_text,
        "target_gate": "PII_Scrub_9670900514",
        "description": "Injects real Krishi Mitra PII phone formatted with spaces (96709 00514) to test literal string search robustness."
    })

    # 7. Disjunctive Shortcut Attack
    m5_text = base_text.replace("2,62,80,200", "5,00,00,000")
    attacks.append({
        "id": "novel_mutant_5_table_corruption",
        "name": "Novel Mutant 5: Disjunctive Shortcut Attack (Table Corrupted -> 5 Cr, Headline Preserved -> 2.63 Cr)",
        "content": m5_text,
        "target_gate": "Leverage_2023_Currency",
        "description": "Mutates exact register table value from Rs 2,62,80,200 to Rs 5,00,00,000 while leaving '2.63 Cr' headline untouched in narrative."
    })

    # 8. Subtle Percentage Perturbation (Onion Share)
    m6_text = base_text
    m6_text = m6_text.replace("43.86%", "43.50%").replace("43.9%", "43.5%").replace("43.86", "43.50")
    attacks.append({
        "id": "novel_mutant_6_subtle_onion_share",
        "name": "Novel Mutant 6: Subtle Onion Share Perturbation (43.86% -> 43.50%)",
        "content": m6_text,
        "target_gate": "Onion_Income_Share",
        "description": "Mutates commercial onion net income share from 43.86% to 43.50% (-0.36 pp shift)."
    })

    # Execute all attacks
    results = []
    for att in attacks:
        mutant_path = MUTANTS_DIR / f"{att['id']}.md"
        mutant_path.write_text(att["content"], encoding="utf-8")

        proc = subprocess.run(
            [sys.executable, str(VERIFY_SCRIPT), "--doc", str(mutant_path)],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace"
        )

        caught = (proc.returncode != 0)
        failures = [line.strip() for line in proc.stdout.splitlines() if "[FAIL]" in line]

        results.append({
            "id": att["id"],
            "name": att["name"],
            "caught": caught,
            "exit_code": proc.returncode,
            "target_gate": att["target_gate"],
            "failures": failures,
            "description": att["description"]
        })

    print("\n" + "=" * 80)
    print("                     NOVEL ATTACK RESULTS MATRIX")
    print("=" * 80)

    for r in results:
        status_str = "[CAUGHT & REJECTED]" if r["caught"] else "[ESCAPED / PASSED]"
        print(f"Attack ID     : {r['id']}")
        print(f"Name          : {r['name']}")
        print(f"Status        : {status_str} (Exit Code: {r['exit_code']})")
        print(f"Target Gate   : {r['target_gate']}")
        print(f"Failures Log  : {r['failures']}")
        print(f"Description   : {r['description']}")
        print("-" * 80)

    caught_count = sum(1 for r in results if r["caught"])
    escaped_count = len(results) - caught_count
    print(f"\nSummary: {caught_count}/{len(results)} rejected ({caught_count/len(results)*100:.1f}%). {escaped_count} escaped due to boundary blind spots.")
    return results

if __name__ == "__main__":
    run_challenge()
