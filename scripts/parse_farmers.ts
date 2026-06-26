import * as fs from 'fs';
import * as path from 'path';

const files = [
  { name: 'Training data_FASAL MIS 2022.md', year: '2022' },
  { name: 'Training data_FASAL MIS 2023 (OLD).md', year: '2023' },
  { name: 'Training data_FASAL MIS 2024.xlsx .md', year: '2024' },
  { name: 'Training data_FASAL MIS 2025.md', year: '2025' }
];

const farmers = new Map();

files.forEach(f => {
  const filePath = path.join(process.cwd(), f.name);
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    lines.forEach(line => {
      // Matches lines starting with | number |
      const match = line.match(/^\|\s*\d+\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([MF]\s*)\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/);
      if (match) {
        let block = match[1].trim();
        let panchayat = match[2].trim();
        let village = match[3].trim();
        let group = match[4].trim();
        let name = match[5].trim();
        let gender = match[6].trim() === 'M' ? 'M' : (match[6].trim() === 'F' ? 'F' : 'Other');
        let farmerId = match[8].trim();

        if (farmerId && farmerId.startsWith('NaN') === false) {
           if (!farmers.has(farmerId)) {
             farmers.set(farmerId, {
               id: farmerId,
               name: name,
               gender: gender,
               village: village,
               panchayat: panchayat,
               group: group,
               years: [f.year]
             });
           } else {
             const existing = farmers.get(farmerId);
             if (!existing.years.includes(f.year)) {
               existing.years.push(f.year);
             }
           }
        }
      }
    });
  }
});

const farmersList = Array.from(farmers.values()).map(f => {
  f.years.sort();
  f.year = f.years.length > 1 ? `${f.years[0]}-${f.years[f.years.length - 1]}` : f.years[0];
  return f;
});

const outDir = path.join(process.cwd(), 'src', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'farmers.json'), JSON.stringify(farmersList, null, 2));
console.log(`Extracted ${farmersList.length} unique farmers.`);
