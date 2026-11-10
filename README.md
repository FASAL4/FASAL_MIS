# FASAL MIS — Master Research Synthesis & Interactive Evidence Dashboard (2022–2026)

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Verification Status](https://img.shields.io/badge/Verification-100%25%20Passing-success)](file:///verification)
[![Deployment](https://img.shields.io/badge/Live%20Dashboard-fasal--mis.vercel.app-blue)](https://fasal-mis.vercel.app)

Publication-grade, empirically grounded interactive web application and comprehensive multi-year research synthesis for the **FASAL** (Facilitating Agricultural Sustainability and Livelihoods) program implemented by **DEHAT India** and supported by **Azim Premji Philanthropic Initiatives (APPI)** across forest-fringe smallholder communities in Bahraich District, Uttar Pradesh.

---

## 🌟 Key Highlights & Architectural Features

### 1. Zero AI-Slop, High-Craft Editorial Design System
- **Typography Triad**: *Newsreader* (editorial serif headlines), *Bricolage Grotesque* (crisp display & UI sans), and *JetBrains Mono* (forensic coordinates & microdata).
- **Dual Audience Presentation Modes**:
  - **Executive Briefing Deck**: Tailored for philanthropic grantmakers (APPI) and DEHAT leadership, featuring 7 headline rollups, 7.97× Societal ROI multiplier model, APPI logframe compliance scorecard, and `@media print` 2-page brief optimization.
  - **Public Research Mode**: Comprehensive exploratory environment with granular econometric tables, sensitivity matrices, cohort filter bars, and deep methodology notes.
- **Portalled Micro-Evidence Architecture (`TrustUI`)**: Every key metric is anchored by an interactive evidence badge linked to cell-level coordinates and formula lineage in `src/data/evidenceLedger.json`.

---

## 📊 Core Thematic Pillars & Empirical Anchors

All parameters in this repository are reconciled against the master 18.3 MB endline dataset (`FDB Survey as on 05112026.xlsx`) and verified across 103 primary assertions:

| Pillar | Focus Area | Verified Headline Metric | Empirical Provenance |
| :--- | :--- | :--- | :--- |
| **Pillar I** | **Income Security** | **₹34,555 $\rightarrow$ ₹63,918** (+84.97% mean, +142.73% median recovery) | `Income Data` (N=1,487 genuine rows, Row 1492 grand total ₹9.50 Cr) |
| **Pillar II** | **RF Agronomic Progression** | **₹90,799/acre** (151.3% of APPI ₹60k benchmark; 0.20 ac/bigha sensitivity) | Section C Agronomy microdata, 4-tier Bigha Sensitivity Matrix |
| **Pillar III** | **Rights & Entitlements** | **₹7.71 Cr Genuine Leverage** (577 verified projects, neutralization of ₹11.70 Cr double-count) | `1. Leverage AASs 2025.xlsx` & Jan Suvidha Kendra registry |
| **Pillar IV** | **Nutrition & Food Security** | **Summer Hunger Gap Inversion** (Pulse deficit mitigated, Poshan Vatika 60-mo recall) | Section G Food Consumption Microdata |
| **Pillar V** | **Forensic Audit & Inclusion** | **99.48% Marginalized Reach** (58.05% OBC, 24.56% ST, 16.87% SC, 0.52% General) | SYS-1 to SYS-7 Reconciliation Ledger (299 indicator rows) |

---

## 📁 Repository Structure

```
.
├── src/
│   ├── components/
│   │   ├── evidence/           # TrustUI Portalled Evidence Drawers & Badges
│   │   ├── filters/            # Global Demographic & Cohort Filter Bars
│   │   └── layout/             # Master Header, Mode Switcher, and Nav
│   ├── modules/
│   │   ├── executive/          # Executive Briefing Deck & Societal ROI Model
│   │   ├── income/             # Longitudinal Income & Turmeric Value Chains
│   │   ├── agronomy/           # LEISA Progression & APPI Benchmark Cards
│   │   ├── entitlements/       # Public Convergence & Civic Leverage Cards
│   │   ├── nutrition/          # Dietary Recall & Hunger Inversion Cards
│   │   └── audit/              # Forensic Audit Matrix & Row 1492 Proof
│   ├── data/
│   │   ├── fasalMasterData.json # Audited, reconciled multi-pillar master dataset
│   │   ├── fasalMasterData.ts   # Strongly typed data accessors
│   │   └── evidenceLedger.json  # Line-item audit trail and cell coordinates
│   ├── context/                # React Contexts (Evidence, Filter, Presentation)
│   ├── styles/                 # Tailwind CSS v4 design tokens and typography
│   ├── App.tsx                 # Main application container
│   └── main.tsx                # React 19 entrypoint
├── scripts/
│   ├── compile_master_data.py  # Master data ETL compiler from primary spreadsheets
│   ├── verify_dashboard_data.py# 181-assertion automated UI regression test
│   └── teamwork_live_telemetry_daemon.py # Live per-second agent coordination daemon
├── verification/
│   ├── verify_fdb_2026.py      # 103-assertion primary dataset verification suite
│   └── verify_m4_adversarial.py# Adversarial boundary & reconciliation checks
├── FASAL_MASTER_SYNTHESIS_AND_RESEARCH_AGENDA_2026.md # 245 KB master publication synthesis
├── FASAL_2026_RECONCILIATION_LEDGER.md                # 299-indicator reconciliation ledger
├── FASAL_REMEDIATION_AUDIT_REPORT.md                  # 490-claim forensic audit report
├── vercel.json                 # Single-page application rewrites for Vercel
├── netlify.toml                # Netlify deployment configuration
└── package.json                # Project dependencies and lifecycle scripts
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js $\ge$ 18.0.0
- `pnpm` $\ge$ 9.0.0 (or `npm`)
- Python $\ge$ 3.10 (for running verification suites)

### Installation
```bash
# Clone the repository
git clone https://github.com/FASAL4/FASAL_MIS.git
cd FASAL_MIS

# Install dependencies
pnpm install

# Start Vite development server
pnpm dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Verification & Auditing Suites

To execute the automated regression test suites that guarantee mathematical integrity and evidence traceability:

```bash
# Run the 181-assertion Dashboard Data verification suite
python scripts/verify_dashboard_data.py

# Run the 103-assertion primary microdata verification suite
python verification/verify_fdb_2026.py

# Run the adversarial stress-test suite
python scripts/verify_m4_empirical_stress.py
```

### Production Build
```bash
# Typecheck and produce minified distribution bundles
pnpm build

# Preview production build locally
pnpm preview
```

---

## 🌐 Deployment

The application is optimized for zero-configuration continuous deployment on **Vercel** and **Netlify**:
- **Vercel**: Pre-configured via `vercel.json` with clean client-side routing rewrites (`/*` $\rightarrow$ `/index.html`).
- **Netlify**: Configured via `netlify.toml` with publish directory `dist` and 200 rewrite fallback.

---

## 📜 Authors & Citation
- **Program Implementation**: DEHAT India (Devangana Jan Seva Sansthan), Bahraich, UP.
- **Grant Support**: Azim Premji Philanthropic Initiatives (APPI).
- **Synthesis & Technical Architecture**: Pair programming team & research working group (2026).
