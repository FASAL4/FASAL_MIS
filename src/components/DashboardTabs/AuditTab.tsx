import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, Info, Shield, Database, FileSearch } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

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
              <div className="sm:col-span-2"><dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Detail</dt><dd className="bg-white border border-slate-200 p-3 rounded-lg">{calculation}</dd></div>
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

const SQL_QUERIES = [
  { name: 'Turmeric farmer count by year', query: `-- Count turmeric farmers from Sheet3 (DEHAT_Dash.xlsx)\nSELECT COUNT(*) as farmers,\n  SUM(CAST("unnamed_107" AS REAL)) as total_income\nFROM "dehat_dash_Sheet3"\nWHERE "unnamed_107" IS NOT NULL AND CAST("unnamed_107" AS REAL) > 0` },
  { name: 'Sheet2 turmeric income verification', query: `-- Verify turmeric income from farmer-wise cost/income\nSELECT COUNT(*) as farmers,\n  SUM(COALESCE(income_from_turmeric, 0)) as total_income,\n  AVG(CAST(income_from_turmeric AS REAL)) as avg_income\nFROM "dehat_dash_Sheet2"\nWHERE income_from_turmeric IS NOT NULL AND income_from_turmeric > 0` },
  { name: 'Identify duplicate farmers', query: `-- Check for duplicate farmer entries\nSELECT "name_of_farmer", COUNT(*) as entries\nFROM "dehat_dash_Sheet2"\nWHERE "name_of_farmer" IS NOT NULL\nGROUP BY "name_of_farmer"\nHAVING COUNT(*) > 1` },
  { name: 'Leverage totals by year', query: `-- Verify leverage amounts\nSELECT '2023' as year, SUM(CAST(unnamed_4 AS REAL)) as total FROM "levrage_january_to_december_2023_Sheet1" WHERE unnamed_4 IS NOT NULL\nUNION ALL\nSELECT '2024', SUM(CAST(unnamed_4 AS REAL)) FROM "t_00047338_levrage_january_2024_to_december_2024_Leveraged_2024"` },
];

const GAPS = [
  { issue: 'Seasonal Migration', impact: 'Households absent during surveys may undercount entitlement access and income', severity: 'Medium' },
  { issue: 'Jal Nigam Timelines', impact: 'Water/sanitation counted as "leveraged" may not yet be fully operational', severity: 'Medium' },
  { issue: 'Sheet2 2022-only Leakage', impact: 'Some entries labeled 2022-only contain multi-year data, causing double-counting risk', severity: 'High' },
  { issue: 'Multi-row Excel Headers', impact: 'Crop details uses merged cells; column names lost during normalization (all unnamed_*)', severity: 'High' },
  { issue: 'Inconsistent Farmer IDs', impact: 'IDs derived from phone numbers; ~340 missing causing pseudo-ID generation', severity: 'High' },
];

const CHECKLIST = [
  { item: 'Crop data reconciled across Sheet2 and Sheet3', done: true },
  { item: 'Turmeric farmers verified: 112 (Sheet3) / 129 (Sheet2)', done: true },
  { item: 'Old MIS figure of 137 farmers corrected', done: true },
  { item: 'Ginger + Turmeric combined reach: 178 farmers', done: true },
  { item: 'Leverage amounts cross-checked with raw files', done: true },
  { item: 'GP-wise income data validated', done: true },
  { item: 'Entitlement conversion rates verified (95.4%)', done: true },
  { item: 'Nutrition tricolour data from FDB fields', done: true },
  { item: 'Duplicate farmer entries need reconciliation', done: false },
  { item: 'Land data standardisation pending (Hindi/English mix)', done: false },
];

export function AuditTab() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const copyQuery = (query: string, idx: number) => {
    navigator.clipboard.writeText(query);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Evidence Audit & Data Gaps</h2>
        <p className="text-slate-500 mt-1">Transparent attribution of data quality, gaps, and verification status</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle size={20} className="text-amber-500" /> Known Data Gaps</h3>
        <div className="space-y-3">
          {GAPS.map((g, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className={`mt-0.5 p-1 rounded ${g.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}><AlertTriangle size={14} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-semibold text-slate-800 text-sm">{g.issue}</span><span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${g.severity === 'High' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{g.severity}</span></div>
                <p className="text-xs text-slate-600 mt-1">{g.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Database size={20} className="text-indigo-500" /> Audit SQL Queries</h3>
        <p className="text-sm text-slate-500 mb-4">Run these against master_context.db to verify data integrity</p>
        <div className="space-y-3">
          {SQL_QUERIES.map((q, i) => (
            <div key={i} className="bg-slate-900 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                <span className="text-xs font-medium text-slate-300">{q.name}</span>
                <button onClick={() => copyQuery(q.query, i)} className="text-xs px-3 py-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors">{copiedIdx === i ? 'Copied!' : 'Copy'}</button>
              </div>
              <pre className="p-4 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap">{q.query}</pre>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={20} className="text-emerald-500" /> Data Integrity Checklist</h3>
        <div className="space-y-2">
          {CHECKLIST.map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
              {c.done ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> : <AlertCircle size={18} className="text-slate-300 shrink-0" />}
              <span className={`text-sm ${c.done ? 'text-slate-700' : 'text-slate-400'}`}>{c.item}</span>
              <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded ${c.done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{c.done ? 'Verified' : 'Pending'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}