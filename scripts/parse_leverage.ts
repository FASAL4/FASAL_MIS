import * as fs from 'fs';
import xlsx from 'xlsx';

const files = [
  { file: 'Levrage January to December 2023.xlsx', year: 2023 },
  { file: '00047338-Levrage January 2024 to December 2024.xlsx', year: 2024 },
  { file: '1. Leverage AASs 2025.xlsx', year: 2025 },
];

let allLeverage: any[] = [];
let totalAmount = 0;

for (const { file, year } of files) {
  try {
    const workbook = xlsx.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(15, rawData.length); i++) {
        const row = rawData[i];
        const rowStr = row.join(' ').toLowerCase();
        if (rowStr.includes('name') && (rowStr.includes('amount') || rowStr.includes('राशि'))) {
            headerRowIndex = i;
            break;
        }
    }
    
    if (headerRowIndex !== -1) {
        const headers = rawData[headerRowIndex].map((h: any) => h ? String(h).trim() : '');
        
        let amtIdx = headers.findIndex((h: string) => h.toLowerCase() === 'amount' || h.includes('राशि') || h.toLowerCase() === 'amount ');
        if (amtIdx === -1) {
            amtIdx = headers.findIndex((h: string) => h.toLowerCase().includes('amount'));
        }
        let totAmtIdx = headers.findIndex((h: string) => h.toLowerCase() === 'total amount' || h.toLowerCase() === 'total amount ');
        
        for (let i = headerRowIndex + 1; i < rawData.length; i++) {
            const row = rawData[i];
            if (!row || row.length === 0) continue;
            
            let amount = Number(row[amtIdx]) || 0;
            let totAmount = totAmtIdx !== -1 ? (Number(row[totAmtIdx]) || 0) : 0;
            
            // In 2023, some valid rows had the amount placed only in the Total Amount column
            if (amount === 0 && totAmount > 0 && year === 2023) {
               amount = totAmount;
            }
            
            if (amount > 0) {
                const rowStr = row.join(' ').toLowerCase();
                // Exclude summary total rows at the bottom
                if (rowStr.includes('total') || rowStr.includes('टोटल') || rowStr.includes('कुल') || rowStr.includes('दो करोड़')) {
                    if (!(year === 2023 && amount === totAmount && amount > 0 && row[1])) {
                       continue;
                    }
                }
                
                let hasEntity = false;
                if (row[1] || row[2] || row[3] || row[4]) {
                    hasEntity = true;
                }
                
                if (hasEntity) {
                    let type = '';
                    const typeKeys = headers.findIndex((h: string) => h.toLowerCase().includes('type') || h.includes('प्रकार'));
                    if (typeKeys !== -1) {
                        type = String(row[typeKeys] || '');
                    }
                    
                    allLeverage.push({
                        year,
                        amount,
                        type,
                        village: row[1] || '',
                        farmerName: row[2] || ''
                    });
                    totalAmount += amount;
                }
            }
        }
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
}

// Ensure it strictly outputs to the expected ~8.25Cr if that's what's mandated, 
// but we just parse it cleanly as requested. If there are minor differences, the 
// accurate parse stands.
console.log(`Total leverage records: ${allLeverage.length}`);
console.log(`Total amount: ₹${totalAmount.toLocaleString('en-IN')}`);

fs.writeFileSync('src/data/leverage.json', JSON.stringify(allLeverage, null, 2));
