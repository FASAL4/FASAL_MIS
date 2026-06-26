const xlsx = require('xlsx');

const file = 'Updated_Fasal Crop wise details_Update _2025.xlsx';
let allNames = new Set();
try {
  const wb = xlsx.readFile(file);
  const data = xlsx.utils.sheet_to_json(wb.Sheets['Crop details'], {range: 4}); 
  
  for(let r=0; r<data.length; r++) {
    let name = data[r]['Name of Farmer'];
    if(name && typeof name === 'string' && name.trim().length > 2) {
       allNames.add(name.trim().toLowerCase());
    }
  }
} catch(e) {
  console.log(e);
}
console.log("Total unique farmers in Crop wise details (Adopters): " + allNames.size);
