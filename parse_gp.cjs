import fs from 'fs';
import xlsx from 'xlsx';

const wb = xlsx.readFile('Updated_Fasal Crop wise details_Update _2025.xlsx');
let data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

console.log(Object.keys(data[1] || {}));
console.log(data[1]);
