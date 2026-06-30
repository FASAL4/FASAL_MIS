/**
 * fix_cumulative_data.cjs
 * Recomputes the "Cumulative" entries in yearly_gp_crops.json
 * to properly sum both income AND area across years.
 */
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'yearly_gp_crops.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Recompute Cumulative for crops
const years = ['2022', '2023', '2024', '2025'];
const cropMap = {};

years.forEach(year => {
    const yearCrops = data.crops[year] || [];
    yearCrops.forEach(c => {
        if (!cropMap[c.name]) {
            cropMap[c.name] = { income: 0, area: 0 };
        }
        cropMap[c.name].income += c.income;
        cropMap[c.name].area += c.area;
    });
});

// Build cumulative crops array
const cumulativeCrops = Object.entries(cropMap)
    .map(([name, vals]) => ({
        name,
        income: parseFloat(vals.income.toFixed(2)),
        area: parseFloat(vals.area.toFixed(2)),
        perAcre: Math.round((vals.income * 100000) / vals.area)
    }))
    .sort((a, b) => b.income - a.income)
    .map((c, i) => ({ rank: i + 1, ...c }));

data.crops.Cumulative = cumulativeCrops;

// Recompute Cumulative for GP
const gpMap = {};
years.forEach(year => {
    const yearGp = data.gp[year] || [];
    yearGp.forEach(gp => {
        if (!gpMap[gp.name]) {
            gpMap[gp.name] = { income: 0, farmers: 0 };
        }
        gpMap[gp.name].income += gp.income;
        // For farmers, take the max (or latest year's count)
        gpMap[gp.name].farmers = Math.max(gpMap[gp.name].farmers, gp.farmers);
    });
});

const cumulativeGp = Object.entries(gpMap)
    .map(([name, vals]) => ({
        name,
        farmers: vals.farmers,
        income: parseFloat(vals.income.toFixed(2)),
        avg: Math.round((vals.income * 100000) / vals.farmers)
    }))
    .sort((a, b) => b.income - a.income);

data.gp.Cumulative = cumulativeGp;

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log('✅ Fixed Cumulative entries in yearly_gp_crops.json');
console.log('\nCumulative Crops (top 5):');
cumulativeCrops.slice(0, 5).forEach(c => {
    console.log(`  ${c.rank}. ${c.name}: ₹${c.income}L, ${c.area} ac, ₹${c.perAcre.toLocaleString('en-IN')}/ac`);
});
console.log('\nCumulative GP:');
cumulativeGp.forEach(gp => {
    console.log(`  ${gp.name}: ${gp.farmers} farmers, ₹${gp.income}L, ₹${gp.avg.toLocaleString('en-IN')}/family`);
});