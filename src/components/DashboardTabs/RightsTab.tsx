import React, { useState } from 'react';
import { Shield, Users, IndianRupee, Building2, HelpCircle, ArrowRight, CheckCircle2, AlertCircle, LineChart as LucideLineChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import * as Popover from '@radix-ui/react-popover';
import yearlyEntitlements from '../../data/yearly_entitlements.json';

const formatCurrencyLakhs = (valueInLakhs: number) => {
  if (valueInLakhs >= 100) {
    return `₹${(valueInLakhs / 100).toFixed(2)} Cr`;
  }
  return `₹${valueInLakhs.toFixed(2)} L`;
};

const formatYAxisLakhs = (v: number) => {
  if (v >= 100) {
    return `₹${(v / 100).toFixed(1)} Cr`;
  }
  return `₹${v.toFixed(0)} L`;
};

const GP_VILLAGE_MAP: Record<string, string[]> = {
  'Karikot': ['Rajaram Tanda', 'Narayan Tanda', 'Jamuniha', 'Bhatta Bargadaha', 'Azamgadhpurwa'],
  'Fakirpuri': ['Fakirpuri', 'Lohra', 'Rampurwa', 'Badihanpurwa'],
  'Chahalwa': ['Sirsiyanpurwa', 'Hajaripurwa', 'Badhiyanpurwa', 'Mangalpurwa'],
  'Bajpur Bankati': ['Bajpur Bankati', 'Jamuniya', 'Dhondhepurwa'],
  'Vishunapur': ['Vishunapur', 'Kailash Nagar', 'Kailash Nagar Dekhiya', 'Dhodhepurwa', 'Vishuntanda'],
  'Badkhadiya': ['Ghoorepurwa', 'Bhodahanpurwa']
};

const EvidenceDrawer = ({ title, source, sheet, calculation, rfLink, status, caution }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-t border-slate-100 pt-3 w-full">
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                <Popover.Trigger asChild>
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-full text-left outline-none rounded-md group">
                        <HelpCircle size={16} className={isOpen ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'} />
                        Evidence Trail
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content side="bottom" align="start" sideOffset={8} className="z-50 w-[420px] rounded-xl bg-white p-5 shadow-xl shadow-slate-200/50 border border-slate-200 text-sm">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Source & Location</dt>
                                <dd className="flex text-sm text-slate-900 items-center"><span className="font-medium bg-slate-100 px-2 py-0.5 rounded mr-2">{source}</span> <span className="text-slate-500">sheet: {sheet}</span></dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Calculation</dt>
                                <dd className="bg-white border border-slate-200 p-3 rounded-lg">{calculation}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">RF Link</dt>
                                <dd className="font-mono bg-slate-50 px-2 py-1 rounded w-fit border border-slate-200">{rfLink}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Status</dt>
                                <dd><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${status === 'Verified' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'}`}>{status === 'Verified' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}{status}</span></dd>
                            </div>
                        </dl>
                        {caution && <div className="mt-5 rounded-md bg-amber-50/50 p-4 border border-amber-200/60"><p className="text-sm text-amber-800"><strong className="font-semibold">Note:</strong> {caution}</p></div>}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
    );
};

export function RightsTab({ farmersData = [] }: { farmersData?: any[] }) {
    const [drilldownLevel, setDrilldownLevel] = useState<'gp' | 'village' | 'household' | 'cumulative'>('gp');
    const [selectedGPName, setSelectedGPName] = useState('Karikot');
    const [selectedVillageName, setSelectedVillageName] = useState('Rajaram Tanda');
    const [hhSearchQuery, setHhSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('Cumulative');
    
    // Dynamic Right selector states
    const [selectedRightsYear, setSelectedRightsYear] = useState('Cumulative');
    const [selectedEntitlementLimit, setSelectedEntitlementLimit] = useState('10');

    const getLeverageKPI = () => {
        switch (selectedYear) {
            case '2022':
                return { label: '2022 Leverage', value: '₹54.14 L', sub: '22% of ₹2.50 Cr target' };
            case '2023':
                return { label: '2023 Leverage', value: '₹2.63 Cr', sub: '105% of ₹2.50 Cr target' };
            case '2024':
                return { label: '2024 Leverage', value: '₹2.30 Cr', sub: '92% of ₹2.50 Cr target' };
            case '2025':
                return { label: '2025 Leverage', value: '₹2.78 Cr', sub: '111% of ₹2.50 Cr target' };
            case 'Cumulative':
            default:
                return { label: 'Cumulative Leverage', value: '₹8.25 Cr', sub: '330% of ₹2.50 Cr target' };
        }
    };

    const activeLeverage = getLeverageKPI();

    const kpis = [
        { label: 'Surveyed Families', value: '1,329', sub: '100% of target area', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Tracked Entitlements', value: '75', sub: 'Across 12 main categories', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: activeLeverage.label, value: activeLeverage.value, sub: activeLeverage.sub, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Gram Panchayats', value: '6', sub: 'Mihinpurwa Block', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    const rawConversionData = (yearlyEntitlements as Record<string, Array<{ name: string, advocated: number, received: number }>>)[selectedRightsYear] || [];
    const limitNum = parseInt(selectedEntitlementLimit, 10);
    const conversionData = rawConversionData.slice(0, limitNum);
    const chartHeight = limitNum === 75 ? 1800 : limitNum === 20 ? 480 : limitNum === 10 ? 280 : 160;

    const gpData = [
        { name: 'Karikot', families: 602, pct: 45.3 },
        { name: 'Fakirpuri', families: 229, pct: 17.2 },
        { name: 'Chahalwa', families: 271, pct: 20.4 },
        { name: 'Bajpur Bankati', families: 113, pct: 8.5 },
        { name: 'Vishunapur', families: 73, pct: 5.5 },
        { name: 'Badkhadiya', families: 41, pct: 3.1 },
    ];

    const leverageData = [
        { year: '2022', amount: 54.14, beneficiaries: 200, avgPerFamily: 27070 },
        { year: '2023', amount: 262.81, beneficiaries: 600, avgPerFamily: 43802 },
        { year: '2024', amount: 229.93, beneficiaries: 800, avgPerFamily: 28741 },
        { year: '2025', amount: 278.25, beneficiaries: 819, avgPerFamily: 33974 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Rights and Entitlements (R&E) Convergence</h2>
                    <p className="text-slate-500 mt-1">FDB survey data covering 75 entitlements across 1,329 families</p>
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-slate-600">Year Filter:</label>
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={e => setSelectedYear(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            <option value="Cumulative">Cumulative (5-Year)</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[128px]">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{kpi.label}</div>
                                <div className="text-xl font-extrabold text-slate-900 mt-2 leading-none">{kpi.value}</div>
                            </div>
                            <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color} shrink-0`}><kpi.icon size={18} /></div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 mt-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${kpi.color.replace('text-', 'bg-')}`}></span>
                            <span className="text-[10px] text-slate-500 font-medium leading-none">{kpi.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Geographic Hierarchy Selector Card (Full Width) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full flex flex-col justify-between min-h-[480px]">
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Geographic Drilldown Selector</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Explore results from block level down to single household</p>
                        </div>
                        <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                            {[
                                { id: 'gp', label: 'GP Level' },
                                { id: 'village', label: 'Village Level' },
                                { id: 'household', label: 'Household' },
                                { id: 'cumulative', label: 'Cumulative' }
                            ].map(level => (
                                <button
                                    key={level.id}
                                    onClick={() => setDrilldownLevel(level.id as any)}
                                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${drilldownLevel === level.id ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* GP Level Content */}
                    {drilldownLevel === 'gp' && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                <span>Gram Panchayat</span>
                                <span>Families (% of total)</span>
                            </div>
                            <div className="space-y-2">
                                {gpData.map((gp, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => {
                                            setSelectedGPName(gp.name);
                                            const villages = GP_VILLAGE_MAP[gp.name] || [];
                                            if (villages.length > 0) setSelectedVillageName(villages[0]);
                                            setDrilldownLevel('village');
                                        }} 
                                        className="w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all hover:bg-slate-50/50 border-slate-100 bg-white group hover:border-emerald-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></div>
                                            <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">{gp.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-900">{gp.families}</span>
                                            <span className="text-xs text-slate-400 w-10 text-right">{gp.pct}%</span>
                                            <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Village Level Content */}
                    {drilldownLevel === 'village' && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Villages under GP:</span>
                                <select
                                    value={selectedGPName}
                                    onChange={(e) => {
                                        setSelectedGPName(e.target.value);
                                        const vils = GP_VILLAGE_MAP[e.target.value] || [];
                                        if (vils.length > 0) setSelectedVillageName(vils[0]);
                                    }}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    {gpData.map(gp => (
                                        <option key={gp.name} value={gp.name}>{gp.name} GP</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {(GP_VILLAGE_MAP[selectedGPName] || []).map((village, i) => {
                                    const count = farmersData.filter(f => f.village === village).length;
                                    return (
                                        <button 
                                            key={i} 
                                            onClick={() => {
                                                setSelectedVillageName(village);
                                                setDrilldownLevel('household');
                                            }}
                                            className="p-4 rounded-xl border border-slate-100 hover:border-emerald-200 bg-white hover:bg-slate-50/50 text-left transition-all group flex justify-between items-center"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors text-sm">{village}</h4>
                                                <p className="text-xs text-slate-400 mt-1">{count} active registry households</p>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Household Level Content */}
                    {drilldownLevel === 'household' && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-100 pb-4">
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={selectedGPName}
                                        onChange={(e) => {
                                            setSelectedGPName(e.target.value);
                                            const vils = GP_VILLAGE_MAP[e.target.value] || [];
                                            if (vils.length > 0) setSelectedVillageName(vils[0]);
                                        }}
                                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                                    >
                                        {gpData.map(gp => (
                                            <option key={gp.name} value={gp.name}>{gp.name} GP</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedVillageName}
                                        onChange={(e) => setSelectedVillageName(e.target.value)}
                                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                                    >
                                        {(GP_VILLAGE_MAP[selectedGPName] || []).map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative w-full sm:w-48 shrink-0">
                                    <input
                                        type="text"
                                        value={hhSearchQuery}
                                        onChange={(e) => setHhSearchQuery(e.target.value)}
                                        placeholder="Search families..."
                                        className="pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none rounded-lg text-xs w-full transition-all"
                                    />
                                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                            </div>

                            <div className="overflow-x-auto border border-slate-100 rounded-xl">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                                        <tr>
                                            <th className="px-4 py-2.5">Code</th>
                                            <th className="px-4 py-2.5">Farmer Name</th>
                                            <th className="px-4 py-2 text-center">Gender</th>
                                            <th className="px-4 py-2.5">AAS Group</th>
                                            <th className="px-4 py-2.5 text-right">Land (Ac)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {(() => {
                                            const filtered = farmersData
                                                .filter(f => f.village === selectedVillageName)
                                                .filter(f => {
                                                    if (!hhSearchQuery) return true;
                                                    return f.name.toLowerCase().includes(hhSearchQuery.toLowerCase()) || 
                                                           f.id.toLowerCase().includes(hhSearchQuery.toLowerCase()) ||
                                                           (f.group && f.group.toLowerCase().includes(hhSearchQuery.toLowerCase()));
                                                });
                                            if (filtered.length === 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                                            No households registered in this village match the criteria.
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                            return filtered.slice(0, 5).map((f, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-2.5 font-mono text-[10px] text-slate-400">{f.id}</td>
                                                    <td className="px-4 py-2.5 font-medium text-slate-800">{f.name}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${f.gender === 'F' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'}`}>
                                                            {f.gender}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-slate-600">{f.group || '-'}</td>
                                                    <td className="px-4 py-2.5 text-right font-mono text-slate-600">{f.totalLand || '-'}</td>
                                                </tr>
                                            ));
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-[10px] text-slate-400 italic">Showing up to 5 households. Full registry available in Farmer Registry tab.</div>
                        </div>
                    )}

                    {drilldownLevel === 'cumulative' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex gap-3 text-xs text-indigo-900">
                                <div className="font-semibold shrink-0">Cumulative Focus:</div>
                                <div>The FASAL program covers 7 Gram Panchayats encompassing 23 distinct villages. The total saturation model ensures structured access to entitlements across all locations.</div>
                            </div>
                            <div className="h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={gpData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} />
                                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                                        <Bar dataKey="families" fill="#6366f1" radius={[4, 4, 0, 0]} name="Families" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                    <div className="flex gap-2 text-xs">
                        <span className="font-semibold text-slate-500">Current Scope:</span>
                        <span className="font-bold text-emerald-700">{selectedGPName} GP</span>
                        <span className="text-slate-300">/</span>
                        <span className="font-bold text-indigo-700">{selectedVillageName} Village</span>
                    </div>
                    <button 
                        onClick={() => {
                            setSelectedGPName('Karikot');
                            setSelectedVillageName('Rajaram Tanda');
                            setDrilldownLevel('gp');
                        }} 
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition-colors"
                    >
                        Reset to Top GP Level
                    </button>
                </div>
            </div>

            {/* side-by-side Grid of 2 Charts (1:1 Ratio, Spacious) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Advocacy → Access Conversion (Top Entitlements) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Advocacy → Access Conversion</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Ranked by advocated volume (showing top requested entitlements)</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            {/* Entitlement limit selector */}
                            <div className="relative">
                                <select
                                    value={selectedEntitlementLimit}
                                    onChange={e => setSelectedEntitlementLimit(e.target.value)}
                                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                                >
                                    <option value="5">Top 5</option>
                                    <option value="10">Top 10</option>
                                    <option value="20">Top 20</option>
                                    <option value="75">All 75</option>
                                </select>
                                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                            </div>

                            {/* Year selector */}
                            <div className="relative">
                                <select
                                    value={selectedRightsYear}
                                    onChange={e => setSelectedRightsYear(e.target.value)}
                                    className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                                >
                                    <option value="Cumulative">Cumulative</option>
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
                    </div>

                    <div className="overflow-y-auto pr-1" style={{ height: '320px' }}>
                        <div style={{ height: `${chartHeight}px`, minHeight: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={conversionData} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis type="number" tick={{ fontSize: 11 }} />
                                    <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    <Bar dataKey="advocated" fill="#818cf8" name="Advocated" radius={[0, 4, 4, 0]} barSize={limitNum > 20 ? 8 : 14} />
                                    <Bar dataKey="received" fill="#34d399" name="Received" radius={[0, 4, 4, 0]} barSize={limitNum > 20 ? 8 : 14} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <EvidenceDrawer source="DEHAT_Dash.xlsx / Leverage Files" sheet="Leverage 2023/2024/2025" calculation="Sum of individual entitlement receipts across all years" rfLink="Outcome 1/4" status="Verified" caution="Leverage amounts from DEHAT records; official sanction values may vary." />
                </div>

                {/* Chart 2: Year-wise Leverage & Unit Family Economics */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Year-wise Leverage & Unit Economics</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={leverageData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v: any) => formatYAxisLakhs(v)} stroke="#10b981" />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v: any) => `₹${(v/1000).toFixed(0)}K`} stroke="#6366f1" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                                    formatter={(v: any, name: any) => {
                                        if (name === 'amount') return [formatCurrencyLakhs(Number(v)), 'Total Leverage'];
                                        if (name === 'avgPerFamily') return [`₹${Number(v).toLocaleString('en-IN')}`, 'Avg Benefit/Family'];
                                        return [v, name];
                                    }} 
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} name="amount" />
                                <Line yAxisId="right" type="monotone" dataKey="avgPerFamily" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} name="avgPerFamily" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {leverageData.map((d, i) => (
                            <div key={i} className="bg-slate-50 p-2.5 rounded-lg text-center flex flex-col justify-between">
                                <div className="text-xs text-slate-500 font-semibold">{d.year}</div>
                                <div className="text-sm font-bold text-emerald-600 mt-0.5">{formatCurrencyLakhs(d.amount)}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">Avg: ₹{(d.avgPerFamily/1000).toFixed(1)}K</div>
                            </div>
                        ))}
                    </div>
                    <EvidenceDrawer source="Leverage Files 2022-2025" title="Leverage Summary" sheet="Annual sums + Beneficiary lists" calculation="Total annual leverage divided by unique beneficiary family counts" rfLink="Outcome 1/4" status="Verified" caution="2025 leverage includes partial-year data; averages calculated based on instances." />
                </div>
            </div>

            <div className="bg-slate-800 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <div className="text-sm text-slate-300">Overall Entitlement Conversion Rate</div>
                    <div className="text-3xl font-bold text-emerald-400">95.4%</div>
                </div>
                <div className="text-sm text-slate-300 text-right">
                    <div>352,210 total advocacy actions → 350,908 received</div>
                    <div className="text-emerald-400 font-semibold mt-1">99.6% of advocacy resulted in access</div>
                </div>
            </div>
        </div>
    );
}