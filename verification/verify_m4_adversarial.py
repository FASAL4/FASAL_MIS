#!/usr/bin/env python3
"""
Adversarial Verification Suite for Milestone 4 (Features F25 & F26).
Author: Empirical Challenger (challenger_m4_2)
"""

import os
import sys
import json
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.dirname(SCRIPT_DIR)
DASHBOARD_DIR = os.path.join(WORKSPACE_DIR, "dashboard")

PRINT_CSS = os.path.join(DASHBOARD_DIR, "src", "styles", "print.css")
INDEX_CSS = os.path.join(DASHBOARD_DIR, "src", "index.css")
APP_TSX = os.path.join(DASHBOARD_DIR, "src", "App.tsx")
MAIN_TSX = os.path.join(DASHBOARD_DIR, "src", "main.tsx")
VITE_CONFIG = os.path.join(DASHBOARD_DIR, "vite.config.ts")
VERCEL_CONFIG = os.path.join(DASHBOARD_DIR, "vercel.json")
NETLIFY_CONFIG = os.path.join(DASHBOARD_DIR, "netlify.toml")
DIST_INDEX = os.path.join(DASHBOARD_DIR, "dist", "index.html")
DIST_404 = os.path.join(DASHBOARD_DIR, "dist", "404.html")

passed = 0
failed = 0
failures = []

def record(ok: bool, test_id: str, desc: str, detail: str = ""):
    global passed, failed
    if ok:
        passed += 1
        print(f"  [PASS] {test_id}: {desc}")
    else:
        failed += 1
        msg = f"  [FAIL] {test_id}: {desc}"
        if detail:
            msg += f" (Detail: {detail})"
        print(msg)
        failures.append((test_id, desc, detail))

def run_suite():
    print("================================================================================")
    print("  MILESTONE 4 ADVERSARIAL CHALLENGE & VERIFICATION SUITE")
    print("================================================================================")

    # --------------------------------------------------------------------------
    # 1. Feature F25 Source Specifications (print.css & App.tsx)
    # --------------------------------------------------------------------------
    print("\n--- Track 1: Feature F25 Source CSS & Component Specifications ---")
    with open(PRINT_CSS, "r", encoding="utf-8") as f:
        print_css = f.read()

    # 1.1 UI Chrome Suppression Selectors
    chrome_items = [
        ("header.bar", "header.bar"),
        ("header.sticky", "header.sticky"),
        ("nav", "nav"),
        (".ThematicNavigation", ".ThematicNavigation"),
        ('[role="tablist"]', '[role="tablist"]'),
        (".theme-toggle-btn", ".theme-toggle-btn"),
        (".filter-bar", ".filter-bar"),
        ("#evidence-portal-root", "#evidence-portal-root"),
        (".scrim", ".scrim"),
        (".drawer", ".drawer"),
        ('[role="dialog"]', '[role="dialog"]'),
        ("input", "input"),
        ("select", "select"),
        ("textarea", "textarea"),
        (".search-box", ".search-box"),
        (".pagination-controls", ".pagination-controls"),
        ("button:not(.print-preserve)", "button:not(.print-preserve)"),
    ]
    for sel_id, sel in chrome_items:
        record(sel in print_css, f"TC-F25-CHROME-{sel_id}", f"UI Chrome suppression rule includes {sel}")

    # 1.2 Page-break avoidance
    break_targets = [".card", "section", "table", "tr", "thead", "svg", "canvas"]
    for bt in break_targets:
        record(bt in print_css and "break-inside: avoid" in print_css,
               f"TC-F25-BREAK-INSIDE-{bt}", f"break-inside: avoid applies to {bt}")

    # 1.3 Heading break-after avoidance
    record("break-after: avoid" in print_css and "h1" in print_css and "h6" in print_css,
           "TC-F25-BREAK-AFTER-HEADINGS", "Headings h1-h6 have break-after: avoid !important")

    # 1.4 thead table-header-group
    record("thead" in print_css and "display: table-header-group !important" in print_css,
           "TC-F25-THEAD-REPEAT", "thead has display: table-header-group !important for repeated page headers")

    # 1.5 High-contrast monochrome
    monochrome_ok = (
        "#FFFFFF !important" in print_css and
        "#111C16 !important" in print_css and
        "color-scheme: light !important" in print_css and
        "print-color-adjust: exact !important" in print_css and
        "-webkit-print-color-adjust: exact !important" in print_css and
        '[data-theme="dark"]' in print_css and
        ".dark" in print_css
    )
    record(monochrome_ok, "TC-F25-MONOCHROME-CONTRAST",
           "Monochrome high-contrast overrides dark mode with #FFFFFF bg, #111C16 ink, exact print color adjust")

    # 1.6 Recharts suppression
    recharts_ok = (
        ".recharts-tooltip-wrapper" in print_css and
        ".recharts-default-tooltip" in print_css and
        ".recharts-cursor" in print_css and
        ".recharts-active-dot" in print_css
    )
    record(recharts_ok, "TC-F25-RECHARTS-SUPPRESSION",
           "Recharts interactive tooltips, active dots, and cursor lines suppressed in print")

    # 1.7 Running institutional banners in App.tsx
    with open(APP_TSX, "r", encoding="utf-8") as f:
        app_tsx = f.read()

    record("PrintHeaderBanner" in app_tsx and "PrintFooterBanner" in app_tsx,
           "TC-F25-BANNER-COMPONENTS", "PrintHeaderBanner and PrintFooterBanner defined in App.tsx")

    banner_meta_ok = (
        "G-2110-10970" in app_tsx and
        "DEHAT INDIA" in app_tsx and
        "1,535" in app_tsx and
        "103/103 AUDITED CLAIMS VERIFIED" in app_tsx
    )
    record(banner_meta_ok, "TC-F25-BANNER-METADATA",
           "Institutional banners include APPI Grant Ref: G-2110-10970, DEHAT India, N=1,535, and verification badge")

    # --------------------------------------------------------------------------
    # 2. Feature F26 Deployment Configurations
    # --------------------------------------------------------------------------
    print("\n--- Track 2: Feature F26 Deployment Configurations ---")

    # 2.1 Vite relative base './'
    with open(VITE_CONFIG, "r", encoding="utf-8") as f:
        vite_cfg = f.read()
    record("base: './'" in vite_cfg, "TC-F26-VITE-BASE", "vite.config.ts has base: './'")

    # 2.2 dist/index.html relative asset URLs
    with open(DIST_INDEX, "r", encoding="utf-8") as f:
        dist_index = f.read()
    record('src="./assets/' in dist_index and 'href="./assets/' in dist_index,
           "TC-F26-DIST-RELATIVE-ASSETS", "dist/index.html contains relative ./assets/ asset paths")

    # 2.3 dist/404.html exact duplication
    with open(DIST_404, "r", encoding="utf-8") as f:
        dist_404 = f.read()
    record(dist_index == dist_404, "TC-F26-404-DUPLICATION",
           "dist/404.html is exact bit-for-bit duplicate of dist/index.html")

    # 2.4 Vercel SPA rewrite & caching & security
    with open(VERCEL_CONFIG, "r", encoding="utf-8") as f:
        vercel = json.load(f)
    has_v_rewrite = any(r.get("source") == "/(.*)" and r.get("destination") == "/index.html" for r in vercel.get("rewrites", []))
    record(has_v_rewrite, "TC-F26-VERCEL-SPA-REWRITE", "vercel.json has /(.*) -> /index.html rewrite")

    v_headers = vercel.get("headers", [])
    has_v_immutable = any("/assets/" in h.get("source", "") and any(item.get("key") == "Cache-Control" and "immutable" in item.get("value", "") for item in h.get("headers", [])) for h in v_headers)
    record(has_v_immutable, "TC-F26-VERCEL-IMMUTABLE-CACHE", "vercel.json has immutable Cache-Control for /assets/*")

    has_v_sec = any(any(item.get("key") == "X-Frame-Options" and item.get("value") == "DENY" for item in h.get("headers", [])) for h in v_headers)
    record(has_v_sec, "TC-F26-VERCEL-SECURITY-HEADERS", "vercel.json has HTTP security headers")

    # 2.5 Netlify SPA rewrite & caching & security
    with open(NETLIFY_CONFIG, "r", encoding="utf-8") as f:
        netlify = f.read()
    record('from = "/*"' in netlify and 'to = "/index.html"' in netlify and "status = 200" in netlify,
           "TC-F26-NETLIFY-SPA-REDIRECT", "netlify.toml has /* -> /index.html status 200 redirect")
    record('for = "/assets/*"' in netlify and "immutable" in netlify,
           "TC-F26-NETLIFY-IMMUTABLE-CACHE", "netlify.toml has immutable Cache-Control for /assets/*")
    record('X-Frame-Options = "DENY"' in netlify and 'X-Content-Type-Options = "nosniff"' in netlify,
           "TC-F26-NETLIFY-SECURITY-HEADERS", "netlify.toml has HTTP security headers")

    # --------------------------------------------------------------------------
    # 3. Adversarial Bundle & Mounting Verifications
    # --------------------------------------------------------------------------
    print("\n--- Track 3: Adversarial Bundle Integrity & Application Mounting ---")

    with open(MAIN_TSX, "r", encoding="utf-8") as f:
        main_tsx = f.read()

    # Check if main.tsx mounts App.tsx
    mounts_app = "import App from './App'" in main_tsx or 'import App from "./App"' in main_tsx
    record(mounts_app, "TC-ADV-MAIN-MOUNTS-APP",
           "src/main.tsx mounts src/App.tsx (not redesign/App stub)",
           "main.tsx currently imports './redesign/App' leaving App.tsx unmounted")

    # Check if main.tsx imports index.css
    imports_css = "import './index.css'" in main_tsx or 'import "./index.css"' in main_tsx
    record(imports_css, "TC-ADV-MAIN-IMPORTS-INDEX-CSS",
           "src/main.tsx imports src/index.css (which includes print.css)",
           "main.tsx currently imports './redesign/redesign.css'")

    # Check if dist CSS bundle includes print-header-banner and print rules
    dist_assets_dir = os.path.join(DASHBOARD_DIR, "dist", "assets")
    dist_css_files = [os.path.join(dist_assets_dir, f) for f in os.listdir(dist_assets_dir) if f.endswith(".css")]
    built_css = ""
    for cfile in dist_css_files:
        with open(cfile, "r", encoding="utf-8") as f:
            built_css += f.read()

    has_print_banner_in_dist = "print-header-banner" in built_css
    record(has_print_banner_in_dist, "TC-ADV-DIST-CSS-PRINT-BANNER",
           "Production dist CSS bundle contains .print-header-banner styles",
           "print.css was not bundled into dist/assets/*.css because main.tsx did not import index.css")

    has_thematic_nav_print_suppress = "ThematicNavigation" in built_css
    record(has_thematic_nav_print_suppress, "TC-ADV-DIST-CSS-THEMATIC-NAV",
           "Production dist CSS bundle contains .ThematicNavigation print suppression",
           "ThematicNavigation not found in dist CSS bundle")

    has_monochrome_in_dist = "print-color-adjust" in built_css
    record(has_monochrome_in_dist, "TC-ADV-DIST-CSS-MONOCHROME",
           "Production dist CSS bundle contains print-color-adjust exact monochrome rule",
           "print-color-adjust not found in dist CSS bundle")

    print("\n================================================================================")
    print(f"  ADVERSARIAL VERIFICATION SUMMARY: {passed} PASSED, {failed} FAILED (Total: {passed + failed})")
    print("================================================================================")
    if failures:
        print("\nFAILURE INVENTORY:")
        for fid, fdesc, fdet in failures:
            print(f"  - {fid}: {fdesc} | {fdet}")

    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(run_suite())
