import React, { useState } from 'react';
import {
  GraduationCap,
  Info,
  CheckCircle2,
  TreeDeciduous,
  Sprout
} from 'lucide-react';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { CasteCensusSummary, ExecutiveOverviewData } from '../../types/dashboard';

export interface SocialInclusionCardProps {
  casteData?: CasteCensusSummary[];
  collectivizationData?: ExecutiveOverviewData['collectivization'];
  headlineKPIs?: ExecutiveOverviewData['headlineKPIs'];
  onOpenLedger?: (metricId?: string) => void;
  className?: string;
}

export type DemographicsSubTab = 'caste_equity' | 'household_structure' | 'union_collectivization' | 'cadre_linkages';

export const SocialInclusionCard: React.FC<SocialInclusionCardProps> = ({
  casteData: _casteData,
  collectivizationData,
  headlineKPIs: _headlineKPIs,
  onOpenLedger: _onOpenLedger,
  className = '',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<DemographicsSubTab>('caste_equity');
  const [landUnit, setLandUnit] = useState<'bigha' | 'acres'>('bigha');

  const collect = collectivizationData || fasalMasterData.overview.collectivization;

  // Extended caste demographics with authoritative empirical figures from Sub-Ledger 3 & 8
  const casteStats = [
    {
      category: 'OBC',
      title: 'Other Backward Classes (Yadav, Maurya, Kurmi)',
      households: 891,
      sharePct: 58.05,
      meanLandBigha: 3.15,
      meanLandAcres: 0.630,
      medianLandBigha: 3.0,
      medianLandAcres: 0.600,
      landlessRatePct: 6.40,
      meanNetIncomeINR: 62450,
      aasMembershipPct: 73.85,
      aasMembersCount: 3564,
      badgeColor: '#0E7490', // cyan
      fillColor: 'bg-cyan-600',
    },
    {
      category: 'ST',
      title: 'Scheduled Tribe (Tharu Indigenous Forest Dwellers)',
      households: 377,
      sharePct: 24.56,
      meanLandBigha: 4.41,
      meanLandAcres: 0.882,
      medianLandBigha: 3.0,
      medianLandAcres: 0.600,
      landlessRatePct: 3.71,
      meanNetIncomeINR: 71820,
      aasMembershipPct: 78.42,
      aasMembersCount: 1185,
      badgeColor: '#047857', // emerald / green
      fillColor: 'bg-emerald-600',
    },
    {
      category: 'SC',
      title: 'Scheduled Caste (Dalit, Pasi, Chamar)',
      households: 259,
      sharePct: 16.87,
      meanLandBigha: 2.87,
      meanLandAcres: 0.574,
      medianLandBigha: 3.0,
      medianLandAcres: 0.600,
      landlessRatePct: 6.18,
      meanNetIncomeINR: 57110,
      aasMembershipPct: 71.94,
      aasMembersCount: 687,
      badgeColor: '#D97706', // amber
      fillColor: 'bg-amber-600',
    },
    {
      category: 'General',
      title: 'General Category',
      households: 8,
      sharePct: 0.52,
      meanLandBigha: 2.62,
      meanLandAcres: 0.524,
      medianLandBigha: 2.0,
      medianLandAcres: 0.400,
      landlessRatePct: 12.50,
      meanNetIncomeINR: 49200,
      aasMembershipPct: 62.50,
      aasMembersCount: 20,
      badgeColor: '#6B7280', // stone
      fillColor: 'bg-stone-500',
    },
  ];

  // Top named AAS village affinity groups
  const affinityGroups = [
    { name: 'Ganga Affinity Group', members: 74, village: 'Karikot' },
    { name: 'Krishna Affinity Group', members: 63, village: 'Fakirpuri' },
    { name: 'Meera Affinity Group', members: 54, village: 'Chahalwa' },
    { name: 'Durga Affinity Group', members: 44, village: 'Bajpur' },
    { name: 'Mahima Affinity Group', members: 38, village: 'Mangalpurwa' },
    { name: 'Shanti Affinity Group', members: 37, village: 'Badkhadiya' },
  ];

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`} id="social-inclusion-card">
      {/* 1. Header with Equity Badges & Sub-Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
              Feature F20: Demographics & Social Inclusion
            </span>
            <EvidenceBadge metricId="REC-SOC-05" variant="card" label="99.48% Marginalized Saturation" />
            <EvidenceBadge metricId="REC-DEMO-01" variant="card" label="6,494 Individuals" />
            <EvidenceBadge metricId="REC-INST-01" variant="card" label="4,826 AAS Union Members" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            Social Category, Caste Saturation & Demographic Inclusion (N=1,535 HHs)
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Complete demographic census across 1,535 households and 6,494 resident individuals in the Katarniaghat forest fringe. With <strong>99.48% marginalized saturation (1,527 / 1,535 HHs)</strong>, indigenous Tharu (ST) smallholders lead the project in mean net farm income (₹71,820) and democratic union density (78.42%).
          </p>
        </div>

        {/* Sub-Navigation Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-elevated border border-border-subtle self-start lg:self-center shrink-0 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveSubTab('caste_equity')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'caste_equity'
                ? 'bg-surface text-content-primary font-bold shadow-xs border border-border-strong'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Caste Equity
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('household_structure')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'household_structure'
                ? 'bg-surface text-content-primary font-bold shadow-xs border border-border-strong'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Family Roster
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('union_collectivization')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'union_collectivization'
                ? 'bg-surface text-content-primary font-bold shadow-xs border border-border-strong'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            AAS Union (74.3%)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('cadre_linkages')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'cadre_linkages'
                ? 'bg-surface text-content-primary font-bold shadow-xs border border-border-strong'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Frontline Cadres
          </button>
        </div>
      </div>

      {/* 2. SUB-TAB 1: Caste Stratification & Economic Equity */}
      {activeSubTab === 'caste_equity' && (
        <div className="space-y-5 animate-fade-in">
          {/* Segmented Stacked Saturation Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-content-primary">
                Caste Distribution (1,527 / 1,535 Marginalized — 99.48%)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLandUnit(landUnit === 'bigha' ? 'acres' : 'bigha')}
                  className="px-2 py-0.5 rounded bg-elevated border border-border-subtle text-[11px] font-mono hover:text-content-primary cursor-pointer"
                >
                  Unit: <strong>{landUnit === 'bigha' ? 'Bigha (0.20 ac)' : 'Acres (Authoritative)'}</strong>
                </button>
              </div>
            </div>

            <div className="w-full h-4 rounded-full overflow-hidden flex bg-border-subtle p-0.5">
              <div style={{ width: '58.05%' }} className="bg-cyan-600 h-full rounded-l-full" title="OBC: 58.05% (891 HHs)" />
              <div style={{ width: '24.56%' }} className="bg-emerald-600 h-full" title="ST (Tharu): 24.56% (377 HHs)" />
              <div style={{ width: '16.87%' }} className="bg-amber-600 h-full" title="SC (Dalit): 16.87% (259 HHs)" />
              <div style={{ width: '0.52%' }} className="bg-stone-500 h-full rounded-r-full" title="General: 0.52% (8 HHs)" />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 text-[11px] font-mono pt-1 text-content-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 inline-block" /> OBC: 891 (58.05%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> ST (Tharu): 377 (24.56%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> SC (Dalit): 259 (16.87%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-500 inline-block" /> General: 8 (0.52%)
              </span>
            </div>
          </div>

          {/* Authoritative Demographic Comparison Table */}
          <div className="overflow-x-auto rounded-lg border border-border-subtle">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-elevated/60 border-b border-border-strong text-content-muted">
                  <th className="py-2.5 px-3">Category & Demographics</th>
                  <th className="py-2.5 px-3 text-right">Households</th>
                  <th className="py-2.5 px-3 text-right">Share (%)</th>
                  <th className="py-2.5 px-3 text-right">
                    Mean Land ({landUnit === 'bigha' ? 'Bigha' : 'Acres'})
                  </th>
                  <th className="py-2.5 px-3 text-right">
                    Median Land ({landUnit === 'bigha' ? 'Bigha' : 'Acres'})
                  </th>
                  <th className="py-2.5 px-3 text-right">Landless Rate</th>
                  <th className="py-2.5 px-3 text-right">2026 Mean Net Farm</th>
                  <th className="py-2.5 px-3 text-right font-bold text-content-primary">AAS Union Density</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/60 bg-surface">
                {casteStats.map((c) => (
                  <tr key={c.category} className="hover:bg-elevated/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-sans font-medium text-content-primary flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.badgeColor }} />
                        <span>{c.category}</span>
                      </div>
                      <div className="text-[10px] text-content-muted">{c.title}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold tabular-nums text-content-primary">
                      {c.households}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-content-secondary">
                      {c.sharePct}%
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-content-primary">
                      {landUnit === 'bigha' ? `${c.meanLandBigha.toFixed(2)} bg` : `${c.meanLandAcres.toFixed(3)} ac`}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-content-muted">
                      {landUnit === 'bigha' ? `${c.medianLandBigha.toFixed(1)} bg` : `${c.medianLandAcres.toFixed(3)} ac`}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-content-muted">
                      {c.landlessRatePct.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-bold text-accent-growth">
                      ₹{c.meanNetIncomeINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-bold text-accent-harvest">
                      {c.aasMembershipPct.toFixed(2)}% <span className="text-[10px] text-content-muted">({c.aasMembersCount})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Context Callout: Indigenous Tharu Leadership & Sample Footnote */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-accent-growth/10 border border-accent-growth/25 space-y-1">
              <span className="font-bold text-accent-growth flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" /> Indigenous Tharu (ST) Economic Leadership
              </span>
              <p className="text-[11px] text-content-secondary font-sans leading-normal">
                Scheduled Tribe smallholders demonstrate highest net farm returns (₹71,820/HH) and union participation (78.42%), driven by organic turmeric cultivation in the forest buffer and collective bargaining power.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-surface border border-border-subtle space-y-1">
              <span className="font-bold text-content-primary flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-content-muted" /> Methodological Note: General Category Cohort (N=8)
              </span>
              <p className="text-[11px] text-content-muted font-sans leading-normal">
                Small sample size (N=8 / 0.52%) reflects historical forest fringe settlement patterns where 99.48% of resident households belong to marginalized communities (SC, ST, OBC).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB 2: Household Structure & Family Roster */}
      {activeSubTab === 'household_structure' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-1">
              <span className="text-xs font-mono text-content-muted uppercase">Resident Individuals</span>
              <div className="text-2xl font-mono font-bold text-content-primary tabular-nums">
                6,494
              </div>
              <p className="text-[11px] text-accent-growth font-mono">
                0 orphaned records (100% matched)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-1">
              <span className="text-xs font-mono text-content-muted uppercase">Mean Family Size</span>
              <div className="text-2xl font-mono font-bold text-content-primary tabular-nums">
                4.23 Persons
              </div>
              <p className="text-[11px] text-content-muted font-mono">
                Median: 4.0 | Range: 1 – 11 members
              </p>
            </div>

            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-1">
              <span className="text-xs font-mono text-content-muted uppercase">Dominant Model</span>
              <div className="text-2xl font-mono font-bold text-accent-growth tabular-nums">
                Nuclear (53.8%)
              </div>
              <p className="text-[11px] text-content-muted font-mono">
                826 HHs with 3–4 members
              </p>
            </div>

            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-1">
              <span className="text-xs font-mono text-content-muted uppercase">Union Coverage</span>
              <div className="text-2xl font-mono font-bold text-accent-harvest tabular-nums">
                74.32%
              </div>
              <p className="text-[11px] text-accent-harvest font-mono">
                4,826 enrolled union members
              </p>
            </div>
          </div>

          {/* Household Typology Breakdown Cards */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-3">
            <h4 className="text-sm font-serif font-bold text-content-primary">
              Household Size Composition Breakdown (N=1,535 Households)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-elevated/60 border border-border-subtle space-y-1">
                <span className="text-content-muted block text-[11px]">Small (1–2 members)</span>
                <span className="text-lg font-bold text-content-primary tabular-nums">158 HHs</span>
                <span className="text-[11px] text-content-muted block">10.29% of cohort</span>
              </div>
              <div className="p-3 rounded-lg bg-accent-growth/10 border border-accent-growth/25 space-y-1">
                <span className="text-accent-growth block text-[11px] font-bold">Nuclear (3–4 members)</span>
                <span className="text-lg font-bold text-accent-growth tabular-nums">826 HHs</span>
                <span className="text-[11px] text-accent-growth block font-bold">53.81% (Dominant)</span>
              </div>
              <div className="p-3 rounded-lg bg-elevated/60 border border-border-subtle space-y-1">
                <span className="text-content-muted block text-[11px]">Medium (5–6 members)</span>
                <span className="text-lg font-bold text-content-primary tabular-nums">470 HHs</span>
                <span className="text-[11px] text-content-muted block">30.62% of cohort</span>
              </div>
              <div className="p-3 rounded-lg bg-elevated/60 border border-border-subtle space-y-1">
                <span className="text-content-muted block text-[11px]">Large (7+ members)</span>
                <span className="text-lg font-bold text-content-primary tabular-nums">81 HHs</span>
                <span className="text-[11px] text-content-muted block">5.28% of cohort</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 3: AAS Union & Collectivization */}
      {activeSubTab === 'union_collectivization' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-accent-growth/10 border border-accent-growth/25 space-y-1">
              <span className="text-content-muted block text-[11px] uppercase">AAS Union Enrollment</span>
              <span className="text-2xl font-bold text-content-primary tabular-nums">
                {collect.aasUnionMembers.toLocaleString()}
              </span>
              <span className="text-accent-growth block text-[11px] font-bold">74.32% of all individuals</span>
              <EvidenceBadge metricId="REC-INST-01" variant="subtle" />
            </div>

            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-1">
              <span className="text-content-muted block text-[11px] uppercase">Village Affinity Groups</span>
              <span className="text-2xl font-bold text-content-primary tabular-nums">
                {collect.aasAffinityGroups}
              </span>
              <span className="text-content-muted block text-[11px]">Autonomous village clusters</span>
              <EvidenceBadge metricId="REC-INST-05" variant="subtle" />
            </div>

            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-1">
              <span className="text-content-muted block text-[11px] uppercase">Women's SHG Collectives</span>
              <span className="text-2xl font-bold text-content-primary tabular-nums">
                {collect.shgGroupsCount} Groups
              </span>
              <span className="text-content-muted block text-[11px]">{collect.shgMembersCount} micro-saving women</span>
              <EvidenceBadge metricId="REC-INST-06" variant="subtle" />
            </div>

            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-1">
              <span className="text-content-muted block text-[11px] uppercase">Youth Governance Cadre</span>
              <span className="text-2xl font-bold text-content-primary tabular-nums">
                31 Leaders
              </span>
              <span className="text-content-muted block text-[11px]">3-Tier Parliaments</span>
              <EvidenceBadge metricId="REC-INST-02" variant="subtle" />
            </div>
          </div>

          {/* Three-Tier Youth Parliaments Breakdown */}
          <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-3">
            <h4 className="text-sm font-serif font-bold text-content-primary flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-accent-harvest" />
              Three-Tier Democratic Youth Governance Architecture
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-elevated/60 border border-border-subtle space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-content-primary">Bal Sansad</span>
                  <span className="text-accent-growth font-bold">9 Ministers</span>
                </div>
                <p className="text-[11px] text-content-secondary font-sans leading-normal">
                  Elected primary school student ministers conducting daily monitoring of teacher attendance and kitchen hygiene.
                </p>
                <EvidenceBadge metricId="REC-INST-02" variant="inline" label="Bal Sansad" />
              </div>

              <div className="p-3.5 rounded-lg bg-elevated/60 border border-border-subtle space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-content-primary">Kishor Sangathan</span>
                  <span className="text-accent-harvest font-bold">11 Leaders</span>
                </div>
                <p className="text-[11px] text-content-secondary font-sans leading-normal">
                  Adolescent peer leaders advocating against child marriage, promoting secondary school retention and menstrual hygiene.
                </p>
                <EvidenceBadge metricId="REC-INST-03" variant="inline" label="Kishor Sangathan" />
              </div>

              <div className="p-3.5 rounded-lg bg-elevated/60 border border-border-subtle space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-content-primary">Yuva Sansad</span>
                  <span className="text-accent-evidence font-bold">11 Delegates</span>
                </div>
                <p className="text-[11px] text-content-secondary font-sans leading-normal">
                  Young adult delegates managing Jan Suvidha Kendra kiosks, public RTI applications, and Gram Sabha resolutions.
                </p>
                <EvidenceBadge metricId="REC-INST-04" variant="inline" label="Yuva Sansad" />
              </div>
            </div>
          </div>

          {/* Named Village Affinity Groups Registry */}
          <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-content-muted">
                Sample Affinity Group Clusters (64 Groups Total)
              </span>
              <span className="text-[11px] font-mono text-content-muted">Sub-Ledger 8</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
              {affinityGroups.map((ag) => (
                <div key={ag.name} className="p-2.5 rounded-lg bg-surface border border-border-subtle space-y-0.5">
                  <span className="font-bold text-content-primary block truncate" title={ag.name}>{ag.name.replace(' Affinity Group', '')}</span>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-content-muted">{ag.village}</span>
                    <span className="font-bold text-accent-growth">{ag.members}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-TAB 4: Frontline Cadres */}
      {activeSubTab === 'cadre_linkages' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TreeDeciduous className="w-4 h-4 text-accent-harvest" />
                  <span className="font-serif font-bold text-sm text-content-primary">
                    Baghmitra / Gajmitra Co-Existence Cadre
                  </span>
                </div>
                <EvidenceBadge metricId="REC-INST-07" variant="subtle" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
                  {collect.baghmitraGajmitraLinkages.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-content-muted">/ 1,535 Households (99.74%)</span>
              </div>
              <p className="text-xs text-content-secondary font-sans leading-relaxed">
                Trained frontline community wildlife scouts monitoring tiger and elephant corridors along the Katarniaghat Wildlife Sanctuary boundary, deploying solar early-warning alarms and community patrols to reduce human-wildlife conflict.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-elevated/40 border border-border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-accent-growth" />
                  <span className="font-serif font-bold text-sm text-content-primary">
                    Krishi Mitra Agronomic Extension Cadre
                  </span>
                </div>
                <EvidenceBadge metricId="REC-INST-08" variant="subtle" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold text-content-primary tabular-nums">
                  {collect.krishiMitraLinkages.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-content-muted">/ 1,535 Households (99.80%)</span>
              </div>
              <p className="text-xs text-content-secondary font-sans leading-relaxed">
                Peer agro-ecological extension fellows providing hands-on training in bio-drum fermentation (Jeevamrit, Ghanjeevamrit), botanical pest repellents (Neemastra, Dashparni Ark), and multi-tier bamboo trellis construction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialInclusionCard;
