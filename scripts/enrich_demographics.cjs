/**
 * enrich_demographics.cjs
 * Processes the anonymized baseline_farmers.json to generate macro-level 
 * social equity and demographic indicators (Caste, Gender vulnerability, Landlessness).
 */
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const outputDir = path.join(baseDir, 'src', 'data');

const farmersDataPath = path.join(outputDir, 'baseline_farmers.json');
const rawData = JSON.parse(fs.readFileSync(farmersDataPath, 'utf8'));
const households = rawData.households;

const demographics = {
  meta: {
    source: 'Baseline Survey (baseline_farmers.json)',
    description: 'Macro-level social equity and demographic aggregations'
  },
  casteBreakdown: {
    'General': 0,
    'OBC': 0,
    'SC': 0,
    'ST': 0,
    'Unknown': 0
  },
  vulnerability: {
    singleWomen: 0,
    singleWomenLandless: 0,
    scStLandless: 0,
    totalScSt: 0,
    totalLandless: 0
  },
  economicsByCaste: {
    'General': { count: 0, totalLand: 0, totalAgriIncome: 0 },
    'OBC': { count: 0, totalLand: 0, totalAgriIncome: 0 },
    'SC': { count: 0, totalLand: 0, totalAgriIncome: 0 },
    'ST': { count: 0, totalLand: 0, totalAgriIncome: 0 }
  }
};

households.forEach(hh => {
  // 1. Caste Breakdown
  let category = hh.category || 'Unknown';
  if (!['General', 'OBC', 'SC', 'ST'].includes(category)) category = 'Unknown';
  demographics.casteBreakdown[category]++;

  // 2. Economics by Caste
  if (category !== 'Unknown') {
    demographics.economicsByCaste[category].count++;
    demographics.economicsByCaste[category].totalLand += hh.cultivableLandAcres || 0;
    demographics.economicsByCaste[category].totalAgriIncome += hh.annualIncFarmingRs || 0;
  }

  // 3. Vulnerability Intersections
  const isSingleWoman = hh.gender === 'F' && ['Widow', 'Separated', 'Single', 'Unmarried', 'Leaving from each other'].includes(hh.maritalStatus);
  const isLandless = hh.cultivableLandAcres === 0;
  const isScSt = category === 'SC' || category === 'ST';

  if (isLandless) demographics.vulnerability.totalLandless++;
  if (isScSt) demographics.vulnerability.totalScSt++;

  if (isSingleWoman) {
    demographics.vulnerability.singleWomen++;
    if (isLandless) {
      demographics.vulnerability.singleWomenLandless++;
    }
  }

  if (isScSt && isLandless) {
    demographics.vulnerability.scStLandless++;
  }
});

// Compute averages for economics
Object.keys(demographics.economicsByCaste).forEach(cat => {
  const data = demographics.economicsByCaste[cat];
  if (data.count > 0) {
    data.avgLandAcres = parseFloat((data.totalLand / data.count).toFixed(2));
    data.avgAgriIncomeRs = Math.round(data.totalAgriIncome / data.count);
  } else {
    data.avgLandAcres = 0;
    data.avgAgriIncomeRs = 0;
  }
});

fs.writeFileSync(
  path.join(outputDir, 'baseline_demographics.json'),
  JSON.stringify(demographics, null, 2),
  'utf8'
);

console.log('✅ Written: src/data/baseline_demographics.json');
console.log(JSON.stringify(demographics, null, 2));
