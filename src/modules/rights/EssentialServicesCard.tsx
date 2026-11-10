import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import {
  HeartPulse,
  Sparkles,
  GraduationCap,
  Utensils,
  CheckCircle2
} from 'lucide-react';
import type { RightsEntitlementsData, EntitlementSchemeDelivery } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { formatPercent } from './rightsFormatters';

export interface EssentialServicesCardProps {
  services: RightsEntitlementsData['stableFrontlineServices'];
  schemes: EntitlementSchemeDelivery[];
  className?: string;
}

type ViewMode = 'bar_trajectory' | 'radar_envelope';

export const EssentialServicesCard: React.FC<EssentialServicesCardProps> = ({
  services,
  schemes,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('bar_trajectory');

  // Top 4 flagship essential frontline services
  const coreServices = [
    {
      key: 'essential_meds',
      label: 'Essential Medicines (IFA & Calcium)',
      coverage: services.essentialMedicationCoveragePct, // 45.7%
      range: '673 – 728 HHs (43.8% – 47.4%)',
      department: 'Health & Family Welfare (NHM / ASHA)',
      evidenceId: 'REC-RNE-02',
      color: '#047857', // emerald
      icon: HeartPulse,
      description: 'Regular doorstep distribution of Iron Folic Acid, Calcium, and Albendazole tablets to adolescent girls and mothers.',
    },
    {
      key: 'sanitary_napkins',
      label: 'Adolescent Sanitary Napkins',
      coverage: services.sanitaryNapkinsCoveragePct, // 41.0%
      range: '619 – 645 HHs (40.3% – 42.0%)',
      department: 'Women & Child Development (WCD)',
      evidenceId: 'REC-RNE-03',
      color: '#92400E', // harvest ochre
      icon: Sparkles,
      description: 'Reproductive health supply delivery to adolescent girls and young mothers under Kishori Suraksha Yojana.',
    },
    {
      key: 'teacher_attendance',
      label: 'Primary School Teacher Attendance',
      coverage: services.teacherDailyAttendancePct, // 37.0%
      range: '529 – 639 HHs (34.5% – 41.6%)',
      department: 'Basic Education Department (RTE)',
      evidenceId: 'REC-RNE-04',
      color: '#0284C7', // sky
      icon: GraduationCap,
      description: 'Community social audit of primary school teacher daily attendance conducted by Bal Sansad and AAS mothers.',
    },
    {
      key: 'mid_day_meal',
      label: 'PM POSHAN Mid-Day Meal Service',
      coverage: services.midDayMealRegularityPct, // 34.7%
      range: '499 – 609 HHs (32.5% – 39.7%)',
      department: 'Basic Education & Food Support',
      evidenceId: 'REC-RNE-05',
      color: '#D97706', // amber
      icon: Utensils,
      description: 'Daily monitoring of fresh hot cooked meals in primary schools adhering to government nutritional guidelines.',
    },
  ];

  // Prepare data for round-by-round Bar Chart
  const barChartData = coreServices.map((cs) => {
    const s = schemes.find((item) => item.schemeKey === cs.key);
    return {
      service: cs.label.split(' (')[0],
      round1: s?.round1Pct ?? 0,
      round2: s?.round2Pct ?? 0,
      round3: s?.round3Pct ?? 0,
      round4: s?.round4Pct ?? 0,
      average: cs.coverage,
    };
  });

  // Prepare data for Radar Chart
  const radarChartData = [
    { service: 'Essential Meds', coverage: services.essentialMedicationCoveragePct, benchmark: 50.0 },
    { service: 'Sanitary Napkins', coverage: services.sanitaryNapkinsCoveragePct, benchmark: 50.0 },
    { service: 'Teacher Attend.', coverage: services.teacherDailyAttendancePct, benchmark: 50.0 },
    { service: 'Mid-Day Meal', coverage: services.midDayMealRegularityPct, benchmark: 50.0 },
    { service: 'Junior School', coverage: services.juniorSchoolAccessPct, benchmark: 50.0 },
    { service: 'School Desks', coverage: 28.3, benchmark: 50.0 },
  ];

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header with Result Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F14: Essential Services Stability Rates
            </span>
            <EvidenceBadge metricId="REC-RNE-02" variant="card" label="Meds: 45.7%" />
            <EvidenceBadge metricId="REC-RNE-03" variant="card" label="Pads: 41.0%" />
            <EvidenceBadge metricId="REC-RNE-04" variant="card" label="Teachers: 37.0%" />
            <EvidenceBadge metricId="REC-RNE-05" variant="card" label="MDM: 34.7%" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            Audited Frontline Service Delivery & School Social Accountability
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Sustained monitoring across four consecutive operational windows demonstrated resilient institutional access: essential medicines delivered to ~46% of households, adolescent menstrual hygiene sustained at ~41%, primary school teacher attendance audited at ~37%, and hot cooked mid-day meals verified at ~35%.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-elevated border border-border-subtle self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('bar_trajectory')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
              viewMode === 'bar_trajectory'
                ? 'bg-surface text-content-primary font-bold shadow-xs border border-border-strong'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            4-Round Trajectory
          </button>
          <button
            type="button"
            onClick={() => setViewMode('radar_envelope')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
              viewMode === 'radar_envelope'
                ? 'bg-surface text-content-primary font-bold shadow-xs border border-border-strong'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Civic Radar Envelope
          </button>
        </div>
      </div>

      {/* 2. Top 4 Essential Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coreServices.map((srv) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.key}
              className="p-4 rounded-xl bg-elevated/40 border border-border-subtle hover:border-border-strong transition-all space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-surface border border-border-subtle shadow-2xs">
                  <Icon className="w-4 h-4 text-accent-growth" />
                </div>
                <EvidenceBadge metricId={srv.evidenceId} variant="subtle" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-serif font-bold text-content-primary block line-clamp-1" title={srv.label}>
                  {srv.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-content-primary tabular-nums">
                    {formatPercent(srv.coverage)}
                  </span>
                  <span className="text-[11px] font-mono text-accent-growth font-bold">Stable</span>
                </div>
                <span className="text-[11px] font-mono text-content-muted block">
                  {srv.range}
                </span>
              </div>

              <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-accent-growth h-full rounded-full transition-all duration-300"
                  style={{ width: `${srv.coverage}%` }}
                />
              </div>

              <p className="text-[11px] text-content-secondary leading-snug pt-1">
                {srv.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Interactive Visual Charts Section */}
      <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-serif font-bold text-content-primary">
            {viewMode === 'bar_trajectory'
              ? 'Round-by-Round Delivery Rates (R1 Jan 25 → R4 Dec 26)'
              : 'Multi-Dimensional Civic Entitlement Envelope vs Benchmark'}
          </h4>
          <span className="text-xs font-mono text-content-muted">
            Audited against N=1,535 survey cohort
          </span>
        </div>

        {viewMode === 'bar_trajectory' ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                <XAxis dataKey="service" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} tickLine={false} />
                <YAxis unit="%" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} tickLine={false} domain={[0, 60]} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="p-3 bg-surface/95 backdrop-blur-md border border-border-strong rounded-lg shadow-elevated text-xs font-mono space-y-1">
                        <div className="font-bold text-content-primary">{label}</div>
                        {payload.map((p) => (
                          <div key={p.name} className="flex justify-between gap-4 text-content-secondary">
                            <span>{p.name}:</span>
                            <span className="font-bold text-content-primary tabular-nums">{p.value}%</span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)', paddingTop: 10 }} />
                <Bar name="Round 1 (Jan–Jun 25)" dataKey="round1" fill="#047857" radius={[3, 3, 0, 0]} />
                <Bar name="Round 2 (Jul–Dec 25)" dataKey="round2" fill="#0E7490" radius={[3, 3, 0, 0]} />
                <Bar name="Round 3 (Jan–Jun 26)" dataKey="round3" fill="#D97706" radius={[3, 3, 0, 0]} />
                <Bar name="Round 4 (Jul–Dec 26)" dataKey="round4" fill="#92400E" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <PolarGrid stroke="currentColor" className="opacity-15" />
                <PolarAngleAxis dataKey="service" tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                <PolarRadiusAxis angle={30} domain={[0, 60]} tick={{ fontSize: 9, fontFamily: 'var(--font-mono)' }} />
                <Radar name="Achieved Saturation (%)" dataKey="coverage" stroke="#047857" fill="#047857" fillOpacity={0.4} />
                <Radar name="50% Saturation Reference" dataKey="benchmark" stroke="#D97706" strokeDasharray="3 3" fill="none" />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)', paddingTop: 10 }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 4. Democratic Social Audit Linkage (Bal Sansad & AAS Union) */}
      <div className="p-4 rounded-xl bg-accent-growth/10 border border-accent-growth/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-accent-growth flex items-center gap-1.5 uppercase">
            <CheckCircle2 className="w-4 h-4" /> Bal Sansad & AAS Union Accountability Architecture
          </span>
          <p className="text-xs text-content-secondary leading-relaxed max-w-3xl">
            Frontline stability is directly sustained by <strong>9 elected child ministers of the Bal Sansad (Children's Parliament, REC-INST-02)</strong> who conduct daily roll-call audits of teachers and kitchen hygiene, backstopped by <strong>4,826 enrolled AAS members (REC-INST-01)</strong> presenting community charters at monthly Gram Sabhas.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <EvidenceBadge metricId="REC-INST-02" variant="card" label="9 Bal Sansad Ministers" />
          <EvidenceBadge metricId="REC-INST-01" variant="card" label="4,826 AAS Members" />
        </div>
      </div>
    </div>
  );
};

export default EssentialServicesCard;
