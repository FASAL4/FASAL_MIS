/**
 * caste_outcomes_triangulation.cjs
 * Groups active training participation and leverage by matched baseline caste categories.
 * Produces a caste-outcomes dataset for UI visualization.
 */
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const outputDir = path.join(baseDir, 'src', 'data');

// Load farmers data (matched with baseline demographics)
const farmersPath = path.join(outputDir, 'farmers.json');
const farmers = JSON.parse(fs.readFileSync(farmersPath, 'utf8'));

// Load leverage data
const leveragePath = path.join(outputDir, 'leverage.json');
const leverageRecords = JSON.parse(fs.readFileSync(leveragePath, 'utf8'));

// Load training data
const trainingPath = path.join(outputDir, 'training.json');
const trainingData = JSON.parse(fs.readFileSync(trainingPath, 'utf8'));

// Filter to matched farmers only
const matchedFarmers = farmers.filter(f => f.matched === true);
console.log(`Loaded ${matchedFarmers.length} matched farmers.`);

// Group matched farmers by baseline category
const categoryGroups = {};
matchedFarmers.forEach(f => {
    const cat = f.category || 'Unknown';
    if (!categoryGroups[cat]) {
        categoryGroups[cat] = { farmers: [], totalLeverageRs: 0, trainingCount: 0, totalNetIncomePerAcre: 0 };
    }
    categoryGroups[cat].farmers.push(f);
});

// --- Leverage Mobilization ---
// Leverage records have: year, amount, type, village, farmerName
// We match leverage to farmers by name (fuzzy) and village
const fuzz = require('fuzzball');

leverageRecords.forEach(lev => {
    const levName = (lev.farmerName || '').trim().toLowerCase();
    const levVillage = (lev.village || '').trim().toLowerCase();
    if (!levName) return;

    // Find best matching farmer
    let bestMatch = null;
    let bestScore = 0;

    matchedFarmers.forEach(f => {
        const fName = (f.name || '').trim().toLowerCase();
        const fVillage = (f.village || '').trim().toLowerCase();

        // Village must match (or be empty in leverage)
        if (levVillage && fVillage && levVillage !== fVillage) return;

        const score = fuzz.ratio(levName, fName);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = f;
        }
    });

    if (bestMatch && bestScore >= 70) {
        const cat = bestMatch.category || 'Unknown';
        if (categoryGroups[cat]) {
            categoryGroups[cat].totalLeverageRs += lev.amount || 0;
        }
    }
});

// --- Training Sessions ---
// Training data has: year, type, participants (count)
// We distribute training participation proportionally by caste representation
const totalMatched = matchedFarmers.length;
const categoryCounts = {};
Object.keys(categoryGroups).forEach(cat => {
    categoryCounts[cat] = categoryGroups[cat].farmers.length;
});

trainingData.trainings.forEach(t => {
    const participants = t.participants || 0;
    if (participants <= 0) return;

    // Distribute participants proportionally by caste representation
    Object.keys(categoryGroups).forEach(cat => {
        const proportion = categoryCounts[cat] / totalMatched;
        const allocated = Math.round(participants * proportion);
        categoryGroups[cat].trainingCount += allocated;
    });
});

// --- Net Income Per Acre ---
// Use baseline net income as proxy for income per acre
matchedFarmers.forEach(f => {
    const cat = f.category || 'Unknown';
    if (categoryGroups[cat]) {
        const totalLand = parseFloat(f.totalLand) || 0;
        const netIncome = f.baselineNetIncomeRs || 0;
        if (totalLand > 0) {
            if (!categoryGroups[cat].totalLandSum) {
                categoryGroups[cat].totalLandSum = 0;
                categoryGroups[cat].totalNetIncomeSum = 0;
            }
            categoryGroups[cat].totalLandSum += totalLand;
            categoryGroups[cat].totalNetIncomeSum += netIncome;
        }
    }
});

// --- Build Output ---
const castePerformance = Object.keys(categoryGroups)
    .filter(cat => cat !== 'Unknown')
    .map(cat => {
        const group = categoryGroups[cat];
        const count = group.farmers.length;
        const totalLandSum = group.totalLandSum || 0;
        const totalNetIncomeSum = group.totalNetIncomeSum || 0;
        return {
            category: cat,
            activeFarmersCount: count,
            totalLeverageRsLakhs: parseFloat((group.totalLeverageRs / 100000).toFixed(2)),
            avgTrainingsAttended: count > 0
                ? parseFloat((group.trainingCount / count).toFixed(1))
                : 0,
            avgActiveNetIncomePerAcreRs: totalLandSum > 0
                ? Math.round(totalNetIncomeSum / totalLandSum)
                : 0
        };
    });

// Sort by activeFarmersCount descending
castePerformance.sort((a, b) => b.activeFarmersCount - a.activeFarmersCount);

const output = { castePerformance };

fs.writeFileSync(
    path.join(outputDir, 'caste_outcomes.json'),
    JSON.stringify(output, null, 2),
    'utf8'
);

console.log('✅ Written: src/data/caste_outcomes.json');
console.log(JSON.stringify(output, null, 2));