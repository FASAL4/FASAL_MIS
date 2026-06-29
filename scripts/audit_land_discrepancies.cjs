/**
 * audit_land_discrepancies.cjs
 * Audits the 600 matched active farmers to verify land size reporting consistency (both in Acres).
 * Flags discrepancies where active acres deviate >20% from baseline acres records.
 */
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const outputDir = path.join(baseDir, 'src', 'data');

const farmersPath = path.join(outputDir, 'farmers.json');
const farmers = JSON.parse(fs.readFileSync(farmersPath, 'utf8'));

const matchedFarmers = farmers.filter(f => f.matched === true);
const totalAudited = matchedFarmers.length;

const DEVIATION_THRESHOLD = 0.2; // 20%

const outliers = [];

matchedFarmers.forEach(f => {
    const activeAcres = parseFloat(f.totalLand);
    if (isNaN(activeAcres) || activeAcres <= 0) return; // Skip if no valid active land

    const baselineAcres = (f.baselineCultivableLandAcres || 0) + (f.baselineLeaseLandAcres || 0);
    if (baselineAcres <= 0) return; // Skip if no baseline land to compare

    const deviationPct = Math.abs(activeAcres - baselineAcres) / baselineAcres * 100;

    if (deviationPct > DEVIATION_THRESHOLD * 100) {
        outliers.push({
            id: f.id,
            name: f.name,
            village: f.village,
            activeAcres: parseFloat(activeAcres.toFixed(2)),
            baselineAcres: parseFloat(baselineAcres.toFixed(2)),
            deviationPct: parseFloat(deviationPct.toFixed(1))
        });
    }
});

// Sort by deviation descending
outliers.sort((a, b) => b.deviationPct - a.deviationPct);

const totalDiscrepancies = outliers.length;
const matchAccuracyPct = totalAudited > 0
    ? parseFloat(((totalAudited - totalDiscrepancies) / totalAudited * 100).toFixed(1))
    : 100.0;

const report = {
    summary: {
        totalAudited,
        totalDiscrepancies,
        matchAccuracyPct
    },
    outliers
};

fs.writeFileSync(
    path.join(outputDir, 'land_discrepancies.json'),
    JSON.stringify(report, null, 2),
    'utf8'
);

console.log('✅ Written: src/data/land_discrepancies.json');
console.log(`   Audited: ${totalAudited} farmers`);
console.log(`   Discrepancies found: ${totalDiscrepancies}`);
console.log(`   Match accuracy: ${matchAccuracyPct}%`);