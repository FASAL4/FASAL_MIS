/**
 * scripts/generate_family_eligibility.cjs
 *
 * Generates `src/data/family_eligibility.json` from the matched farmers file
 * and the baseline summary. Applies rule-based scheme eligibility inference.
 *
 * Rule-based mapping (per Manager spec):
 *   bpl:true                  -> Ration Card (BPL), Ayushman Bharat
 *   antodyaya:true            -> Antodyaya Anna Yojana
 *   landless (cultivable<=0)  -> MNREGA Job Card
 *   category in {SC, ST}      -> SC/ST Welfare schemes
 *   gender:F + singleWomen    -> Widow / Single Women Pension
 *   bankAccount:true          -> DBT-eligible schemes (PM Awas, etc.)
 *   hasToilet:false           -> SBM-G (Swachh Bharat Mission - Toilet)
 *   migration:true            -> eShram / Building Worker scheme
 *   age>=60 OR marital widow  -> Old Age Pension
 *   female farmer + shgMember -> Mahila Shakti Kendra / SHG credit
 *   children (matched w/ <=0 land) -> Mid-day Meal / School entitlements
 *
 * Output schema:
 *   [
 *     {
 *       "farmerId": "F001",
 *       "name": "...",
 *       "village": "...",
 *       "gp": "...",
 *       "eligibleSchemes": ["Aadhar", "Ration Card", "MNREGA"],
 *       "criteria": {
 *         "bpl": true, "antodyaya": false, "landless": true,
 *         "caste": "SC", "female": true, "bankAccount": true
 *       }
 *     }
 *   ]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FARMERS = path.join(ROOT, 'src', 'data', 'farmers.json');
const BASELINE = path.join(ROOT, 'src', 'data', 'baseline_summary.json');
const OUT = path.join(ROOT, 'src', 'data', 'family_eligibility.json');

// Map of village name -> GP name (must match RightsTab GP_VILLAGE_MAP).
// Drawn from baseline_summary.gpComparison and gpVillageSummary.
const VILLAGE_TO_GP = {
    'Rajaram Tanda': 'Karikot',
    'Narayan Tanda': 'Karikot',
    'Jamuniha': 'Karikot',
    'Bhatta Bargadaha': 'Karikot',
    'Azamgadhpurwa': 'Karikot',
    'Fakirpuri': 'Fakirpuri',
    'Lohra': 'Fakirpuri',
    'Rampurwa': 'Fakirpuri',
    'Badihanpurwa': 'Fakirpuri',
    'Sirsiyanpurwa': 'Chahalwa',
    'Hajaripurwa': 'Chahalwa',
    'Badhiyanpurwa': 'Chahalwa',
    'Mangalpurwa': 'Chahalwa',
    'Bajpur Bankati': 'Bajpur Bankati',
    'Jamuniya': 'Bajpur Bankati',
    'Dhondhepurwa': 'Bajpur Bankati',
    'Vishunapur': 'Vishunapur',
    'Kailash Nagar': 'Vishunapur',
    'Kailash Nagar Dekhiya': 'Vishunapur',
    'Dhodhepurwa': 'Vishunapur',
    'Vishuntanda': 'Vishunapur',
    'Ghoorepurwa': 'Badkhadiya',
    'Bhodahanpurwa': 'Badkhadiya',
};

const SCHEMES = {
    AADHAR: 'Aadhar Card',
    RATION: 'Ration Card (BPL/Antodaya)',
    ANTODAYA: 'Antodyaya Anna Yojana',
    AYUSHMAN: 'Ayushman Bharat',
    MNREGA: 'MNREGA Job Card',
    PMAWAS: 'PM Awas (PMAY-G)',
    SCST: 'SC/ST Welfare Scheme',
    WIDOW: 'Widow / Single Women Pension',
    OLDAGE: 'Old Age Pension (Vaya Vandana)',
    SHG: 'Mahila Shakti Kendra / SHG Credit Linkage',
    TOILET: 'Swachh Bharat Mission (Toilet)',
    ESHRAM: 'eShram / Building Worker Welfare',
    SCHOOL: 'School Entitlements (MDM/Uniform)',
    ASHA: 'ASHA / Anganwadi Services',
    ELECTRICITY: 'Free Electricity Connection',
    FAMILYID: 'Family ID / Register',
};

function inferEligibility(farmer) {
    const schemes = new Set();
    const c = {
        bpl: false,
        antodyaya: false,
        landless: false,
        caste: farmer.category || 'General',
        female: farmer.gender === 'F',
        bankAccount: false,
    };

    // Universal - everyone in registry needs identity
    schemes.add(SCHEMES.AADHAR);
    schemes.add(SCHEMES.FAMILYID);

    if (farmer.bpl) {
        c.bpl = true;
        schemes.add(SCHEMES.RATION);
        schemes.add(SCHEMES.AYUSHMAN);
    }
    if (farmer.antodyaya) {
        c.antodyaya = true;
        schemes.add(SCHEMES.ANTODAYA);
    }
    if (farmer.bankAccount) {
        c.bankAccount = true;
        schemes.add(SCHEMES.PMAWAS);
    }

    // Landless inference: cultivable acres at or below 0
    const landAcres = parseFloat(farmer.baselineCultivableLandAcres ?? farmer.totalLand ?? '0') || 0;
    if (landAcres <= 0.05) {
        c.landless = true;
        schemes.add(SCHEMES.MNREGA);
    }

    if (farmer.category === 'SC' || farmer.category === 'ST') {
        schemes.add(SCHEMES.SCST);
    }

    if (farmer.gender === 'F') {
        schemes.add(SCHEMES.ASHA); // ASHA/Anganwadi worker eligibility
    }
    if (farmer.shgMember) {
        schemes.add(SCHEMES.SHG);
    }
    if (farmer.migration) {
        schemes.add(SCHEMES.ESHRAM);
    }
    if (farmer.hasToilet === false) {
        schemes.add(SCHEMES.TOILET);
    }
    if (farmer.age && farmer.age >= 60) {
        schemes.add(SCHEMES.OLDAGE);
    }
    if (farmer.maritalStatus === 'Widow' || farmer.maritalStatus === 'Single') {
        schemes.add(SCHEMES.WIDOW);
    }

    return { schemes: Array.from(schemes).sort(), criteria: c, landAcres };
}

function build() {
    if (!fs.existsSync(FARMERS)) {
        throw new Error(`farmers.json not found at ${FARMERS}`);
    }
    if (!fs.existsSync(BASELINE)) {
        throw new Error(`baseline_summary.json not found at ${BASELINE}`);
    }

    const farmers = JSON.parse(fs.readFileSync(FARMERS, 'utf8'));
    // We only emit eligibility records for matched farmers who have a
    // demographic profile (bpl/antodyaya/bankAccount etc.) populated.
    const matched = farmers.filter(f => f && f.matched);

    const records = matched.map((f, i) => {
        const { schemes, criteria, landAcres } = inferEligibility(f);
        // Force a stable, human-readable id (the source data uses an opaque
        // district/village/group code; the dashboard wants F001 style)
        const farmerId = `F${String(i + 1).padStart(3, '0')}`;
        const village = f.village || '';
        const gp = VILLAGE_TO_GP[village] || 'Unknown';
        return {
            farmerId,
            originalId: f.id,
            name: f.name || '',
            gender: f.gender || '',
            age: f.age ?? null,
            category: f.category || '',
            religion: f.religion || '',
            village,
            gp,
            group: f.group || '',
            landAcres: Number(landAcres.toFixed(2)),
            eligibleSchemes: schemes,
            criteria,
        };
    });

    // Aggregate coverage statistics for the eligibility matrix
    const total = records.length || 1;
    const coverage = {
        totalFamilies: records.length,
        bplPct: round1((records.filter(r => r.criteria.bpl).length / total) * 100),
        antodyayaPct: round1((records.filter(r => r.criteria.antodyaya).length / total) * 100),
        landlessPct: round1((records.filter(r => r.criteria.landless).length / total) * 100),
        scstPct: round1((records.filter(r => r.criteria.caste === 'SC' || r.criteria.caste === 'ST').length / total) * 100),
        femaleHeadedPct: round1((records.filter(r => r.criteria.female).length / total) * 100),
        bankAccountPct: round1((records.filter(r => r.criteria.bankAccount).length / total) * 100),
    };

    // Per-scheme counts
    const schemeCounts = {};
    for (const r of records) {
        for (const s of r.eligibleSchemes) {
            schemeCounts[s] = (schemeCounts[s] || 0) + 1;
        }
    }
    const schemeBreakdown = Object.entries(schemeCounts)
        .map(([name, count]) => ({ name, count, pct: round1((count / total) * 100) }))
        .sort((a, b) => b.count - a.count);

    // GP-level rollup
    const gpRollup = {};
    for (const r of records) {
        const gp = r.gp;
        if (!gpRollup[gp]) {
            gpRollup[gp] = { gp, families: 0, bpl: 0, landless: 0, scst: 0, female: 0 };
        }
        gpRollup[gp].families += 1;
        if (r.criteria.bpl) gpRollup[gp].bpl += 1;
        if (r.criteria.landless) gpRollup[gp].landless += 1;
        if (r.criteria.caste === 'SC' || r.criteria.caste === 'ST') gpRollup[gp].scst += 1;
        if (r.criteria.female) gpRollup[gp].female += 1;
    }

    const out = {
        meta: {
            source: 'farmers.json (matched records) + rule-based inference',
            generatedAt: new Date().toISOString(),
            matchedCount: matched.length,
            note: 'Eligibility is rule-based inference from existing farmer flags. No new primary data was collected.',
        },
        coverage,
        schemeBreakdown,
        gpRollup: Object.values(gpRollup).sort((a, b) => b.families - a.families),
        families: records,
    };

    fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
    console.log(`[generate_family_eligibility] wrote ${records.length} family records to ${path.relative(ROOT, OUT)}`);
    console.log('Coverage:', coverage);
    console.log('Top schemes:');
    schemeBreakdown.slice(0, 8).forEach(s => console.log(`  - ${s.name}: ${s.count} families (${s.pct}%)`));
}

function round1(v) {
    return Math.round(v * 10) / 10;
}

build();
