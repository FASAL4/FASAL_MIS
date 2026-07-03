import React, { useMemo, useState } from 'react';
import { BarChart3, Users, Layers, Filter, Sparkles, Info, MapPin } from 'lucide-react';
import familyEligibility from '../../../data/family_eligibility.json';

type GpFilter = 'All' | string;

interface Criterion {
    key: string;
    label: string;
    shortLabel: string;
    color: string;       // tailwind background
    textColor: string;   // tailwind text
    barColor: string;    // bar fill
    description: string;
    focusSchemeLink: string;
    extract: (f: any) => boolean;
}

const CRITERIA: Criterion[] = [
    {
        key: 'bpl',
        label: 'BPL Families',
        shortLabel: 'BPL',
        color: 'bg-amber-100',
        textColor: 'text-amber-800',
        barColor: '#f59e0b',
        description: 'Below Poverty Line — eligible for subsidized food grains, Ayushman, PMAY',
        focusSchemeLink: 'Ration Card, Ayushman, PM Awas',
        extract: f => !!f.criteria?.bpl,
    },
    {
        key: 'antodyaya',
        label: 'Antodyaya',
        shortLabel: 'Antodyaya',
        color: 'bg-rose-100',
        textColor: 'text-rose-800',
        barColor: '#f43f5e',
        description: 'Poorest of the poor — 35 kg free grain/month under AAY',
        focusSchemeLink: 'Antodyaya Anna Yojana',
        extract: f => !!f.criteria?.antodyaya,
    },
    {
        key: 'landless',
        label: 'Landless',
        shortLabel: 'Landless',
        color: 'bg-orange-100',
        textColor: 'text-orange-800',
        barColor: '#f97316',
        description: '≤0.05 acres cultivable land — priority for MNREGA',
        focusSchemeLink: 'MNREGA Job Card',
        extract: f => !!f.criteria?.landless,
    },
    {
        key: 'scst',
        label: 'SC/ST Families',
        shortLabel: 'SC/ST',
        color: 'bg-purple-100',
        textColor: 'text-purple-800',
        barColor: '#a855f7',
        description: 'Scheduled Caste/Scheduled Tribe — additional welfare benefits',
        focusSchemeLink: 'SC/ST Welfare Scheme',
        extract: f => f.criteria?.caste === 'SC' || f.criteria?.caste === 'ST',
    },
    {
        key: 'female',
        label: 'Female Headed',
        shortLabel: 'Female',
        color: 'bg-pink-100',
        textColor: 'text-pink-800',
        barColor: '#ec4899',
        description: 'Female primary farmer — eligible for women-centric schemes',
        focusSchemeLink: 'Widow Pension, SHG Credit',
        extract: f => !!f.criteria?.female,
    },
    {
        key: 'bankAccount',
        label: 'Bank Account',
        shortLabel: 'Bank',
        color: 'bg-blue-100',
        textColor: 'text-blue-800',
        barColor: '#3b82f6',
        description: 'Has a bank account — required for DBT',
        focusSchemeLink: 'All DBT-linked schemes',
        extract: f => !!f.criteria?.bankAccount,
    },
];

export function EligibilityMatrix() {
    const [gpFilter, setGpFilter] = useState<GpFilter>('All');

    const dataset = (familyEligibility as any) as {
        families: Array<any>;
        coverage: any;
        gpRollup: Array<{ gp: string; families: number; bpl: number; landless: number; scst: number; female: number }>;
    };

    const filteredFamilies = useMemo(() => {
        if (gpFilter === 'All') return dataset.families;
        return dataset.families.filter((f: any) => f.gp === gpFilter);
    }, [gpFilter, dataset.families]);

    const gpOptions = useMemo(() => {
        const set = new Set<string>();
        dataset.families.forEach((f: any) => f.gp && set.add(f.gp));
        return Array.from(set).filter(Boolean).sort();
    }, [dataset.families]);

    const total = filteredFamilies.length || 1;
    const stats = useMemo(() => {
        return CRITERIA.map(c => {
            const count = filteredFamilies.filter(c.extract).length;
            const pct = Math.round((count / total) * 1000) / 10;
            return { ...c, count, pct };
        });
    }, [filteredFamilies, total]);

    const overallCoverage = (dataset.coverage?.totalFamilies || 0);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Eligibility Coverage Matrix</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            % of <span className="font-bold text-slate-700">600 matched families</span> meeting scheme-eligibility criteria
                            {gpFilter !== 'All' && <> in <span className="font-bold text-slate-700">{gpFilter}</span> GP</>}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-slate-400" />
                    <select
                        value={gpFilter}
                        onChange={e => setGpFilter(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        <option value="All">All GPs ({overallCoverage})</option>
                        {gpOptions.map(gp => (
                            <option key={gp} value={gp}>{gp} ({dataset.families.filter((f: any) => f.gp === gp).length})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data Scope: denominator cascade callout */}
            <div className="mb-5 rounded-lg bg-slate-50 border border-slate-200 p-3.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Data Scope (Denominator Cascade)</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px]">Baseline Surveyed</span>
                        <span className="font-extrabold text-slate-800 text-base">2,060 <span className="text-[10px] font-normal text-slate-500">households</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px]">Active Registry (AAS)</span>
                        <span className="font-extrabold text-slate-800 text-base">1,322 <span className="text-[10px] font-normal text-slate-500">members (64.2%)</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px]">Matched Cohort (with flags)</span>
                        <span className="font-extrabold text-emerald-700 text-base">600 <span className="text-[10px] font-normal text-slate-500">(45.4% of registry, 29.1% of baseline)</span></span>
                    </div>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 italic">
                    Only the 600 matched records have the demographic flags (BPL/antodyaya/caste/bankAccount/etc.) needed for rule-based scheme eligibility. The 722 unmatched registry members are in the AAS groups but their baseline profile was not collected.
                </div>
            </div>

            {/* Horizontal stacked bar chart of criteria coverage */}
            <div className="space-y-3.5">
                {stats.map((s) => (
                    <div key={s.key} className="group">
                        <div className="flex items-baseline justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${s.color} ${s.textColor}`}>{s.shortLabel}</span>
                                <span className="text-sm font-semibold text-slate-700">{s.label}</span>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-base font-extrabold text-slate-800">{s.pct}%</span>
                                <span className="text-[10px] text-slate-500 font-medium ml-1">({s.count}/{total})</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/60 relative">
                            <div
                                className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                                style={{ width: `${Math.max(2, s.pct)}%`, backgroundColor: s.barColor }}
                            >
                                {s.pct >= 12 && (
                                    <span className="text-[9px] font-bold text-white drop-shadow">{s.pct}%</span>
                                )}
                            </div>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                            <Sparkles size={10} className="text-amber-500" />
                            <span>Linked to focus schemes: <span className="font-semibold text-slate-700">{s.focusSchemeLink}</span></span>
                        </div>
                    </div>
                ))}
            </div>

            {/* GP rollup compact view */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin size={14} className="text-slate-500" />
                    <h4 className="text-sm font-bold text-slate-800">GP-Level Rollup — where the vulnerable are concentrated</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {dataset.gpRollup.map((g: any) => {
                        const bplPct = g.families > 0 ? Math.round((g.bpl / g.families) * 1000) / 10 : 0;
                        const landlessPct = g.families > 0 ? Math.round((g.landless / g.families) * 1000) / 10 : 0;
                        const scstPct = g.families > 0 ? Math.round((g.scst / g.families) * 1000) / 10 : 0;
                        const femalePct = g.families > 0 ? Math.round((g.female / g.families) * 1000) / 10 : 0;
                        return (
                            <div key={g.gp} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-bold text-slate-800">{g.gp}</span>
                                    <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-500 font-bold border border-slate-200">{g.families} families</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-[10px]">
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-slate-600">BPL: <b className="text-slate-800">{bplPct}%</b></span></div>
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span><span className="text-slate-600">Landless: <b className="text-slate-800">{landlessPct}%</b></span></div>
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-slate-600">SC/ST: <b className="text-slate-800">{scstPct}%</b></span></div>
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span><span className="text-slate-600">Female: <b className="text-slate-800">{femalePct}%</b></span></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 rounded-md bg-slate-50 border border-slate-200 p-3 flex gap-2 text-[11px] text-slate-600">
                <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold text-slate-700">Methodology:</span> Eligibility is rule-based inference from existing baseline flags (BPL, antodyaya, cultivable acres, caste, gender, bank account). No new primary data was collected; for official sanction values, refer to the relevant government database.
                </div>
            </div>
        </div>
    );
}
