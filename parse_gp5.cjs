const fs = require('fs');
const xlsx = require('xlsx');
const wb = xlsx.readFile('Updated_Fasal Crop wise details_Update _2025.xlsx');
const sheet = wb.Sheets['Crop details'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
for(let i=0; i<10; i++) {
  console.log(data[i]);
}
