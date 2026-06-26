import React, { useState } from 'react';
import { Leaf, Sprout, Apple, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import * as Popover from '@radix-ui/react-popover';

const EvidenceDrawer = ({ source, sheet, calculation, rfLink, status, caution }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-t border-slate-100 pt-3 w-full">
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                <Popover.Trigger asChild>
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-full text-left outline-none rounded-md group">
                        <HelpCircle size={16} className={isOpen ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'} /> Evidence Trail
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content side="bottom" align="start" sideOffset={8} className="z-50 w-[420px] rounded-xl bg-white p-5 shadow-xl shadow-slate-200/50 border border-slate-200 text-sm">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                            <div className="sm:col-span-2"><dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Source</dt><dd><span className="font-medium bg-slate-100 px-2 py-0.5 rounded">{source}</span></dd></div>
                            <div className="sm:col-span-2"><dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Calculation</dt><dd className="bg-white border border-slate-200 p-3 rounded-lg">{calculation}</dd></div>
                            <div><dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">RF Link</dt><dd className="font-mono bg-slate-50 px-2 py-1 rounded w-fit border border-slate-200">{rfLink}</dd></div>
                            <div><dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Status</dt><dd><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${status === 'Verified' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'}`}>{status === 'Verified' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}{status}</span></dd></div>
                        </dl>
                        {caution && <div className="mt-5 rounded-md bg-amber-50/50 p-4 border border-amber-200/60"><p className="text-sm text-amber-800"><strong>Note:</strong> {caution}</p></div>}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
    );
};

export function NutritionTab() {
    const tricolourData = [
        { year: '2022', white: 82.8, green: 39.7, yellow: 45.0 },
        { year: '2023', white: 80.8, green: 64.2, yellow: 58.0 },
        { year: '2024', white: 76.5, green: 76.4, yellow: 62.0 },
    ];

    const kitchenGardenData = [
        { year: '2022', gardens: 200 },
        { year: '2023', gardens: 500 },
        { year: '2024', gardens: 900 },
        { year: '2025', gardens: 1328 },
    ];

    const householdSavingsData = [
        { year: '2022', savings: 2400 },
        { year: '2023', savings: 6800 },
        { year: '2024', savings: 14050 },
    ];

    const foodCategories = [
        { color: 'White', icon: Apple, items: 'Milk, Paneer, Egg, Cauliflower, Rice', bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700' },
        { color: 'Green', icon: Leaf, items: 'Bitter gourd, Bottle gourd, Drumstick, Greens, Ladyfinger, Lemon, Banana, Ridge gourd', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
        { color: 'Yellow', icon: Sprout, items: 'Pigeon pea, Chickpea, Peas dal, Lentil, Soybean, Wheat, Maize', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    ];

    const kpis = [
        { label: 'White Foods', value: '82.8% → 76.5%', sub: 'White Foods Consumption (2022→2024)', icon: Apple, color: 'text-stone-600', bg: 'bg-stone-50' },
        { label: 'Green Foods', value: '39.7% → 76.4%', sub: 'Green Foods Consumption (2022→2024) 🚀', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Yellow Foods', value: '45.0% → 62.0%', sub: 'Yellow Foods Consumption (2022→2024)', icon: Sprout, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Nutrition & Food Security</h2>
                <p className="text-slate-500 mt-1">Tricolour (Tiranga) monthly consumption tracking across 1,329 families</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Tricolour (Tiranga) Food Group Progression</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={tricolourData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v: any) => `${v}%`} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v: any) => [`${v}%`]} />
                            <Legend />
                            <Line type="monotone" dataKey="white" stroke="#78716c" strokeWidth={3} name="White (Dairy/Grains)" dot={{ r: 5 }} />
                            <Line type="monotone" dataKey="green" stroke="#10b981" strokeWidth={3} name="Green (Vegetables)" dot={{ r: 5 }} />
                            <Line type="monotone" dataKey="yellow" stroke="#f59e0b" strokeWidth={3} name="Yellow (Pulses)" dot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <EvidenceDrawer source="DEHAT_Dash.xlsx Nutrition Dashboard" sheet="Tricolour tracking" calculation="Monthly food group consumption % from FDB fields (1260 food fields)" rfLink="Outcome 2" status="Verified" caution="Self-reported consumption; not anthropometric measurement." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Tricolour Food Categories</h3>
                    {foodCategories.map((cat, i) => (
                        <div key={i} className={`${cat.bg} p-4 rounded-xl border ${cat.border}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <cat.icon size={18} className={cat.text} />
                                <h4 className={`font-bold ${cat.text}`}>{cat.color} Foods</h4>
                            </div>
                            <p className="text-sm text-slate-600">{cat.items}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Kitchen Gardens Established</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={kitchenGardenData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Bar dataKey="gardens" fill="#10b981" radius={[6, 6, 0, 0]} name="Kitchen Gardens" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <p className="text-sm text-emerald-800"><strong>200</strong> gardens in 2022 → <strong>1,328</strong> in 2025. Growth of <strong>564%</strong>.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Avg Household Savings (Home Production)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={householdSavingsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: any) => `₹${v}`} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Savings/Family']} />
                                <Bar dataKey="savings" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Savings (Rs)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <p className="text-sm text-amber-800">Direct savings of <strong>₹14,050</strong> per family in 2024 by replacing market purchases.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}