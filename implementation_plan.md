# Implementation Plan - Dashboard Refinements & Drilldown Hierarchy

Implement user feedback regarding monetary readability, KPI card spacing, annual combined income crop breakdowns, and geographic hierarchy drilldowns.

---

## Proposed Changes

### 1. Readability & Readjusting KPI Scorecard Cards

#### [MODIFY] [OverviewTab.tsx](file:///c:/Users/bentn/antigravity/Untitled/src/components/DashboardTabs/OverviewTab.tsx)
- **Monetary Readability**: Convert any Lakhs value greater than or equal to 100 Lakhs into Crores (e.g. `₹825.13L` becomes `₹8.25 Cr` and `₹169.78L` becomes `₹1.70 Cr`).
- **Uncramped Layout**: Rearrange the scorecard widgets on the Overview tab into a premium horizontal layout:
  - Top Left: Label (upper-case bold tracking text) + Large Value (2xl font weight).
  - Top Right: Floating colored icon container.
  - Bottom: Indicator dot + subtext (e.g., target progress).
  - Height fixed to `h-[120px]` to maintain alignment and give ample spacing.
- **Annual Income Breakup Panel**: Add an interactive accordion/tabs widget under the Combined Net Income chart called **"Crop-wise Breakdown of Annual combined income"**:
  - Show the crop contributions (e.g. Wheat, Paddy, Okra) for the selected year (2022, 2023, 2024, or 2025 Projected) using horizontal percentage bars.
  - Label the dotted line in the chart's legend and tooltip clearly as **"Annual combined Gross Income of all farmers"**.
  - Adjust chart Y-axis ticks to display in Crores (e.g. `₹8.5 Cr`, `₹17.0 Cr`, `₹25.5 Cr`, `₹34.0 Cr`).

#### [MODIFY] [RightsTab.tsx](file:///c:/Users/bentn/antigravity/Untitled/src/components/DashboardTabs/RightsTab.tsx), [NutritionTab.tsx](file:///c:/Users/bentn/antigravity/Untitled/src/components/DashboardTabs/NutritionTab.tsx), [InstitutionsTab.tsx](file:///c:/Users/bentn/antigravity/Untitled/src/components/DashboardTabs/InstitutionsTab.tsx)
- Reorganize the KPI cards in the other tabs to follow the identical premium layout (Label + Value on the left, Icon on the right, status/subtext at the bottom).

---

### 2. Geographic Hierarchy Drilldown

#### [MODIFY] [RightsTab.tsx](file:///c:/Users/bentn/antigravity/Untitled/src/components/DashboardTabs/RightsTab.tsx)
- Replace the simple GP family box with an interactive **"Geographic Drilldown Selector"** following the hierarchy:
  `Gram Panchayat (GP) Level -> Village/Hamlet Level -> Household (Family) Level`
- **Drilldown Steps**:
  1. **GP Level**: User clicks a Gram Panchayat from the list (Karikot, Fakirpuri, etc.).
  2. **Village Level**: Selecting a GP reveals a list of its constituent villages (e.g. Narayan Tanda, Rajaram Tanda) and their respective household counts.
  3. **Household Level**: Clicking a village reveals a sample table of participating families in that village, detailing their surveyor name, SHG group, and entitlement access status (e.g. Mira from Karikot, Anguriya, etc. fetched from CleanedData).
- Sourced from the exact GP-village relationships in the FDB database.

---

## Verification Plan

### Automated Verification
- Run a production build to check for type definitions and component compatibility:
  ```powershell
  npm.cmd run build
  ```

### Manual Verification
- Click through all cards and verify the uncramped layouts.
- Hover over the progression charts and verify that axis labels display in Crores (e.g., `₹17.0 Cr` instead of `₹1700L`).
- Drill down from GP to Village to Household inside the Rights tab to confirm the selector updates the lists correctly.
