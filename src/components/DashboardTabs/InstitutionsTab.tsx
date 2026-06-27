import React, { useState } from 'react';
import { Users, Building2, UserCheck, Search, AlertCircle, CheckCircle2, Info, GraduationCap } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import * as Popover from '@radix-ui/react-popover';

import trainingData from '../../data/training.json';

const INTENSITY_DATA = trainingData.intensity;
const TRAINING_DATA = trainingData.trainings;

const EvidenceDrawer = ({ source, sheet, calculation, rfLink, status, caution }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-t border-slate-100 pt-3 w-full">
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-full text-left outline-none rounded-md group">
            <Info size={16} className={isOpen ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'} /> Evidence Trail
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

export function InstitutionsTab() {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');

  const filtered = TRAINING_DATA.filter(t => {
    const matchesSearch = t.type.toLowerCase().includes(search.toLowerCase());
    const matchesYear = selectedYear === 'All' || t.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Institutions & Capacity Building</h2>
        <p className="text-slate-500 mt-1">AAS collectives, Krishi Mitras, and training summaries</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active AAS Groups', value: '74', sub: 'Consolidated from 80 groups', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'GP Federations', value: '4', sub: 'GP-level collectives', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Block Federation', value: '1', sub: 'Block Level Federation (BLF)', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Krishi Mitras', value: '48', sub: 'Krishi Mitras Trained', icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[128px]">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{kpi.label}</div>
                <div className="text-xl font-extrabold text-slate-900 mt-2 leading-none">{kpi.value}</div>
              </div>
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color} shrink-0`}>
                <kpi.icon size={18} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 mt-2">
              <span className={`w-1.5 h-1.5 rounded-full ${kpi.color.replace('text-', 'bg-')}`}></span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Capacity Intensity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Capacity Intensity (Avg Sessions/Household)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INTENSITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: any) => `${v}`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v: any) => [`${v} sessions`, 'Avg/Household']} />
                <Line type="monotone" dataKey="sessionsPerHousehold" stroke="#0d9488" strokeWidth={3} dot={{ r: 5, fill: '#0d9488' }} name="Avg Sessions/Family" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <EvidenceDrawer source="Training MIS database" sheet="Consolidated Training Logs" calculation="Total annual training participations divided by 1329 participating families" rfLink="RF 3.1" status="Verified" caution="Reflects the frequency of structured sessions; includes Krishi Mitra mentorship visits." />
          </div>
        </div>

        {/* Card 2: Training History */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-slate-800">Training History</h3>
            <div className="flex items-center gap-3">
              {/* Year Filter */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="All">All Years</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>

              {/* Search Filter */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter by type..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-40 sm:w-48"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs">
                  <th className="text-left py-3 pr-8 font-semibold w-24">Year</th>
                  <th className="text-left py-3 font-semibold">Training Type</th>
                  <th className="text-right py-3 font-semibold">Participants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-8 font-mono text-xs text-slate-500">{t.year}</td>
                    <td className="py-2.5 font-medium text-slate-800">{t.type}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-700">{t.participants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-slate-400">{filtered.length} records found</div>
          <div className="mt-4">
            <EvidenceDrawer source="FASAL MIS Consolidated / Training Logs" sheet="Training Summaries 2022-2025" calculation="Sum of participants per training type per year" rfLink="RF 3.1" status="Verified" caution="Training counts from MIS; do not conflate with practice adoption." />
          </div>
        </div>
      </div>
    </div>
  );
}