const fs = require('fs');

function addImport(content) {
    const idx = content.indexOf("from 'lucide-react'");
    if (idx === -1) return content;
    const openBrace = content.lastIndexOf('{', idx);
    if (openBrace === -1) return content;
    if (content.includes('Sparkles,') || content.includes('Sparkles }')) return content;
    return content.substring(0, openBrace + 1) + ' Sparkles,' + content.substring(openBrace + 1);
}

// AgricultureTab
let ag = fs.readFileSync('src/components/DashboardTabs/AgricultureTab.tsx', 'utf8');
ag = addImport(ag);
// Find the last closing paren + newline } pattern
ag = ag.replace(/  \);\r?\n\}\r?\n?$/, findings.ag + '\n  );\n}\n');
fs.writeFileSync('src/components/DashboardTabs/AgricultureTab.tsx', ag);
console.log('AgricultureTab: Sparkles added:', ag.includes('Sparkles,'));

// RightsTab
let rt = fs.readFileSync('src/components/DashboardTabs/RightsTab.tsx', 'utf8');
rt = addImport(rt);
rt = rt.replace(/    \);\r?\n\}\r?\n?$/, findings.rights + '\n    );\n}\n');
fs.writeFileSync('src/components/DashboardTabs/RightsTab.tsx', rt);
console.log('RightsTab: Sparkles added:', rt.includes('Sparkles,'));

// InstitutionsTab
let inst = fs.readFileSync('src/components/DashboardTabs/InstitutionsTab.tsx', 'utf8');
inst = addImport(inst);
inst = inst.replace(/    \);\r?\n\}\r?\n?$/, findings.inst + '\n    );\n}\n');
fs.writeFileSync('src/components/DashboardTabs/InstitutionsTab.tsx', inst);
console.log('InstitutionsTab: Sparkles added:', inst.includes('Sparkles,'));

console.log('All tabs updated');

// Findings HTML blocks
const findings = `
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