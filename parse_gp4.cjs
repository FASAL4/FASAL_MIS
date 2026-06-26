const fs = require('fs');
const xlsx = require('xlsx');
const wb = xlsx.readFile('Updated_Fasal Crop wise details_Update _2025.xlsx');
console.log(wb.SheetNames);
