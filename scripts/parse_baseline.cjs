/**
 * parse_baseline.cjs
 * Parses Base line Data1.xlsx and Baseline Findings NRM.xlsx into structured JSON
 * for integration into the FASAL MIS dashboard.
 * 
 * Output files:
 *   src/data/baseline_summary.json   -- GP & village level aggregate (farming economics, demographics)
 *   src/data/baseline_nrm.json       -- GP-level NRM indicator breakdown
 *   src/data/baseline_farmers.json   -- Household-level anonymised profile data
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const outputDir = path.join(baseDir, 'src', 'data');

// ============================================================
// 1. PARSE BASE LINE DATA1.XLSX - Summary Sheet (GP level)
// ============================================================
const wb1 = XLSX.readFile(path.join(baseDir, 'Base line Data1.xlsx'));

// --- Summary Sheet: GP-level aggregates ---
const summaryWs = wb1.Sheets['Summary'];
const summaryRaw = XLSX.utils.sheet_to_json(summaryWs, { header: 1, defval: '' });

// GP/Village level rows start at row index 3
// Columns (0-indexed): 0=Name, 1=Count(HH), 2=TotalFemale, 3=TotalMale, 
//   4=CultivableLand, 5=LeaseLand, 6=TotalCultivated, 7=Fertilizer,
//   8=AnnExpFarm, 9=AnnIncFarm, 10=GrossInc, 11=TotalFarmers,
//   12=FemaleFarmers, 13=MaleFarmers, 14=MigrationIncome

const summaryRows = summaryRaw.slice(3); // skip title + header rows

// Identify GP-level rows vs village-level rows vs sum rows vs Grand Total
// The data pattern: GP rows followed by village rows, then "X Sum" rows, then Grand Total
// We'll keep all non-empty, non-"Sum" rows and the Grand Total

const gpVillageSummary = [];
let currentGP = null;

summaryRows.forEach((row) => {
  const name = String(row[0]).trim();
  if (!name || name === 'Grand Total') {
    if (name === 'Grand Total') {
      gpVillageSummary.push({
        type: 'grand_total',
        name: 'Grand Total',
        households: Number(row[1]) || 0,
        totalFemale: Number(row[2]) || 0,
        totalMale: Number(row[3]) || 0,
        cultivableLandAcres: parseFloat((Number(row[4]) / 1.6).toFixed(2)) || 0,
        leaseLandAcres: parseFloat((Number(row[5]) / 1.6).toFixed(2)) || 0,
        totalCultivatedAcres: parseFloat((Number(row[6]) / 1.6).toFixed(2)) || 0,
        fertilizerKg: Number(row[7]) || 0,
        annualExpFarmingRs: Number(row[8]) || 0,
        annualIncFarmingRs: Number(row[9]) || 0,
        grossIncFarmingRs: Number(row[10]) || 0,
        totalFarmers: Number(row[11]) || 0,
        femaleFarmers: Number(row[12]) || 0,
        maleFarmers: Number(row[13]) || 0,
        migrationIncomeRs: Number(row[14]) || 0,
      });
    }
    return;
  }
  // Skip "Sum" rows
  if (name.endsWith(' Sum')) return;

  const record = {
    name,
    households: Number(row[1]) || 0,
    totalFemale: Number(row[2]) || 0,
    totalMale: Number(row[3]) || 0,
    cultivableLandAcres: parseFloat((Number(row[4]) / 1.6).toFixed(2)) || 0,
    leaseLandAcres: parseFloat((Number(row[5]) / 1.6).toFixed(2)) || 0,
    totalCultivatedAcres: parseFloat((Number(row[6]) / 1.6).toFixed(2)) || 0,
    fertilizerKg: Number(row[7]) || 0,
    annualExpFarmingRs: Number(row[8]) || 0,
    annualIncFarmingRs: Number(row[9]) || 0,
    grossIncFarmingRs: Number(row[10]) || 0,
    totalFarmers: Number(row[11]) || 0,
    femaleFarmers: Number(row[12]) || 0,
    maleFarmers: Number(row[13]) || 0,
    migrationIncomeRs: Number(row[14]) || 0,
  };

  gpVillageSummary.push(record);
});

// ============================================================
// 2. PARSE BASE LINE SHEET - Household-level profiles (anonymised)
// ============================================================
const baseLineWs = wb1.Sheets['Base Line'];
const baseLineRaw = XLSX.utils.sheet_to_json(baseLineWs, { header: 1, defval: '' });
const blHeaders = baseLineRaw[1]; // Row 1 is header

// Known GP names for type inference
const knownGPs = ['Karikot', 'Chahalwa', 'Fakirpuri', 'Badkhadiya', 'Bajpur Bankati', 'Vishunapur'];

const farmerRows = baseLineRaw.slice(2).filter(r => r[1]); // skip blank rows

const householdProfiles = farmerRows.map((row) => {
  const gpRaw = String(row[1]).trim();
  // Normalize GP name
  const gp = gpRaw.charAt(0).toUpperCase() + gpRaw.slice(1).toLowerCase()
    .replace('karikot', 'Karikot').replace('fakirpuri', 'Fakirpuri');

  return {
    gp: String(row[1]).trim(),
    village: String(row[2]).trim(),
    gender: String(row[9]).trim(),
    age: Number(row[10]) || null,
    maritalStatus: String(row[11]).trim(),
    category: String(row[15]).trim(),
    religion: String(row[16]).trim(),
    // Entitlement flags
    antodyaya: String(row[17]).trim() !== '' && String(row[17]).trim() !== '0',
    bpl: String(row[18]).trim() !== '' && String(row[18]).trim() !== '0',
    apl: String(row[19]).trim() !== '' && String(row[19]).trim() !== '0',
    mnrega: String(row[20]).trim() !== '' && String(row[20]).trim() !== '0',
    eShram: String(row[21]).trim() !== '' && String(row[21]).trim() !== '0',
    pension: String(row[22]).trim() !== '' || String(row[23]).trim() !== '' || String(row[24]).trim() !== '',
    kisanSammanNidhi: String(row[25]).trim() !== '' && String(row[25]).trim() !== '0',
    bankAccount: String(row[26]).trim().toLowerCase() === 'yes' || String(row[26]).trim() === '1',
    shgMember: String(row[29]).trim() !== '' && String(row[29]).trim().toLowerCase() !== 'no',
    shgName: String(row[30]).trim(),
    // Land
    cultivableLandAcres: parseFloat((Number(row[53]) / 1.6).toFixed(2)) || 0,
    leaseLandAcres: parseFloat((Number(row[54]) / 1.6).toFixed(2)) || 0,
    totalCultivatedAcres: parseFloat((Number(row[55]) / 1.6).toFixed(2)) || 0,
    // Farming economics
    annualExpFarmingRs: Number(row[59]) || 0,
    annualIncFarmingRs: Number(row[60]) || 0,
    grossIncFarmingRs: Number(row[61]) || 0,
    // Animals
    // Health
    hasToilet: String(row[92]).trim().toLowerCase() === 'yes' || String(row[92]).trim() === '1',
    vaccinated: String(row[106]).trim().toLowerCase() === 'yes' || String(row[106]).trim() === '1',
    // Migration
    migration: String(row[129]).trim() !== '' && String(row[129]).trim().toLowerCase() !== 'no',
    migrationIncomeRs: Number(row[131]) || 0,
    migrationExpRs: Number(row[132]) || 0,
    migrationNetIncRs: Number(row[133]) || 0,
    // Govt scheme
    govtSchemeBeneficiary: String(row[135]).trim().toLowerCase() === 'yes' || String(row[135]).trim() === '1',
  };
});

// ============================================================
// 3. PARSE BASELINE FINDINGS NRM.XLSX
// ============================================================
const wb2 = XLSX.readFile(path.join(baseDir, 'Baseline Findings NRM.xlsx'));

// Map of sheet -> GP name
const gpSheetMap = {
  'Summary Sheet': 'All GPs (Summary)',
  'Bakhadiya GP ': 'Badkhadiya',
  'Bajpur Bankati ': 'Bajpur Bankati',
  'Chahalwa': 'Chahalwa',
  'Fakirpuri': 'Fakirpuri',
  'Karikot ': 'Karikot',
  'Vishunapur': 'Vishunapur',
};

// Metric label mapping (by indicator number prefix)
const metricLabels = {
  '1': 'Total Households Surveyed',
  '1.1': 'Male Farmers',
  '1.2': 'Female Farmers',
  '1.3': 'Married',
  '1.5': 'Single Women (Widowed/Separated)',
  '1.8': 'Total Family Members Surveyed',
  '1.9': 'Avg Family Size',
  '5': 'Bank Account Holders',
  '6': 'AAS Groups in Village',
  '6.1': 'AAS Membership',
  '8': 'Total Cultivable Land (Acres)',
  '8.1': 'Avg Land per Family (Acres)',
  '8.4': 'Landless Families',
  '8.5': 'Landless Families Cultivating Rented Land',
  '8.6': 'Families Not Farming',
  '10': 'Total Cultivation Cost (INR)',
  '10.1': 'Total Agriculture Income (INR)',
  '10.2': 'Total Net Income from Agriculture (INR)',
  '10.3': 'Avg Cost per Acre (INR)',
  '10.4': 'Avg Income per Acre (INR)',
  '10.5': 'Total Fertilizer Use (Kgs)',
  '10.6': 'Avg Fertilizer per Acre (Kgs)',
  '10.7': 'Total Farmers',
  '10.8': 'Avg Farmers per Family',
  '12': 'Total Animals',
  '12.1': 'Avg Animals per Family',
  '13.5': 'Households with Toilets',
  '14.2': 'Housing Scheme Beneficiaries',
  '14.3': 'Jan Dhan Yojana Beneficiaries',
  '15': 'Vaccinated Families',
  '16': 'Migration Members',
  '17': 'Govt Scheme Beneficiaries',
};

const nrmByGP = {};

wb2.SheetNames.forEach(sheetName => {
  const gpName = gpSheetMap[sheetName] || sheetName.trim();
  const ws = wb2.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  
  const indicators = [];
  
  data.slice(1).forEach(row => {
    const code = String(row[0]).trim();
    const particulars = String(row[3]).trim();
    const no = row[5];
    const unit = String(row[6]).trim();
    const pct = row[7];
    
    if (!particulars || particulars === '0' || particulars === 'Particular' || particulars === 'Particulars' || particulars === 'Particular') return;
    
    const label = metricLabels[code] || particulars;
    
    indicators.push({
      code,
      label,
      rawLabel: particulars,
      value: typeof no === 'number' ? parseFloat(no.toFixed(2)) : (parseFloat(no) || 0),
      unit,
      percentage: pct !== '' && pct !== 0 ? parseFloat(parseFloat(pct).toFixed(1)) : null,
    });
  });
  
  nrmByGP[gpName] = indicators;
});

// ============================================================
// 4. COMPUTE AGGREGATE BASELINE METRICS for dashboard cards
// ============================================================

// Grand total from summary
const grandTotal = gpVillageSummary.find(r => r.type === 'grand_total') || {};

// GP-level rollup from NRM (Summary Sheet)
const nrmSummary = nrmByGP['All GPs (Summary)'] || [];
const getIndicator = (code) => nrmSummary.find(i => i.code === code);

const aggregateMetrics = {
  // Demographics
  totalHouseholds: getIndicator('1')?.value || 2060,
  totalFamilyMembers: getIndicator('1.8')?.value || 0,
  avgFamilySize: getIndicator('1.9')?.value || 0,
  maleFarmers: getIndicator('1.1')?.value || 264,
  femaleFarmers: getIndicator('1.2')?.value || 1796,
  femaleFarmerPct: getIndicator('1.2')?.percentage || 87.2,
  singleWomen: getIndicator('1.5')?.value || 0,
  
  // Land
  totalCultivableLandAcres: parseFloat(((getIndicator('8')?.value || 0) / 1.6).toFixed(2)),
  avgLandPerFamilyAcres: parseFloat(((getIndicator('8.1')?.value || 0) / 1.6).toFixed(2)),
  landlessFamiliesPct: getIndicator('8.4')?.percentage || 0,
  familiesNotFarmingPct: getIndicator('8.6')?.percentage || 0,
  
  // Economics (from summary sheet Grand Total)
  totalAnnualExpFarmingRs: grandTotal.annualExpFarmingRs || 25805500,
  totalAnnualIncFarmingRs: grandTotal.annualIncFarmingRs || 50361400,
  totalGrossIncFarmingRs: grandTotal.grossIncFarmingRs || 24555900,
  totalMigrationIncomeRs: grandTotal.migrationIncomeRs || 0,
  
  // Per NRM: agriculture
  totalCultivationCostRs: getIndicator('10')?.value || 0,
  totalAgriIncomeRs: getIndicator('10.1')?.value || 0,
  totalNetAgriIncomeRs: getIndicator('10.2')?.value || 0,
  avgCostPerAcreRs: parseFloat(((getIndicator('10.3')?.value || 0) * 1.6).toFixed(2)),
  avgIncomePerAcreRs: parseFloat(((getIndicator('10.4')?.value || 0) * 1.6).toFixed(2)),
  totalFertilizerKg: getIndicator('10.5')?.value || 0,
  
  // Social assets
  bankAccountPct: getIndicator('5')?.percentage || 100,
  aasGroups: getIndicator('6')?.value || 0,
  aasMembershipPct: getIndicator('6.1')?.percentage || 0,
  toiletHouseholdsPct: getIndicator('13.5')?.percentage || 42.3,
  housingSchemePct: getIndicator('14.2')?.percentage || 27.4,
  govtSchemeBeneficiaryPct: getIndicator('17')?.percentage || 65.9,
  vaccinatedPct: getIndicator('15')?.percentage || null,
  migrationMembersPct: getIndicator('16')?.percentage || 72.1,
  
  // Animals
  totalAnimals: getIndicator('12')?.value || 4787,
  avgAnimalsPerFamily: getIndicator('12.1')?.value || 2.32,
  
  // GP breakdown
  gps: ['Badkhadiya', 'Bajpur Bankati', 'Chahalwa', 'Fakirpuri', 'Karikot', 'Vishunapur'],
};

// ============================================================
// 5. GP-LEVEL COMPARISON TABLE
// ============================================================
const gpComparisonTable = Object.entries(gpSheetMap)
  .filter(([sheet]) => sheet !== 'Summary Sheet')
  .map(([sheet, gpName]) => {
    const indicators = nrmByGP[gpName] || [];
    const get = (code) => indicators.find(i => i.code === code);
    return {
      gp: gpName,
      households: get('1')?.value || 0,
      femaleFarmerPct: get('1.2')?.percentage || 0,
      singleWomenCount: get('1.5')?.value || 0,
      cultivableLandAcres: parseFloat(((get('8')?.value || 0) / 1.6).toFixed(2)),
      avgLandPerFamilyAcres: parseFloat(((get('8.1')?.value || 0) / 1.6).toFixed(2)),
      landlessFamiliesPct: get('8.4')?.percentage || 0,
      totalAgriIncome: get('10.1')?.value || 0,
      totalNetAgriIncome: get('10.2')?.value || 0,
      avgIncomePerAcre: parseFloat(((get('10.4')?.value || 0) * 1.6).toFixed(2)),
      toiletPct: get('13.5')?.percentage || 0,
      bankAccountPct: get('5')?.percentage || 0,
      govtSchemePct: get('17')?.percentage || 0,
      migrationPct: get('16')?.percentage || 0,
      aasMembershipPct: get('6.1')?.percentage || 0,
    };
  });

// ============================================================
// 6. WRITE OUTPUT FILES
// ============================================================

const baselineSummary = {
  meta: {
    source: 'Base line Data1.xlsx + Baseline Findings NRM.xlsx',
    programme: 'FASAL - Farmers Action for Sustainable Agro-based Livelihoods',
    organisation: 'DEHAT',
    geographicScope: 'Mihinpurwa Block, Bahraich District, UP',
    dataType: 'Baseline (Pre-programme)',
    totalHouseholds: aggregateMetrics.totalHouseholds,
    gpCount: 6,
    villageCount: 19,
  },
  aggregateMetrics,
  gpComparison: gpComparisonTable,
  gpVillageSummary: gpVillageSummary.filter(r => !r.type),
};

fs.writeFileSync(
  path.join(outputDir, 'baseline_summary.json'),
  JSON.stringify(baselineSummary, null, 2),
  'utf8'
);
console.log('✅ Written: src/data/baseline_summary.json');

const baselineNRM = {
  meta: {
    source: 'Baseline Findings NRM.xlsx',
    description: 'GP-level NRM (Natural Resource Management) baseline indicator data',
  },
  byGP: nrmByGP,
};

fs.writeFileSync(
  path.join(outputDir, 'baseline_nrm.json'),
  JSON.stringify(baselineNRM, null, 2),
  'utf8'
);
console.log('✅ Written: src/data/baseline_nrm.json');

// Household profiles - strip PII (no names, no Aadhar/contact)
// We keep only analytical fields
const baselineFarmers = {
  meta: {
    source: 'Base line Data1.xlsx - Base Line sheet',
    description: 'Anonymised household-level baseline profiles (PII removed)',
    totalRecords: householdProfiles.length,
  },
  households: householdProfiles,
};

fs.writeFileSync(
  path.join(outputDir, 'baseline_farmers.json'),
  JSON.stringify(baselineFarmers, null, 2),
  'utf8'
);
console.log('✅ Written: src/data/baseline_farmers.json');

// Print summary stats
console.log('\n=== Parse Summary ===');
console.log(`Total households parsed: ${householdProfiles.length}`);
console.log(`GPs in NRM: ${Object.keys(nrmByGP).length}`);
console.log(`GP comparison rows: ${gpComparisonTable.length}`);
console.log(`Village summary rows: ${gpVillageSummary.filter(r => !r.type).length}`);

console.log('\n=== Aggregate Metrics Preview ===');
console.log(`Total Households: ${aggregateMetrics.totalHouseholds}`);
console.log(`Female Farmers: ${aggregateMetrics.femaleFarmers} (${aggregateMetrics.femaleFarmerPct.toFixed(1)}%)`);
console.log(`Total Agri Income (NRM): ₹${(aggregateMetrics.totalAgriIncomeRs/100000).toFixed(2)} L`);
console.log(`Total Net Agri Income (NRM): ₹${(aggregateMetrics.totalNetAgriIncomeRs/100000).toFixed(2)} L`);
console.log(`Toilet Coverage: ${aggregateMetrics.toiletHouseholdsPct}%`);
console.log(`Govt Scheme Beneficiaries: ${aggregateMetrics.govtSchemeBeneficiaryPct}%`);
console.log(`Bank Account: ${aggregateMetrics.bankAccountPct}%`);
