import React from 'react';
import type { EntitlementSchemeDelivery } from '@/types/dashboard';
import { inrShort } from '../../ui';

/* ----------------------------------------------------------------------------
   Labels, evidence ids and the hard-coded content carried over from the old
   Rights module. Numbers that live in fasalMasterData are read from there;
   only what the old module typed by hand is repeated here.
---------------------------------------------------------------------------- */

/** ₹7.71 Cr -> "₹7.71 crore", ₹94.5 L -> "₹94.5 lakh" for running text. */
export const crore = (n: number) => inrShort(n).replace(' Cr', ' crore').replace(' L', ' lakh');

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
/** 4 -> "four" (falls back to the numeral above ten). */
export const word = (n: number) => WORDS[n] ?? String(n);
export const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Survey rounds ---------- */

export const ROUNDS = [
  { short: 'R1', name: 'Round 1', period: 'Jan–Jun 2025' },
  { short: 'R2', name: 'Round 2', period: 'Jul–Dec 2025' },
  { short: 'R3', name: 'Round 3', period: 'Jan–Jun 2026' },
  { short: 'R4', name: 'Round 4', period: 'Jul–Dec 2026' },
] as const;

export interface RoundPoint {
  pct: number;
  count: number;
}

export function roundsOf(s: EntitlementSchemeDelivery): RoundPoint[] {
  return [
    { pct: s.round1Pct, count: s.round1Count },
    { pct: s.round2Pct, count: s.round2Count },
    { pct: s.round3Pct, count: s.round3Count },
    { pct: s.round4Pct, count: s.round4Count },
  ];
}

/** Mean household count across the four rounds, rounded (as the old module did). */
export function averageCount(s: EntitlementSchemeDelivery): number {
  return Math.round((s.round1Count + s.round2Count + s.round3Count + s.round4Count) / 4);
}

/* ---------- Schemes ---------- */

export type SchemeCategory = EntitlementSchemeDelivery['category'];
export type CategoryFilter = 'all' | SchemeCategory;

export const CATEGORY_ORDER: SchemeCategory[] = [
  'Health & Sanitation',
  'Education',
  'Food Security',
  'Civil ID & Banking',
  'Livelihoods',
];

export const CATEGORY_LABEL: Record<SchemeCategory, string> = {
  'Health & Sanitation': 'Health and sanitation',
  Education: 'Education',
  'Food Security': 'Food security',
  'Civil ID & Banking': 'Civil ID and banking',
  Livelihoods: 'Livelihoods',
};

/** Plain-language names for the schemes; `detail` is used where the service is described. */
const SCHEME_LABEL: Record<string, { name: string; detail: string }> = {
  essential_meds: {
    name: 'Essential medicines',
    detail: 'Iron folic acid, calcium and albendazole tablets, delivered at the doorstep to adolescent girls and mothers.',
  },
  sanitary_napkins: {
    name: 'Sanitary napkins for adolescent girls',
    detail: 'Supplied to adolescent girls and young mothers under the Kishori Suraksha Yojana.',
  },
  teacher_attendance: {
    name: 'Primary school teachers present daily',
    detail: 'Daily teacher attendance in primary schools, audited by the Bal Sansad and by mothers in the union.',
  },
  mid_day_meal: {
    name: 'Mid-day meal served regularly',
    detail: 'A fresh hot meal cooked daily in primary schools under PM POSHAN, checked against the government’s nutrition guidelines.',
  },
  junior_school_access: {
    name: 'Junior high school access',
    detail: 'Enrolment access to classes 6–8 under the Samagra Shiksha Abhiyan.',
  },
  aadhaar_card: {
    name: 'Aadhaar card enrolment',
    detail: 'Biometric enrolment for the universal identity card.',
  },
  ration_card: {
    name: 'Ration cards',
    detail: 'Antyodaya and priority-household cards under the National Food Security Act.',
  },
  mgnrega_work: {
    name: 'MGNREGA wage work',
    detail: 'Paid work under the 100-day rural employment guarantee.',
  },
};

export const schemeName = (s: EntitlementSchemeDelivery) => SCHEME_LABEL[s.schemeKey]?.name ?? s.schemeName;
export const schemeDetail = (s: EntitlementSchemeDelivery) => SCHEME_LABEL[s.schemeKey]?.detail ?? s.schemeName;

/** Ledger entry for each scheme. Each entry records the round-one share. */
export const SCHEME_SRC: Record<string, string> = {
  essential_meds: 'REC-RNE-02',
  sanitary_napkins: 'REC-RNE-03',
  teacher_attendance: 'REC-RNE-04',
  mid_day_meal: 'REC-RNE-05',
  junior_school_access: 'REC-RNE-07',
  aadhaar_card: 'REC-RNE-06',
  ration_card: 'REC-RNE-08',
  mgnrega_work: 'REC-RNE-12',
};

/* ---------- Awareness, leadership, receipt ---------- */

/** Conversion rates the old module applied to recorded receipts to model the two earlier steps. */
export const FUNNEL = {
  awareToLeadPct: 60.7,
  leadToReceiptPct: 85.3,
  coRecordedRange: '93–98%',
};

export function funnelFor(receiptCount: number, universe: number) {
  const lead = Math.min(universe, Math.round(receiptCount / (FUNNEL.leadToReceiptPct / 100)));
  const aware = Math.min(universe, Math.max(lead, Math.round(lead / (FUNNEL.awareToLeadPct / 100))));
  return { aware, lead };
}

/* ---------- Frontline services ---------- */

/** Sixth service shown only in the old comparison against the 50% reference. */
export const SCHOOL_DESKS = { name: 'School desks and benches', pct: 28.3 };
export const REFERENCE_PCT = 50;

/* ---------- Public leverage ---------- */

/** Plain names for the register categories; `scheme` keeps the official name. */
const LEVERAGE_LABEL: Record<string, { name: string; scheme: string; src?: string }> = {
  'Pradhan Mantri Awas Yojana (PMAY-G)': {
    name: 'Rural housing',
    scheme: 'Pradhan Mantri Awas Yojana (PMAY-G)',
    src: 'REC-LEV-05',
  },
  'Interlocking CC Roads & Concrete Drains': {
    name: 'Village roads and drains',
    scheme: 'Interlocking and cement-concrete roads, concrete drains',
    src: 'REC-LEV-06',
  },
  'Jal Jeevan Mission (Har Ghar Nal Piped Water)': {
    name: 'Piped drinking water',
    scheme: 'Jal Jeevan Mission (Har Ghar Nal)',
    src: 'REC-LEV-07',
  },
  'Individual Household Latrines (SBM Gramin)': {
    name: 'Household latrines',
    scheme: 'Swachh Bharat Mission (Gramin)',
    src: 'REC-LEV-08',
  },
  'Solar Minigrids & High-Mast LED Lighting': {
    name: 'Solar lighting',
    scheme: 'Solar minigrids and high-mast LED lights',
  },
  'Free Minor Irrigation Engine Borings': {
    name: 'Irrigation borings',
    scheme: 'Free minor-irrigation engine borings',
  },
  'Community Soak Pits & Greywater Drainage': {
    name: 'Soak pits and greywater drains',
    scheme: 'Community soak pits and greywater drainage',
  },
};

export const leverageLabel = (schemeCategory: string) =>
  LEVERAGE_LABEL[schemeCategory] ?? { name: schemeCategory, scheme: '' };

export const ANNUAL_SRC: Record<string, string> = {
  '2023': 'REC-LEV-02',
  '2024': 'REC-LEV-03',
  '2025': 'REC-LEV-04',
};

/** The figure earlier synthesis drafts carried, before the registers were re-read. */
export const OLDER_CLAIM = { amountINR: 117021520, rows: 583 };

export const CORRECTIONS: Array<{ title: string; effect: string; detail: React.ReactNode }> = [
  {
    title: 'The 2025 total row was added to the works above it',
    effect: '+₹2,78,24,960',
    detail: (
      <>
        Row 165 of the 2025 register is a total, <span className="t-mono">=SUM(G7:G164)</span>. Adding up the whole
        column counted every 2025 work twice and turned ₹2.78 crore into ₹5.56 crore.
      </>
    ),
  },
  {
    title: 'A 2023 subtotal row was counted as if it were a work',
    effect: '+₹1,48,33,200',
    detail: (
      <>
        Row 264 of the 2023 register, <span className="t-mono">=SUBTOTAL(9,G103:G263)</span>, was included in the sum.
        The same sum missed ₹27.35 lakh of road works entered in column H.
      </>
    ),
  },
  {
    title: 'Footer rows were counted as works',
    effect: '+6 rows',
    detail: (
      <>
        Hindi notes, dates and signature rows at the foot of the sheets were counted, giving 583. The registers hold
        exactly 577 works.
      </>
    ),
  },
];

/* ---------- Jan Suvidha Kendra ---------- */

const KIOSK_SERVICE_LABEL: Record<string, string> = {
  'Aadhaar Card Correction & Biometric Update': 'Aadhaar card correction and biometric update',
  'PAN Card Registration & KYC Linking': 'PAN card registration and KYC linking',
  'Ration Card Family Addition / Separation': 'Ration card: adding or separating family members',
  'PM Kisan Samman Nidhi e-KYC Verification': 'PM-Kisan Samman Nidhi e-KYC verification',
};
export const kioskServiceName = (serviceName: string) => KIOSK_SERVICE_LABEL[serviceName] ?? serviceName;

/** Service lines verified in the kiosk service register (reconciliation sub-ledger 11). */
export const KIOSK_REGISTER: Array<{ name: string; department: string; records: number; sharePct: number; src?: string }> = [
  {
    name: 'Household latrine applications',
    department: 'Swachh Bharat Mission (Gramin)',
    records: 394,
    sharePct: 35.75,
    src: 'REC-JSK-02',
  },
  {
    name: 'Subsidised minor-irrigation borings',
    department: 'Minor Irrigation / Agriculture Department',
    records: 352,
    sharePct: 31.94,
    src: 'REC-JSK-03',
  },
  {
    name: 'Agro-ecological input and biological drum bookings',
    department: 'DEHAT agro-ecological package-of-practices linkage',
    records: 123,
    sharePct: 11.16,
  },
  {
    name: 'PM-Kisan Samman Nidhi portal registrations',
    department: 'Ministry of Agriculture and Farmers Welfare',
    records: 12,
    sharePct: 1.09,
    src: 'REC-JSK-04',
  },
];

/** The earlier draft count and what was removed from it. */
export const KIOSK_CORRECTION = { olderCount: 1118, removedRows: 16, titleBanners: 3, repeatHeaders: 3, blankSerials: 10 };
