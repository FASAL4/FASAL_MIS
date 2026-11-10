import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  X, 
  ChevronDown, 
  Users, 
  Layers, 
  MapPin, 
  AlertTriangle 
} from 'lucide-react';
import { useFilters, type CasteCategoryKey, type LandholdingTierKey } from '../../context/FilterContext';

const GP_OPTIONS = [
  { value: 'ALL', label: 'All 7 Gram Panchayats' },
  { value: 'Karikot', label: 'Karikot (758 HHs)' },
  { value: 'Fakirpuri', label: 'Fakirpuri (249 HHs)' },
  { value: 'Chahalwa', label: 'Chahalwa (201 HHs)' },
  { value: 'Bajpur Bankati', label: 'Bajpur Bankati (129 HHs)' },
  { value: 'Mangalpurwa', label: 'Mangalpurwa (79 HHs)' },
  { value: 'Badkhadiya', label: 'Badkhadiya (63 HHs)' },
  { value: 'Vishunapur', label: 'Vishunapur (56 HHs)' },
];

const CASTE_OPTIONS: { value: CasteCategoryKey; label: string }[] = [
  { value: 'ALL', label: 'All Caste Categories' },
  { value: 'OBC', label: 'OBC (891 HHs - 58.1%)' },
  { value: 'ST', label: 'ST / Tharu (377 HHs - 24.6%)' },
  { value: 'SC', label: 'SC / Dalit (259 HHs - 16.9%)' },
  { value: 'General', label: 'General (8 HHs - 0.5%)' },
];

const LAND_TIER_OPTIONS: { value: LandholdingTierKey; label: string }[] = [
  { value: 'ALL', label: 'All Landholding Tiers' },
  { value: 'LANDLESS', label: 'Landless (0 bigha / 88 HHs)' },
  { value: 'MARGINAL_LE_1_ACRE', label: 'Marginal (≤1.0 ac / ≤5 bi / 1,259 HHs)' },
  { value: 'SMALL_1_TO_2_ACRES', label: 'Small (1-2 ac / 5-10 bi / 153 HHs)' },
  { value: 'MEDIUM_GT_2_ACRES', label: 'Medium/Large (>2 ac / >10 bi / 35 HHs)' },
];

export const GlobalFilterBar: React.FC = () => {
  const {
    filters,
    setGP,
    setVillage,
    setCaste,
    setLandTier,
    resetFilters,
    clearFilter,
    cohortCount,
    cohortPercentage,
    meanLandBigha,
    meanLandAcres,
    medianLandBigha,
    isFiltered,
    activeFilterCount,
    isEmptyCohort,
    availableVillages,
  } = useFilters();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <aside 
      aria-label="Global Cohort Filters"
      className="sticky top-[65px] z-30 bg-surface/95 backdrop-blur-md border-b border-border-subtle shadow-xs no-print transition-colors duration-200"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Main Ribbon */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Filter Toggle & Reactive Cohort Indicator */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-elevated border border-border-strong text-content-primary hover:bg-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-primary"
              title="Toggle filter dropdown selectors"
            >
              <Filter className="w-3.5 h-3.5 text-accent-harvest" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-accent-primary text-surface text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Reactive Cohort Metric Badge */}
            <div 
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold transition-colors ${
                isEmptyCohort
                  ? 'bg-accent-stress/15 text-accent-stress border border-accent-stress/30'
                  : isFiltered
                  ? 'bg-accent-harvest/15 text-accent-harvest border border-accent-harvest/30'
                  : 'bg-accent-growth/10 text-accent-growth border border-accent-growth/20'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>
                Cohort: <strong>N={cohortCount.toLocaleString('en-IN')}</strong> ({cohortPercentage.toFixed(1)}% of 1,535 HHs)
              </span>
            </div>

            {/* Cohort Landholding Benchmark */}
            {cohortCount > 0 && (
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-content-muted">
                <span>•</span>
                <span>Mean: <strong className="text-content-secondary">{meanLandBigha} bi</strong> ({meanLandAcres} ac)</span>
                <span>•</span>
                <span>Med: <strong className="text-content-secondary">{medianLandBigha} bi</strong></span>
              </div>
            )}
          </div>

          {/* Right: Reset Action Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-accent-stress hover:bg-accent-stress/10 border border-accent-stress/25 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-stress"
              title="Reset all filters back to full cohort (N=1,535)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Collapsible Selectors Row */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-border-subtle/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* 1. Gram Panchayat Dropdown */}
            <div>
              <label htmlFor="filter-gp" className="block text-[10px] font-mono uppercase tracking-wider text-content-muted mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-accent-harvest" /> Gram Panchayat
              </label>
              <select
                id="filter-gp"
                value={filters.selectedGP}
                onChange={(e) => setGP(e.target.value)}
                className="w-full text-xs font-mono bg-elevated border border-border-strong rounded-md px-2.5 py-1.5 text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              >
                {GP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* 2. Village / Settlement Dropdown (Cascades based on GP) */}
            <div>
              <label htmlFor="filter-village" className="block text-[10px] font-mono uppercase tracking-wider text-content-muted mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-accent-growth" /> Village / Settlement ({availableVillages.length})
              </label>
              <select
                id="filter-village"
                value={filters.selectedVillage}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full text-xs font-mono bg-elevated border border-border-strong rounded-md px-2.5 py-1.5 text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              >
                <option value="ALL">All Villages ({availableVillages.length} settlements)</option>
                {availableVillages.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* 3. Caste Category Dropdown */}
            <div>
              <label htmlFor="filter-caste" className="block text-[10px] font-mono uppercase tracking-wider text-content-muted mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-accent-primary" /> Caste Category
              </label>
              <select
                id="filter-caste"
                value={filters.selectedCaste}
                onChange={(e) => setCaste(e.target.value as CasteCategoryKey)}
                className="w-full text-xs font-mono bg-elevated border border-border-strong rounded-md px-2.5 py-1.5 text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              >
                {CASTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* 4. Landholding Tier Dropdown */}
            <div>
              <label htmlFor="filter-land" className="block text-[10px] font-mono uppercase tracking-wider text-content-muted mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-accent-evidence" /> Landholding Tier
              </label>
              <select
                id="filter-land"
                value={filters.selectedLandTier}
                onChange={(e) => setLandTier(e.target.value as LandholdingTierKey)}
                className="w-full text-xs font-mono bg-elevated border border-border-strong rounded-md px-2.5 py-1.5 text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              >
                {LAND_TIER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filter Chips Pill Row */}
        {isFiltered && (
          <div className="mt-2 flex items-center gap-1.5 flex-wrap pt-2 border-t border-border-subtle/50 text-[11px] font-mono">
            <span className="text-content-muted text-[10px] uppercase font-bold tracking-wider">Active Filters:</span>

            {filters.selectedGP !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-harvest/15 text-accent-harvest border border-accent-harvest/30">
                <span>GP: {filters.selectedGP}</span>
                <button 
                  type="button" 
                  onClick={() => clearFilter('selectedGP')} 
                  className="hover:text-content-primary cursor-pointer"
                  aria-label={`Remove Gram Panchayat filter: ${filters.selectedGP}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.selectedVillage !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                <span>Village: {filters.selectedVillage}</span>
                <button 
                  type="button" 
                  onClick={() => clearFilter('selectedVillage')} 
                  className="hover:text-content-primary cursor-pointer"
                  aria-label={`Remove village filter: ${filters.selectedVillage}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.selectedCaste !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-primary/15 text-accent-primary border border-accent-primary/30">
                <span>Caste: {filters.selectedCaste}</span>
                <button 
                  type="button" 
                  onClick={() => clearFilter('selectedCaste')} 
                  className="hover:text-content-primary cursor-pointer"
                  aria-label={`Remove caste filter: ${filters.selectedCaste}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.selectedLandTier !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-evidence/15 text-accent-evidence border border-accent-evidence/30">
                <span>Tier: {filters.selectedLandTier.replace(/_/g, ' ')}</span>
                <button 
                  type="button" 
                  onClick={() => clearFilter('selectedLandTier')} 
                  className="hover:text-content-primary cursor-pointer"
                  aria-label={`Remove landholding tier filter: ${filters.selectedLandTier}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] text-content-muted hover:text-accent-stress underline cursor-pointer ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Zero-Cohort Edge-Case Alert */}
        {isEmptyCohort && (
          <div className="mt-2.5 p-3 rounded-lg bg-accent-stress/10 border border-accent-stress/30 text-xs font-mono text-accent-stress flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">Zero-Cohort Combination Detected (N=0)</div>
              <p className="text-[11px] text-content-secondary font-sans leading-relaxed">
                No surveyed households match the combined filters: 
                <strong> {filters.selectedGP !== 'ALL' ? filters.selectedGP : ''} </strong>
                {filters.selectedVillage !== 'ALL' ? `• Village: ${filters.selectedVillage}` : ''}
                {filters.selectedCaste !== 'ALL' ? `• Caste: ${filters.selectedCaste}` : ''}
                {filters.selectedLandTier !== 'ALL' ? `• Land Tier: ${filters.selectedLandTier}` : ''}.
                In this geographical area, all households belong to other demographic strata.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-1 px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-accent-stress text-white hover:bg-accent-stress/90 cursor-pointer inline-flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Restore Full Cohort (N=1,535)
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default GlobalFilterBar;

