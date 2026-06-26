const xlsx = require('xlsx');

const file = 'RF Template (5year) Ver.2.0 16th Aug.xlsx';
try {
  const wb = xlsx.readFile(file);
  const data = xlsx.utils.sheet_to_json(wb.Sheets['Outcome Indicators'], {header: 1}); 
  for(let i=0; i<data.length; i++) {
    if(data[i]) {
      const row = data[i].join(" | ");
      if (row.trim() !== '') {
         console.log(row.slice(0, 150)); // print first 150 chars of row
      }
    }
  }
} catch(e) {
  console.log(e);
}
