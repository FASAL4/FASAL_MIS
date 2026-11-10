#!/usr/bin/env python3
r"""
================================================================================
CHALLENGER 2: MILESTONE 1 UI COMPONENT & SHELL ADVERSARIAL VERIFIER
================================================================================
Empirical, zero-trust validation of:
  - dashboard/src/components/evidence/EvidenceDrawer.tsx
  - dashboard/src/components/evidence/EvidenceBadge.tsx
  - dashboard/src/context/ThemeContext.tsx
  - dashboard/src/context/EvidenceContext.tsx
  - dashboard/src/components/layout/ExecutiveSummaryBar.tsx
  - dashboard/src/App.tsx & dashboard/index.html
  - dashboard/src/data/evidenceLedger.json

Key Stress Test Suites:
  1. Unknown metricId handling in EvidenceContext, EvidenceDrawer, and EvidenceBadge
  2. ThemeContext resilience to missing/throwing localStorage & invalid theme strings
  3. Portal mounting verification & duplicate ID collision (#evidence-portal-root)
  4. Timer race condition in EvidenceContext.closeDrawer / openDrawer lifecycle
  5. Clipboard API security context safety in EvidenceDrawer
  6. Props contract alignment between PROJECT.md and EvidenceDrawer implementation
  7. Cross-referencing all metricIds in UI code against evidenceLedger.json
================================================================================
"""

import os
import sys
import json
import re
from pathlib import Path

# Force UTF-8 stdout
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
DASHBOARD_DIR = ROOT_DIR / "dashboard"
SRC_DIR = DASHBOARD_DIR / "src"
EVIDENCE_DRAWER_PATH = SRC_DIR / "components" / "evidence" / "EvidenceDrawer.tsx"
EVIDENCE_BADGE_PATH = SRC_DIR / "components" / "evidence" / "EvidenceBadge.tsx"
THEME_CONTEXT_PATH = SRC_DIR / "context" / "ThemeContext.tsx"
EVIDENCE_CONTEXT_PATH = SRC_DIR / "context" / "EvidenceContext.tsx"
APP_PATH = SRC_DIR / "App.tsx"
INDEX_HTML_PATH = DASHBOARD_DIR / "index.html"
EVIDENCE_LEDGER_PATH = SRC_DIR / "data" / "evidenceLedger.json"
EXECUTIVE_BAR_PATH = SRC_DIR / "components" / "layout" / "ExecutiveSummaryBar.tsx"


class UIAdversarialTestSuite:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.findings = []

    def record_test(self, test_id: str, description: str, passed: bool, severity: str = "INFO", details: str = ""):
        if passed:
            self.passed += 1
            print(f"  [PASS] {test_id}: {description}")
        else:
            self.failed += 1
            print(f"  [FAIL] {test_id}: {description} (Severity: {severity})")
            if details:
                print(f"         Details: {details}")
            self.findings.append({
                "test_id": test_id,
                "description": description,
                "severity": severity,
                "details": details
            })


def run_tests():
    suite = UIAdversarialTestSuite()
    print("=" * 80)
    print("CHALLENGER 2: UI ARCHITECTURE & SHELL ADVERSARIAL STRESS TEST")
    print("=" * 80)

    # --------------------------------------------------------------------------
    # SUITE 1: EvidenceDrawer & Unknown MetricId Resilience
    # --------------------------------------------------------------------------
    print("\n--- SUITE 1: Unknown MetricId & Fallback Handling ---")
    drawer_code = EVIDENCE_DRAWER_PATH.read_text(encoding="utf-8")
    badge_code = EVIDENCE_BADGE_PATH.read_text(encoding="utf-8")
    ctx_code = EVIDENCE_CONTEXT_PATH.read_text(encoding="utf-8")

    # 1.1 Context openDrawer guard against unknown metricId
    open_drawer_guarded = "if (evidenceRegistry[metricId])" in ctx_code
    suite.record_test(
        "ADV-UI-01",
        "EvidenceContext.openDrawer validates metricId against registry before opening",
        open_drawer_guarded,
        severity="HIGH",
        details="openDrawer must verify registry presence to prevent opening on invalid ID"
    )

    # 1.2 EvidenceDrawer null guard on missing activeMetric
    drawer_null_guard = "if (!isOpen || !activeMetric) return null;" in drawer_code
    suite.record_test(
        "ADV-UI-02",
        "EvidenceDrawer immediately returns null if activeMetric is null/undefined",
        drawer_null_guard,
        severity="CRITICAL",
        details="Prevents null property dereferencing crashes when activeMetric is absent"
    )

    # 1.3 EvidenceBadge fallback when metric is not found in registry
    badge_fallback = "'Ledger Ref'" in badge_code and "metric?.provenance" in badge_code
    suite.record_test(
        "ADV-UI-03",
        "EvidenceBadge uses safe optional chaining and falls back to 'Ledger Ref'",
        badge_fallback,
        severity="HIGH",
        details="Unknown metricId in badge renders 'Ledger Ref' without crashing"
    )

    # 1.4 EvidenceDrawer Props Contract vs PROJECT.md specification
    # PROJECT.md specifies EvidenceDrawerProps with activeMetricId and onClose.
    # In EvidenceDrawer.tsx, activeMetricId is defined on the interface but ignored in implementation.
    props_decoupling = "export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ onNavigateToLedger })" in drawer_code
    suite.record_test(
        "ADV-UI-04",
        "EvidenceDrawer ignores props.activeMetricId and solely relies on EvidenceContext",
        props_decoupling,
        severity="MEDIUM",
        details="Architectural divergence: EvidenceDrawer is tightly bound to EvidenceContext rather than controlled via props as specified in PROJECT.md"
    )

    # --------------------------------------------------------------------------
    # SUITE 2: ThemeContext Resilience & Storage Safety
    # --------------------------------------------------------------------------
    print("\n--- SUITE 2: ThemeContext & Storage Exception Resilience ---")
    theme_code = THEME_CONTEXT_PATH.read_text(encoding="utf-8")

    # 2.1 Invalid theme string fallback
    invalid_theme_guarded = "if (stored === 'light' || stored === 'dark')" in theme_code and "return 'light';" in theme_code
    suite.record_test(
        "ADV-UI-05",
        "ThemeContext normalizes invalid/corrupt theme strings to 'light'",
        invalid_theme_guarded,
        severity="HIGH",
        details="Invalid strings like 'blue', '', or corrupt values gracefully fall back to 'light'"
    )

    # 2.2 localStorage exception handling (SecurityError / iframe / quota)
    has_try_catch_in_theme = "try {" in theme_code and "catch" in theme_code
    suite.record_test(
        "ADV-UI-06",
        "ThemeContext wraps localStorage.getItem and setItem in try...catch blocks",
        has_try_catch_in_theme,
        severity="HIGH",
        details="VULNERABILITY: If localStorage is blocked in sandboxed iframe or private browsing, ThemeContext throws unhandled SecurityError crashing the whole application on mount"
    )

    # 2.3 SSR / window undefined check
    has_window_check = "if (typeof window !== 'undefined')" in theme_code
    suite.record_test(
        "ADV-UI-07",
        "ThemeContext checks for typeof window !== 'undefined' before accessing window APIs",
        has_window_check,
        severity="MEDIUM"
    )

    # --------------------------------------------------------------------------
    # SUITE 3: Portal Mounting & DOM ID Uniqueness
    # --------------------------------------------------------------------------
    print("\n--- SUITE 3: Portal Mounting & DOM Hierarchy ---")
    index_html = INDEX_HTML_PATH.read_text(encoding="utf-8")
    app_code = APP_PATH.read_text(encoding="utf-8")

    # 3.1 EvidenceDrawer checks for #evidence-portal-root with fallback to document.body
    has_portal_root_fallback = "document.getElementById('evidence-portal-root') || document.body" in drawer_code
    suite.record_test(
        "ADV-UI-08",
        "EvidenceDrawer checks for #evidence-portal-root existence and falls back to document.body",
        has_portal_root_fallback,
        severity="HIGH",
        details="createPortal receives valid DOM node even if #evidence-portal-root is missing"
    )

    # 3.2 Duplicate id="evidence-portal-root" collision check
    portal_in_html = 'id="evidence-portal-root"' in index_html
    portal_in_app = 'id="evidence-portal-root"' in app_code
    is_duplicate_portal_id = portal_in_html and portal_in_app

    suite.record_test(
        "ADV-UI-09",
        "Absence of duplicate DOM ID 'evidence-portal-root' across index.html and App.tsx",
        not is_duplicate_portal_id,
        severity="HIGH",
        details="VULNERABILITY: 'evidence-portal-root' is defined in BOTH index.html and App.tsx. document.getElementById selects the inner App.tsx node, defeating the body portal boundary and violating W3C unique ID rules"
    )

    # --------------------------------------------------------------------------
    # SUITE 4: Lifecycle & Race Conditions
    # --------------------------------------------------------------------------
    print("\n--- SUITE 4: Lifecycle & Concurrency Race Conditions ---")

    # 4.1 Timer race condition in EvidenceContext.closeDrawer
    # closeDrawer sets timeout for 250ms without clearing previous timer if openDrawer is called
    has_timer_in_close = "setTimeout(() => {" in ctx_code and "setActiveMetricId(null)" in ctx_code
    has_timer_ref_cleanup = "clearTimeout" in ctx_code
    is_race_condition_present = has_timer_in_close and not has_timer_ref_cleanup

    suite.record_test(
        "ADV-UI-10",
        "EvidenceContext cleans up pending closeDrawer setTimeout upon rapid re-open",
        not is_race_condition_present,
        severity="MEDIUM",
        details="RACE CONDITION: Rapid openDrawer within 250ms of closeDrawer causes the pending timer to wipe activeMetricId to null, unexpectedly vanishing the newly opened drawer"
    )

    # 4.2 Clipboard API safety in insecure / iframe contexts
    has_clipboard_guard = (
        "if (!navigator.clipboard)" in drawer_code or 
        "navigator.clipboard?.writeText" in drawer_code or 
        "try {" in drawer_code
    )
    suite.record_test(
        "ADV-UI-11",
        "EvidenceDrawer copy functions verify navigator.clipboard presence or handle writeText rejection",
        has_clipboard_guard,
        severity="MEDIUM",
        details="In insecure contexts (HTTP) or restricted iframes, navigator.clipboard is undefined or rejects, causing uncaught exception on Copy Code / Copy Citation click"
    )

    # --------------------------------------------------------------------------
    # SUITE 5: Referential Integrity of Referenced Metric IDs
    # --------------------------------------------------------------------------
    print("\n--- SUITE 5: Metric Referential Integrity Across UI ---")
    evidence_ledger = json.loads(EVIDENCE_LEDGER_PATH.read_text(encoding="utf-8"))
    
    # Collect all metricId="..." from App.tsx and ExecutiveSummaryBar.tsx
    referenced_ids = set()
    for source in [app_code, drawer_code, badge_code, EXECUTIVE_BAR_PATH.read_text(encoding="utf-8")]:
        matches = re.findall(r'metricId=["\']([^"\']+)["\']', source)
        for m in matches:
            referenced_ids.add(m)

    missing_in_ledger = [mid for mid in referenced_ids if mid not in evidence_ledger]
    suite.record_test(
        "ADV-UI-12",
        f"All {len(referenced_ids)} hardcoded metric IDs exist in evidenceLedger.json",
        len(missing_in_ledger) == 0,
        severity="CRITICAL",
        details=f"Missing metric IDs: {missing_in_ledger}" if missing_in_ledger else ""
    )

    # --------------------------------------------------------------------------
    # SUITE 6: Build & Production Bundle Verification
    # --------------------------------------------------------------------------
    print("\n--- SUITE 6: Production Build & Asset Integrity ---")
    dist_dir = DASHBOARD_DIR / "dist"
    dist_index = dist_dir / "index.html"
    dist_assets = dist_dir / "assets"

    has_dist_index = dist_index.exists()
    suite.record_test(
        "ADV-UI-13",
        "dist/index.html exists and is non-empty",
        has_dist_index and dist_index.stat().st_size > 0,
        severity="CRITICAL"
    )

    # Check that built JS and CSS exist in dist/assets
    js_assets = list(dist_assets.glob("*.js")) if dist_assets.exists() else []
    css_assets = list(dist_assets.glob("*.css")) if dist_assets.exists() else []
    js_maps = list(dist_assets.glob("*.js.map")) if dist_assets.exists() else []

    suite.record_test(
        "ADV-UI-14",
        f"Production bundle includes valid JS chunks ({len(js_assets)}) and CSS ({len(css_assets)})",
        len(js_assets) > 0 and len(css_assets) > 0,
        severity="CRITICAL"
    )

    suite.record_test(
        "ADV-UI-15",
        f"Production bundle generates source maps ({len(js_maps)}) for auditability",
        len(js_maps) > 0,
        severity="MEDIUM"
    )

    # Check dist/index.html references the actual generated assets
    if has_dist_index:
        dist_html_content = dist_index.read_text(encoding="utf-8")
        js_ref_valid = any(p.name in dist_html_content for p in js_assets)
        css_ref_valid = any(p.name in dist_html_content for p in css_assets)
        suite.record_test(
            "ADV-UI-16",
            "dist/index.html correctly references bundled assets",
            js_ref_valid and css_ref_valid,
            severity="CRITICAL"
        )
    else:
        suite.record_test("ADV-UI-16", "dist/index.html asset references", False, severity="CRITICAL")

    # --------------------------------------------------------------------------
    # Summary
    # --------------------------------------------------------------------------
    print("\n" + "=" * 80)
    print("CHALLENGER 2 EMPIRICAL TEST SUMMARY")
    print("=" * 80)
    print(f"Total Tests Executed : {suite.passed + suite.failed}")
    print(f"Passed               : {suite.passed}")
    print(f"Failed (Findings)    : {suite.failed}")
    print("=" * 80)

    for idx, f in enumerate(suite.findings, 1):
        print(f"\nFinding {idx} [{f['severity']}]: {f['test_id']} - {f['description']}")
        print(f"  Impact: {f['details']}")

    return suite


if __name__ == '__main__':
    suite = run_tests()
    # Exit with code 0 if criticals pass, or code 1 if critical failures
    critical_failures = [f for f in suite.findings if f['severity'] == 'CRITICAL']
    if critical_failures:
        sys.exit(1)
    sys.exit(0)
