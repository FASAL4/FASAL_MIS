import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { FilterState } from '../types/dashboard';

export type CasteCategoryKey = 'ALL' | 'OBC' | 'ST' | 'SC' | 'General';
export type LandholdingTierKey = 
  | 'ALL' 
  | 'LANDLESS' 
  | 'MARGINAL_LE_1_ACRE' 
  | 'SMALL_1_TO_2_ACRES' 
  | 'MEDIUM_GT_2_ACRES';

export interface CohortCombo {
  gp: string;
  village: string;
  caste: 'OBC' | 'ST' | 'SC' | 'General';
  tier: 'LANDLESS' | 'MARGINAL_LE_1_ACRE' | 'SMALL_1_TO_2_ACRES' | 'MEDIUM_GT_2_ACRES';
  count: number;
  bighaSum: number;
  bighas: number[];
}

export interface FilterContextValue {
  filters: FilterState;
  setGP: (gp: string) => void;
  setVillage: (village: string) => void;
  setCaste: (caste: CasteCategoryKey) => void;
  setLandTier: (tier: LandholdingTierKey) => void;
  setBighaMultiplier: (multiplier: number) => void;
  setViewMode: (mode: 'EXECUTIVE' | 'RESEARCH') => void;
  resetFilters: () => void;
  clearFilter: (key: 'selectedGP' | 'selectedVillage' | 'selectedCaste' | 'selectedLandTier') => void;
  cohortCount: number;
  cohortPercentage: number;
  totalHouseholds: number;
  meanLandBigha: number;
  meanLandAcres: number;
  medianLandBigha: number;
  medianLandAcres: number;
  isFiltered: boolean;
  activeFilterCount: number;
  isEmptyCohort: boolean;
  availableVillages: string[];
}

export const INITIAL_FILTER_STATE: FilterState = {
  selectedGP: 'ALL',
  selectedVillage: 'ALL',
  selectedCaste: 'ALL',
  selectedLandTier: 'ALL',
  bighaMultiplier: 0.20,
  viewMode: 'EXECUTIVE',
};

const TOTAL_SURVEY_HOUSEHOLDS = 1535;

/** 118 verified cohort combinations across 1,535 households */
const COHORT_COMBOS: CohortCombo[] = [
  {
    "gp": "Badkhadiya",
    "village": "Dhodhepurwa",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 3,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Badkhadiya",
    "village": "Dhodhepurwa",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 42,
    "bighaSum": 105.0,
    "bighas": [
      3.0,
      4.0,
      2.0,
      2.0,
      2.0,
      2.0,
      1.0,
      2.0,
      3.0,
      1.0,
      1.0,
      5.0,
      4.0,
      1.0,
      1.0,
      2.0,
      2.0,
      3.0,
      2.0,
      3.0,
      2.0,
      1.0,
      1.0,
      1.0,
      5.0,
      1.0,
      5.0,
      2.0,
      5.0,
      2.0,
      1.0,
      3.0,
      1.0,
      2.0,
      3.0,
      3.0,
      3.0,
      2.0,
      5.0,
      3.0,
      4.0,
      4.0
    ]
  },
  {
    "gp": "Badkhadiya",
    "village": "Dhodhepurwa",
    "caste": "OBC",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 2,
    "bighaSum": 23.0,
    "bighas": [
      12.0,
      11.0
    ]
  },
  {
    "gp": "Badkhadiya",
    "village": "Dhodhepurwa",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 5,
    "bighaSum": 41.0,
    "bighas": [
      10.0,
      7.0,
      6.0,
      8.0,
      10.0
    ]
  },
  {
    "gp": "Badkhadiya",
    "village": "Dhodhepurwa",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 9,
    "bighaSum": 10.4,
    "bighas": [
      1.0,
      1.0,
      1.0,
      2.0,
      1.0,
      1.0,
      1.0,
      0.4,
      2.0
    ]
  },
  {
    "gp": "Badkhadiya",
    "village": "Dhodhepurwa",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 2,
    "bighaSum": 6.0,
    "bighas": [
      2.0,
      4.0
    ]
  },
  {
    "gp": "Bajpur Bankati",
    "village": "Bajpur Bankati",
    "caste": "General",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 2,
    "bighaSum": 5.0,
    "bighas": [
      2.0,
      3.0
    ]
  },
  {
    "gp": "Bajpur Bankati",
    "village": "Bajpur Bankati",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 6,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Bajpur Bankati",
    "village": "Bajpur Bankati",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 95,
    "bighaSum": 246.7,
    "bighas": [
      2.0,
      4.0,
      5.0,
      3.0,
      3.0,
      5.0,
      1.0,
      2.0,
      2.0,
      2.0,
      3.0,
      3.0,
      2.0,
      1.2,
      1.0,
      1.0,
      2.0,
      2.5,
      1.0,
      1.0,
      4.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      2.0,
      2.0,
      1.0,
      2.0,
      3.0,
      2.0,
      3.0,
      3.0,
      2.0,
      2.0,
      4.0,
      3.0,
      1.0,
      2.0,
      4.0,
      2.0,
      1.0,
      4.0,
      2.0,
      3.0,
      2.0,
      3.0,
      2.0,
      1.0,
      4.0,
      1.0,
      2.0,
      3.0,
      3.0,
      2.0,
      3.0,
      5.0,
      2.0,
      2.0,
      4.0,
      3.0,
      3.0,
      2.0,
      1.0,
      2.0,
      5.0,
      3.0,
      4.0,
      4.0,
      2.0,
      1.0,
      2.0,
      3.0,
      1.0,
      2.0,
      2.0,
      2.0,
      4.0,
      2.0,
      3.0,
      2.0,
      4.0,
      5.0,
      4.0,
      4.0,
      5.0,
      5.0,
      3.0,
      5.0,
      3.0,
      3.0,
      3.0,
      3.0,
      4.0
    ]
  },
  {
    "gp": "Bajpur Bankati",
    "village": "Bajpur Bankati",
    "caste": "OBC",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 3,
    "bighaSum": 55.0,
    "bighas": [
      25.0,
      15.0,
      15.0
    ]
  },
  {
    "gp": "Bajpur Bankati",
    "village": "Bajpur Bankati",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 8,
    "bighaSum": 65.0,
    "bighas": [
      10.0,
      8.0,
      8.0,
      7.0,
      10.0,
      8.0,
      8.0,
      6.0
    ]
  },
  {
    "gp": "Bajpur Bankati",
    "village": "Bajpur Bankati",
    "caste": "SC",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Bajpur Bankati",
    "village": "Bajpur Bankati",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 10,
    "bighaSum": 31.0,
    "bighas": [
      3.0,
      3.0,
      3.0,
      3.0,
      5.0,
      3.0,
      2.0,
      3.0,
      3.0,
      3.0
    ]
  },
  {
    "gp": "Bajpur Bankati",
    "village": "Bajpur Bankati",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 4,
    "bighaSum": 9.0,
    "bighas": [
      2.0,
      3.0,
      2.0,
      2.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Ghoorepurwa",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 24,
    "bighaSum": 65.0,
    "bighas": [
      4.0,
      3.0,
      4.0,
      4.0,
      2.0,
      2.0,
      3.0,
      2.0,
      2.0,
      3.0,
      2.0,
      2.0,
      2.0,
      3.0,
      4.0,
      2.0,
      2.0,
      2.0,
      2.0,
      2.0,
      3.0,
      5.0,
      2.0,
      3.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Ghoorepurwa",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 1,
    "bighaSum": 6.0,
    "bighas": [
      6.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Ghoorepurwa",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 3,
    "bighaSum": 9.0,
    "bighas": [
      3.0,
      5.0,
      1.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Ghoorepurwa",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 2,
    "bighaSum": 6.0,
    "bighas": [
      4.0,
      2.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Kailash Nagar",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 5,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Kailash Nagar",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 53,
    "bighaSum": 138.0,
    "bighas": [
      1.0,
      1.0,
      1.0,
      2.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      2.0,
      5.0,
      3.0,
      2.0,
      2.0,
      3.0,
      2.0,
      2.0,
      3.0,
      1.0,
      5.0,
      3.0,
      5.0,
      3.0,
      1.0,
      4.0,
      5.0,
      3.0,
      5.0,
      5.0,
      3.0,
      2.0,
      2.0,
      2.0,
      2.0,
      1.0,
      4.0,
      2.0,
      3.0,
      2.0,
      2.0,
      3.0,
      3.0,
      4.0,
      3.0,
      2.0,
      3.0,
      4.0,
      3.0,
      3.0,
      3.0,
      2.0,
      2.0,
      4.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Kailash Nagar",
    "caste": "OBC",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 2,
    "bighaSum": 24.0,
    "bighas": [
      12.0,
      12.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Kailash Nagar",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 12,
    "bighaSum": 94.0,
    "bighas": [
      10.0,
      8.0,
      8.0,
      10.0,
      6.0,
      6.0,
      8.0,
      10.0,
      8.0,
      7.0,
      7.0,
      6.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Kailash Nagar",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 1,
    "bighaSum": 1.0,
    "bighas": [
      1.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Sirsiyanpurwa",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 5,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Sirsiyanpurwa",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 84,
    "bighaSum": 175.45,
    "bighas": [
      1.0,
      3.0,
      1.0,
      1.0,
      2.0,
      5.0,
      2.0,
      1.0,
      2.0,
      2.0,
      2.0,
      3.0,
      2.0,
      1.0,
      1.0,
      1.0,
      1.0,
      4.0,
      2.0,
      2.0,
      2.0,
      1.0,
      5.0,
      2.0,
      1.0,
      2.0,
      0.1,
      1.05,
      2.05,
      2.0,
      2.0,
      2.0,
      5.0,
      2.0,
      0.0,
      0.05,
      3.0,
      3.0,
      3.0,
      1.0,
      2.0,
      1.0,
      3.0,
      1.0,
      2.0,
      2.0,
      3.0,
      2.0,
      2.0,
      2.0,
      2.0,
      2.0,
      2.0,
      3.0,
      2.0,
      2.0,
      2.0,
      2.0,
      2.0,
      2.0,
      1.0,
      2.0,
      3.0,
      2.0,
      2.0,
      2.0,
      2.0,
      3.0,
      3.0,
      3.0,
      3.0,
      2.0,
      2.0,
      2.05,
      0.05,
      1.05,
      5.0,
      2.0,
      1.05,
      1.0,
      3.0,
      5.0,
      3.0,
      3.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Sirsiyanpurwa",
    "caste": "OBC",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 1,
    "bighaSum": 11.0,
    "bighas": [
      11.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Sirsiyanpurwa",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 5,
    "bighaSum": 33.0,
    "bighas": [
      7.0,
      7.0,
      6.0,
      7.0,
      6.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Sirsiyanpurwa",
    "caste": "SC",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Chahalwa",
    "village": "Sirsiyanpurwa",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 2,
    "bighaSum": 7.0,
    "bighas": [
      3.0,
      4.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Badihanpurwa",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 2,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Badihanpurwa",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 12,
    "bighaSum": 36.0,
    "bighas": [
      2.0,
      3.0,
      2.0,
      2.0,
      2.0,
      5.0,
      2.0,
      4.0,
      3.0,
      5.0,
      3.0,
      3.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Badihanpurwa",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 3,
    "bighaSum": 7.0,
    "bighas": [
      2.0,
      3.0,
      2.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Fakirpuri",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Fakirpuri",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 10,
    "bighaSum": 25.0,
    "bighas": [
      4.0,
      3.0,
      2.0,
      1.0,
      3.0,
      1.0,
      5.0,
      1.0,
      3.0,
      2.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Fakirpuri",
    "caste": "OBC",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 1,
    "bighaSum": 20.0,
    "bighas": [
      20.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Fakirpuri",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 3,
    "bighaSum": 26.0,
    "bighas": [
      6.0,
      10.0,
      10.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Fakirpuri",
    "caste": "ST",
    "tier": "LANDLESS",
    "count": 9,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Fakirpuri",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 121,
    "bighaSum": 361.25,
    "bighas": [
      4.0,
      1.0,
      5.0,
      5.0,
      4.0,
      4.0,
      4.0,
      5.0,
      3.0,
      1.0,
      1.0,
      2.0,
      1.0,
      1.0,
      1.0,
      1.0,
      5.0,
      5.0,
      1.0,
      5.0,
      1.0,
      1.0,
      5.0,
      4.0,
      1.0,
      1.0,
      1.0,
      3.0,
      5.0,
      3.0,
      4.0,
      5.0,
      5.0,
      1.0,
      2.0,
      2.0,
      3.0,
      2.0,
      5.0,
      5.0,
      5.0,
      5.0,
      4.0,
      1.0,
      2.0,
      5.0,
      2.0,
      3.0,
      3.0,
      3.0,
      5.0,
      5.0,
      3.0,
      3.0,
      1.5,
      5.0,
      3.0,
      2.0,
      5.0,
      5.0,
      5.0,
      5.0,
      5.0,
      5.0,
      5.0,
      1.0,
      5.0,
      1.0,
      5.0,
      1.0,
      1.0,
      4.0,
      2.0,
      1.0,
      3.0,
      1.0,
      5.0,
      5.0,
      5.0,
      1.0,
      5.0,
      5.0,
      5.0,
      5.0,
      5.0,
      2.0,
      1.0,
      5.0,
      1.0,
      1.0,
      2.0,
      1.0,
      4.0,
      1.0,
      1.5,
      1.0,
      5.0,
      5.0,
      2.0,
      1.0,
      1.0,
      1.0,
      4.0,
      2.0,
      0.75,
      0.5,
      2.0,
      3.0,
      1.0,
      4.0,
      5.0,
      2.5,
      1.5,
      1.0,
      5.0,
      2.0,
      2.0,
      3.0,
      1.0,
      1.0,
      5.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Fakirpuri",
    "caste": "ST",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 10,
    "bighaSum": 195.0,
    "bighas": [
      22.0,
      20.0,
      11.0,
      15.0,
      30.0,
      30.0,
      16.0,
      16.0,
      20.0,
      15.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Fakirpuri",
    "caste": "ST",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 27,
    "bighaSum": 254.0,
    "bighas": [
      10.0,
      10.0,
      8.0,
      10.0,
      10.0,
      7.0,
      8.0,
      10.0,
      10.0,
      10.0,
      10.0,
      6.0,
      10.0,
      8.0,
      7.0,
      10.0,
      10.0,
      10.0,
      10.0,
      10.0,
      10.0,
      10.0,
      10.0,
      10.0,
      10.0,
      10.0,
      10.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Rampurwa",
    "caste": "ST",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Rampurwa",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 37,
    "bighaSum": 131.9,
    "bighas": [
      5.0,
      1.0,
      5.0,
      5.0,
      3.0,
      4.0,
      3.0,
      3.0,
      5.0,
      1.0,
      1.0,
      2.5,
      5.0,
      5.0,
      2.0,
      3.0,
      3.0,
      4.0,
      3.0,
      5.0,
      5.0,
      2.0,
      5.0,
      5.0,
      2.0,
      5.0,
      5.0,
      2.0,
      2.0,
      2.0,
      5.0,
      0.4,
      3.0,
      5.0,
      5.0,
      5.0,
      5.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Rampurwa",
    "caste": "ST",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 3,
    "bighaSum": 41.0,
    "bighas": [
      15.0,
      14.0,
      12.0
    ]
  },
  {
    "gp": "Fakirpuri",
    "village": "Rampurwa",
    "caste": "ST",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 9,
    "bighaSum": 68.0,
    "bighas": [
      7.0,
      10.0,
      7.0,
      10.0,
      7.0,
      6.0,
      7.0,
      7.0,
      7.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Badhiyanpurwa",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 3,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Badhiyanpurwa",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 36,
    "bighaSum": 113.0,
    "bighas": [
      5.0,
      3.0,
      4.0,
      3.0,
      4.0,
      2.0,
      4.0,
      3.0,
      4.0,
      3.0,
      4.0,
      4.0,
      4.0,
      2.0,
      4.0,
      5.0,
      4.0,
      2.0,
      4.0,
      2.0,
      2.0,
      3.0,
      2.0,
      3.0,
      2.0,
      3.0,
      3.0,
      2.0,
      3.0,
      2.0,
      4.0,
      2.0,
      2.0,
      2.0,
      3.0,
      5.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Badhiyanpurwa",
    "caste": "SC",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Badhiyanpurwa",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 1,
    "bighaSum": 3.0,
    "bighas": [
      3.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Badhiyanpurwa",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 1,
    "bighaSum": 3.0,
    "bighas": [
      3.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhatta Bargadaha",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 19,
    "bighaSum": 62.0,
    "bighas": [
      3.0,
      2.0,
      3.0,
      3.0,
      5.0,
      3.0,
      4.0,
      4.0,
      3.0,
      2.0,
      4.0,
      3.0,
      2.0,
      4.0,
      4.0,
      3.0,
      3.0,
      4.0,
      3.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhatta Bargadaha",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 4,
    "bighaSum": 26.0,
    "bighas": [
      7.0,
      6.0,
      7.0,
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhatta Bargadaha",
    "caste": "SC",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhatta Bargadaha",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 34,
    "bighaSum": 103.0,
    "bighas": [
      3.0,
      4.0,
      4.0,
      5.0,
      2.0,
      4.0,
      2.0,
      3.0,
      5.0,
      1.0,
      2.0,
      3.0,
      3.0,
      1.0,
      2.0,
      3.0,
      3.0,
      3.0,
      4.0,
      2.0,
      2.0,
      5.0,
      4.0,
      3.0,
      4.0,
      1.0,
      2.0,
      2.0,
      3.0,
      4.0,
      2.0,
      5.0,
      4.0,
      3.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhatta Bargadaha",
    "caste": "SC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 1,
    "bighaSum": 6.0,
    "bighas": [
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhatta Bargadaha",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 12,
    "bighaSum": 34.0,
    "bighas": [
      2.0,
      4.0,
      2.0,
      3.0,
      5.0,
      4.0,
      4.0,
      3.0,
      1.0,
      2.0,
      2.0,
      2.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhatta Bargadaha",
    "caste": "ST",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 1,
    "bighaSum": 10.0,
    "bighas": [
      10.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhodahanpurwa",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhodahanpurwa",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 42,
    "bighaSum": 94.6,
    "bighas": [
      1.0,
      5.0,
      0.1,
      4.0,
      1.0,
      3.0,
      1.0,
      2.0,
      1.0,
      2.0,
      1.0,
      1.0,
      2.0,
      3.0,
      5.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      2.0,
      3.0,
      1.5,
      2.0,
      4.0,
      2.0,
      2.0,
      2.0,
      2.0,
      3.0,
      2.0,
      3.0,
      5.0,
      5.0,
      3.0,
      1.0,
      1.0,
      4.0,
      3.0,
      1.0,
      5.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhodahanpurwa",
    "caste": "OBC",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 1,
    "bighaSum": 25.0,
    "bighas": [
      25.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhodahanpurwa",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 3,
    "bighaSum": 22.0,
    "bighas": [
      10.0,
      6.0,
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhodahanpurwa",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 2,
    "bighaSum": 5.0,
    "bighas": [
      2.0,
      3.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Bhodahanpurwa",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 4,
    "bighaSum": 12.0,
    "bighas": [
      3.0,
      3.0,
      3.0,
      3.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Hajaripurwa",
    "caste": "General",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Hajaripurwa",
    "caste": "General",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 4,
    "bighaSum": 10.0,
    "bighas": [
      2.0,
      1.0,
      2.0,
      5.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Hajaripurwa",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 3,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Hajaripurwa",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 55,
    "bighaSum": 150.0,
    "bighas": [
      1.0,
      4.0,
      2.0,
      2.0,
      4.0,
      3.0,
      1.0,
      4.0,
      4.0,
      1.0,
      3.0,
      3.0,
      3.0,
      2.0,
      2.0,
      1.0,
      1.0,
      2.0,
      2.0,
      2.0,
      2.0,
      4.0,
      2.0,
      1.0,
      4.0,
      4.0,
      2.0,
      3.0,
      3.0,
      1.0,
      5.0,
      4.0,
      2.0,
      5.0,
      2.0,
      5.0,
      2.0,
      1.0,
      2.0,
      2.0,
      2.0,
      5.0,
      4.0,
      3.0,
      2.0,
      1.0,
      4.0,
      3.0,
      2.0,
      4.0,
      5.0,
      4.0,
      2.0,
      2.0,
      4.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Hajaripurwa",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 6,
    "bighaSum": 36.0,
    "bighas": [
      6.0,
      6.0,
      6.0,
      6.0,
      6.0,
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Hajaripurwa",
    "caste": "SC",
    "tier": "LANDLESS",
    "count": 3,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Hajaripurwa",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 57,
    "bighaSum": 163.0,
    "bighas": [
      3.0,
      2.0,
      1.0,
      1.0,
      1.0,
      3.0,
      2.0,
      4.0,
      4.0,
      3.0,
      2.0,
      4.0,
      3.0,
      4.0,
      1.0,
      4.0,
      4.0,
      5.0,
      4.0,
      2.0,
      1.0,
      4.0,
      3.0,
      2.0,
      3.0,
      2.0,
      2.0,
      2.0,
      3.0,
      2.0,
      3.0,
      2.0,
      2.0,
      4.0,
      2.0,
      2.0,
      4.0,
      3.0,
      2.0,
      4.0,
      2.0,
      4.0,
      4.0,
      4.0,
      2.0,
      4.0,
      2.0,
      2.0,
      4.0,
      3.0,
      4.0,
      4.0,
      2.0,
      3.0,
      4.0,
      4.0,
      2.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Hajaripurwa",
    "caste": "SC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 4,
    "bighaSum": 25.0,
    "bighas": [
      6.0,
      6.0,
      6.0,
      7.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Jamuniha",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 2,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Jamuniha",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 37,
    "bighaSum": 119.5,
    "bighas": [
      2.5,
      1.0,
      3.0,
      5.0,
      4.0,
      1.0,
      2.0,
      5.0,
      1.0,
      2.0,
      1.0,
      1.0,
      1.0,
      2.0,
      5.0,
      3.0,
      5.0,
      3.0,
      2.0,
      2.0,
      3.0,
      5.0,
      5.0,
      5.0,
      4.0,
      3.0,
      5.0,
      5.0,
      5.0,
      4.0,
      4.0,
      5.0,
      4.0,
      3.0,
      2.0,
      5.0,
      1.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Jamuniha",
    "caste": "OBC",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 2,
    "bighaSum": 24.0,
    "bighas": [
      12.0,
      12.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Jamuniha",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 1,
    "bighaSum": 6.0,
    "bighas": [
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Jamuniha",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 8,
    "bighaSum": 23.0,
    "bighas": [
      2.0,
      2.0,
      2.0,
      5.0,
      2.0,
      5.0,
      3.0,
      2.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Jamuniha",
    "caste": "ST",
    "tier": "LANDLESS",
    "count": 3,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Jamuniha",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 56,
    "bighaSum": 113.0,
    "bighas": [
      1.5,
      1.0,
      2.0,
      3.0,
      1.0,
      5.0,
      1.75,
      1.0,
      1.5,
      4.0,
      1.5,
      1.0,
      5.0,
      1.0,
      1.0,
      3.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      5.0,
      3.0,
      2.5,
      1.0,
      5.0,
      1.0,
      2.0,
      1.0,
      0.25,
      2.0,
      5.0,
      3.0,
      2.0,
      2.0,
      2.0,
      1.0,
      1.5,
      1.0,
      2.0,
      1.0,
      3.0,
      1.5,
      1.0,
      5.0,
      2.0,
      1.0,
      2.0,
      2.0,
      1.0,
      1.0,
      3.0,
      2.0,
      3.0,
      2.0,
      1.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Jamuniha",
    "caste": "ST",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 3,
    "bighaSum": 39.0,
    "bighas": [
      13.0,
      14.0,
      12.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Jamuniha",
    "caste": "ST",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 8,
    "bighaSum": 73.0,
    "bighas": [
      9.0,
      10.0,
      10.0,
      10.0,
      8.0,
      10.0,
      10.0,
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Lohra",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 11,
    "bighaSum": 36.0,
    "bighas": [
      2.0,
      2.0,
      2.0,
      3.0,
      4.0,
      4.0,
      4.0,
      4.0,
      4.0,
      2.0,
      5.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Lohra",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 1,
    "bighaSum": 7.0,
    "bighas": [
      7.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Lohra",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 12,
    "bighaSum": 31.0,
    "bighas": [
      1.0,
      1.0,
      2.0,
      2.0,
      5.0,
      2.0,
      3.0,
      2.0,
      4.0,
      3.0,
      4.0,
      2.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Lohra",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 10,
    "bighaSum": 31.0,
    "bighas": [
      1.0,
      2.0,
      5.0,
      1.0,
      4.0,
      2.0,
      5.0,
      4.0,
      3.0,
      4.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Lohra",
    "caste": "ST",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 4,
    "bighaSum": 29.0,
    "bighas": [
      7.0,
      8.0,
      6.0,
      8.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Narayan Tanda",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 12,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Narayan Tanda",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 59,
    "bighaSum": 157.25,
    "bighas": [
      2.0,
      5.0,
      0.5,
      1.0,
      2.0,
      2.0,
      1.0,
      2.0,
      1.0,
      1.0,
      1.0,
      1.0,
      2.0,
      3.0,
      2.0,
      3.0,
      2.0,
      2.0,
      3.0,
      0.75,
      3.0,
      3.0,
      2.0,
      2.0,
      3.0,
      2.0,
      3.0,
      3.0,
      1.0,
      1.0,
      3.0,
      2.0,
      3.0,
      2.0,
      3.0,
      2.0,
      2.0,
      3.0,
      3.0,
      4.0,
      3.0,
      3.0,
      2.0,
      3.0,
      2.0,
      4.0,
      4.0,
      5.0,
      5.0,
      3.0,
      5.0,
      4.0,
      5.0,
      2.0,
      3.0,
      4.0,
      5.0,
      4.0,
      4.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Narayan Tanda",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 4,
    "bighaSum": 33.0,
    "bighas": [
      10.0,
      7.0,
      6.0,
      10.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Narayan Tanda",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 10,
    "bighaSum": 35.0,
    "bighas": [
      3.0,
      3.0,
      3.0,
      3.0,
      4.0,
      3.0,
      5.0,
      3.0,
      4.0,
      4.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Narayan Tanda",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 1,
    "bighaSum": 3.0,
    "bighas": [
      3.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "General",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 1,
    "bighaSum": 6.0,
    "bighas": [
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 7,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 98,
    "bighaSum": 290.4,
    "bighas": [
      2.0,
      1.0,
      2.0,
      3.0,
      4.0,
      3.0,
      4.0,
      2.5,
      3.0,
      2.0,
      4.0,
      2.0,
      0.5,
      2.0,
      2.0,
      4.0,
      1.0,
      5.0,
      3.0,
      5.0,
      1.0,
      3.0,
      2.0,
      1.0,
      2.0,
      3.0,
      2.0,
      2.0,
      2.0,
      5.0,
      2.5,
      3.0,
      0.05,
      2.1,
      5.0,
      1.0,
      5.0,
      1.05,
      5.0,
      5.0,
      5.0,
      3.0,
      3.0,
      2.0,
      2.0,
      2.0,
      2.0,
      1.5,
      5.0,
      5.0,
      3.0,
      3.0,
      2.0,
      2.0,
      2.0,
      3.0,
      3.0,
      3.0,
      3.0,
      2.0,
      4.0,
      2.0,
      4.0,
      2.0,
      3.0,
      4.0,
      5.0,
      5.0,
      1.0,
      4.0,
      4.0,
      3.0,
      5.0,
      5.0,
      4.0,
      1.1,
      1.1,
      5.0,
      5.0,
      3.0,
      2.0,
      3.0,
      3.0,
      4.0,
      3.0,
      3.0,
      2.0,
      2.0,
      3.0,
      3.0,
      3.0,
      2.0,
      5.0,
      3.0,
      5.0,
      3.0,
      3.0,
      4.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "OBC",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 1,
    "bighaSum": 15.0,
    "bighas": [
      15.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 13,
    "bighaSum": 88.0,
    "bighas": [
      6.0,
      7.0,
      10.0,
      7.0,
      8.0,
      6.0,
      7.0,
      6.0,
      7.0,
      6.0,
      6.0,
      6.0,
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "SC",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 18,
    "bighaSum": 62.1,
    "bighas": [
      2.1,
      2.0,
      3.0,
      4.0,
      4.0,
      3.0,
      4.0,
      4.0,
      4.0,
      4.0,
      3.0,
      2.0,
      5.0,
      4.0,
      4.0,
      3.0,
      5.0,
      2.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "SC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 4,
    "bighaSum": 25.0,
    "bighas": [
      6.0,
      6.0,
      7.0,
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 5,
    "bighaSum": 17.0,
    "bighas": [
      3.0,
      5.0,
      4.0,
      3.0,
      2.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Rajaram Tanda",
    "caste": "ST",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 1,
    "bighaSum": 6.0,
    "bighas": [
      6.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Vishuntanda",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 6,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Vishuntanda",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 43,
    "bighaSum": 126.18,
    "bighas": [
      3.0,
      1.0,
      3.0,
      4.0,
      4.0,
      3.0,
      2.0,
      4.0,
      2.0,
      3.0,
      4.0,
      5.0,
      4.0,
      1.0,
      3.0,
      5.0,
      1.03,
      1.0,
      3.1,
      1.0,
      2.0,
      2.0,
      3.0,
      3.0,
      2.0,
      2.0,
      5.0,
      3.0,
      3.0,
      3.0,
      3.0,
      2.0,
      2.0,
      2.0,
      2.05,
      5.0,
      5.0,
      3.0,
      3.0,
      4.0,
      4.0,
      4.0,
      2.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Vishuntanda",
    "caste": "OBC",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 3,
    "bighaSum": 45.0,
    "bighas": [
      15.0,
      15.0,
      15.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Vishuntanda",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 9,
    "bighaSum": 71.0,
    "bighas": [
      10.0,
      7.0,
      7.0,
      8.0,
      6.0,
      10.0,
      10.0,
      6.0,
      7.0
    ]
  },
  {
    "gp": "Karikot",
    "village": "Vishuntanda",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 4,
    "bighaSum": 13.0,
    "bighas": [
      5.0,
      4.0,
      2.0,
      2.0
    ]
  },
  {
    "gp": "Mangalpurwa",
    "village": "Mangalpurwa",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 9,
    "bighaSum": 23.0,
    "bighas": [
      3.0,
      2.0,
      2.0,
      2.0,
      2.0,
      4.0,
      1.0,
      3.0,
      4.0
    ]
  },
  {
    "gp": "Mangalpurwa",
    "village": "Mangalpurwa",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 2,
    "bighaSum": 15.0,
    "bighas": [
      8.0,
      7.0
    ]
  },
  {
    "gp": "Mangalpurwa",
    "village": "Mangalpurwa",
    "caste": "SC",
    "tier": "LANDLESS",
    "count": 8,
    "bighaSum": 0.0,
    "bighas": [
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    ]
  },
  {
    "gp": "Mangalpurwa",
    "village": "Mangalpurwa",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 54,
    "bighaSum": 146.1,
    "bighas": [
      2.0,
      3.0,
      1.0,
      2.0,
      2.0,
      2.0,
      2.0,
      3.0,
      4.0,
      4.0,
      3.0,
      2.0,
      2.0,
      3.0,
      2.0,
      3.0,
      5.0,
      2.0,
      2.0,
      2.0,
      2.0,
      2.0,
      3.0,
      2.0,
      2.0,
      2.0,
      2.0,
      1.0,
      5.0,
      2.0,
      4.0,
      5.0,
      4.0,
      2.0,
      4.0,
      5.0,
      2.0,
      3.0,
      1.0,
      3.0,
      5.0,
      2.0,
      0.0,
      0.05,
      4.0,
      4.0,
      4.0,
      0.0,
      2.05,
      2.0,
      4.0,
      4.0,
      4.0,
      4.0
    ]
  },
  {
    "gp": "Mangalpurwa",
    "village": "Mangalpurwa",
    "caste": "SC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 5,
    "bighaSum": 36.0,
    "bighas": [
      10.0,
      7.0,
      6.0,
      6.0,
      7.0
    ]
  },
  {
    "gp": "Mangalpurwa",
    "village": "Mangalpurwa",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 1,
    "bighaSum": 1.0,
    "bighas": [
      1.0
    ]
  },
  {
    "gp": "Vishunapur",
    "village": "Vishunapur",
    "caste": "OBC",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Vishunapur",
    "village": "Vishunapur",
    "caste": "OBC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 11,
    "bighaSum": 28.0,
    "bighas": [
      2.0,
      2.0,
      2.0,
      2.0,
      3.0,
      3.0,
      3.0,
      3.0,
      2.0,
      4.0,
      2.0
    ]
  },
  {
    "gp": "Vishunapur",
    "village": "Vishunapur",
    "caste": "OBC",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 1,
    "bighaSum": 6.0,
    "bighas": [
      6.0
    ]
  },
  {
    "gp": "Vishunapur",
    "village": "Vishunapur",
    "caste": "SC",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 1,
    "bighaSum": 2.0,
    "bighas": [
      2.0
    ]
  },
  {
    "gp": "Vishunapur",
    "village": "Vishunapur",
    "caste": "ST",
    "tier": "LANDLESS",
    "count": 1,
    "bighaSum": 0.0,
    "bighas": [
      0.0
    ]
  },
  {
    "gp": "Vishunapur",
    "village": "Vishunapur",
    "caste": "ST",
    "tier": "MARGINAL_LE_1_ACRE",
    "count": 28,
    "bighaSum": 93.0,
    "bighas": [
      3.0,
      3.0,
      3.0,
      5.0,
      1.0,
      5.0,
      5.0,
      5.0,
      5.0,
      5.0,
      5.0,
      3.0,
      5.0,
      1.0,
      2.0,
      1.0,
      2.0,
      2.0,
      2.0,
      5.0,
      3.0,
      3.0,
      2.0,
      5.0,
      3.0,
      1.0,
      5.0,
      3.0
    ]
  },
  {
    "gp": "Vishunapur",
    "village": "Vishunapur",
    "caste": "ST",
    "tier": "MEDIUM_GT_2_ACRES",
    "count": 3,
    "bighaSum": 39.0,
    "bighas": [
      12.0,
      15.0,
      12.0
    ]
  },
  {
    "gp": "Vishunapur",
    "village": "Vishunapur",
    "caste": "ST",
    "tier": "SMALL_1_TO_2_ACRES",
    "count": 10,
    "bighaSum": 86.0,
    "bighas": [
      6.0,
      6.0,
      10.0,
      10.0,
      8.0,
      8.0,
      10.0,
      8.0,
      10.0,
      10.0
    ]
  }
];

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  // Cascading Village List based on selected GP
  const availableVillages = useMemo(() => {
    if (filters.selectedGP === 'ALL') {
      const allVillages = Array.from(new Set(COHORT_COMBOS.map((h) => h.village)));
      return allVillages.sort();
    }
    const gpVillages = Array.from(
      new Set(COHORT_COMBOS.filter((h) => h.gp === filters.selectedGP).map((h) => h.village))
    );
    return gpVillages.sort();
  }, [filters.selectedGP]);

  // Set GP with cascading reset of selectedVillage if it does not belong to new GP
  const setGP = useCallback((gp: string) => {
    setFilters((prev) => {
      let nextVillage = prev.selectedVillage;
      if (gp !== 'ALL' && nextVillage !== 'ALL') {
        const belongs = COHORT_COMBOS.some((h) => h.gp === gp && h.village === nextVillage);
        if (!belongs) nextVillage = 'ALL';
      }
      return { ...prev, selectedGP: gp, selectedVillage: nextVillage };
    });
  }, []);

  const setVillage = useCallback((village: string) => {
    setFilters((prev) => {
      let inferredGP = prev.selectedGP;
      if (village !== 'ALL' && inferredGP === 'ALL') {
        const match = COHORT_COMBOS.find((h) => h.village === village);
        if (match) inferredGP = match.gp;
      }
      return { ...prev, selectedVillage: village, selectedGP: inferredGP };
    });
  }, []);

  const setCaste = useCallback((caste: CasteCategoryKey) => {
    setFilters((prev) => ({ ...prev, selectedCaste: caste }));
  }, []);

  const setLandTier = useCallback((tier: LandholdingTierKey) => {
    setFilters((prev) => ({ ...prev, selectedLandTier: tier }));
  }, []);

  const setBighaMultiplier = useCallback((multiplier: number) => {
    setFilters((prev) => ({ ...prev, bighaMultiplier: multiplier }));
  }, []);

  const setViewMode = useCallback((mode: 'EXECUTIVE' | 'RESEARCH') => {
    setFilters((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...INITIAL_FILTER_STATE,
      bighaMultiplier: prev.bighaMultiplier,
      viewMode: prev.viewMode,
    }));
  }, []);

  const clearFilter = useCallback((key: 'selectedGP' | 'selectedVillage' | 'selectedCaste' | 'selectedLandTier') => {
    setFilters((prev) => {
      const next = { ...prev, [key]: 'ALL' };
      if (key === 'selectedGP' && next.selectedVillage !== 'ALL') {
        // If resetting GP to ALL, keep village
      }
      return next;
    });
  }, []);

  // Compute Filtered Cohort Stats
  const { cohortCount, meanLandBigha, meanLandAcres, medianLandBigha, medianLandAcres } = useMemo(() => {
    let count = 0;
    let bighaSum = 0;
    const bighas: number[] = [];

    for (const item of COHORT_COMBOS) {
      if (filters.selectedGP !== 'ALL' && item.gp !== filters.selectedGP) continue;
      if (filters.selectedVillage !== 'ALL' && item.village !== filters.selectedVillage) continue;
      if (filters.selectedCaste !== 'ALL' && item.caste !== filters.selectedCaste) continue;
      if (filters.selectedLandTier !== 'ALL' && item.tier !== filters.selectedLandTier) continue;

      count += item.count;
      bighaSum += item.bighaSum;
      bighas.push(...item.bighas);
    }

    if (count === 0) {
      return {
        cohortCount: 0,
        meanLandBigha: 0,
        meanLandAcres: 0,
        medianLandBigha: 0,
        medianLandAcres: 0,
      };
    }

    bighas.sort((a, b) => a - b);
    const meanBi = parseFloat((bighaSum / count).toFixed(2));
    const meanAc = parseFloat((meanBi * filters.bighaMultiplier).toFixed(4));

    const mid = Math.floor(bighas.length / 2);
    const medBi = bighas.length % 2 === 1
      ? bighas[mid]
      : parseFloat(((bighas[mid - 1] + bighas[mid]) / 2).toFixed(2));
    const medAc = parseFloat((medBi * filters.bighaMultiplier).toFixed(4));

    return {
      cohortCount: count,
      meanLandBigha: meanBi,
      meanLandAcres: meanAc,
      medianLandBigha: medBi,
      medianLandAcres: medAc,
    };
  }, [filters.selectedGP, filters.selectedVillage, filters.selectedCaste, filters.selectedLandTier, filters.bighaMultiplier]);

  const cohortPercentage = (cohortCount / TOTAL_SURVEY_HOUSEHOLDS) * 100;
  const isEmptyCohort = cohortCount === 0;

  const isFiltered =
    filters.selectedGP !== 'ALL' ||
    filters.selectedVillage !== 'ALL' ||
    filters.selectedCaste !== 'ALL' ||
    filters.selectedLandTier !== 'ALL';

  const activeFilterCount = [
    filters.selectedGP !== 'ALL',
    filters.selectedVillage !== 'ALL',
    filters.selectedCaste !== 'ALL',
    filters.selectedLandTier !== 'ALL',
  ].filter(Boolean).length;

  const value: FilterContextValue = {
    filters,
    setGP,
    setVillage,
    setCaste,
    setLandTier,
    setBighaMultiplier,
    setViewMode,
    resetFilters,
    clearFilter,
    cohortCount,
    cohortPercentage,
    totalHouseholds: TOTAL_SURVEY_HOUSEHOLDS,
    meanLandBigha,
    meanLandAcres,
    medianLandBigha,
    medianLandAcres,
    isFiltered,
    activeFilterCount,
    isEmptyCohort,
    availableVillages,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = (): FilterContextValue => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export default FilterContext;
