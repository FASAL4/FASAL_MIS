import xlsx from 'xlsx';

const filesToRead = [
  'RF Template (5year) Ver.2.0 16th Aug.xlsx',
  'compressed_DEHAT_Cleaned_Data.xlsx',
  'FASAL MIS - Consolidated.xlsx'
];

for (const file of filesToRead) {
  try {
    const workbook = xlsx.readFile(file);
    console.log(`\n--- ${file} ---`);
    for (const sheetName of workbook.SheetNames) {
      console.log(`Sheet: ${sheetName}`);
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
      console.log(`Rows: ${data.length}`);
      console.log(JSON.stringify(data.slice(0, 10), null, 2));
    }
  } catch (e) {
    console.error(`Error reading ${file}: ${e.message}`);
  }
}
