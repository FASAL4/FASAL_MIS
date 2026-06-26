import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import * as stringSimilarity from 'fuzzball';

const farmersPath = path.join(process.cwd(), 'src', 'data', 'farmers.json');
const csvPath = path.join(process.cwd(), 'DEHAT_Cleaned_Data_with_Acres.csv');

let farmers = JSON.parse(fs.readFileSync(farmersPath, 'utf8'));

console.log(`Loaded ${farmers.length} farmers from registry.`);

const csvData: any[] = [];

fs.createReadStream(csvPath)
  .pipe(csvParser())
  .on('data', (data) => csvData.push(data))
  .on('end', () => {
    console.log(`Loaded ${csvData.length} records from CSV.`);
    
    let accurate = 0;
    let inaccurate = 0;
    let newlyFound = 0;
    let stillMissing = 0;

    farmers.forEach((f: any) => {
        const matches = csvData.filter(c => {
            const cName = (c['Name of the Farmers/AAS Members'] || '').trim().toLowerCase();
            const fName = (f.name || '').trim().toLowerCase();
            const cGroup = (c['AAS Name'] || '').trim().toLowerCase();
            const fGroup = (f.group || '').trim().toLowerCase();
            
            const nameMatch = stringSimilarity.ratio(cName, fName) > 85;
            const groupMatch = stringSimilarity.ratio(cGroup, fGroup) > 80 || cGroup.includes(fGroup) || fGroup.includes(cGroup);
            return nameMatch && groupMatch;
        });

        if (matches.length > 0) {
            const bestMatch = matches[0];
            const csvLand = parseFloat(bestMatch['Total_Land_(Acres)']);
            
            if (f.totalLand) {
                const currentLand = parseFloat(f.totalLand);
                if (!isNaN(csvLand) && Math.abs(csvLand - currentLand) < 0.1) {
                    accurate++;
                } else if (!isNaN(csvLand)) {
                    inaccurate++;
                    f.totalLand = csvLand.toFixed(2); // Overwrite with Acres data
                }
            } else {
                if (!isNaN(csvLand)) {
                    newlyFound++;
                    f.totalLand = csvLand.toFixed(2);
                } else {
                    stillMissing++;
                }
            }
        } else {
            if (!f.totalLand) {
                stillMissing++;
            }
        }
    });

    console.log(`--- TRIANGULATION RESULTS ---`);
    console.log(`Currently with land data: ${farmers.filter((f: any) => f.totalLand && parseFloat(f.totalLand) > 0).length}`);
    console.log(`Accurate against CSV: ${accurate}`);
    console.log(`Inaccurate/Mismatched: ${inaccurate}`);
    console.log(`Newly found for missing farmers: ${newlyFound}`);
    console.log(`Still missing: ${stillMissing}`);
    
    fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'farmers_updated.json'), JSON.stringify(farmers, null, 2));
    console.log(`Saved updated farmers list with newly found land data to farmers_updated.json`);
  });
