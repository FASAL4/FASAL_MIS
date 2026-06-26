import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const files = [
  'Training data_FASAL MIS 2022-1.xlsx',
  'Training data_FASAL MIS 2023 (OLD)-1.xlsx',
  'Training data_FASAL MIS 2024,xlsx -1.xlsx',
  'Training data_FASAL MIS 2025-1.xlsx'
];

interface Farmer {
  id: string;
  name: string;
  gender: string;
  village: string;
  group: string;
  year: string;
  totalLand: string;
}

const farmersMap = new Map<string, Farmer>();

for (const file of files) {
  try {
    const wb = xlsx.readFile(file);
    const sheetName = wb.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });

    const yearMatch = file.match(/202\d/);
    const year = yearMatch ? yearMatch[0] : '';

    let headerRowIdx = -1;
    for (let i = 0; i < 10; i++) {
      if (data[i] && data[i].includes('Name of Farmer') || data[i] && data[i].includes('Farmer Code')) {
        headerRowIdx = i;
        break;
      }
    }

    if (headerRowIdx !== -1) {
      const headers = data[headerRowIdx] as string[];
      const codeIdx = headers.findIndex(h => h && h.toString().trim().includes('Farmer Code'));
      const nameIdx = headers.findIndex(h => h && h.toString().trim().includes('Name of Farmer'));
      const genderIdx = headers.findIndex(h => h && h.toString().trim().includes('Gender'));
      const villageIdx = headers.findIndex(h => h && h.toString().trim().includes('Revenue village') || h && h.toString().trim().includes('Village'));
      const groupIdx = headers.findIndex(h => h && h.toString().trim().includes('AAS Group Name'));

      for (let i = headerRowIdx + 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        const id = row[codeIdx]?.toString().trim();
        const name = row[nameIdx]?.toString().trim();
        let gender = row[genderIdx]?.toString().trim() || '';
        const village = row[villageIdx]?.toString().trim() || '';
        const group = row[groupIdx]?.toString().trim() || '';

        if (id && id.length > 2 && name) {
          if (gender.toUpperCase() === 'M' || gender.toLowerCase() === 'male') gender = 'M';
          else if (gender.toUpperCase() === 'F' || gender.toLowerCase() === 'female') gender = 'F';

          if (!farmersMap.has(id)) {
            farmersMap.set(id, {
              id, name, gender, village, group, year, totalLand: ''
            });
          } else {
             const existing = farmersMap.get(id)!;
             if (!existing.gender && gender) existing.gender = gender;
             if (!existing.year.includes(year)) existing.year += `, ${year}`;
          }
        }
      }
    }
  } catch (e) {
    console.error(`Error reading ${file}:`, e);
  }
}

const farmersList = Array.from(farmersMap.values());
fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'farmers.json'), JSON.stringify(farmersList, null, 2));
console.log(`Saved ${farmersList.length} unique farmers.`);

