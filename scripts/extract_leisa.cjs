const xlsx = require('xlsx');

const files = [
  'Training data_FASAL MIS 2022.xlsx',
  'Training data_FASAL MIS 2023 (OLD).xlsx',
  'Training data_FASAL MIS 2024.xlsx .xlsx',
  'Training data_FASAL MIS 2025.xlsx'
];

let totalUnique = new Set();
let leisaAdopters = new Set();

files.forEach(file => {
  try {
    const wb = xlsx.readFile(file);
    const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {range: 3});
    data.forEach(row => {
      // Name of farmer is in different columns depending on the file, let's just check the values of the first 10 columns for a string that looks like a name
      let name = row['__EMPTY_5'] || row['Name of Farmer'] || row['Farmer Name'];
      if (!name && row['__EMPTY_6']) { name = row['__EMPTY_6']; } // Sometimes shifted
      
      // Let's just find the key that corresponds to 'Name of Farmer'
      // Actually {range: 3} means the keys are what was in row 3.
      // E.g. { '__EMPTY_5': 'Name of Farmer' } was row 3, so row 4 has the actual name under the key '__EMPTY_5'.
      
      if (typeof name === 'string' && name.length > 2 && !name.includes('Name of')) {
         totalUnique.add(name.trim().toLowerCase());
         
         // If they have any date under 'Multi layer farming', 'Mix Farming', 'Organic Pest management' or 'Scientific Turmeric & Ginger' or 'NRM LIESA'
         let hasLeisa = false;
         Object.keys(row).forEach(k => {
            const v = row[k];
            // Check if the column is a LEISA column OR the value is a date/marked.
            // Wait, the data rows will have dates in these columns.
            if (v && typeof v !== 'undefined') {
              // We just assume if they are in this file, they are a farmer receiving training.
              // Let's just add them to leisaAdopters if they have ANY training date.
            }
         });
      }
    });
  } catch(e) {
    console.error("Error reading " + file + ": " + e.message);
  }
});
console.log("Total unique farmers across Fasal MIS sheets (Row 4+): " + totalUnique.size);

// Let's do a more robust extraction by checking ALL files for unique names.
let allNames = new Set();
files.forEach(file => {
  try {
    const wb = xlsx.readFile(file);
    const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header: 1}); // Read as array of arrays
    // find the column index for "Name of Farmer" or "Farmer Name"
    let nameColIdx = -1;
    for(let r=0; r<10; r++) {
       if(!data[r]) continue;
       for(let c=0; c<data[r].length; c++) {
          let val = String(data[r][c] || '').toLowerCase();
          if(val.includes('name of farmer') || val.includes('farmer name')) {
             nameColIdx = c;
             break;
          }
       }
       if(nameColIdx !== -1) break;
    }
    
    if(nameColIdx !== -1) {
       for(let r=0; r<data.length; r++) {
          let val = data[r][nameColIdx];
          if(val && typeof val === 'string' && !val.toLowerCase().includes('name of')) {
             allNames.add(val.trim().toLowerCase());
          }
       }
    }
  } catch(e) {}
});

console.log("Robust total unique farmers across Fasal MIS sheets: " + allNames.size);
