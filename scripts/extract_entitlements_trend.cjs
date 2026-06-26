const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('compressed_DEHAT_Cleaned_Data.xlsx');
const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

const keys = [
  "Aadhar card", "Ration Card", "MNREGA job card", "mid-day meal/school food", 
  "family register", "labor card", "vaccination", "PAN card", "community toilet", 
  "private toilet", "school toilet", "Drain", "water tank", "sanitary pads",
  "widow pension", "old age pension"
];

const results = {};
const gpResults = {};

keys.forEach(k => {
  results[k] = {
    name: k,
    baseline2022: { advocated: 0, accessed: 0 },
    current2025: { advocated: 0, accessed: 0 }
  };
});

const periods2022 = ["first six months", "second six months"];
// Accumulate all periods up to sixth six months for "current" as per user prompt about cumulative 2022-2025
const periodsAll = ["first six months", "second six months", "third six months", "fourth six months", "fifth six months", "sixth six months"]; 

const headers = Object.keys(data[0] || {});

// Precompute header mappings
const headerMappings = {};
keys.forEach(k => {
  headerMappings[k] = {
    baseline2022: { adv: [], acc: [] },
    currentAll: { adv: [], acc: [] }
  };
  headers.forEach(h => {
    const hLow = h.toLowerCase();
    const kLow = k.toLowerCase();
    
    // Check 2022
    periods2022.forEach(p => {
      if (hLow.includes(`is leading done for ${kLow}`) && hLow.includes(p)) headerMappings[k].baseline2022.adv.push(h);
      if (hLow.includes(`did you received ${kLow}`) && hLow.includes(p)) headerMappings[k].baseline2022.acc.push(h);
    });
    // Check All (2022-2025)
    periodsAll.forEach(p => {
      if (hLow.includes(`is leading done for ${kLow}`) && hLow.includes(p)) headerMappings[k].currentAll.adv.push(h);
      if (hLow.includes(`did you received ${kLow}`) && hLow.includes(p)) headerMappings[k].currentAll.acc.push(h);
    });
  });
});

data.forEach(row => {
  let gp = row['Village Panchayat'] || row['village panchayat'] || 'Unknown';
  if (gp === 'Unknown' || gp.trim() === '') return;
  gp = gp.trim();
  
  if (!gpResults[gp]) {
    gpResults[gp] = {
      name: gp,
      totalHouseholds: 0,
      entitlements: {}
    };
    keys.forEach(k => {
      gpResults[gp].entitlements[k] = { advocated: 0, accessed: 0 };
    });
  }
  gpResults[gp].totalHouseholds++;

  keys.forEach(k => {
    const map = headerMappings[k];
    
    let baseAdv = false, baseAcc = false;
    map.baseline2022.adv.forEach(h => { if (row[h] && String(row[h]).toLowerCase() === 'yes') baseAdv = true; });
    map.baseline2022.acc.forEach(h => { if (row[h] && String(row[h]).toLowerCase() === 'yes') baseAcc = true; });
    
    if (baseAdv) results[k].baseline2022.advocated++;
    if (baseAcc) results[k].baseline2022.accessed++;
    
    let currAdv = false, currAcc = false;
    map.currentAll.adv.forEach(h => { if (row[h] && String(row[h]).toLowerCase() === 'yes') currAdv = true; });
    map.currentAll.acc.forEach(h => { if (row[h] && String(row[h]).toLowerCase() === 'yes') currAcc = true; });
    
    if (currAdv) {
       results[k].current2025.advocated++;
       gpResults[gp].entitlements[k].advocated++;
    }
    if (currAcc) {
       results[k].current2025.accessed++;
       gpResults[gp].entitlements[k].accessed++;
    }
  });
});

fs.writeFileSync('src/data/entitlements_trend.json', JSON.stringify({
  overall: Object.values(results),
  byGP: Object.values(gpResults).sort((a,b) => b.totalHouseholds - a.totalHouseholds)
}, null, 2));
console.log("Done extracting entitlement trends");
