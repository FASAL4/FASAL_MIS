// scripts/_inspect_match_coverage.cjs
const fs = require('fs');
const path = require('path');

const FARMERS = path.resolve(__dirname, '..', 'src', 'data', 'farmers.json');
const BASELINE = path.resolve(__dirname, '..', 'src', 'data', 'baseline_summary.json');

const farmers = JSON.parse(fs.readFileSync(FARMERS, 'utf8'));
const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));

const total = farmers.length;
const matched = farmers.filter(f => f && f.matched);
const unmatched = farmers.filter(f => !f || !f.matched);
const matchedWithBpl = matched.filter(f => f.bpl);
const matchedWithBank = matched.filter(f => f.bankAccount);

// Sample unmatched to show what fields they lack
console.log('=== INSPECTING FARMERS.JSON COVERAGE ===\n');
console.log('Total farmer records:', total);
console.log('Matched (have demographic flags):', matched.length);
console.log('  - with bpl flag:', matchedWithBpl.length);
console.log('  - with bankAccount flag:', matchedWithBank.length);
console.log('Unmatched (registry-only):', unmatched.length);
console.log();
console.log('=== SAMPLE UNMATCHED FARMERS (no demographic flags populated) ===');
unmatched.slice(0, 3).forEach(f => {
    console.log(JSON.stringify({
        id: f.id, name: f.name, gender: f.gender, village: f.village,
        group: f.group, totalLand: f.totalLand, matched: f.matched,
        bpl: f.bpl, antodyaya: f.antodyaya, mnrega: f.mnrega, bankAccount: f.bankAccount
    }, null, 2));
});
console.log();
console.log('=== BASELINE.SUMMARY HOUSEHOLD COUNT ===');
console.log('Total households surveyed (baseline):', baseline.aggregateMetrics.totalHouseholds);
console.log('Total family members:', baseline.aggregateMetrics.totalFamilyMembers);
console.log('GP count:', baseline.aggregateMetrics.gpCount);
console.log('Village count:', baseline.aggregateMetrics.villageCount);
console.log();
console.log('=== MATCH RATE ===');
console.log('farmers.json (active registry) / baseline households:',
    ((total / baseline.aggregateMetrics.totalHouseholds) * 100).toFixed(1) + '%');
console.log('matched cohort / baseline households:',
    ((matched.length / baseline.aggregateMetrics.totalHouseholds) * 100).toFixed(1) + '%');
