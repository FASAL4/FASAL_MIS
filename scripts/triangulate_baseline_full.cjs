const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const fuzz = require('fuzzball');

const baseDir = path.resolve(__dirname, '..');
const farmersPath = path.join(baseDir, 'src', 'data', 'farmers.json');

if (!fs.existsSync(farmersPath)) {
  console.error("farmers.json not found!");
  process.exit(1);
}

const farmers = JSON.parse(fs.readFileSync(farmersPath, 'utf8'));
console.log(`Loaded ${farmers.length} active MIS farmers.`);

const wb = XLSX.readFile(path.join(baseDir, 'Base line Data1.xlsx'));
const ws = wb.Sheets['Base Line'];
const baselineRaw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// Header at row 1
const headers = baselineRaw[1];
const colMap = {};
headers.forEach((h, idx) => {
  if (h) {
    colMap[h.toString().trim()] = idx;
  }
});

console.log("Baseline Columns mapped successfully.");

// Map baseline records by village for faster matching
const baselineByVillage = {};

baselineRaw.slice(2).forEach(row => {
  const gp = String(row[colMap['Name of GP'] || 1]).trim();
  const village = String(row[colMap['Name of Village'] || 2]).trim();
  const name = String(row[colMap['Name of Farmers '] || 7]).trim();
  
  if (!name || !village) return;
  
  const vKey = village.toLowerCase().replace(/\s+/g, '');
  if (!baselineByVillage[vKey]) {
    baselineByVillage[vKey] = [];
  }
  
  baselineByVillage[vKey].push({
    name,
    gp,
    village,
    gender: String(row[colMap['Gender'] || 9]).trim(),
    age: Number(row[colMap['Age'] || 10]) || null,
    maritalStatus: String(row[colMap['Marital Status'] || 11]).trim(),
    category: String(row[colMap['Category'] || 15]).trim(),
    religion: String(row[colMap['Religion'] || 16]).trim(),
    antodyaya: String(row[colMap['Antodyaya'] || 17]).trim() !== '' && String(row[colMap['Antodyaya'] || 17]).trim() !== '0',
    bpl: String(row[colMap['BPL'] || 18]).trim() !== '' && String(row[colMap['BPL'] || 18]).trim() !== '0',
    apl: String(row[colMap['APL'] || 19]).trim() !== '' && String(row[colMap['APL'] || 19]).trim() !== '0',
    mnrega: String(row[colMap['MNREGA'] || 20]).trim() !== '' && String(row[colMap['MNREGA'] || 20]).trim() !== '0',
    eShram: String(row[colMap['E-Shram'] || 21]).trim() !== '' && String(row[colMap['E-Shram'] || 21]).trim() !== '0',
    bankAccount: String(row[colMap['Bank Account Status'] || 26]).trim().toLowerCase() === 'yes' || String(row[colMap['Bank Account Status'] || 26]).trim() === '1',
    shgMember: String(row[colMap['Associated with  group '] || 29]).trim() !== '' && String(row[colMap['Associated with  group '] || 29]).trim().toLowerCase() !== 'no',
    cultivableLandAcres: parseFloat((Number(row[colMap['Cultivable land (in bigha)'] || 53]) / 1.6).toFixed(2)) || 0,
    leaseLandAcres: parseFloat((Number(row[colMap['land taken on lease (in bigha)'] || 54]) / 1.6).toFixed(2)) || 0,
    annualExpFarmingRs: Number(row[colMap['Annual Expenditure on Farming (in Rs.)'] || 59]) || 0,
    annualIncFarmingRs: Number(row[colMap['Annual income on Farming (in Rs.)'] || 60]) || 0,
    baselineNetIncomeRs: Number(row[colMap['Gross Income'] || 61]) || 0,
    hasToilet: String(row[colMap['toilet in your house'] || 92]).trim().toLowerCase() === 'yes' || String(row[colMap['toilet in your house'] || 92]).trim() === '1',
    migration: String(row[colMap['Migration'] || 129]).trim() !== '' && String(row[colMap['Migration'] || 129]).trim().toLowerCase() !== 'no',
    migrationNetIncomeRs: Number(row[colMap['Net Income from Migration'] || 133]) || 0,
  });
});

console.log(`Indexed baseline records across ${Object.keys(baselineByVillage).length} unique village keys.`);

let matchCount = 0;
const enrichedFarmers = farmers.map(f => {
  const fName = String(f.name).trim().toLowerCase();
  const fVillage = String(f.village).trim().toLowerCase();
  const vKey = fVillage.replace(/\s+/g, '');
  
  const villageBaseline = baselineByVillage[vKey] || [];
  
  if (villageBaseline.length === 0) {
    // Village name didn't match exactly. Let's look across all baseline records (broad search)
    // for fallback matching, but limit candidate pool for safety
    return { ...f, matched: false };
  }
  
  // Find the best fuzzy match for the name in the same village
  let bestMatch = null;
  let bestScore = 0;
  
  villageBaseline.forEach(b => {
    const score = fuzz.ratio(fName, b.name.toLowerCase());
    if (score > bestScore) {
      bestScore = score;
      bestMatch = b;
    }
  });
  
  // Score threshold of 75 to ensure confidence
  if (bestMatch && bestScore >= 75) {
    matchCount++;
    return {
      ...f,
      matched: true,
      matchScore: bestScore,
      age: bestMatch.age,
      maritalStatus: bestMatch.maritalStatus,
      category: bestMatch.category,
      religion: bestMatch.religion,
      antodyaya: bestMatch.antodyaya,
      bpl: bestMatch.bpl,
      apl: bestMatch.apl,
      mnrega: bestMatch.mnrega,
      eShram: bestMatch.eShram,
      bankAccount: bestMatch.bankAccount,
      shgMember: bestMatch.shgMember,
      baselineCultivableLandAcres: bestMatch.cultivableLandAcres,
      baselineLeaseLandAcres: bestMatch.leaseLandAcres,
      baselineAnnualExpFarmingRs: bestMatch.annualExpFarmingRs,
      baselineAnnualIncFarmingRs: bestMatch.annualIncFarmingRs,
      baselineNetIncomeRs: bestMatch.baselineNetIncomeRs,
      hasToilet: bestMatch.hasToilet,
      migration: bestMatch.migration,
      migrationNetIncomeRs: bestMatch.migrationNetIncomeRs,
    };
  }
  
  return { ...f, matched: false };
});

console.log(`Matched and Enriched ${matchCount} out of ${farmers.length} active MIS farmers (${((matchCount / farmers.length)*100).toFixed(1)}%).`);

fs.writeFileSync(farmersPath, JSON.stringify(enrichedFarmers, null, 2), 'utf8');
console.log(`Saved enriched farmers list back to ${farmersPath}`);

// Write triangulation log
const triangulationSummary = {
  activeFarmersCount: farmers.length,
  matchedCount: matchCount,
  matchRatePct: parseFloat(((matchCount / farmers.length)*100).toFixed(1)),
  averageBaselineNetIncome: Math.round(
    enrichedFarmers
      .filter(f => f.matched && f.baselineNetIncomeRs > 0)
      .reduce((sum, f) => sum + f.baselineNetIncomeRs, 0) / matchCount || 0
  ),
  casteBreakdownMatched: enrichedFarmers
    .filter(f => f.matched)
    .reduce((acc, f) => {
      const cat = f.category || 'Unknown';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {}),
  landlessCountMatched: enrichedFarmers
    .filter(f => f.matched && f.baselineCultivableLandAcres === 0).length
};

fs.writeFileSync(
  path.join(baseDir, 'src', 'data', 'triangulation_summary.json'),
  JSON.stringify(triangulationSummary, null, 2),
  'utf8'
);
console.log('✅ Written: src/data/triangulation_summary.json');
console.log(triangulationSummary);
