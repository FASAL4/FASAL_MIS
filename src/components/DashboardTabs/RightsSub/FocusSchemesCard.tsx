import React, { useMemo, useState } from 'react';
import { Target, ChevronDown, ChevronUp, TrendingUp, Users, CheckCircle2, AlertCircle, X } from 'lucide-react';
import yearlyEntitlements from '../../../data/yearly_entitlements.json';
import familyEligibility from '../../../data/family_eligibility.json';

type YearKey = 'Cumulative' | '2022' | '2023' | '2024' | '2025';

interface FocusScheme {
    name: string;
    shortName: string;
    description: string;
    color: string;
    bgColor: string;
}

// Curated focus schemes per Manager spec. `match` is the exact
// entitlement name in yearly_entitlements.json (these names vary by year
// so we do a fuzzy contains match instead of strict equality).
const FOCUS_SCHEMES: FocusScheme[] = [
    {
        name: 'Aadhar Card',
        shortName: 'Aadhar',
        description: 'Universal biometric ID; required for all DBT-linked entitlements',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-50',
    },
    {
        name: 'Ration Card (BPL/Antodaya)',
        shortName: 'Ration Card',
        description: 'Subsidized food grain access under NFSA',
        color: 'text-amber-700',
        bgColor: 'bg-amber-50',
    },
    {
        name: 'MNREGA Job Card',
        shortName: 'MNREGA',
        description: '100 days guaranteed wage employment for rural adults',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
    },
    {
        name: 'Ayushman Bharat',
        shortName: 'Ayushman',
        description: '₹5L/year health cover for BPL & vulnerable families',
        color: 'text-rose-700',
        bgColor: 'bg-rose-50',
    },
    {
        name: 'PM Awas (PMAY-G)',
        shortName: 'PM Awas',
        description: 'Pucca housing for houseless & kutcha-house families',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
    },
    {
        name: 'Swachh Bharat Mission (Toilet)',
        shortName: 'SBM Toilet',
        description: 'IHHL construction incentive for BPL households',
        color: 'text-cyan-700',
        bgColor: 'bg-cyan-50',
    },
    {
        name: 'SC/ST Welfare Scheme',
        shortName: 'SC/ST',
        description: 'State and central welfare benefits for SC/ST families',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50',
    },
    {
        name: 'Old Age Pension (Vaya Vandana)',
        shortName: 'Vaya Vandana',
        description: 'Monthly pension for senior citizens (60+) from BPL',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
    },
];

function findSchemeRow(name: string, yearData: Array<{ name: string; advocated: number; received: number }>) {
    if (!yearData || yearData.length === 0) return null;
    const n = name.toLowerCase();
    // 1) exact (case-insensitive) match
    const exact = yearData.find(r => r.name.toLowerCase() === n);
    if (exact) return exact;
    // 2) "Aadhar" family of matches
    if (n.includes('aadhar')) {
        return yearData.find(r => r.name.toLowerCase().includes('aadhar')) || null;
    }
    // 3) Ration Card -> "ration card (bpl/antodaya)"
    if (n.includes('ration card')) {
        return yearData.find(r => r.name.toLowerCase().includes('ration')) || null;
    }
    // 4) MNREGA -> "mnrega job card"
    if (n.includes('mnrega')) {
        return yearData.find(r => r.name.toLowerCase().includes('mnrega')) || null;
    }
    // 5) Ayushman -> not in survey; derive from PMJAY-only entries
    if (n.includes('ayushman')) {
        return yearData.find(r => r.name.toLowerCase().includes('ayushman')) || null;
    }
    // 6) PM Awas -> housing schemes
    if (n.includes('pm awas') || n.includes('pmay')) {
        return yearData.find(r => r.name.toLowerCase().includes('awas') || r.name.toLowerCase().includes('pmay')) || null;
    }
    // 7) Toilet -> school toilet / IHHL
    if (n.includes('toilet') || n.includes('sbm')) {
        return yearData.find(r => r.name.toLowerCase().includes('toilet')) || null;
    }
    // 8) SC/ST welfare
    if (n.includes('sc') || n.includes('st') || n.includes('welfare')) {
        return yearData.find(r => r.name.toLowerCase().includes('sc') || r.name.toLowerCase().includes('st')) || null;
    }
    // 9) Old age pension
    if (n.includes('old age') || n.includes('vaya')) {
        return yearData.find(r => r.name.toLowerCase().includes('pension') || r.name.toLowerCase().includes('old age')) || null;
    }
    return null;
}

function eligibleFamiliesFor(schemeName: string): { count: number; pct: number } {
    const families = (familyEligibility as any).families as Array<{ eligibleSchemes: string[] }>;
    const total = families.length || 1;
    const count = families.filter(f => f.eligibleSchemes.includes(schemeName)).length;
    return { count, pct: Math.round((count / total) * 1000) / 10 };
}

function progressPct(advocated: number, received: number): number {
    if (!advocated || advocated <= 0) return 0;
    return Math.min(100, Math.round((received / advocated) * 100));
}

interface FocusSchemesCardProps {
    defaultYear?: YearKey;
}

export function FocusSchemesCard({ defaultYear = 'Cumulative' }: FocusSchemesCardProps) {
    const [year, setYear] = useState<YearKey>(defaultYear);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const [drilldownScheme, setDrilldownScheme] = useState<string | null>(null);

    const yearData = (yearlyEntitlements as Record<string, any[]>)[year] || [];

    const focusRows = useMemo(() => {
        return FOCUS_SCHEMES.map(s => {
            const row = findSchemeRow(s.name, yearData);
            const advocated = row?.advocated ?? 0;
            const received = row?.received ?? 0;
            const eligible = eligibleFamiliesFor(s.name);
            return {
                ...s,
                advocated,
                received,
                pct: progressPct(advocated, received),
                eligibleCount: eligible.count,
                eligiblePct: eligible.pct,
                hasData: !!row,
            };
        });
    }, [year, yearData]);

    const drilldownFamilies = useMemo(() => {
        if (!drilldownScheme) return [];
        const families = (familyEligibility as any).families as Array<any>;
        return families.filter(f => f.eligibleSchemes.includes(drilldownScheme));
    }, [drilldownScheme]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                        <Target size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Focus Schemes (5-8 priority entitlements)</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Want vs. got, cross-referenced with family eligibility (rule-based)</p>
                    </div>
                </div>
                <div className="relative">
                    <select
                        value={year}
                        onChange={e => setYear(e.target.value as YearKey)}
                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        <option value="Cumulative">Cumulative (5-Year)</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                </div>
            </div>

            {/* Data scope banner — explicit denominator */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px]">
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold">Coverage Denominator</span>
                <span className="text-slate-500">Want/Got totals are program-wide (75 entitlements, all surveyed families).</span>
                <span className="text-slate-500">Eligible-families count is from the <b className="text-slate-700">600 matched cohort</b> (45.4% of 1,322 registry, 29.1% of 2,060 baseline) — the only records with demographic flags for rule-based inference.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {focusRows.map((s, i) => {
                    const isExpanded = expandedIdx === i;
                    return (
                        <button
                            key={i}
                            onClick={() => {
                                setExpandedIdx(isExpanded ? null : i);
                                setDrilldownScheme(s.name);
                            }}
                            className={`text-left p-4 rounded-xl border transition-all ${s.bgColor} border-transparent hover:border-slate-200 hover:shadow-sm group`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className={`text-xs font-bold uppercase tracking-wider ${s.color}`}>{s.shortName}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{s.description}</div>
                                </div>
                                {isExpanded ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
                            </div>

                            <div className="mt-3">
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className={`text-2xl font-extrabold ${s.color}`}>{s.hasData ? `${s.pct}%` : 'N/A'}</span>
                                    <span className="text-[10px] text-slate-500 font-medium">conversion</span>
                                </div>
                                {/* Mini conversion bar */}
                                <div className="mt-2 w-full bg-white/70 rounded-full h-2 overflow-hidden border border-slate-200/50">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${s.pct >= 80 ? 'bg-emerald-500' : s.pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        style={{ width: `${s.hasData ? s.pct : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-1 text-[10px]">
                                <div>
                                    <div className="text-slate-400 font-semibold">Want</div>
                                    <div className="text-slate-800 font-bold">{s.hasData ? s.advocated.toLocaleString('en-IN') : '—'}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 font-semibold">Got</div>
                                    <div className="text-slate-800 font-bold">{s.hasData ? s.received.toLocaleString('en-IN') : '—'}</div>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center gap-1.5">
                                <Users size={11} className="text-slate-500" />
                                <span className="text-[10px] text-slate-600">
                                    <span className="font-bold">{s.eligibleCount}</span> families eligible ({s.eligiblePct}%)
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Expanded detail / drill-down for a focus scheme */}
            {expandedIdx !== null && drilldownScheme && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-slate-500" />
                            <h4 className="text-sm font-bold text-slate-800">Family-Scheme Mapping: {drilldownScheme}</h4>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">{drilldownFamilies.length} families</span>
                        </div>
                        <button
                            onClick={() => { setExpandedIdx(null); setDrilldownScheme(null); }}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {drilldownFamilies.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No matched families in registry meet the eligibility rules for this scheme.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                            {drilldownFamilies.slice(0, 24).map((f, idx) => (
                                <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-800 truncate">{f.name}</div>
                                        <div className="text-[10px] text-slate-500 truncate">{f.village} • {f.gp} GP</div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        {f.criteria?.bpl && <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">BPL</span>}
                                        {f.criteria?.landless && <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">Landless</span>}
                                        {f.criteria?.female && <span className="text-[9px] bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded font-bold">F</span>}
                                    </div>
                                </div>
                            ))}
                            {drilldownFamilies.length > 24 && (
                                <div className="col-span-full text-center text-[10px] text-slate-500 italic pt-1">
                                    +{drilldownFamilies.length - 24} more families. Full mapping available in Farmer Registry tab.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-semibold">
                            <AlertCircle size={10} /> Methodology: Rule-based inference from baseline flags
                        </span>
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-semibold">
                            <CheckCircle2 size={10} /> 600 matched families evaluated
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
