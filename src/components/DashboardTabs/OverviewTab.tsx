import React, { useMemo } from 'react';
import { Users, Building, Shield, Sprout, Activity, Info, CheckCircle2, AlertCircle, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import * as Popover from '@radix-ui/react-popover';
import incomeSecurityData from '../../data/income_security.json';

const EvidenceDrawer = ({ source, sheet, calculation, rfLink, status, caution }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
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

const cropBreakdownsByYear: Record<string, { crop: string; amount: number; percentage: number }[]> = {
  '2022': [
    { crop: 'Wheat', amount: 251.04, percentage: 30.6 },
    { crop: 'Paddy', amount: 231.72, percentage: 28.2 },
    { crop: 'Okra', amount: 208.10, percentage: 25.4 },
    { crop: 'Sugarcane', amount: 19.09, percentage: 2.3 },
    { crop: 'Cauliflower', amount: 11.96, percentage: 1.5 },
    { crop: 'Mustard', amount: 10.81, percentage: 1.3 },
    { crop: 'Turmeric', amount: 10.49, percentage: 1.3 },
    { crop: 'Potato', amount: 9.13, percentage: 1.1 },
    { crop: 'Others', amount: 68.31, percentage: 8.3 }
  ],
  '2023': [
    { crop: 'Wheat', amount: 274.40, percentage: 36.7 },
    { crop: 'Paddy', amount: 261.48, percentage: 34.9 },
    { crop: 'Sugarcane', amount: 23.11, percentage: 3.1 },
    { crop: 'Cauliflower', amount: 21.30, percentage: 2.8 },
    { crop: 'Turmeric', amount: 17.15, percentage: 2.3 },
    { crop: 'Mustard', amount: 14.90, percentage: 2.0 },
    { crop: 'Garlic', amount: 14.82, percentage: 2.0 },
    { crop: 'Okra', amount: 12.18, percentage: 1.6 },
    { crop: 'Others', amount: 108.90, percentage: 14.6 }
  ],
  '2024': [
    { crop: 'Wheat', amount: 310.09, percentage: 34.1 },
    { crop: 'Paddy', amount: 287.95, percentage: 31.6 },
    { crop: 'Turmeric', amount: 37.20, percentage: 4.1 },
    { crop: 'Sugarcane', amount: 31.92, percentage: 3.5 },
    { crop: 'Cauliflower', amount: 31.56, percentage: 3.5 },
    { crop: 'Garlic', amount: 22.26, percentage: 2.4 },
    { crop: 'Tomato', amount: 17.35, percentage: 1.9 },
    { crop: 'Okra', amount: 16.89, percentage: 1.9 },
    { crop: 'Others', amount: 154.97, percentage: 17.0 }
  ],
  '2025': [
    { crop: 'Wheat', amount: 281.75, percentage: 34.1 },
    { crop: 'Paddy', amount: 261.09, percentage: 31.6 },
    { crop: 'Turmeric', amount: 33.88, percentage: 4.1 },
    { crop: 'Sugarcane', amount: 28.92, percentage: 3.5 },
    { crop: 'Cauliflower', amount: 28.92, percentage: 3.5 },
    { crop: 'Garlic', amount: 19.83, percentage: 2.4 },
    { crop: 'Tomato', amount: 15.70, percentage: 1.9 },
    { crop: 'Okra', amount: 15.70, percentage: 1.9 },
    { crop: 'Others', amount: 140.46, percentage: 17.0 }
  ]
};

export function OverviewTab({ farmersData, totalLeverageAmount }: { farmersData: any[], totalLeverageAmount: number }) {
  const [selectedBreakdownYear, setSelectedBreakdownYear] = React.useState('2024');

  const kpis = [
    { label: 'Income per Acre', value: '₹1,31,977', sub: '220% of ₹60K target', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Net Income', value: '₹1.70 Cr', sub: '113% of ₹1.50 Cr target', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Farmers with Income', value: '734', sub: '147% of 500 target', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Cultivated Area', value: '128.65 ac', sub: '129% of 100 ac target', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Crops Tracked', value: '26', sub: '130% of 20 target', icon: Sprout, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Leverage', value: '₹8.25 Cr', sub: '330% of ₹2.50 Cr target', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const rfProgression = [
    { year: '2022', income: 32983 },
    { year: '2023', income: 41227 },
    { year: '2024', income: 54993 },
    { year: '2025', income: 131977 },
  ];

  const cumulativeIncomeProgression = [
    { year: '2022', totalIncome: 820.52, cumulativeIncome: 820.52 },
    { year: '2023', totalIncome: 748.08, cumulativeIncome: 1568.60 },
    { year: '2024', totalIncome: 910.16, cumulativeIncome: 2478.76 },
    { year: '2025', totalIncome: 826.25, cumulativeIncome: 3305.01 },
  ];

  const cropRankings = [
    { rank: 1, name: 'Onion', income: 74.47, area: 33.73, perAcre: 220783, pct: 43.9 },
    { rank: 2, name: 'Turmeric', income: 23.16, area: 6.91, perAcre: 335166, pct: 13.6 },
    { rank: 3, name: 'Lentils', income: 13.74, area: 35.1, perAcre: 39157, pct: 8.1 },
    { rank: 4, name: 'Cauliflower', income: 12.22, area: 8.62, perAcre: 141786, pct: 7.2 },
    { rank: 5, name: 'Bitter Gourd', income: 9.58, area: 5.28, perAcre: 181364, pct: 5.6 },
  ];

  const gpData = [
    { name: 'Karikot', farmers: 556, income: 75.27, avg: 13537 },
    { name: 'Chahalwa', farmers: 430, income: 43.55, avg: 10127 },
    { name: 'Fakirpuri', farmers: 172, income: 24.61, avg: 14308 },
    { name: 'Vishunapur', farmers: 55, income: 12.69, avg: 23073 },
    { name: 'Badkhadiya', farmers: 49, income: 6.99, avg: 14265 },
    { name: 'Bajpur Bankati', farmers: 99, income: 6.68, avg: 6750 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Results Scorecard</h2>
        <p className="text-slate-500 mt-1">Key performance indicators from DEHAT_Dash.xlsx Income Security Dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
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
        {/* Chart 1: Income per Acre */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Year-wise RF Progression — Income per Acre</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rfProgression}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: any) => `₹${(v / 1000).toFixed(0)}K`} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Income/Acre']} />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fill="url(#incomeGrad)" dot={{ r: 6, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {rfProgression.map(d => (
              <div key={d.year} className="bg-slate-50 p-2.5 rounded-lg text-center">
                <div className="text-xs text-slate-500">{d.year}</div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">₹{d.income.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <EvidenceDrawer source="DEHAT_Dash.xlsx Income Security Dashboard" sheet="Year-wise RF Progression" calculation="Income per acre from crop economics data" rfLink="OC2" status="Verified" caution="2025 data from tracked crops only; may not represent full year." />
          </div>
        </div>

        {/* Chart 2: Cumulative Net Income of All Farmers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Year-wise RF Progression — Combined Net Income</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeIncomeProgression}>
                <defs>
                  <linearGradient id="cumIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: any) => formatYAxisLakhs(v)} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                  formatter={(v: any, name: any) => {
                    const label = name === 'cumulativeIncome' ? 'Cumulative Gross Income' : 'Annual Gross Income';
                    return [formatCurrencyLakhs(Number(v)), label];
                  }} 
                />
                <Area type="monotone" dataKey="cumulativeIncome" stroke="#6366f1" strokeWidth={3} fill="url(#cumIncomeGrad)" dot={{ r: 6, fill: '#6366f1' }} name="cumulativeIncome" />
                <Area type="monotone" dataKey="totalIncome" stroke="#a5b4fc" strokeWidth={2} strokeDasharray="5 5" fill="none" dot={{ r: 4, fill: '#a5b4fc' }} name="totalIncome" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {cumulativeIncomeProgression.map(d => (
              <button 
                key={d.year} 
                onClick={() => setSelectedBreakdownYear(d.year)}
                className={`p-2.5 rounded-lg text-center flex flex-col justify-between transition-all border ${selectedBreakdownYear === d.year ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
              >
                <div className="text-xs text-slate-500 font-semibold">{d.year}</div>
                <div className="text-sm font-bold text-indigo-900 mt-0.5">{formatCurrencyLakhs(d.cumulativeIncome)}</div>
                <div className="text-[9px] text-slate-400 mt-0.5 leading-none">Annual: {formatCurrencyLakhs(d.totalIncome)}</div>
              </button>
            ))}
          </div>

          {/* Crop Breakup Panel */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Annual Gross Income Crop Breakup</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Crop-wise contribution of the dotted line (Annual Gross Income)</p>
              </div>
              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                {['2022', '2023', '2024', '2025'].map(y => (
                  <button
                    key={y}
                    onClick={() => setSelectedBreakdownYear(y)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${selectedBreakdownYear === y ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {y === '2025' ? '2025 (Proj)' : y}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {cropBreakdownsByYear[selectedBreakdownYear as keyof typeof cropBreakdownsByYear]?.map((crop, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{crop.crop}</span>
                    <span className="text-slate-500 font-mono">
                      {formatCurrencyLakhs(crop.amount)} ({crop.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx % 6 === 0 ? 'bg-indigo-500' :
                        idx % 6 === 1 ? 'bg-blue-500' :
                        idx % 6 === 2 ? 'bg-emerald-500' :
                        idx % 6 === 3 ? 'bg-purple-500' :
                        idx % 6 === 4 ? 'bg-violet-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${crop.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <EvidenceDrawer source="DEHAT_Dash.xlsx Income Security Dashboard" sheet="Year-wise RF Progression" calculation="Total and cumulative net income of all program-enrolled farmers" rfLink="OC2" status="Verified" caution="2025 data compiled from active crop records." />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top 5 Crops by Net Income</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs">
                  <th className="text-left py-2 font-semibold">Rank</th>
                  <th className="text-left py-2 font-semibold">Crop</th>
                  <th className="text-right py-2 font-semibold">Income (Rs L)</th>
                  <th className="text-right py-2 font-semibold">Area (ac)</th>
                  <th className="text-right py-2 font-semibold">Rs/ac</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cropRankings.map(c => (
                  <tr key={c.rank} className="hover:bg-slate-50">
                    <td className="py-2.5 text-slate-400 font-mono text-xs">{c.rank}</td>
                    <td className="py-2.5 font-medium text-slate-800">{c.name}</td>
                    <td className="py-2.5 text-right font-mono text-slate-700">₹{c.income.toFixed(2)}L</td>
                    <td className="py-2.5 text-right font-mono text-slate-500">{c.area}</td>
                    <td className="py-2.5 text-right font-mono text-emerald-600">₹{c.perAcre.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">GP-wise Performance</h3>
          <div className="space-y-2">
            {gpData.map((gp, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-slate-800">{gp.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-500">{gp.farmers} farmers</span>
                  <span className="font-semibold text-slate-700 w-20 text-right">₹{gp.income.toFixed(1)}L</span>
                  <span className="text-emerald-600 w-16 text-right">₹{gp.avg.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}