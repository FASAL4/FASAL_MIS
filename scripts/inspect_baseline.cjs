const XLSX = require('xlsx');
const path = require('path');

function inspectWorkbook(filePath) {
  console.log('\n' + '='.repeat(70));
  console.log('FILE:', path.basename(filePath));
  console.log('='.repeat(70));
  
  const wb = XLSX.readFile(filePath);
  console.log('Sheets:', wb.SheetNames);
  
  wb.SheetNames.forEach(sheetName => {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
    
    console.log(`\n  Sheet: "${sheetName}" | Rows: ${data.length} | Cols: ${range.e.c + 1}`);
    
    // Print first 5 rows to understand structure
    console.log('  First 5 rows:');
    data.slice(0, 5).forEach((row, i) => {
      const trimmed = row.slice(0, 15).map(c => String(c).substring(0, 30));
      console.log(`    Row ${i}:`, JSON.stringify(trimmed));
    });
    
    // Print headers (row 0 or 1)
    if (data.length > 1) {
      console.log('\n  All column headers (row 0):');
      data[0].forEach((h, i) => {
        if (h !== '') console.log(`    Col ${i}: ${h}`);
      });
    }
  });
}

const baseDir = path.resolve(__dirname, '..');

try {
  inspectWorkbook(path.join(baseDir, 'Base line Data1.xlsx'));
} catch(e) {
  console.error('Error reading Base line Data1.xlsx:', e.message);
}

try {
  inspectWorkbook(path.join(baseDir, 'Baseline Findings NRM.xlsx'));
} catch(e) {
  console.error('Error reading Baseline Findings NRM.xlsx:', e.message);
}
