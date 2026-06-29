const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const baseDir = path.resolve(__dirname, '..');
const farmers = require('../src/data/farmers.json');

const wb1 = XLSX.readFile(path.join(baseDir, 'Base line Data1.xlsx'));
const baseLineWs = wb1.Sheets['Base Line'];
const baseLineRaw = XLSX.utils.sheet_to_json(baseLineWs, { header: 1, defval: '' });

// Row 1 is header. Data starts from row 2.
// Column 2: Name of Village
// Column 7: Name of Farmers

const baselineNames = new Set();
const baselineFarmers = [];
baseLineRaw.slice(2).forEach(row => {
    if (row[1]) { // If GP exists
        const village = String(row[2]).trim().toLowerCase();
        const name = String(row[7]).trim().toLowerCase();
        baselineNames.add(`${name}-${village}`);
        baselineFarmers.push({ name, village, category: String(row[15]).trim(), age: Number(row[10]), marital: String(row[11]).trim() });
    }
});

let matches = 0;
farmers.forEach(f => {
    const v = String(f.village).trim().toLowerCase();
    const n = String(f.name).trim().toLowerCase();
    if (baselineNames.has(`${n}-${v}`)) {
        matches++;
    } else {
        // try partial
        const partial = baselineFarmers.find(b => b.village === v && (b.name.includes(n) || n.includes(b.name)));
        if (partial) matches++;
    }
});

console.log(`Total active farmers: ${farmers.length}`);
console.log(`Total baseline records: ${baselineFarmers.length}`);
console.log(`Matches found: ${matches}`);
