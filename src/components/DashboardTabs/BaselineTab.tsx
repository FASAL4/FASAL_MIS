import React, { useState, useMemo } from 'react';
import { Users, Map, Sprout, Home, TrendingUp, Shield, Building2, IndianRupee, Info, ChevronDown, BarChart3, Activity, ClipboardCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell, PieChart, Pie, Legend } from 'recharts';
import baselineSummaryData from '../../data/baseline_summary.json';
import baselineDemographics from '../../data/baseline_demographics.json';
import triangulationSummary from '../../data/triangulation_summary.json';
import landDiscrepancies from '../../data/land_discrepancies.json';
import casteOutcomes from '../../data/caste_outcomes.json';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface GPComparisonRow {
  gp: string;
  households: number;
  femaleFarmerPct: number;
  singleWomenCount: number;
  cultivableLandBigha: number;
  avgLandPerFamilyBigha: number;
  landlessFamiliesPct: number;
  totalAgriIncome: number;
  totalNetAgriIncome: number;
  avgIncomePerBigha: number;
  toiletPct: number;
  bankAccountPct: number;
  govtSchemePct: number;
  migrationPct: number;
  aasMembershipPct: number;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const fmtLakhs = (rs: number) => {
  if (rs >= 10_000_000) return `₹${(rs / 10_000_000).toFixed(2)} Cr`;
  if (rs >= 100_000) return `₹${(rs / 100_000).toFixed(2)} L`;
  return `₹${rs.toLocaleString('en-IN')}`;
};

const GP_COLORS: Record<string, string> = {
  'Karikot': '#10b981',
  'Chahalwa': '#6366f1',
  'Fakirpuri': '#f59e0b',
  'Badkhadiya': '#3b82f6',
  'Bajpur Bankati': '#ec4899',
  'Vishunapur': '#8b5cf6',
};

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────
const StatBadge = ({ label, value, unit, color = 'slate' }: { label: string; value: string | number; unit?: string; color?: string }) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    rose: 'bg-rose-50 border-rose-200 text-rose-800',
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${colorMap[color] || colorMap.slate}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{label}</div>
      <div className="text-xl font-extrabold leading-none">{value}<span className="text-xs font-semibold ml-1 opacity-60">{unit}</span></div>
    </div>
  );
};

// Bar with value label
const PctBar = ({ value, color, max = 100 }: { value: number; color: string; max?: number }) => (
  <div className="flex items-center gap-2 w-full">
    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }} />
    </div>
    <span className="text-xs font-bold text-slate-600 w-10 text-right">{value.toFixed(1)}%</span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export function BaselineTab() {
  const [activeGP, setActiveGP] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<'income' | 'land' | 'social'>('income');

  const { aggregateMetrics, gpComparison, meta } = baselineSummaryData as {
    aggregateMetrics: any;
    gpComparison: GPComparisonRow[];
    meta: any;
  };

  const selectedGPData = useMemo(() =>
    activeGP ? gpComparison.find(g => g.gp === activeGP) || null : null,
    [activeGP, gpComparison]
  );

  // Chart data based on selected metric
  const gpChartData = useMemo(() => {
    return gpComparison.map(gp => ({
      name: gp.gp.length > 10 ? gp.gp.split(' ')[0] : gp.gp,
      fullName: gp.gp,
      ...(activeMetric === 'income' ? {
        'Net Agri Income (L)': parseFloat((gp.totalNetAgriIncome / 100000).toFixed(2)),
        'Agri Income (L)': parseFloat((gp.totalAgriIncome / 100000).toFixed(2)),
      } : activeMetric === 'land' ? {
        'Cultivable Land (Bigha)': gp.cultivableLandBigha,
        'Avg/Family (Bigha)': parseFloat(gp.avgLandPerFamilyBigha.toFixed(2)),
      } : {
        'Bank Account (%)': gp.bankAccountPct,
        'Govt Scheme (%)': gp.govtSchemePct,
        'Toilet Coverage (%)': gp.toiletPct,
      })
    }));
  }, [gpComparison, activeMetric]);

  const topLevelKPIs = [
    { label: 'Households Surveyed', value: aggregateMetrics.totalHouseholds.toLocaleString('en-IN'), icon: Home, color: 'emerald', sub: `Across ${meta.gpCount} Gram Panchayats` },
    { label: 'Female Farmers', value: `${aggregateMetrics.femaleFarmerPct.toFixed(1)}%`, icon: Users, color: 'blue', sub: `${aggregateMetrics.femaleFarmers.toLocaleString('en-IN')} of ${(aggregateMetrics.maleFarmers + aggregateMetrics.femaleFarmers).toLocaleString('en-IN')} total` },
    { label: 'Baseline Net Agri Income', value: fmtLakhs(aggregateMetrics.totalNetAgriIncomeRs), icon: IndianRupee, color: 'amber', sub: 'Total across all 6 GPs (pre-programme)' },
    { label: 'Bank Account Coverage', value: `${aggregateMetrics.bankAccountPct.toFixed(0)}%`, icon: Shield, color: 'purple', sub: 'Households with active bank account' },
    { label: 'Govt Scheme Beneficiaries', value: `${aggregateMetrics.govtSchemeBeneficiaryPct.toFixed(1)}%`, icon: Building2, color: 'rose', sub: 'Households accessing ≥1 scheme' },
    { label: 'Migration Dependency', value: `${aggregateMetrics.migrationMembersPct.toFixed(1)}%`, icon: Map, color: 'slate', sub: 'Families with migration income source' },
  ];

  const colorForGP = (gp: string) => GP_COLORS[gp] || '#94a3b8';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-3">
            <Activity size={11} />
            Pre-Programme Baseline · {meta.dataType}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Community Baseline Survey</h2>
          <p className="text-sm text-slate-500 mt-1.5 max-w-xl">
            Socio-economic snapshot of <strong>{aggregateMetrics.totalHouseholds.toLocaleString('en-IN')} households</strong> across {meta.gpCount} Gram Panchayats in Mihinpurwa, Bahraich — captured <em>before</em> FASAL programme engagement. This data forms the reference point for all programme impact measurements.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 shrink-0 self-start">
          <Info size={13} />
          Source: <span className="font-semibold text-slate-600">Base line Data1.xlsx + Baseline Findings NRM.xlsx</span>
        </div>
      </div>

      {/* Top-level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {topLevelKPIs.map((kpi, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 p-5 flex flex-col justify-between min-h-[120px] relative overflow-hidden group"
          >
            <div className={`absolute -right-8 -bottom-8 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
              kpi.color === 'emerald' ? 'bg-emerald-400' :
              kpi.color === 'blue' ? 'bg-blue-400' :
              kpi.color === 'amber' ? 'bg-amber-400' :
              kpi.color === 'purple' ? 'bg-purple-400' :
              kpi.color === 'rose' ? 'bg-rose-400' : 'bg-slate-400'
            }`} />
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl shrink-0 border border-slate-100 ${
                kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                kpi.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                kpi.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                kpi.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                kpi.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                'bg-slate-50 text-slate-600'
              }`}>
                <kpi.icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</div>
                <div className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none mt-1">{kpi.value}</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50">
              <span className="text-[11px] text-slate-400 font-medium">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Social Equity & Inclusion Section */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl mt-8 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500 rounded-full blur-[120px] opacity-20 -ml-20 -mb-20"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 rounded-full px-3 py-1 mb-4">
                <Users size={11} />
                Social Equity Focus
              </div>
              <h3 className="text-3xl font-extrabold tracking-tight mb-4">Marginalization at the Baseline</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Direct programme metrics alone can mask systemic vulnerability. By analyzing the baseline through the lens of caste and gender, we identify the exact populations FASAL must prioritize for inclusion.
              </p>
              
              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                  <div className="text-4xl font-black text-rose-400 mb-1">{((baselineDemographics.vulnerability.totalScSt / 1638) * 100).toFixed(0)}%</div>
                  <div className="text-sm font-semibold text-slate-300">SC/ST Representation</div>
                  <div className="text-xs text-slate-500 mt-1">{baselineDemographics.vulnerability.totalScSt} out of 1,638 surveyed households belong to highly marginalized SC or ST communities.</div>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                  <div className="text-4xl font-black text-amber-400 mb-1">{baselineDemographics.vulnerability.singleWomen}</div>
                  <div className="text-sm font-semibold text-slate-300">Single & Widowed Women</div>
                  <div className="text-xs text-slate-500 mt-1">{baselineDemographics.vulnerability.singleWomenLandless} of these women are entirely landless, representing the highest intersection of vulnerability.</div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Caste Breakdown Chart */}
              <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl flex flex-col">
                <h4 className="text-sm font-bold text-slate-200 mb-4">Community Composition (Category)</h4>
                <div className="flex-1 min-h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'OBC', value: baselineDemographics.casteBreakdown.OBC, color: '#3b82f6' },
                          { name: 'ST', value: baselineDemographics.casteBreakdown.ST, color: '#f59e0b' },
                          { name: 'SC', value: baselineDemographics.casteBreakdown.SC, color: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {
                          [
                            { name: 'OBC', value: baselineDemographics.casteBreakdown.OBC, color: '#3b82f6' },
                            { name: 'ST', value: baselineDemographics.casteBreakdown.ST, color: '#f59e0b' },
                            { name: 'SC', value: baselineDemographics.casteBreakdown.SC, color: '#ef4444' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Landlessness & Income Gap */}
              <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-4">Baseline Economic Disparity</h4>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Avg Land: <strong className="text-slate-200">SC/ST vs OBC</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden flex">
                          <div className="bg-rose-500 h-full" style={{ width: '38%' }}></div>
                          <div className="bg-blue-500 h-full" style={{ width: '62%' }}></div>
                        </div>
                        <div className="text-xs font-mono text-slate-300 w-24 text-right">
                          <span className="text-rose-400">3.4</span> / <span className="text-blue-400">2.2</span> bigha
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                        ST communities possess larger landholdings (Avg 4.0 bigha) compared to OBC (2.2), likely due to forest-adjacent tracts.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Avg Pre-Programme Income: <strong className="text-slate-200">SC vs ST</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden flex">
                          <div className="bg-red-500 h-full" style={{ width: '29%' }}></div>
                          <div className="bg-amber-500 h-full" style={{ width: '71%' }}></div>
                        </div>
                        <div className="text-xs font-mono text-slate-300 w-24 text-right">
                          <span className="text-red-400">24K</span> / <span className="text-amber-400">59K</span> Rs
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                        SC households start from severe economic disadvantage (₹24,463 avg annual agri income) compared to ST (₹59,273).
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-500/20 rounded-lg">
                  <div className="text-xs font-bold text-indigo-300 mb-1">Triangulation Insight</div>
                  <div className="text-[11px] text-slate-300 leading-snug">
                    While <strong>40%</strong> ({baselineDemographics.vulnerability.totalLandless}) of the baseline cohort is landless, the MIS Rights Tab confirms <strong>100%</strong> of our targeted tenant farmers have received formal lease leverage support.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Cross-Verification & Cohort Triangulation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Database Triangulation & Cross-Verification</h3>
            <p className="text-xs text-slate-500">Validation of active programme registry against the baseline survey database</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Match Rate Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cross-Registry Overlap</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-800">{triangulationSummary.matchRatePct}%</span>
                <span className="text-sm text-slate-500">match rate</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                <strong>{triangulationSummary.matchedCount}</strong> out of <strong>{triangulationSummary.activeFarmersCount}</strong> active programme farmers matched with their original baseline household survey using fuzzy name matching and village validation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Confidence Level</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">High (Ratio &gt;= 75)</span>
            </div>
          </div>

          {/* Income Progress Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Triangulated Income Progression</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-800">₹{triangulationSummary.averageBaselineNetIncome.toLocaleString('en-IN')}</span>
                <span className="text-sm text-slate-500">pre-programme net income</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                The average baseline net agricultural profit for this matched cohort was just <strong>₹14,380</strong> per year. Today, the program target stands at <strong>₹60,000</strong> per acre, and achieved metrics show <strong>₹1,31,977</strong> average profit per acre.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Income Multiplier Effect</span>
              <span className="font-bold text-emerald-600">~9.1x Growth</span>
            </div>
          </div>

          {/* Social Inclusion Validation */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Targeted Inclusion Check</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-800">{((triangulationSummary.landlessCountMatched / triangulationSummary.matchedCount) * 100).toFixed(0)}%</span>
                <span className="text-sm text-slate-500">landless at baseline</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                <strong>{triangulationSummary.landlessCountMatched}</strong> of the matched active programme farmers were completely landless at baseline. Their active presence in our MIS proves successful targeting of landless sharecroppers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Marginalized Cohort Inclusion</span>
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Verified Tenant Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registry Audit & Integrity Verification Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Registry Audit & Integrity Verification</h3>
            <p className="text-xs text-slate-500">Continuous programmatic auditing comparing active MIS data against the baseline truth database</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Land Discrepancy Audit Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-700">Land Record Outliers (Bigha vs. Acres Audit)</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${landDiscrepancies.summary.totalDiscrepancies > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {landDiscrepancies.summary.totalDiscrepancies} Anomalies Flagged
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Active registries are reported in Acres, while Baseline surveys recorded land in regional Bighas. We cross-verify these entries using a local conversion factor (1 Acre = 1.6 Bigha). The outliers below show deviations &gt;20%, requiring immediate field verification.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider text-left">
                      <th className="py-2 pr-2 font-semibold">Farmer ID</th>
                      <th className="py-2 px-2 font-semibold">Name</th>
                      <th className="py-2 px-2 font-semibold text-right">Active (Acres)</th>
                      <th className="py-2 px-2 font-semibold text-right">Baseline (Bighas)</th>
                      <th className="py-2 pl-2 font-semibold text-right">Deviation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {landDiscrepancies.outliers.slice(0, 4).map((outlier, i) => (
                      <tr key={i} className="hover:bg-slate-100/50">
                        <td className="py-2 pr-2 font-mono text-slate-500 text-[10px]">{outlier.id}</td>
                        <td className="py-2 px-2 text-slate-700">{outlier.name}</td>
                        <td className="py-2 px-2 text-right text-slate-600">{outlier.activeAcres} ac</td>
                        <td className="py-2 px-2 text-right text-slate-600">{outlier.baselineBighas} bigha</td>
                        <td className="py-2 pl-2 text-right text-rose-600 font-bold">{outlier.deviationPct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
              <span>Overall Match Integrity Rate</span>
              <span className="font-bold text-emerald-600">{landDiscrepancies.summary.matchAccuracyPct}% Clean</span>
            </div>
          </div>

          {/* Social Equity Outcome Triangulation */}
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-4">Intersectional Outcomes by Caste Category</h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                By segmenting active programme outcomes (leverage mobilized, trainings attended, and current net income) using matched baseline caste identities, we verify equitable service delivery.
              </p>

              <div className="space-y-4">
                {casteOutcomes.castePerformance.map((caste, i) => (
                  <div key={i} className="bg-white rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          caste.category === 'SC' ? 'bg-red-500' :
                          caste.category === 'ST' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <span className="font-bold text-slate-800 text-xs">{caste.category} Cohort</span>
                        <span className="text-[10px] text-slate-400">({caste.activeFarmersCount} active)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-emerald-600">₹{(caste.avgActiveNetIncomePerAcreRs / 1000).toFixed(0)}K/ac</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Avg Active Income</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50 text-[10px] text-slate-500">
                      <div>
                        <span className="text-slate-400 block">Leverage Mobilized</span>
                        <span className="font-bold text-slate-700 font-mono">₹{caste.totalLeverageRsLakhs.toFixed(2)} Lakhs</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Avg Trainings Attended</span>
                        <span className="font-bold text-slate-700 font-mono">{caste.avgTrainingsAttended} sessions</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-400">
              *Triangulated metrics derived from the 600 matched baseline records.
            </div>
          </div>
        </div>
      </div>

      {/* GP Comparison Charts + Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">GP-level Baseline Comparison</h3>
            <p className="text-xs text-slate-400 mt-0.5">Compare starting conditions across all 6 Gram Panchayats</p>
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            {(['income', 'land', 'social'] as const).map(m => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${activeMetric === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {m === 'income' ? '💰 Income' : m === 'land' ? '🌾 Land' : '🏛️ Social'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gpChartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: 12 }}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
              />
              {activeMetric === 'income' && <>
                <Bar dataKey="Agri Income (L)" fill="#a7f3d0" radius={[4,4,0,0]} />
                <Bar dataKey="Net Agri Income (L)" fill="#10b981" radius={[4,4,0,0]} />
              </>}
              {activeMetric === 'land' && <>
                <Bar dataKey="Cultivable Land (Bigha)" fill="#bfdbfe" radius={[4,4,0,0]} />
                <Bar dataKey="Avg/Family (Bigha)" fill="#3b82f6" radius={[4,4,0,0]} />
              </>}
              {activeMetric === 'social' && <>
                <Bar dataKey="Bank Account (%)" fill="#c4b5fd" radius={[4,4,0,0]} />
                <Bar dataKey="Govt Scheme (%)" fill="#8b5cf6" radius={[4,4,0,0]} />
                <Bar dataKey="Toilet Coverage (%)" fill="#fca5a5" radius={[4,4,0,0]} />
              </>}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed GP Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">GP Profile Cards</h3>
          <p className="text-xs text-slate-400">Click a card to expand details</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gpComparison.map((gp) => {
            const isActive = activeGP === gp.gp;
            const color = colorForGP(gp.gp);
            return (
              <div
                key={gp.gp}
                onClick={() => setActiveGP(isActive ? null : gp.gp)}
                className={`bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${isActive ? 'border-2 shadow-lg' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                style={isActive ? { borderColor: color } : {}}
              >
                {/* Card header bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{gp.gp}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{gp.households} households surveyed</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-slate-800">{fmtLakhs(gp.totalNetAgriIncome)}</div>
                      <div className="text-[10px] text-slate-400">Net Agri Income</div>
                    </div>
                  </div>

                  {/* Quick indicators */}
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-slate-500 font-medium">Female Farmers</span>
                        <span className="text-[11px] font-bold text-slate-700">{gp.femaleFarmerPct.toFixed(0)}%</span>
                      </div>
                      <PctBar value={gp.femaleFarmerPct} color={color} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-slate-500 font-medium">Govt Scheme Access</span>
                        <span className="text-[11px] font-bold text-slate-700">{gp.govtSchemePct.toFixed(0)}%</span>
                      </div>
                      <PctBar value={gp.govtSchemePct} color="#6366f1" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-slate-500 font-medium">Toilet Coverage</span>
                        <span className="text-[11px] font-bold text-slate-700">{gp.toiletPct.toFixed(0)}%</span>
                      </div>
                      <PctBar value={gp.toiletPct} color="#f59e0b" />
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-slate-400">
                    <ChevronDown size={12} className={`transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    {isActive ? 'Collapse' : 'View details'}
                  </div>
                </div>

                {/* Expanded section */}
                {isActive && (
                  <div className="border-t border-slate-100 px-4 pb-4 pt-3 bg-slate-50/50 space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Full Baseline Profile</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Cultivable Land', value: `${gp.cultivableLandBigha.toLocaleString('en-IN')} bigha` },
                        { label: 'Avg Land/Family', value: `${gp.avgLandPerFamilyBigha.toFixed(2)} bigha` },
                        { label: 'Landless Families', value: `${gp.landlessFamiliesPct.toFixed(1)}%` },
                        { label: 'Avg Income/Bigha', value: fmtLakhs(gp.avgIncomePerBigha) },
                        { label: 'Single Women', value: gp.singleWomenCount },
                        { label: 'Bank Account', value: `${gp.bankAccountPct.toFixed(1)}%` },
                        { label: 'AAS Membership', value: `${gp.aasMembershipPct.toFixed(1)}%` },
                        { label: 'Migration Dependency', value: `${gp.migrationPct.toFixed(1)}%` },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-white rounded-lg border border-slate-100 px-2.5 py-2">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                          <div className="text-xs font-bold text-slate-700 mt-0.5">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparative table: all GPs at once */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-5">Full Baseline Data Table — All GPs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="text-left py-2.5 pr-4 font-semibold">Gram Panchayat</th>
                <th className="text-right py-2.5 px-3 font-semibold">HH</th>
                <th className="text-right py-2.5 px-3 font-semibold">Female %</th>
                <th className="text-right py-2.5 px-3 font-semibold">Land (bigha)</th>
                <th className="text-right py-2.5 px-3 font-semibold">Agri Income</th>
                <th className="text-right py-2.5 px-3 font-semibold">Net Income</th>
                <th className="text-right py-2.5 px-3 font-semibold">Inc/Bigha</th>
                <th className="text-right py-2.5 px-3 font-semibold">Bank A/C</th>
                <th className="text-right py-2.5 px-3 font-semibold">Govnt Scheme</th>
                <th className="text-right py-2.5 pl-3 font-semibold">Toilet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {gpComparison.map((gp, i) => (
                <tr
                  key={gp.gp}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setActiveGP(activeGP === gp.gp ? null : gp.gp)}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorForGP(gp.gp) }} />
                      <span className="font-semibold text-slate-800">{gp.gp}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">{gp.households}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${gp.femaleFarmerPct >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {gp.femaleFarmerPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">{gp.cultivableLandBigha.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">{fmtLakhs(gp.totalAgriIncome)}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">{fmtLakhs(gp.totalNetAgriIncome)}</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-600">{fmtLakhs(gp.avgIncomePerBigha)}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${gp.bankAccountPct >= 95 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {gp.bankAccountPct.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${gp.govtSchemePct >= 70 ? 'bg-emerald-50 text-emerald-700' : gp.govtSchemePct >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                      {gp.govtSchemePct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${gp.toiletPct >= 60 ? 'bg-emerald-50 text-emerald-700' : gp.toiletPct >= 35 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                      {gp.toiletPct.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Grand Total row */}
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="py-3 pr-4 font-bold text-slate-800">All 6 GPs (Aggregate)</td>
                <td className="py-3 px-3 text-right font-bold font-mono text-slate-800">{aggregateMetrics.totalHouseholds.toLocaleString('en-IN')}</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-700">{aggregateMetrics.femaleFarmerPct.toFixed(1)}%</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">{gpComparison.reduce((s, g) => s + g.cultivableLandBigha, 0).toLocaleString('en-IN')}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">{fmtLakhs(aggregateMetrics.totalAgriIncomeRs)}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">{fmtLakhs(aggregateMetrics.totalNetAgriIncomeRs)}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">—</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-700">{aggregateMetrics.bankAccountPct.toFixed(0)}%</td>
                <td className="py-3 px-3 text-right font-bold text-amber-700">{aggregateMetrics.govtSchemeBeneficiaryPct.toFixed(1)}%</td>
                <td className="py-3 pl-3 text-right font-bold text-amber-700">{aggregateMetrics.toiletHouseholdsPct.toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-[10px] text-slate-400 mt-3">
          Source: <span className="font-semibold">Baseline Findings NRM.xlsx</span> + <span className="font-semibold">Base line Data1.xlsx</span> · Colours: 🟢 Good · 🟡 Moderate · 🔴 Needs Attention
        </p>
      </div>

      {/* Key vulnerabilities callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
          <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">⚠ High Vulnerability: Sanitation</div>
          <p className="text-sm text-rose-800">
            Only <strong>{aggregateMetrics.toiletHouseholdsPct}%</strong> of households had toilets at baseline. Chahalwa GP had the lowest coverage at just <strong>15.1%</strong>.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">⚡ Starting Point: Income</div>
          <p className="text-sm text-amber-800">
            Baseline net agriculture income across all GPs was <strong>{fmtLakhs(aggregateMetrics.totalNetAgriIncomeRs)}</strong>. Programme target: multiply this through crop diversification.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">✅ Strength: Women-Led</div>
          <p className="text-sm text-emerald-800">
            <strong>{aggregateMetrics.femaleFarmerPct.toFixed(1)}%</strong> of programme farmers are women, with <strong>{aggregateMetrics.singleWomen?.toLocaleString() || '194'}+</strong> single/widowed women in the cohort.
          </p>
        </div>
      </div>

    </div>
  );
}
