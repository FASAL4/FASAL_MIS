const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'crop_economics.json');
const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

// 1. Merge Bhindi into Okra
if (data['Bhindi'] && data['Okra']) {
  console.log('Merging Bhindi into Okra...');
  for (const [year, stats] of Object.entries(data['Bhindi'])) {
    if (data['Okra'][year]) {
      // Aggregate if year already exists
      data['Okra'][year].cost = (data['Okra'][year].cost || 0) + (stats.cost || 0);
      data['Okra'][year].income = (data['Okra'][year].income || 0) + (stats.income || 0);
      data['Okra'][year].farmers = (data['Okra'][year].farmers || 0) + (stats.farmers || 0);
      if (stats.net !== undefined) {
        data['Okra'][year].net = (data['Okra'][year].net || 0) + (stats.net || 0);
      }
    } else {
      // Add year to Okra
      data['Okra'][year] = stats;
    }
  }
  delete data['Bhindi'];
} else if (data['Bhindi'] && !data['Okra']) {
  // If only Bhindi exists, rename it to Okra
  data['Okra'] = data['Bhindi'];
  delete data['Bhindi'];
}

// 2. Remove blank graphs (income and cost are 0) and specific requested crops
const cropsToRemove = ['Mix Cropping', 'Rajima seed (Kg)', 'Cumin', 'Fennel', 'Mixed Cropping'];
cropsToRemove.forEach(crop => {
  if (data[crop]) {
    console.log(`Removing crop: ${crop}`);
    delete data[crop];
  }
});

// Also dynamically check for any other crop where all years are 0 income and 0 cost
for (const [crop, years] of Object.entries(data)) {
  let totalIncome = 0;
  let totalCost = 0;
  for (const stats of Object.values(years)) {
    totalIncome += stats.income || 0;
    totalCost += stats.cost || 0;
  }
  if (totalIncome === 0 && totalCost === 0) {
    console.log(`Removing blank crop: ${crop}`);
    delete data[crop];
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
console.log('Data cleaning completed successfully.');
