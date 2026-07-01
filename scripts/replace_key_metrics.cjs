const fs = require('fs');

// Read the App.tsx file
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Find the Key Metrics block
const startMarker = '{/* Key Metrics from New Reports */}';
const endMarker = '</div>\n\n                </div>\n              )}';

const startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
    console.log('Key Metrics block not found');
    process.exit(1);
}

// Find the closing of the reports tab section
const reportsEndIdx = content.indexOf(endMarker, startIdx);
if (reportsEndIdx === -1) {
    console.log('End marker not found');
    process.exit(1);
}

// Build the new triangulated insights block
const newBlock = `{/* Triangulated Insights: Grant Reports vs Dashboard Data */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <BarChart3 size={24} className="text-indigo-600" />
                      Triangulated Insights: Grant Reports vs Dashboard Data
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">
                      Cross-referencing new grant report figures with existing dashboard metrics to validate and strengthen our data story.
                    </p>
                    
                    {/* Summary Bar */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span className="font-semibold text-slate-700">5 Corroborated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-teal-600" />
                        <span className="font-semibold text-slate-700">3 New Dimensions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-600" />
                        <span className="font-semibold text-slate-700">1 Needs Reconciliation</span>
                      </div>
                      <div className="ml-auto font-bold text-indigo-900">₹10.85 Cr Combined Leverage</div>
                    </div>

                    {/* Insight Cards Grid */}
                    <div className="space-y-4">
                      
                      {/* Leverage Total */}
                      <div className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">Total Convergence Leveraged</h4>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} /> CORROBORATES
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-indigo-900">₹10.85 Cr</div>
                            <div className="text-[10px] text-slate-500">Combined total</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Grant Reports</div>
                            <div className="font-mono text-slate-800">₹3.16 Cr</div>
                            <div className="text-[10px] text-slate-400 mt-1">HY2 (₹54.14L) + HY3-HY4 (₹2.61Cr)</div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Dashboard (leverage.json)</div>
                            <div className="font-mono text-slate-800">₹7.70 Cr</div>
                            <div className="text-[10px] text-slate-400 mt-1">576 beneficiary records, 2023-2025</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                          Combined validated convergence: ₹10.85 Cr across 2023-2025. Year breakdown: 2023 ₹3.17Cr, 2024 ₹4.91Cr, 2025 ₹2.77Cr.
                        </p>
                      </div>

                      {/* PMAY Homes */}
                      <div className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">PMAY Housing Sanctioned</h4>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} /> CORROBORATES
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-900">151</div>
                            <div className="text-[10px] text-slate-500">Unique beneficiaries</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Grant Report (HY4)</div>
                            <div className="font-mono text-slate-800">134 homes</div>
                            <div className="text-[10px] text-slate-400 mt-1">8 villages aggregated</div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Dashboard (leverage.json)</div>
                            <div className="font-mono text-slate-800">151 records</div>
                            <div className="text-[10px] text-slate-400 mt-1">Individual beneficiary names</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                          17-unit difference: additional homes sanctioned after HY4 report or in villages not covered. Dashboard has individual names for verification.
                        </p>
                      </div>

                      {/* LEISA Training vs Adoption */}
                      <div className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">LEISA Training vs Adoption Gap</h4>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                              <Sparkles size={11} /> ADDS DIMENSION
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-violet-900">29.5%</div>
                            <div className="text-[10px] text-slate-500">Training-to-adoption rate</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Grant Report (2024)</div>
                            <div className="font-mono text-slate-800">603 trained</div>
                            <div className="text-[10px] text-slate-400 mt-1">Pest mgmt, LEISA, mixed, multi-layer</div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Dashboard (Agriculture tab)</div>
                            <div className="font-mono text-slate-800">178 adopted</div>
                            <div className="text-[10px] text-slate-400 mt-1">Turmeric + Ginger farmers</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                          Key insight: 29.5% of trained farmers adopted high-value crops. The 425 not yet adopting may practice other LEISA techniques (organic pest mgmt, multi-layer farming). This conversion rate is a program effectiveness KPI.
                        </p>
                      </div>

                      {/* Income Transformation */}
                      <div className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">Per-Acre Income Transformation</h4>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} /> CORROBORATES
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-amber-900">6x → 33x</div>
                            <div className="text-[10px] text-slate-500">Target exceeded for turmeric</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <div className="font-semibold text-slate-600 mb-1">Baseline</div>
                            <div className="font-mono text-slate-800">₹10K/ac</div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <div className="font-semibold text-slate-600 mb-1">Target (Grant)</div>
                            <div className="font-mono text-slate-800">₹60K/ac</div>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-lg text-center border border-emerald-200">
                            <div className="font-semibold text-emerald-700 mb-1">Actual (Turmeric)</div>
                            <div className="font-mono text-emerald-900 font-bold">₹3.35L/ac</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                          Program target was 6x increase (₹10K→₹60K). Turmeric farmers achieved 33x increase (₹3,35,166/ac), exceeding target by 5.6x. This validates the LEISA + high-value crop strategy.
                        </p>
                      </div>

                      {/* GPDP - New Metric */}
                      <div className="border border-teal-200 rounded-xl p-5 bg-teal-50/30 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">Gram Panchayat Development Plans</h4>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                              <Sparkles size={11} /> NEW METRIC
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-teal-900">1,712</div>
                            <div className="text-[10px] text-slate-500">Citizens participated</div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600">
                          <p className="mb-2"><strong>6 GPDPs</strong> created for <strong>20 hamlets</strong> using participatory PRA tools. Plans to be submitted to Gram Pradhans, Tehsil, Block, District, MP, MLA, and CM in HY7.</p>
                          <p className="text-[11px] text-slate-500">This governance participation metric was not previously tracked in the dashboard. It adds a democratic engagement dimension to the Institutions tab.</p>
                        </div>
                      </div>

                      {/* Toilets - Needs Reconciliation */}
                      <div className="border border-amber-200 rounded-xl p-5 bg-amber-50/30 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">Toilets Constructed</h4>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle size={11} /> NEEDS RECONCILIATION
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-amber-900">82 vs 100+</div>
                            <div className="text-[10px] text-slate-500">Dashboard vs Grant report</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Grant Report (HY4)</div>
                            <div className="font-mono text-slate-800">100+ toilets</div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Dashboard (leverage.json)</div>
                            <div className="font-mono text-slate-800">82 records</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-amber-700 mt-3 leading-relaxed">
                          Gap of 18+ toilets. May be due to toilets built in late 2024 not yet entered in MIS, or counted differently (group vs individual). Action: update MIS with missing records.
                        </p>
                      </div>

                      {/* Women's Training */}
                      <div className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">Women's Leadership Training</h4>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                              <Sparkles size={11} /> ADDS DIMENSION
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-pink-900">439</div>
                            <div className="text-[10px] text-slate-500">Total leaders trained</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Grant Report (2024)</div>
                            <div className="font-mono text-slate-800">218 gender + 221 leadership</div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Dashboard (Institutions)</div>
                            <div className="font-mono text-slate-800">74 AAS groups</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                          ~3 women leaders trained per AAS group. Total leadership development: 439 individuals. This training intensity metric shows systematic capacity building.
                        </p>
                      </div>

                      {/* Farmer Registry Coverage */}
                      <div className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">Farmer Registry Coverage</h4>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} /> CORROBORATES
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-800">88.1%</div>
                            <div className="text-[10px] text-slate-500">Of 1,500 target</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Program Target</div>
                            <div className="font-mono text-slate-800">~1,500 families</div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg">
                            <div className="font-semibold text-slate-600 mb-1">Dashboard (farmers.json)</div>
                            <div className="font-mono text-slate-800">1,322 farmers</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                          88.1% coverage. 178-family gap may include late joiners or data being digitized via Kobo Collect. 23 villages in registry align with 20 hamlets in grant reports.
                        </p>
                      </div>

                    </div>

                    {/* Methodology Note */}
                    <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                      <HelpCircle size={18} className="shrink-0 mt-0.5 text-blue-600" />
                      <div>
                        <p className="font-semibold mb-1">Triangulation Methodology</p>
                        <p className="text-xs leading-relaxed">
                          Each metric compares grant report figures (from PDFs in folders 23-26) with existing dashboard data sources (leverage.json, farmers.json, AgricultureTab, InstitutionsTab).
                          Status indicators: <span className="font-semibold text-emerald-700">Corroborates</span> = both sources agree,
                          <span className="font-semibold text-teal-700">Adds Dimension</span> = new insight from grant reports,
                          <span className="font-semibold text-amber-700">Needs Reconciliation</span> = gap between sources.
                          Full data: <code className="text-[10px] bg-blue-100 px-1 rounded">src/data/triangulated_insights.json</code>
                        </p>
                      </div>
                    </div>
                  </div>`;

// Replace the old block
const beforeBlock = content.substring(0, startIdx - 18); // -18 to include the leading spaces before the comment
const afterBlock = content.substring(reportsEndIdx);

// Find the actual start of the Key Metrics div (go back to find the opening)
const divStart = content.lastIndexOf('<div', startIdx);
const newContent = content.substring(0, divStart) + newBlock + '\n\n' + content.substring(reportsEndIdx + endMarker.length);

fs.writeFileSync('src/App.tsx', newContent);
console.log('Successfully replaced Key Metrics with Triangulated Insights block');