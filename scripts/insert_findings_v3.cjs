const fs = require('fs');

const agBlock = `
                  {/* Grant Report Triangulation: LEISA Training Pipeline */}
                  <div className="mt-6 p-5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-amber-600" />
                      <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">New Findings: LEISA Training Pipeline</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm">
                        <div className="font-bold text-amber-800">603</div>
                        <div className="text-slate-600">Farmers trained in LEISA (Grant Report 2024)</div>
                        <div className="text-[10px] text-slate-400 mt-1">Pest mgmt, mixed cropping, multi-layer, turmeric</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm">
                        <div className="font-bold text-amber-800">178</div>
                        <div className="text-slate-600">Farmers adopted turmeric + ginger (Dashboard)</div>
                        <div className="text-[10px] text-amber-600 mt-1 font-semibold">29.5% training-to-adoption conversion rate</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                        <div className="font-bold text-emerald-800">₹10K → ₹60K → ₹3.35L</div>
                        <div className="text-slate-600">Per-acre income: baseline → target → turmeric actual</div>
                        <div className="text-[10px] text-emerald-600 mt-1 font-semibold">6x target achieved; 33x for turmeric</div>
                      </div>
                    </div>
                  </div>
`;

const rightsBlock = `
                  {/* Grant Report Triangulation: Entitlement Convergence Deep-Dive */}
                  <div className="mt-6 p-5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-blue-600" />
                      <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">New Findings: Entitlement Convergence Deep-Dive</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                        <div className="font-bold text-blue-800">151</div>
                        <div className="text-slate-600">PMAY homes sanctioned (Dashboard records)</div>
                        <div className="text-[10px] text-slate-400 mt-1">Grant report: 134 homes. Gap: 17 not yet in MIS</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                        <div className="font-bold text-blue-800">82</div>
                        <div className="text-slate-600">Toilets tracked (Dashboard records)</div>
                        <div className="text-[10px] text-amber-600 mt-1 font-semibold">Report says 100+; 18 need MIS entry</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                        <div className="font-bold text-blue-800">304</div>
                        <div className="text-slate-600">Individual entitlements accessed (Grant Report)</div>
                        <div className="text-[10px] text-slate-400 mt-1">MNREGA, widow pension, KCC, Ayushman cards</div>
                      </div>
                    </div>
                  </div>
`;

const instBlock = `
                  {/* Grant Report Triangulation: Community Governance & Leadership */}
                  <div className="mt-6 p-5 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-purple-600" />
                      <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider">New Findings: Community Governance & Leadership</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
                        <div className="font-bold text-purple-800">6 GPDPs</div>
                        <div className="text-slate-600">Village Development Plans created</div>
                        <div className="text-[10px] text-slate-400 mt-1">20 hamlets, 1,712 citizens via PRA tools</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
                        <div className="font-bold text-purple-800">439</div>
                        <div className="text-slate-600">Women leaders trained (Grant Report)</div>
                        <div className="text-[10px] text-slate-400 mt-1">218 gender + 221 leadership = ~3 per AAS group</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
                        <div className="font-bold text-purple-800">88.1%</div>
                        <div className="text-slate-600">Farmer registry coverage</div>
                        <div className="text-[10px] text-slate-400 mt-1">1,322 of 1,500 target families in MIS</div>
                      </div>
                    </div>
                  </div>
`;

// AgricultureTab
let ag = fs.readFileSync('src/components/DashboardTabs/AgricultureTab.tsx', 'utf8');
ag = ag.replace("from 'lucide-react'", "{ Sparkles } from 'lucide-react'");
let agLines = ag.split('\n');
agLines.splice(agLines.length - 2, 0, agBlock);
fs.writeFileSync('src/components/DashboardTabs/AgricultureTab.tsx', agLines.join('\n'));
console.log('AgricultureTab done');

// RightsTab
let rt = fs.readFileSync('src/components/DashboardTabs/RightsTab.tsx', 'utf8');
rt = rt.replace("from 'lucide-react'", "{ Sparkles } from 'lucide-react'");
let rtLines = rt.split('\n');
rtLines.splice(rtLines.length - 2, 0, rightsBlock);
fs.writeFileSync('src/components/DashboardTabs/RightsTab.tsx', rtLines.join('\n'));
console.log('RightsTab done');

// InstitutionsTab
let inst = fs.readFileSync('src/components/DashboardTabs/InstitutionsTab.tsx', 'utf8');
inst = inst.replace("from 'lucide-react'", "{ Sparkles } from 'lucide-react'");
let instLines = inst.split('\n');
instLines.splice(instLines.length - 2, 0, instBlock);
fs.writeFileSync('src/components/DashboardTabs/InstitutionsTab.tsx', instLines.join('\n'));
console.log('InstitutionsTab done');

console.log('All tabs updated');