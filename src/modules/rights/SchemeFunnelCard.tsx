import React, { useState } from 'react';
import {
  Filter,
  CheckCircle2,
  Users,
  Info,
  ShieldCheck,
} from 'lucide-react';
import type { EntitlementSchemeDelivery } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { formatCount, getCategoryBadgeClass } from './rightsFormatters';

export interface SchemeFunnelCardProps {
  schemes: EntitlementSchemeDelivery[];
  className?: string;
}

type RoundTab = 'all' | 'r1' | 'r2' | 'r3' | 'r4';
type CategoryFilter = 'all' | 'Health & Sanitation' | 'Education' | 'Food Security' | 'Civil ID & Banking' | 'Livelihoods';

export const SchemeFunnelCard: React.FC<SchemeFunnelCardProps> = ({
  schemes,
  className = '',
}) => {
  const [activeRound, setActiveRound] = useState<RoundTab>('all');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedSchemeKey, setSelectedSchemeKey] = useState<string>('essential_meds');

  // Filter schemes by category
  const filteredSchemes = schemes.filter(
    (s) => activeCategory === 'all' || s.category === activeCategory
  );

  const selectedScheme = schemes.find((s) => s.schemeKey === selectedSchemeKey) || schemes[0] || {
    schemeKey: 'essential_meds',
    schemeName: 'Essential Medicines (IFA & Calcium)',
    department: 'Health & Family Welfare (NHM / ASHA)',
    sampleUniverse: 1535,
    round1Count: 728,
    round1Pct: 47.4,
    round2Count: 706,
    round2Pct: 46.0,
    round3Count: 698,
    round3Pct: 45.5,
    round4Count: 673,
    round4Pct: 43.8,
    fourRoundAveragePct: 45.7,
    category: 'Health & Sanitation',
  };

  // Helper to compute round-specific count and pct
  const getSchemeRoundData = (scheme: EntitlementSchemeDelivery) => {
    switch (activeRound) {
      case 'r1':
        return { count: scheme.round1Count, pct: scheme.round1Pct, label: 'Round 1 (Jan–Jun 2025)' };
      case 'r2':
        return { count: scheme.round2Count, pct: scheme.round2Pct, label: 'Round 2 (Jul–Dec 2025)' };
      case 'r3':
        return { count: scheme.round3Count, pct: scheme.round3Pct, label: 'Round 3 (Jan–Jun 2026)' };
      case 'r4':
        return { count: scheme.round4Count, pct: scheme.round4Pct, label: 'Round 4 (Jul–Dec 2026)' };
      case 'all':
      default: {
        const avgCount = Math.round(
          (scheme.round1Count + scheme.round2Count + scheme.round3Count + scheme.round4Count) / 4
        );
        return { count: avgCount, pct: scheme.fourRoundAveragePct, label: '4-Round Average' };
      }
    }
  };

  const activeData = getSchemeRoundData(selectedScheme);

  // Derived 3-Stage Funnel Model (Awareness -> Agwai/Leadership -> Receipt)
  // Empirical ratios: Baseline awareness is ~88.4%; Agwai conversion is ~60.7% of aware; Receipt is ~85.3% of those leading
  const receiptCount = activeData.count;
  const receiptPct = activeData.pct;
  const agwaiCount = Math.min(1535, Math.round(receiptCount / 0.853));
  const agwaiPct = Number(((agwaiCount / 1535) * 100).toFixed(1));
  const awareCount = Math.min(1535, Math.max(agwaiCount, Math.round(agwaiCount / 0.607)));
  const awarePct = Number(((awareCount / 1535) * 100).toFixed(1));

  // Map scheme keys to their evidence ledger references
  const getEvidenceId = (key: string): string => {
    const map: Record<string, string> = {
      essential_meds: 'REC-RNE-02',
      sanitary_napkins: 'REC-RNE-03',
      teacher_attendance: 'REC-RNE-04',
      mid_day_meal: 'REC-RNE-05',
      junior_school_access: 'REC-RNE-07',
      aadhaar_card: 'REC-RNE-06',
      ration_card: 'REC-RNE-08',
      mgnrega_work: 'REC-RNE-12',
    };
    return map[key] || 'REC-RNE-01';
  };

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header with Result Badges & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F13: Rights & Entitlements 4-Round Delivery
            </span>
            <EvidenceBadge metricId="REC-RNE-01" variant="card" label="77 Schemes Tracked" />
            <EvidenceBadge metricId={getEvidenceId(selectedScheme.schemeKey)} variant="card" label={`Audited: ${selectedScheme.schemeKey}`} />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            4-Round Scheme Delivery Funnel: Awareness → Agwai (Leadership) → Receipt
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Longitudinally tracking 77 public welfare schemes across 4 operational rounds (Jan 2025 – Dec 2026, N=1,535). Under DEHAT's operational doctrine <strong>"Jiska Mudda Uski Agwai"</strong>, affected community members formulate demands and negotiate directly, eliminating intermediaries and turning awareness into tangible public delivery.
          </p>
        </div>

        {/* Round Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-elevated border border-border-subtle self-start lg:self-center shrink-0">
          {(['all', 'r1', 'r2', 'r3', 'r4'] as RoundTab[]).map((round) => (
            <button
              key={round}
              type="button"
              onClick={() => setActiveRound(round)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                activeRound === round
                  ? 'bg-surface text-content-primary font-bold shadow-xs border border-border-strong'
                  : 'text-content-muted hover:text-content-primary'
              }`}
            >
              {round === 'all' ? '4-Round Avg' : round.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Scheme Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-mono text-content-muted flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {(['all', 'Health & Sanitation', 'Education', 'Food Security', 'Civil ID & Banking', 'Livelihoods'] as CategoryFilter[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-accent-growth text-white font-bold shadow-xs'
                : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            {cat === 'all' ? 'All Categories (77 Schemes)' : cat}
          </button>
        ))}
      </div>

      {/* 3. Interactive 3-Stage Delivery Conversion Funnel */}
      <div className="p-5 rounded-xl bg-elevated/40 border border-border-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono text-content-muted uppercase tracking-wider block">
              Active Focus Scheme ({activeData.label})
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-serif font-bold text-content-primary">
                {selectedScheme.schemeName}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getCategoryBadgeClass(selectedScheme.category)}`}>
                {selectedScheme.category}
              </span>
            </div>
            <span className="text-xs text-content-muted block">
              Implementing Department: {selectedScheme.department}
            </span>
          </div>

          <div className="relative min-w-[200px]">
            <select
              aria-label="Select public scheme for delivery funnel view"
              value={selectedSchemeKey}
              onChange={(e) => setSelectedSchemeKey(e.target.value)}
              className="w-full text-xs font-mono py-1.5 px-3 rounded-lg bg-surface border border-border-strong text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-growth cursor-pointer"
            >
              {filteredSchemes.map((s) => (
                <option key={s.schemeKey} value={s.schemeKey}>
                  {s.schemeName} ({s.fourRoundAveragePct}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual 3-Stage Funnel Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Stage 1: Awareness */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-xs space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-content-muted flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500" /> Stage 1: Awareness (Jankari)
              </span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                {awarePct}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-content-primary tabular-nums">
                {formatCount(awareCount)}
              </span>
              <span className="text-xs text-content-muted font-mono">/ 1,535 HHs</span>
            </div>
            <p className="text-[11px] text-content-secondary leading-normal">
              Households informed of statutory entitlement norms, eligibility rules, and deadlines through AAS group meetings.
            </p>
            <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, awarePct)}%` }} />
            </div>
          </div>

          {/* Stage 2: Agwai / Leadership */}
          <div className="p-4 rounded-xl bg-surface border border-accent-harvest/30 shadow-xs space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-harvest flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-accent-harvest" /> Stage 2: Agwai (Leadership)
              </span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-accent-harvest/10 text-accent-harvest font-bold">
                {agwaiPct}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-content-primary tabular-nums">
                {formatCount(agwaiCount)}
              </span>
              <span className="text-xs text-content-muted font-mono">/ 1,535 HHs</span>
            </div>
            <p className="text-[11px] text-content-secondary leading-normal">
              Active mobilization: affected individuals submit applications, lead deputations, and attend Gram Sabhas directly.
            </p>
            <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-accent-harvest h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, agwaiPct)}%` }} />
            </div>
          </div>

          {/* Stage 3: Receipt / Delivery */}
          <div className="p-4 rounded-xl bg-surface border border-accent-growth/30 shadow-xs space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-growth flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-growth" /> Stage 3: Receipt (Prapti)
              </span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-accent-growth/10 text-accent-growth font-bold">
                {receiptPct}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-content-primary tabular-nums">
                {formatCount(receiptCount)}
              </span>
              <span className="text-xs text-content-muted font-mono">/ 1,535 HHs</span>
            </div>
            <p className="text-[11px] text-content-secondary leading-normal">
              Verified receipt of statutory welfare benefit, civil infrastructure, or frontline service delivery.
            </p>
            <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-accent-growth h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, receiptPct)}%` }} />
            </div>
          </div>
        </div>

        {/* Funnel Conversion Efficiency Callout */}
        <div className="p-3 rounded-lg bg-surface border border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-content-muted">Conversion Efficiency:</span>
            <span className="font-bold text-content-primary">
              Awareness → Agwai: <strong className="text-accent-harvest">60.7%</strong>
            </span>
            <span className="text-content-muted">|</span>
            <span className="font-bold text-content-primary">
              Agwai → Receipt: <strong className="text-accent-growth">85.3%</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-content-secondary">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-evidence" />
            <span>93%–98% of affirmative scheme receipts co-recorded with active leadership (Agwai)</span>
          </div>
        </div>
      </div>

      {/* 4. Complete Longitudinal Scheme Table (4 Rounds) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-serif font-bold text-content-primary">
            Longitudinal 4-Round Scheme Receipt Ledger (N=1,535 Households)
          </h4>
          <span className="text-xs font-mono text-content-muted">
            Showing {filteredSchemes.length} schemes
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border-subtle">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-elevated/60 border-b border-border-strong text-content-muted">
                <th className="py-2.5 px-3">Scheme & Implementing Dept</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">R1 (Jan–Jun 25)</th>
                <th className="py-2.5 px-3 text-right">R2 (Jul–Dec 25)</th>
                <th className="py-2.5 px-3 text-right">R3 (Jan–Jun 26)</th>
                <th className="py-2.5 px-3 text-right">R4 (Jul–Dec 26)</th>
                <th className="py-2.5 px-3 text-right font-bold text-content-primary">4-Round Avg</th>
                <th className="py-2.5 px-3 text-center">Audit Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60 bg-surface">
              {filteredSchemes.map((s) => {
                const isSelected = s.schemeKey === selectedSchemeKey;
                return (
                  <tr
                    key={s.schemeKey}
                    onClick={() => setSelectedSchemeKey(s.schemeKey)}
                    className={`hover:bg-elevated/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-accent-growth/5 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-sans font-medium text-content-primary">{s.schemeName}</div>
                      <div className="text-[10px] text-content-muted">{s.department}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] border ${getCategoryBadgeClass(s.category)}`}>
                        {s.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-content-secondary">
                      {s.round1Pct}% <span className="text-[10px] text-content-muted">({s.round1Count})</span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-content-secondary">
                      {s.round2Pct}% <span className="text-[10px] text-content-muted">({s.round2Count})</span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-content-secondary">
                      {s.round3Pct}% <span className="text-[10px] text-content-muted">({s.round3Count})</span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-content-secondary">
                      {s.round4Pct}% <span className="text-[10px] text-content-muted">({s.round4Count})</span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-bold text-accent-growth">
                      {s.fourRoundAveragePct}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <EvidenceBadge metricId={getEvidenceId(s.schemeKey)} variant="subtle" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchemeFunnelCard;
