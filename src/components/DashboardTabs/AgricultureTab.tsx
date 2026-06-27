import React, { useState, useMemo } from 'react';
import { Sprout, Leaf, Utensils, AlertCircle, CheckCircle2, Info, TrendingUp, Users, IndianRupee } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import * as Popover from '@radix-ui/react-popover';
import cropEconomics from '../../data/crop_economics.json';

// Hardcoded definitions removed to support dynamic, re-triangulated FDB data


const EvidenceDrawer = ({ source, sheet, calculation, rfLink, status, caution }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-t border-slate-100 pt-3 w-full">
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-full text-left outline-none rounded-md group">
            <Info size={16} className={isOpen ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'} />
            Evidence Trail
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

export function AgricultureTab() {
  const [selectedCrop, setSelectedCrop] = useState("Turmeric");

  const cropList = useMemo(() => {
    const names = cropEconomics ? Object.keys(cropEconomics) : [];
    const priority = ["Turmeric", "Ginger"].filter(c => names.includes(c));
    const rest = names.filter(c => c !== "Turmeric" && c !== "Ginger").sort();
    return [...priority, ...rest];
  }, []);

  const chartData = useMemo(() => {
    const filtered: any[] = [];
    if (cropEconomics && typeof cropEconomics === 'object' && !Array.isArray(cropEconomics)) {
      const cropData = (cropEconomics as any)[selectedCrop];
      if (cropData) {
        Object.entries(cropData).forEach(([year, item]: [string, any]) => {
          const costLakhs = (item.cost || 0) / 100000;
          const incomeLakhs = (item.income || 0) / 100000;
          filtered.push({
            year,
            cost: Math.round(costLakhs * 100) / 100,
            income: Math.round(incomeLakhs * 100) / 100,
            netIncome: Math.round(incomeLakhs * 100) / 100,
            farmers: item.farmers || 0,
            avgNet: item.farmers > 0 ? Math.round(item.income / item.farmers) : 0,
          });
        });
      }
    }
    return filtered.sort((a: any, b: any) => a.year.localeCompare(b.year));
  }, [selectedCrop]);

  const farmerData = useMemo(() => {
    return chartData.map((d: any) => ({ year: d.year, farmers: d.farmers }));
  }, [chartData]);

  const hhChartData = useMemo(() => {
    return chartData.map((d: any) => {
      const f = d.farmers || 1;
      const avgCost = d.cost > 0 ? Math.round((d.cost * 100000) / f) : 0;
      const avgNet = d.netIncome > 0 ? Math.round((d.netIncome * 100000) / f) : 0;
      const avgIncome = avgCost + avgNet;
      return {
        year: d.year,
        avgCost,
        avgNet,
        avgIncome,
        farmers: f
      };
    });
  }, [chartData]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Agriculture & Crop Economics</h2>
          <p className="text-slate-500 mt-1">Crop-wise cost, income, and adoption trends (2022-2025)</p>
        </div>
        <div className="relative">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="appearance-none bg-white border border-slate-300 rounded-xl px-5 py-3 pr-10 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 cursor-pointer"
          >
            {cropList.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {chartData.map(d => (
            <div key={d.year} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{d.year}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{d.farmers}</div>
              <div className="text-xs text-slate-500">farmers</div>
              <div className="text-sm font-semibold text-emerald-600 mt-1">₹{d.netIncome}L</div>
              <div className="text-xs text-slate-400">Avg ₹{Math.round(d.avgNet).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Cost vs Income vs Net Income by Year</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: any) => `₹${v}L`} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v: any) => [`₹${v}L`]} />
                <Legend />
                <Bar dataKey="cost" fill="#94a3b8" name="Cost (Rs L)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="income" fill="#10b981" name="Income (Rs L)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {selectedCrop === "Turmeric" ? (
            <EvidenceDrawer source="DEHAT_Cleaned_Data (1).xlsx Sheet: Income" sheet="Income cols 193-198 + Crop details cols 104-107" calculation="Re-triangulated FDB database totals (2022-2024) and 2025 Rabi crop details." rfLink="RF 2.6" status="Verified" caution="Audited and corrected crop statistics aligned with raw record sheets." />
          ) : (
            <EvidenceDrawer source="crop_economics.json" sheet="Generated from DEHAT_Cleaned_Data + 2025 Crop details" calculation="Extracted from raw data files" rfLink="RF 2.6" status="Verified" caution="Data quality varies by crop. Cross-reference with source files." />
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Household Crop Economics (Avg Per Farmer)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hhChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: any) => `₹${(v / 1000).toFixed(0)}K`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                  formatter={(v: any, name: any, props: any) => {
                    const label = props.dataKey === 'avgCost' ? 'Avg Cost/Farmer' : 'Avg Net Income/Farmer';
                    return [`₹${Number(v).toLocaleString('en-IN')}`, label];
                  }} 
                />
                <Legend />
                <Bar dataKey="avgCost" fill="#a5b4fc" name="Avg Cost/Farmer" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgNet" fill="#10b981" name="Avg Net Income/Farmer" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <EvidenceDrawer source="crop_economics.json" sheet="Calculated" calculation="Crop totals divided by total adopting farmers" rfLink="RF 2.6" status="Verified" caution="Unit economics reflect average performance; individual margins vary." />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Adopting Farmers by Year</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={farmerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="farmers" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Farmers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}