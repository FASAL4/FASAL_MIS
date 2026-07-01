/**
 * Fix area parsing bugs and regenerate extracted_fact_sheets.json
 * Bug 1: 'एकड़' diacritic variant not matching 'एकड़' pattern
 * Bug 2: 'विसवा' variant not matching 'बिसवा' pattern
 * Bug 3: Bare numeric area "0.2" without unit label defaulting to bigha
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const factsheets = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'extracted_fact_sheets.json'), 'utf-8'));

function parseNumericVal(text) {
    if (!text) return null;
    const cleaned = text.replace(/[,₹\s]/g, '');
    const m = cleaned.match(/(\d+\.?\d*)/);
    return m ? parseFloat(m[1]) : null;
}

function correctedAreaToAcres(areaRaw) {
    if (!areaRaw) return null;
    const num = parseNumericVal(areaRaw);
    if (num === null) return null;

    const lower = areaRaw.toLowerCase();
    // Fix: Match ALL spelling variants of acre/bigha/biswa
    if (lower.includes('एकड़') || lower.includes('एकड़') || lower.includes('एकड') || lower.includes('acre')) {
        return num; // Direct acres
    }
    if (lower.includes('बीघा') || lower.includes('बिघा') || lower.includes('bigha') || lower.includes('vigha')) {
        return num * 0.2;
    }
    if (lower.includes('बिसवा') || lower.includes('बिस्वा') || lower.includes('बिसवा') || lower.includes('biswa') || lower.includes('विसवा') || lower.includes('बीसा')) {
        return num * 0.01;
    }
    // No unit label: check if reasonable as acres (< 5) or as bigha
    // If num > 5 it's likely bigha, if < 5 it's likely acres (marginal farmers)
    if (num > 5) return num * 0.2; // assume bigha
    return num; // assume acres
}

let changes = 0;
for (const fs of factsheets) {
    const oldAcres = fs.areaAcres;
    const newAcres = correctedAreaToAcres(fs.areaRaw);

    if (oldAcres !== newAcres) {
        console.log(`  Fixing ${fs.farmerName || '?'} (${fs.crop || '?'}): ${fs.areaRaw} → ${oldAcres} → ${newAcres} acres`);
        fs.areaAcres = newAcres;

        // Recalculate per-acre values
        if (newAcres && fs.income?.netProfit) {
            fs.netProfitPerAcre = Math.round(fs.income.netProfit / newAcres);
        } else {
            fs.netProfitPerAcre = null;
        }
        if (newAcres && fs.income?.totalIncome) {
            fs.incomePerAcre = Math.round(fs.income.totalIncome / newAcres);
        } else {
            fs.incomePerAcre = null;
        }
        changes++;
    }
}

console.log(`\nTotal corrections: ${changes} records`);

// Write corrected file
fs.writeFileSync(path.join(DATA_DIR, 'extracted_fact_sheets.json'), JSON.stringify(factsheets, null, 2), 'utf-8');
console.log('Written src/data/extracted_fact_sheets.json');

// Print corrected crop economics summary
console.log('\n--- Corrected Crop Economics ---');
const crops = {};
for (const fs of factsheets) {
    if (!fs.crop) continue;
    if (!crops[fs.crop]) crops[fs.crop] = [];
    crops[fs.crop].push(fs);
}
for (const [crop, sheets] of Object.entries(crops)) {
    const withProfit = sheets.filter(f => f.income?.netProfit && f.areaAcres && f.netProfitPerAcre);
    if (withProfit.length === 0) continue;
    const avgPerAcre = Math.round(withProfit.reduce((a, b) => a + b.netProfitPerAcre, 0) / withProfit.length);
    console.log(`  ${crop.padEnd(12)} ${String(sheets.length).padEnd(4)} sheets, avg ₹${avgPerAcre.toLocaleString('en-IN')}/acre (corrected)`);
}

// Also dump the micro-plots table (≤0.05 acres)
console.log('\n--- Micro-Plot Economics (≤0.05 acres, corrected) ---');
const smallPlots = factsheets.filter(f => f.areaAcres && f.areaAcres <= 0.05 && f.income?.netProfit);
for (const fs of smallPlots) {
    console.log(`  ${(fs.farmerName || '?').padEnd(15)} ${(fs.crop || '?').padEnd(12)} ${fs.areaAcres.toFixed(3).padEnd(8)} ₹${(fs.income.netProfit || 0).toString().padEnd(8)} ₹${(fs.netProfitPerAcre || 0).toLocaleString('en-IN')}/acre`);
}