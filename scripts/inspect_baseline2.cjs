const XLSX = require('xlsx');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

// ---- Deep inspect Base Line sheet columns ----
const wb1 = XLSX.readFile(path.join(baseDir, 'Base line Data1.xlsx'));
const ws1 = wb1.Sheets['Base Line'];
const data1 = XLSX.utils.sheet_to_json(ws1, { header: 1, defval: '' });

console.log('=== BASE LINE SHEET: Full Column Headers (Row 1) ===');
const headers = data1[1];
headers.forEach((h, i) => {
  if (h !== '') console.log(`  [${i}] ${h}`);
});

console.log('\n=== SAMPLE ROW (Row 2) ===');
const sample = data1[2];
headers.forEach((h, i) => {
  if (h !== '') console.log(`  ${h}: ${sample[i]}`);
});

// ---- Deep inspect NRM Summary Sheet ----
const wb2 = XLSX.readFile(path.join(baseDir, 'Baseline Findings NRM.xlsx'));
const nrmWs = wb2.Sheets['Summary Sheet'];
const nrmData = XLSX.utils.sheet_to_json(nrmWs, { header: 1, defval: '' });

console.log('\n=== NRM SUMMARY SHEET: All Rows ===');
nrmData.slice(1).forEach((row, i) => {
  if (row[0] !== '' || row[3] !== '') {
    console.log(`  [${row[0]}] GP:${row[1]||'-'} | ${row[3]} | No:${row[5]} ${row[6]} | ${row[7] ? parseFloat(row[7]).toFixed(1)+'%' : ''}`);
  }
});

// ---- Base Line Summary sheet ----
const summaryWs = wb1.Sheets['Summary'];
const summaryData = XLSX.utils.sheet_to_json(summaryWs, { header: 1, defval: '' });
console.log('\n=== BASE LINE SUMMARY SHEET: All rows ===');
summaryData.slice(2).forEach((row, i) => {
  if (row[0] !== '') {
    console.log(`  GP/Village: ${row[0]} | Count:${row[1]} | F:${row[2]} M:${row[3]} | CultLand:${row[4]} | AnnExpFarm:${row[8]} | AnnIncFarm:${row[9]} | GrossInc:${row[10]}`);
  }
});
