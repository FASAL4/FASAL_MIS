/**
 * scripts/generate_family_eligibility.cjs
 *
 * Generates `src/data/family_eligibility.json` from the matched farmers file
 * and BASELINE-ANCHORED scheme holding rates from the Baseline Report (Jaykar).
 *
 * Why baseline-anchored rates?
 * The source `farmers.json` has bpl:true AND apl:true AND antodyaya:true
 * AND mnrega:true AND eShram:true on EVERY matched record (1,638/1,638
 * in baseline_farmers.json, 600/600 in farmers.json). This is a data-quality
 * artefact, not a measured scheme-holding rate. The Baseline Report (Jaykar)
 * Section B gives the truthful holding rates:
 *   - BPL: 972/1504 = 64.6%
 *   - MGNREGA: 972/1504 = 64.6%
 *   - E-Shram: 1041/1504 = 69.2%
 *   - Kisan Samman Nidhi: 164/1504 = 10.9%
 *   - Antyodaya: 102/1504 = 6.8%
 *   - O/A Pension: 17/1504 = 1.1%
 *   - Widow Pension: 9/1504 = 0.6%
 *   - D-Pension: 0/1504 = 0%
 *   - Housing Scheme: 564/2060 = 27.4% (baseline_nrm.json)
 *   - Toilet coverage: 871/2060 = 42.3% (baseline_nrm.json) => no-toilet 57.7%
 *
 * For schemes with varying source flags (gender, caste, landlessness, age,
 * marital status, hasToilet, migration, bankAccount), we use the source flag
 * directly because the audit verified those vary correctly.
 *
 * For schemes with uniform-true source flags, we use the Baseline Report rate
 * with a deterministic seeded RNG (mulberry32) so the same input always
 * produces the same eligibility assignments.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FARMERS = path.join(ROOT, 'src', 'data', 'farmers.json');
const BASELINE_SUMMARY = path.join(ROOT, 'src', 'data', 'baseline_summary.json');
const OUT = path.join(ROOT, 'src', 'data', 'family_eligibility.json');

// Baseline-anchored scheme holding rates from Baseline Report (Jaykar) Section B
// and baseline_nrm.json. These are AUTHORITATIVE - the source data has
// uniform-true artefacts that must be corrected by these rates.
const BASELINE_RATES = {
    BPL_CARD: 0.646,           // 972/1504 Baseline Report
    ANTODAYA: 0.068,           // 102/1504 Baseline Report (subset of BPL)
    MNREGA: 0.646,             // 972/1504 Baseline Report
    ESHRAM: 0.692,             // 1041/1504 Baseline Report
    KISAN_SAMMAN: 0.109,       // 164/1504 Baseline Report
    PMAY_HOUSE: 0.274,         // 564/2060 baseline_nrm.json (housing scheme)
    OA_PENSION: 0.011,         // 17/1504 Baseline Report
    WIDOW_PENSION: 0.006,      // 9/1504 Baseline Report
    D_PENSION: 0.0,            // 0/1504 Baseline Report
};

// Deterministic seeded RNG (mulberry32) - same seed always produces same output
function mulberry32(seed) {
    return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// Map of village name -> GP name (matches RightsTab GP_VILLAGE_MAP)
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

// Scheme constants
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
    DPENSION: 'Disability Pension',
    SHG: 'Mahila Shakti Kendra / SHG Credit Linkage',
    TOILET: 'Swachh Bharat Mission (Toilet)',
    ESHRAM: 'eShram / Building Worker Welfare',
    ASHA: 'ASHA / Anganwadi Services',
    ELECTRICITY: 'Free Electricity Connection',
    FAMILYID: 'Family ID / Register',
};

/**
 * Derive per-family scheme eligibility.
 *
 * For schemes with VARYING source flags: use the flag directly.
 * For schemes with UNIFORM-TRUE source flags (BPL, Antodyaya, MGNREGA, E-Shram):
 *   use Baseline Report rate with deterministic seeded RNG.
 *
 * The RNG seed is derived from the farmer's index, so the same input
 * always produces the same eligibility assignments. This is reproducible.
 */
function inferEligibility(farmer, index) {
    const schemes = new Set();
    const criteria = {
        bpl: false,
        antodyaya: false,
        landless: false,
        caste: farmer.category || 'General',
        female: farmer.gender === 'F',
        bankAccount: false,
    };

    // Universal: every household needs identity
    schemes.add(SCHEMES.AADHAR);
    schemes.add(SCHEMES.FAMILYID);

    // Landless inference (source flag varies correctly)
    const landAcres = parseFloat(farmer.baselineCultivableLandAcres ?? farmer.totalLand ?? '0') || 0;
    if (landAcres <= 0.05) {
        criteria.landless = true;
        schemes.add(SCHEMES.MNREGA); // Landless -> MNREGA priority (deterministic flag)
    }

    // SC/ST - source varies correctly
    if (farmer.category === 'SC' || farmer.category === 'ST') {
        schemes.add(SCHEMES.SCST);
    }

    // Female -> ASHA / Anganwadi services eligibility (source varies)
    if (farmer.gender === 'F') {
        schemes.add(SCHEMES.ASHA);
    }

    // SHG member (source varies)
    if (farmer.shgMember) {
        schemes.add(SCHEMES.SHG);
    }

    // Migration -> eShram / Building Worker (source varies)
    if (farmer.migration) {
        schemes.add(SCHEMES.ESHRAM);
    }

    // No toilet -> SBM Toilet (source varies - 42.3% have toilet => 57.7% don't)
    if (farmer.hasToilet === false) {
        schemes.add(SCHEMES.TOILET);
    }

    // Bank account - source varies (but NOT used for PM Awas anymore)
    if (farmer.bankAccount) {
        criteria.bankAccount = true;
    }

    // Age >= 60 -> Old Age Pension (source varies)
    if (farmer.age && farmer.age >= 60) {
        schemes.add(SCHEMES.OLDAGE);
    }

    // Marital widow/single -> Widow Pension (source varies)
    if (farmer.maritalStatus === 'Widow' || farmer.maritalStatus === 'Single') {
        schemes.add(SCHEMES.WIDOW);
    }

    // ===== UNIFORM-TRUE FLAGS - USE BASELINE RATES =====

    // Seeded RNG based on farmer index for reproducibility
    const rng = mulberry32(index * 2654435761 + 1);

    // BPL Card holding - baseline rate 64.6%
    if (rng() < BASELINE_RATES.BPL_CARD) {
        criteria.bpl = true;
        schemes.add(SCHEMES.RATION);
        schemes.add(SCHEMES.AYUSHMAN);
    }

    // Antodyaya - baseline rate 6.8% (subset of BPL)
    if (criteria.bpl && rng() < BASELINE_RATES.ANTODAYA / BASELINE_RATES.BPL_CARD) {
        criteria.antodyaya = true;
        schemes.add(SCHEMES.ANTODAYA);
    }

    // MGNREGA - baseline rate 64.6% (but already added via landless; this covers non-landless BPL)
    if (!schemes.has(SCHEMES.MNREGA) && rng() < BASELINE_RATES.MNREGA) {
        schemes.add(SCHEMES.MNREGA);
    }

    // eShram - baseline rate 69.2% (but already added via migration; this covers non-migrant)
    if (!schemes.has(SCHEMES.ESHRAM) && rng() < BASELINE_RATES.ESHRAM) {
        schemes.add(SCHEMES.ESHRAM);
    }

    // PM Awas (PMAY-G) - baseline rate 27.4% (564/2060 from baseline_nrm.json)
    // Previously linked to bankAccount (98.8%) which was wrong.
    // PMAY-G is for houseless/kutcha-house families, not all bank account holders.
    if (rng() < BASELINE_RATES.PMAY_HOUSE) {
        schemes.add(SCHEMES.PMAWAS);
    }

    return { schemes: Array.from(schemes).sort(), criteria, landAcres };
}

function build() {
    if (!fs.existsSync(FARMERS)) {
        throw new Error(`farmers.json not found at ${FARMERS}`);
    }

    const farmers = JSON.parse(fs.readFileSync(FARMERS, 'utf8'));
    const matched = farmers.filter(f => f && f.matched);

    const records = matched.map((f, i) => {
        const { schemes, criteria, landAcres } = inferEligibility(f, i);
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

    // Coverage stats (re-derived from output)
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

    // GP rollup
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
            source: 'farmers.json (matched records) + Baseline Report (Jaykar) anchored rates',
            generatedAt: new Date().toISOString(),
            matchedCount: matched.length,
            methodology: 'Hybrid: source flags for varying data (gender, caste, land, age, marital, hasToilet, migration, bankAccount); Baseline Report rates (Section B) with deterministic seeded RNG for uniform-true flags (BPL, Antodyaya, MGNREGA, E-Shram).',
            baselineRatesSource: 'Baseline Report - Jaykar.md Section B; baseline_nrm.json',
            note: 'BPL 100% in source data is a data-quality artefact (bpl:true AND apl:true on every record). Replaced with Baseline Report rate (64.6%) using seeded RNG for reproducibility.',
        },
        coverage,
        schemeBreakdown,
        gpRollup: Object.values(gpRollup).sort((a, b) => b.families - a.families),
        families: records,
    };

    fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
    console.log(`[generate_family_eligibility] wrote ${records.length} family records to ${path.relative(ROOT, OUT)}`);
    console.log('Coverage (baseline-anchored):', coverage);
    console.log('\nTop schemes:');
    schemeBreakdown.slice(0, 8).forEach(s => console.log(`  - ${s.name}: ${s.count} families (${s.pct}%)`));
    console.log('\n=== Method comparison ===');
    console.log('Source bpl=true rate: 100% (data-quality artefact)');
    console.log('Baseline Report BPL card rate: 64.6% (972/1504)');
    console.log('Source antodyaya=true rate: 100% (data-quality artefact)');
    console.log('Baseline Report Antyodaya rate: 6.8% (102/1504)');
    console.log('Output now uses Baseline Report rates with deterministic seeded RNG.');
}

function round1(v) {
    return Math.round(v * 10) / 10;
}

build();
