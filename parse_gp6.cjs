const fs = require('fs');
const xlsx = require('xlsx');
const wb = xlsx.readFile('Updated_Fasal Crop wise details_Update _2025.xlsx');
const sheet = wb.Sheets['Crop details'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const gpStats = {};
// Rows start from 5 (index 5)
for(let i=5; i<data.length; i++) {
  const row = data[i];
  if (!row || row.length === 0 || !row[2]) continue;
  const gp = row[2].trim();
  
  // Find the last number in the row which seems to be the total
  let totalIncome = 0;
  for (let j = row.length - 1; j >= 0; j--) {
    if (typeof row[j] === 'number') {
      totalIncome = row[j];
      break;
    }
  }

  if (!gpStats[gp]) {
    gpStats[gp] = { farmers: 0, income: 0 };
  }
  gpStats[gp].farmers += 1;
  gpStats[gp].income += totalIncome;
}

console.log(gpStats);
let overallTotal = 0;
Object.values(gpStats).forEach(s => overallTotal += s.income);
console.log("Overall Total:", overallTotal);
