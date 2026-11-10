/**
 * ==============================================================================
 * FASAL Dashboard Thematic Data Contracts & State Schemas
 * File: src/types/dashboard.ts
 *
 * Defines complete data structures for all six thematic domains:
 * 1. ExecutiveOverviewData (Grant Governance & Operational Census)
 * 2. IncomeSecurityData (Macro Crop Economics & Turmeric Value Chain)
 * 3. RFProgressionData (APPI Benchmarks, Landholdings & PoP Transition)
 * 4. RightsEntitlementsData (4-Round Delivery, Public Leverage & JSK)
 * 5. NutritionData (60-Month Dietary Recall & Poshan Vatikas)
 * 6. ForensicLedgerData (Audit Registry, SYS Remediations & Slice Identity)
 * Alongside FilterState and ThemeState for interactive client control.
 * ==============================================================================
 */

import { MetricProvenance } from './evidence';

// ==============================================================================
// 1. ROOT MASTER DATA STORE CONTRACT
// ==============================================================================

/**
 * Root container for the pre-compiled, zero-backend FASAL data engine.
 */
export interface FasalMasterData {
  /** Overall metadata regarding survey cuts, hashes, and project lifecycle */
  metadata: ProjectMetadata;
  /** Theme 0: Executive & Donor Overview */
  overview: ExecutiveOverviewData;
  /** Theme 1: Income Security & Agrarian Economics */
  income: IncomeSecurityData;
  /** Theme 2: Results Framework (RF) & Agricultural Progression */
  rfProgression: RFProgressionData;
  /** Theme 3: Rights & Entitlements 4-Round Delivery */
  rights: RightsEntitlementsData;
  /** Theme 4: Nutrition & Dietary Diversity Dynamics */
  nutrition: NutritionData;
  /** Theme 5: Forensic Ledger & Audit Matrix */
  forensic: ForensicLedgerData;
  /** Complete micro-evidence lookup catalog mapping metricId to provenance */
  evidenceLedger: Record<string, MetricProvenance>;
}

export interface ProjectMetadata {
  projectName: string;
  grantRef: string;
  grantCommitmentINR: number;
  lifecycleSpan: string;
  implementingAgency: string;
  targetLandscape: string;
  datasetCutDate: string;
  datasetSha256: string;
  surveyWave1Window: string;
  surveyWave2Window: string;
}

// ==============================================================================
// 2. THEME 0: EXECUTIVE & DONOR OVERVIEW DATA CONTRACTS
// ==============================================================================

export interface ExecutiveOverviewData {
  /** High-level executive headline metrics */
  headlineKPIs: {
    grantCommitment: number;             // ₹2,16,00,000 (₹2.16 Cr)
    totalHouseholdsSurveyed: number;     // 1,535 HHs
    activeCultivatingFarmers: number;    // 1,487 genuine farmers
    residentIndividualPopulation: number;// 6,494 individuals
    meanHouseholdSize: number;           // 4.23 members / HH
    gramPanchayatsCount: number;         // 7 GPs
    villagesCount: number;               // 19 villages
    marginalizedInclusionRate: number;   // 99.48% (SC/ST/OBC)
    verifiedPublicLeverageINR: number;   // ₹7,70,98,360 (577 projects)
    jskTransactionsCount: number;        // 1,102 services
    trainingSessionsCount: number;       // 210 sessions
    trainingAttendancesCount: number;    // 13,510 attendances
  };

  /** Geographic census distribution across all 7 Gram Panchayats */
  geographicDistribution: GramPanchayatCensus[];

  /** Social demographics and caste distribution across N=1,535 households */
  casteDemographics: CasteCensusSummary[];

  /** Institutional community collectivization and democratic union membership */
  collectivization: {
    aasUnionMembers: number;             // 4,826 members (74.32% of 6,494 roster)
    aasAffinityGroups: number;           // 64 groups
    shgGroupsCount: number;              // 39 groups
    shgMembersCount: number;             // 549 micro-saving women
    balSansadMinisters: number;          // 9 elected youth
    kishorSangathanLeaders: number;      // 11 adolescent leaders
    yuvaSansadDelegates: number;         // 11 young adult delegates
    baghmitraGajmitraLinkages: number;   // 1,531 HHs linked
    krishiMitraLinkages: number;         // 1,532 HHs linked
  };

  /** Field survey administration settlement status from Payment Status sheet */
  fieldAdministration: {
    visibleSubmissions: number;          // 1,535
    incompleteSurveys: number;           // 14 (0.91% attrition)
    duplicateSurveys: number;            // 15 (0.98% field duplicates expunged)
    completedValidatedSurveys: number;   // 1,506 (Formula: 1535 - 14 - 15)
    physicalBookletsDeposited: number;   // 1,520 (99.02% physical deposit rate)
    enumeratorPaymentsDisbursed: number; // 1,102 surveys paid
    enumeratorPaymentsPending: number;   // 408 surveys pending audit
    totalSurveyors: number;              // 19 named surveyors
  };
}

export interface GramPanchayatCensus {
  gpName: string;
  households: number;
  percentage: number;
  hamletsCount: number;
  hamletNames: string[];
  primaryCharacteristics: string;
}

export interface CasteCensusSummary {
  casteCategory: 'OBC' | 'ST' | 'SC' | 'General';
  description: string;
  households: number;
  percentage: number;
  meanLandBigha: number;
  meanNetIncome2026: number;
  aasMembershipPct: number;
}

// ==============================================================================
// 3. THEME 1: INCOME SECURITY & AGRARIAN ECONOMICS CONTRACTS
// ==============================================================================

export interface IncomeSecurityData {
  /** Macro crop economy balance sheet across 1,487 genuine farmers (Rows 4:1490) */
  macroFinancials: {
    year2025: MacroFinancialTotals;
    year2026: MacroFinancialTotals;
    deltaYoY: {
      netProfitGrowthAmount: number;     // +₹1,40,13,419
      netProfitGrowthPct: number;        // +17.29%
      grossRevenueGrowthAmount: number;  // +₹1,69,23,404
      grossRevenueGrowthPct: number;     // +15.21%
      cultivationCostGrowthAmount: number; // +₹29,09,985
      cultivationCostGrowthPct: number;  // +9.63%
      profitMarginDeltaPp: number;       // +1.32 percentage points
    };
  };

  /** 5-year definitive longitudinal trajectory (2022 to 2026) */
  longitudinalTrajectory: IncomeTrajectoryYear[];

  /** Longitudinal growth synthesis indicators */
  longitudinalGrowth: {
    meanGrowthPct: number;               // +84.97% (1.85x)
    medianGrowthPct: number;             // +142.73% (2.43x)
    aggregateGrowthPct: number;          // +106.97% (2.07x)
    bottomQuartileGainSummary: string;
  };

  /** Caste-stratified farm economics (2026 Endline) */
  casteEconomics: CasteEconomicMetrics[];

  /** Flagship commercial turmeric value chain */
  turmericValueChain: TurmericEconomics;

  /** Comprehensive 42-crop economics ledger */
  cropLedger: CropEconomicRecord[];
}

export interface MacroFinancialTotals {
  cultivationCostINR: number;            // 2025: ₹30,214,192 | 2026: ₹33,124,177
  grossRevenueINR: number;               // 2025: ₹111,246,772 | 2026: ₹128,170,176
  netProfitINR: number;                  // 2025: ₹81,032,580 | 2026: ₹95,045,999
  meanNetIncomePerHH: number;            // 2025: ₹54,494.00 | 2026: ₹63,917.95
  medianNetIncomePerHH: number;          // 2025: ₹44,400.00 | 2026: ₹53,400.00
  activeFarmersCount: number;            // 1,487
  activeEarnersCount: number;            // 2025: 1,484 (99.80%) | 2026: 1,478 (99.39%)
  activeEarnerSaturationPct: number;
  netProfitMarginPct: number;            // 2025: 72.84% | 2026: 74.16%
}

export interface IncomeTrajectoryYear {
  calendarYear: number;
  surveyWave: 'Wave 1 RAW' | 'Wave 2 Master';
  meanNetIncomeINR: number;
  medianNetIncomeINR: number;
  aggregateNetIncomeINR: number;
  sampleSize: number;
  activeEarnerPct: number;
  notes: string;
}

export interface CasteEconomicMetrics {
  caste: 'ST' | 'OBC' | 'SC' | 'General';
  label: string;
  sampleSize: number;
  meanNetFarmIncome2026: number;
  medianNetFarmIncome2026: number;
  meanLandBigha: number;
  meanLandAcres020: number;
  landlessRatePct: number;
  aasUnionEnrollmentPct: number;
  keyDrivers: string;
}

export interface TurmericEconomics {
  growers2025: number;                   // 333
  growers2026: number;                   // 328
  areaBigha2025: number;                 // 315 bigha (63.0 ac)
  areaBigha2026: number;                 // 345 bigha (69.0 ac)
  freshRhizomeProductionKg: number;      // 738,640 kg (7,386.4 quintals)
  averageYieldQuintalsPerAcre: number;   // 107.0 q/ac (2,141 kg/bigha)
  cultivationCost2025: number;           // ₹24,88,890.00
  cultivationCost2026: number;           // ₹28,49,768.00
  grossRevenue2025: number;              // ₹1,17,97,750.00
  grossRevenue2026: number;              // ₹1,26,88,160.00
  netProfit2025: number;                 // ₹93,08,860.00
  netProfit2026: number;                 // ₹98,38,392.00
  netProfitMarginPct2026: number;        // 82.85%
  averageNetProfitPerGrower2026: number; // ₹29,995.10
  curcuminContentPctRange: string;       // "3.2% - 3.8%"
  dryFingerMarketingPriceRange: string;  // "₹140 - ₹180 / kg"
}

export interface CropEconomicRecord {
  cropKey: string;                       // e.g. 'wheat', 'paddy', 'turmeric'
  displayName: string;                   // e.g. 'Wheat (Gehun)'
  hindiName: string;                     // e.g. 'गेहूं'
  category: 'Cereal' | 'Pulse' | 'Cash/Spice' | 'Vegetable' | 'Oilseed' | 'Other';
  growersCount2026: number;
  cultivationCost2025: number;
  cultivationCost2026: number;
  grossRevenue2025: number;
  grossRevenue2026: number;
  netProfit2025: number;
  netProfit2026: number;
  netProfitMargin2026: number;
  yoyGrowthPct: number;
}

// ==============================================================================
// 4. THEME 2: RESULTS FRAMEWORK & AGRONOMIC PROGRESSION CONTRACTS
// ==============================================================================

export interface RFProgressionData {
  /** Core APPI Grant Results Framework indicators */
  benchmarks: RFBenchmarkItem[];

  /** Operational landholding distribution & tenurial regime */
  landholdingStructure: {
    rawNumericSumBigha: number;          // 3,623.50 bigha
    regexParsedTotalBigha: number;       // 5,233.84 bigha
    totalPhysicalAcres020: number;       // 1,046.77 acres (at 0.20 factor)
    meanLandBigha: number;               // 3.41 bigha
    meanLandAcres020: number;            // 0.6819 acres
    medianLandBigha: number;             // 3.00 bigha
    medianLandAcres020: number;          // 0.6000 acres
    ownedLandAcres: number;              // 1,019.01 acres (97.35%)
    leasedBataiLandAcres: number;        // 43.14 acres (2.65%)
    landlessHHsCount: number;            // 88 HHs reporting 0 bigha (5.73%)
    unparsedHomesteadHHsCount: number;   // 574 HHs without titled parcel (37.39%)
    smallholderProportionLe1Acre: number;// 91.3% operating <= 5 bigha (<= 1.0 ac)
  };

  /** Regional bigha conversion factor sensitivity matrix (SYS-4 remediation) */
  bighaSensitivity: BighaSensitivityMatrixItem[];

  /** Package of Practices (PoP) & LEISA ecological transition */
  leisaTransition: {
    chemicalPesticideCutPct: number;     // ~90% cut
    bioNutrientDrumsCount: number;       // 1,120+ drums (200L units)
    machanTrellisFarmsCount: number;     // 777+ households
    lerLandEquivalentRatio: number;      // > 2.0
    averageCultivationCostPerBighaINR: number; // ~₹2,227
    formulationsAdopted: Array<{
      name: string;
      type: 'Liquid Bio-Nutrient' | 'Solid Bio-Manure' | 'Bio-Pest Repellent';
      ingredients: string;
      applicationTarget: string;
    }>;
    physicalYields: Array<{
      crop: string;
      yieldPerAcreQuintals: number;
      yieldPerBighaKg: number;
    }>;
  };
}

export interface RFBenchmarkItem {
  indicatorKey: string;
  label: string;
  targetValueFormatted: string;
  achievedValueFormatted: string;
  attainmentPct: number;
  status: 'EXCEEDED' | 'MET' | 'ON_TRACK' | 'NOT_MET';
  notes: string;
}

export interface BighaSensitivityMatrixItem {
  standardName: string;
  regionalContext: string;
  multiplierAcrePerBigha: number;        // 0.20, 0.25, 0.3333, 0.619
  totalAcresDerived: number;
  meanAcresPerHH: number;
  benchmarkAttainmentPct: number;        // % of landholders crossing ₹60k/acre
  isProjectBaseline: boolean;
}

// ==============================================================================
// 5. THEME 3: RIGHTS & ENTITLEMENTS 4-ROUND DELIVERY CONTRACTS
// ==============================================================================

export interface RightsEntitlementsData {
  /** 4-round delivery matrix across 77 schemes (Jan 2025 to Dec 2026) */
  longitudinalRounds: EntitlementSchemeDelivery[];

  /** Cross-round benchmark summary for stable frontline entitlements */
  stableFrontlineServices: {
    essentialMedicationCoveragePct: number; // ~45.7% (R1: 728, R2: 706, R3: 698, R4: 673)
    sanitaryNapkinsCoveragePct: number;     // ~41.0% (R1: 645, R2: 619, R3: 620, R4: 632)
    teacherDailyAttendancePct: number;      // ~37.0% (R1: 639, R2: 561, R3: 540, R4: 529)
    midDayMealRegularityPct: number;        // ~34.7% (R1: 609, R2: 517, R3: 506, R4: 499)
    juniorSchoolAccessPct: number;          // ~32.4% (R1: 536, R2: 482, R3: 476, R4: 498)
  };

  /** Verified public scheme leverage across 577 projects (SYS-7 remediation) */
  publicLeverage: {
    totalLeverageAmountINR: number;      // ₹7,70,98,360 (~₹7.71 Cr)
    totalProjectsCount: number;          // 577 genuine projects
    subtotalDoubleCountingPurgedINR: number; // ~₹4.00 Cr purged from false ₹11.70 Cr myth
    annualBreakdown: Array<{
      fiscalYear: string;
      registerFile: string;
      verifiedAmountINR: number;
      projectItemsCount: number;
    }>;
    categoryBreakdown: Array<{
      schemeCategory: string;
      amountINR: number;
      percentage: number;
      unitsSanctioned: number;
      unitDescription: string;
    }>;
  };

  /** Jan Suvidha Kendra (JSK) frontline kiosk performance (2022–2025) */
  janSuvidhaKendra: {
    totalCitizenServicesDelivered: number;// 1,102 verified transactions
    activeKiosksCount: number;           // 4 kiosks
    topServiceTypes: Array<{
      serviceName: string;
      applicationsCount: number;
      deliveredCount: number;
      successRatePct: number;
    }>;
  };
}

export interface EntitlementSchemeDelivery {
  schemeKey: string;
  schemeName: string;
  department: string;
  sampleUniverse: number;                // 1,535 HHs
  round1Count: number;                   // Jan–Jun 2025
  round1Pct: number;
  round2Count: number;                   // Jul–Dec 2025
  round2Pct: number;
  round3Count: number;                   // Jan–Jun 2026
  round3Pct: number;
  round4Count: number;                   // Jul–Dec 2026
  round4Pct: number;
  fourRoundAveragePct: number;
  category: 'Health & Sanitation' | 'Education' | 'Civil ID & Banking' | 'Food Security' | 'Livelihoods';
}

// ==============================================================================
// 6. THEME 4: NUTRITION & DIETARY DIVERSITY DYNAMICS CONTRACTS
// ==============================================================================

export interface NutritionData {
  /** 60-Month continuous dietary dynamics (Baseline 2022 to Endline 2026) */
  foodGroupRecall: {
    whiteFoodsStaples: {
      baselineRangePct: string;          // "91.2% - 95.8%"
      endlineRangePct: string;           // "92.4% - 96.5%"
      accessDynamic: string;
    };
    greenFoodsVegetables: {
      summerPeakPctRange: string;        // "67.2% - 70.4%"
      winterTroughBaselinePct: number;   // 31.4% (2022)
      winterTroughEndlinePct: number;    // 42.8% (2026)
      netWinterRemediationGainPp: number;// +11.4 percentage points
      invertedMythDescription: string;
    };
    yellowFoodsPulses: {
      baselineWeeklyPct: number;         // 42.6% (2022)
      endlineWeeklyPct: number;          // 66.4% (2026)
      reversalExpansionGainPp: number;   // +23.8 percentage points
      indigenousPulseRetentionKg: number;// ~50 kg retained per HH
    };
  };

  /** 12-Month seasonal consumption trend series across food groups */
  monthlySeasonalDynamics: MonthlyDietaryObservation[];

  /** Poshan Vatikas (Homestead Bio-Diverse Nutrition Gardens) */
  poshanVatikas: {
    baselineGardensCount: number;        // 200 units (2022)
    endlineGardensCount: number;         // 1,120+ units (2026)
    saturationPctOfHHs: number;          // ~73.0% of households
    micronutrientKeyFocus: string[];     // ['Iron', 'Folate', 'Vitamin A', 'Dietary Fiber']
  };
}

export interface MonthlyDietaryObservation {
  calendarMonth: string;                 // 'Jan', 'Feb', ... 'Dec'
  whiteFoodsAccessPct: number;
  greenFoodsAccessPct: number;
  yellowFoodsAccessPct: number;
  isSummerPeakWindow: boolean;
  isWinterTroughWindow: boolean;
  notes: string;
}

// ==============================================================================
// 7. THEME 5: FORENSIC LEDGER & AUDIT MATRIX CONTRACTS
// ==============================================================================

export interface ForensicLedgerData {
  /** Audit overview metrics */
  auditOverview: {
    totalAuditedClaims: number;          // 490 claims
    verifiedClaimsCount: number;
    reconciledClaimsCount: number;
    neutralizedDefectsCount: number;
    zeroPiiViolationsCount: number;      // 0 violations confirmed
  };

  /** The Seven Systemic Defects Formally Audited and Remediated */
  systemicDefects: SystemicDefectItem[];

  /** Perfect ₹0.00 Slice Identity Proof (Income Data Sheet) */
  sliceIdentityProof: {
    farmerRowsCount: number;             // 1,487 genuine farmers (Rows 4:1490)
    grandTotalRowIndex: number;          // Row 1492
    metrics: Array<{
      metricName: string;
      farmerRowsSum: number;
      grandTotalCellValue: number;
      discrepancyDelta: number;          // Strict ₹0.00
      cellCoordinate: string;
      status: 'MATCH_ZERO_DISCREPANCY';
    }>;
  };

  /** Debunked Myth & Artifact Purge Registry */
  debunkedMyths: DebunkedMythRecord[];

  /** Four-Tier PII Redaction Verification Status */
  piiRedactionStatus: {
    phoneNumbersFoundCount: number;      // Exactly 0 in production deliverables
    namesAnonymizationPolicy: string;    // Synthetic identifiers FASAL-2026-XXXX
    childRosterTokenization: string;     // FASAL-2026-XXXX-M01
    geographyIntegrityPreserved: boolean;// True (GPs and villages intact)
  };
}

export interface SystemicDefectItem {
  defectId: 'SYS-1' | 'SYS-2' | 'SYS-3' | 'SYS-4' | 'SYS-5' | 'SYS-6' | 'SYS-7';
  title: string;
  historicalArtifact: string;
  remediatedTruth: string;
  safeguardMandate: string;
}

export interface DebunkedMythRecord {
  mythId: string;
  mythName: string;
  originatingContext: string;
  forensicInvestigation: string;
  neutralizationVerdict: string;
}

// ==============================================================================
// 8. INTERACTIVE CLIENT FILTER & THEME STATE CONTRACTS
// ==============================================================================

/**
 * Global filtering parameters applied reactively across all dashboard charts and tables.
 */
export interface FilterState {
  /** Filter by Gram Panchayat ('ALL' or one of 7 GP names) */
  selectedGP: string;
  /** Filter by specific village settlements ('ALL' or village name) */
  selectedVillage: string;
  /** Filter by social category */
  selectedCaste: 'ALL' | 'OBC' | 'ST' | 'SC' | 'General';
  /** Filter by operational landholding size tier */
  selectedLandTier: 'ALL' | 'LANDLESS' | 'MARGINAL_LE_1_ACRE' | 'SMALL_1_TO_2_ACRES' | 'MEDIUM_GT_2_ACRES';
  /** Regional bigha conversion factor multiplier (0.20, 0.25, 0.3333, 0.619) */
  bighaMultiplier: number;
  /** Active presentation mode */
  viewMode: 'EXECUTIVE' | 'RESEARCH';
}

/**
 * Theme and presentation environment state.
 */
export interface ThemeState {
  /** Active theme: 'light' (Editorial Monograph) or 'dark' (Executive Chamber) */
  theme: 'light' | 'dark';
  /** Toggles high-contrast printing stylesheet layout */
  isPrintOptimized: boolean;
}

