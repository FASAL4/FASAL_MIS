const XLSX = require('xlsx');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

// Get all NRM metrics per GP
const wb2 = XLSX.readFile(path.join(baseDir, 'Baseline Findings NRM.xlsx'));

const gpSheets = ['Bakhadiya GP ', 'Bajpur Bankati ', 'Chahalwa', 'Fakirpuri', 'Karikot ', 'Vishunapur'];

gpSheets.forEach(sheetName => {
  console.log('\n\n=== GP SHEET:', sheetName.trim(), '===');
  const ws = wb2.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  
  data.slice(1).forEach((row) => {
    if (row[3] !== '' && row[3] !== 0) {
      console.log(`  [${row[0]}] ${row[3]} | No: ${row[5]} ${row[6]} | ${row[7] ? parseFloat(row[7]).toFixed(1)+'%' : ''}`);
    }
  });
});

// Also get headers of Base Line sheet
const wb1 = XLSX.readFile(path.join(baseDir, 'Base line Data1.xlsx'));
const ws1 = wb1.Sheets['Base Line'];
const data1 = XLSX.utils.sheet_to_json(ws1, { header: 1, defval: '' });
const headers = data1[1];

console.log('\n\n=== BASE LINE FULL COLUMN HEADERS ===');
headers.forEach((h, i) => {
  if (h) console.log(`  [${i}] ${h}`);
});

// Count unique GPs and villages
const gpSet = new Set();
const villageSet = new Set();
data1.slice(2).forEach(row => {
  if (row[1]) gpSet.add(row[1]);
  if (row[2]) villageSet.add(row[2]);
});
console.log('\nUnique GPs:', [...gpSet].sort());
console.log('Unique Villages:', [...villageSet].sort());
console.log('Total farmer rows:', data1.length - 2);
