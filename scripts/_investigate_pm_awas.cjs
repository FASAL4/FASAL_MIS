// scripts/_investigate_pm_awas.cjs
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
function readj(f) { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return { error: e.message }; } }
console.log('=== PM AWAS INVESTIGATION ===\n');

// 1. LEVERAGE
console.log('--- LEVERAGE.JSON ---');
const l = readj('src/data/leverage.json');
const pm = l.filter(i => {
    const t = (i.type || '').trim().toLowerCase();
    const n = (i.name || '').trim().toLowerCase();
    return /awas|pmay|आवास|प्रधान/i.test(t) || /awas|pmay|आवास|प्रधान/i.test(n);
});
console.log('Total entries:', pm.length);
const byY = {}, byT = {}, byV = {};
let ta = 0;
for (const i of pm) {
    const y = i.year || '?';
    byY[y] = (byY[y] || 0) + 1;
    byT[(i.type || '').trim()] = (byT[(i.type || '').trim()] || 0) + 1;
    byV[i.village || '?'] = (byV[i.village || '?'] || 0) + 1;
    ta += parseFloat(String(i.amount).replace(/[^0-9.]/g, '') || 0);
}
console.log(JSON.stringify({ byYear: byY, byType: byT, totalRs: ta }, null, 2));

// 2. ENTITLEMENTS
console.log('\n--- ENTITLEMENTS.JSON ---');
const e = readj('src/data/entitlements.json');
const pmE = (e || []).filter(i => /awas|pmay|house|housing/i.test(i.name || ''));
console.log('PM matches:', pmE.length);
console.log('All names:', (e || []).map(i => i.name).join(', '));

// 3. YEARLY
console.log('\n--- YEARLY ENTITLEMENTS ---');
const y = readj('src/data/yearly_entitlements.json');
for (const k of Object.keys(y)) {
    const items = y[k] || [];
    const pmY = items.filter(i => /awas|pmay|house|housing/i.test(i.name || ''));
    console.log(k, 'PM Awas entries:', pmY.length);
}
const yk = Object.keys(y)[0];
if (y[yk]) console.log('Sample names:', y[yk].slice(0, 10).map(i => i.name).join(', '));

// 4. BASELINE NRM
console.log('\n--- BASELINE_NRM ---');
const nrm = readj('src/data/baseline_nrm.json');
if (nrm.allGPs) console.log('housingPct:', nrm.allGPs.housingSchemeBeneficiaries, '/', nrm.allGPs.housingSchemePct);
else console.log('All keys:', Object.keys(nrm).slice(0, 10).join(', '));

// 5. BASELINE SUMMARY housing
console.log('\n--- BASELINE SUMMARY housing ---');
const bs = readj('src/data/baseline_summary.json');
if (bs.aggregateMetrics) {
    const hk = Object.keys(bs.aggregateMetrics).filter(k => /house|awas|kutcha|pucca/i.test(k));
    console.log('Housing keys:', hk.length ? hk : 'NONE');
    for (const k of hk) console.log(k, bs.aggregateMetrics[k]);
}

// 6. GRANT REPORT
console.log('\n--- GRANT REPORT 2025 ---');
try {
    const g = fs.readFileSync(path.join(ROOT, 'Grant Report January to December 2025.md'), 'utf8');
    const lines = g.split('\n').filter(l => /134|pmay|awas|आवास|house|pmaay/i.test(l));
    console.log('Lines:', lines.length);
    lines.forEach((l, i) => console.log(i, l.substring(0, 150)));
} catch (e) { console.log('error:', e.message); }

// 7. GRANT APPLICATION
console.log('\n--- GRANT APPLICATION ---');
try {
    const ga = fs.readFileSync(path.join(ROOT, 'Grant Application APPI_DEHAT V2.0 31st Aug.md'), 'utf8');
    const lines = ga.split('\n').filter(l => /house|awas|pmay|आवास|कच्चा|पक्का|houseless/i.test(l));
    console.log('Lines:', lines.length);
    lines.forEach((l, i) => console.log(i, l.substring(0, 150)));
} catch (e) { console.log('error:', e.message); }

// 8. MIDLINE
console.log('\n--- MIDLINE ---');
try {
    const ml = fs.readFileSync(path.join(ROOT, 'Midline_FASAL_Jaykar (1).md'), 'utf8');
    const lines = ml.split('\n').filter(l => /house|awas|pmay|आवास|कच्चा|पक्का/i.test(l));
    console.log('Lines:', lines.length);
    lines.forEach((l, i) => console.log(i, l.substring(0, 150)));
} catch (e) { console.log('error:', e.message); }

// 9. EXTRACTED GRANT REPORTS
console.log('\n--- EXTRACTED GRANT REPORTS ---');
try {
    const egr = readj('src/data/extracted_grant_reports.json');
    if (egr && !egr.error) {
        const str = JSON.stringify(egr);
        const matches = str.match(/[1-9][0-9]*\s*PMAY|pmay|awas|आवास|house|[1-9][0-9]*\s*house|[1-9][0-9]*\s*housing|[1-9][0-9]*\s*pma/gi);
        console.log('Matches:', matches ? matches.slice(0, 20) : 'none');
    }
} catch (e) { console.log('error:', e.message); }

// 10. family_eligibility current PM Awas
console.log('\n--- FAMILY ELIGIBILITY PM Awas ---');
const fe = readj('src/data/family_eligibility.json');
if (fe.coverage) {
    const pmFE = (fe.schemeBreakdown || []).find(s => /Awas/i.test(s.name));
    console.log('PM Awas in schemeBreakdown:', JSON.stringify(pmFE));
}

// 11. HY4 REPORTS
console.log('\n--- HY4 FLUXX ---');
try {
    const h4 = fs.readFileSync(path.join(ROOT, 'HY4 Fluxx Part-I Report.md'), 'utf8');
    const lines = h4.split('\n').filter(l => /house|awas|pmay|आवास|कच्चा|पक्का|pucca|kutcha/i.test(l));
    console.log('Lines:', lines.length);
    lines.slice(0, 5).forEach((l, i) => console.log(i, l.substring(0, 150)));
} catch (e) { console.log('error:', e.message); }

console.log('\n--- HY4 REMAINING ---');
try {
    const h4r = fs.readFileSync(path.join(ROOT, 'HY4 Report-Remaining Aspects.md'), 'utf8');
    const lines = h4r.split('\n').filter(l => /house|awas|pmay|आवास|कच्चा|पक्का|pucca|kutcha/i.test(l));
    console.log('Lines:', lines.length);
    lines.slice(0, 5).forEach((l, i) => console.log(i, l.substring(0, 150)));
} catch (e) { console.log('error:', e.message); }

// 12. NARRATIVE REPORT HY2
console.log('\n--- NARRATIVE HY2 ---');
try {
    const n2 = fs.readFileSync(path.join(ROOT, 'Narrative Report HY2.md'), 'utf8');
    const lines = n2.split('\n').filter(l => /house|awas|pmay|आवास|कच्चा|पक्का|pucca|kutcha/i.test(l));
    console.log('Lines:', lines.length);
    lines.slice(0, 5).forEach((l, i) => console.log(i, l.substring(0, 150)));
} catch (e) { console.log('error:', e.message); }

console.log('\n=== DONE ===');