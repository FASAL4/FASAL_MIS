const fs = require('fs');

function addImport(content, icon) {
  // Add icon to the lucide-react import line
  const importLine = "from 'lucide-react'";
  const idx = content.indexOf(importLine);
  if (idx === -1) return content;
  // Find the opening { of the import
  const openBrace = content.lastIndexOf('{', idx);
  if (openBrace === -1) return content;
  const beforeImport = content.substring(0, openBrace + 1);
  const afterImport = content.substring(openBrace + 1);
  // Check if icon already imported
  if (content.includes(icon + ',')) return content;
  if (content.includes(icon + ' }')) return content;
  return beforeImport + ' ' + icon + ',' + afterImport;
}

// ===== Add to AgricultureTab.tsx =====
let agContent = fs.readFileSync('src/components/DashboardTabs/AgricultureTab.tsx', 'utf8');
agContent = addImport(agContent, 'Sparkles');

const agEndIdx = agContent.lastIndexOf('</div>');
const agExportIdx = agContent.indexOf('export default AgricultureTab;');
if (agEndIdx === -1 || agExportIdx === -1) {
  console.log('Could not find AgricultureTab closing');
  process.exit(1);
}

const agFindings = `
                  {/* New Findings: Grant Report Triangulation - Agriculture Economy */}
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

const agInsertIdx = agContent.lastIndexOf('</div>', agEndIdx - 1);
agContent = agContent.substring(0, agInsertIdx) + agFindings + '\n' + agContent.substring(agInsertIdx);
fs.writeFileSync('src/components/DashboardTabs/AgricultureTab.tsx', agContent);
console.log('Added new findings to AgricultureTab');

// ===== Add to RightsTab.tsx =====
let rtContent = fs.readFileSync('src/components/DashboardTabs/RightsTab.tsx', 'utf8');
rtContent = addImport(rtContent, 'Sparkles');

const rtEndIdx = rtContent.lastIndexOf('</div>');
const rtExportIdx = rtContent.indexOf('export default RightsTab;');
if (rtEndIdx === -1 || rtExportIdx === -1) {
  console.log('Could not find RightsTab closing');
  process.exit(1);
}

const rtFindings = `
                  {/* New Findings: Grant Report Triangulation - Rights & Entitlements */}
                  <div className="mt-6 p-5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-blue-600" />
                      <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">New Findings: Entitlement Convergence Deep-Dive</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                        <div className="font-bold text-blue-800">151</div>
                        <div className="text-slate-600">PMAY homes sanctioned (Dashboard records)</div>
                        <div className="text-[10px] text-slate-400 mt-1">Grant report: 134 homes. Gap: 17 homes not yet in MIS</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                        <div className="font-bold text-blue-800">82</div>
                        <div className="text-slate-600">Toilets tracked (Dashboard records)</div>
                        <div className="text-[10px] text-amber-600 mt-1 font-semibold">Report says 100+ - 18 need MIS entry</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                        <div className="font-bold text-blue-800">304</div>
                        <div className="text-slate-600">Individual entitlements accessed (Grant Report)</div>
                        <div className="text-[10px] text-slate-400 mt-1">MNREGA, widow pension, KCC, Ayushman cards</div>
                      </div>
                    </div>
                  </div>
`;

const rtInsertIdx = rtContent.lastIndexOf('</div>', rtEndIdx - 1);
rtContent = rtContent.substring(0, rtInsertIdx) + rtFindings + '\n' + rtContent.substring(rtInsertIdx);
fs.writeFileSync('src/components/DashboardTabs/RightsTab.tsx', rtContent);
console.log('Added new findings to RightsTab');

// ===== Add to InstitutionsTab.tsx =====
let instContent = fs.readFileSync('src/components/DashboardTabs/InstitutionsTab.tsx', 'utf8');
instContent = addImport(instContent, 'Sparkles');

const instEndIdx = instContent.lastIndexOf('</div>');
const instExportIdx = instContent.indexOf('export default InstitutionsTab;');
if (instEndIdx === -1 || instExportIdx === -1) {
  console.log('Could not find InstitutionsTab closing');
  process.exit(1);
}

const instFindings = `
                  {/* New Findings: Grant Report Triangulation - Institutions */}
                  <div className="mt-6 p-5 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-purple-600" />
                      <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider">New Findings: Community Governance & Leadership</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
                        <div className="font-bold text-purple-800">6 GPDPs</div>
                        <div className="text-slate-600">Village Development Plans created</div>
                        <div className="text-[10px] text-slate-400 mt-1">20 hamlets, 1,712 citizens participated via PRA tools</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
                        <div className="font-bold text-purple-800">439</div>
                        <div className="text-slate-600">Women leaders trained (Grant Report)</div>
                        <div className="text-[10px] text-slate-400 mt-1">218 gender + 221 leadership = ~3 leaders per AAS group</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
                        <div className="font-bold text-purple-800">88.1%</div>
                        <div className="text-slate-600">Farmer registry coverage</div>
                        <div className="text-[10px] text-slate-400 mt-1">1,322 of 1,500 target families registered in MIS</div>
                      </div>
                    </div>
                  </div>
`;

const instInsertIdx = instContent.lastIndexOf('</div>', instEndIdx - 1);
instContent = instContent.substring(0, instInsertIdx) + instFindings + '\n' + instContent.substring(instInsertIdx);
fs.writeFileSync('src/components/DashboardTabs/InstitutionsTab.tsx', instContent);
console.log('Added new findings to InstitutionsTab');

console.log('All tabs updated successfully');