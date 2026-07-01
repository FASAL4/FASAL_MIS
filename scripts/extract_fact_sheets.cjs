/**
 * Phase 1: Systematic Extraction of all Fact Sheets and Case Studies
 * 
 * Reads all .docx/.pdf files from "Fact sheets with case studies" folder,
 * extracts structured data, and outputs JSON for triangulation.
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

const FACT_SHEETS_DIR = path.join(__dirname, '..', 'Fact sheets with case studies');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

// ─── Helpers ───────────────────────────────────────────────────────────

function cleanHindiText(text) {
    return text
        .replace(/[\r\n]+/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractField(text, hindiLabel, englishLabel = null) {
    // Try exact Hindi match first
    const patterns = [
        new RegExp(`${hindiLabel}\\s*[:\n]?\\s*\\n*\\s*(.+?)(?:\\n|$)`, 'i'),
        new RegExp(`${hindiLabel}\\s*\\n+\\s*(.+?)(?:\\n|$)`, 'i'),
    ];
    if (englishLabel) {
        patterns.push(new RegExp(`${englishLabel}\\s*[:\n]?\\s*\\n*\\s*(.+?)(?:\\n|$)`, 'i'));
    }

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[1].trim();
    }
    return null;
}

function extractNumberValue(text) {
    if (!text) return null;
    // Handle Hindi numbers in Devanagari
    const hindiToDigit = {
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    };
    let cleaned = text;
    for (const [h, d] of Object.entries(hindiToDigit)) {
        cleaned = cleaned.replace(new RegExp(h, 'g'), d);
    }

    // Extract numeric value
    const numMatch = cleaned.match(/([\d,.]+)/);
    if (numMatch) {
        const num = parseFloat(numMatch[1].replace(/,/g, ''));
        return isNaN(num) ? null : num;
    }
    return null;
}

function parseAreaToAcres(text) {
    if (!text) return null;
    const num = extractNumberValue(text);
    if (num === null) return null;

    const lower = text.toLowerCase();
    // Convert bigha/biswa to acres (approximate: 1 bigha ≈ 0.2 acres, 1 biswa ≈ 0.05 acres)
    if (lower.includes('बीघा') || lower.includes('बिघा') || lower.includes('bigha') || lower.includes('vigha')) {
        return num * 0.2;
    }
    if (lower.includes('बिसवा') || lower.includes('बिस्वा') || lower.includes('बिसवा') || lower.includes('biswa')) {
        return num * 0.01;
    }
    if (lower.includes('एकड़') || lower.includes('एकड') || lower.includes('acre') || lower.includes('ac')) {
        return num;
    }
    // Default: assume bigha if not specified
    return num * 0.2;
}

function parseCostLines(text) {
    const costs = {};

    // Seed cost
    const seedMatch = text.match(/(?:Seed|बीज)\s*[:\n]?\s*\n*\s*(\d+)/i);
    if (seedMatch) costs.seed = parseInt(seedMatch[1]);

    // Land rent
    const landMatch = text.match(/(?:Land Rent|जमीन का भाड़ा|जमीन का भाड़ा)\s*[:\n]?\s*\n*\s*(\d+)/i);
    if (landMatch) costs.landRent = parseInt(landMatch[1]);

    // Land preparation
    const prepMatch = text.match(/(?:land preparation|जमीन की तैयारी)\s*[:\n]?\s*\n*\s*(\d+)/i);
    if (prepMatch) costs.landPreparation = parseInt(prepMatch[1]);

    // Fertilizer / Cow dung
    const fertMatch = text.match(/(?:Cost of fertilizer|खाद और कीटनाशक|Cost of cow dung|गोबर)\s*[:\n]?\s*\n*\s*(\d+)/i);
    if (fertMatch) costs.fertilizer = parseInt(fertMatch[1]);

    // Irrigation
    const irrMatch = text.match(/(?:Cost of Irrigation|सिंचाई)\s*[:\n]?\s*\n*\s*(\d+)/i);
    if (irrMatch) costs.irrigation = parseInt(irrMatch[1]);

    // Labour
    const labourMatch = text.match(/(?:Cost of Labour|मजदुर|मजदूरी)\s*[:\n]?\s*\n*\s*(\d+)/i);
    if (labourMatch) costs.labour = parseInt(labourMatch[1]);

    // Total input cost
    const totalMatch = text.match(/(?:Total Input Cost|कुल लागत खर्च|कुल लागत)\s*[:\n]?\s*\n*\s*(\d+)/i);
    if (totalMatch) costs.totalInput = parseInt(totalMatch[1]);

    return costs;
}

function parseProduction(text) {
    const prod = {};

    // Total production in quintals
    const prodMatch = text.match(/(?:Total Production|कुल उत्पादन)\s*[:\n]?\s*\n*\s*(.+?)(?:\n|$)/i);
    if (prodMatch) {
        const val = prodMatch[1].trim();
        prod.raw = val;
        const num = extractNumberValue(val);
        if (num !== null) {
            // Check unit
            if (val.toLowerCase().includes('kg') || val.includes('किलो') || val.includes('कि०') || val.includes('क्वी०')) {
                prod.quintals = num / 100;
                prod.kg = num;
            } else {
                prod.quintals = num;
            }
        }
    }

    // Also try कुल उत्पादन क्विंटल में
    const prodQMatch = text.match(/(?:कुल उत्पादन क्विंटल में|क्विंटल में)\s*[:\n]?\s*\n*\s*(\d+)/i);
    if (prodQMatch) prod.quintals = parseInt(prodQMatch[1]);

    return prod;
}

function parseIncome(text) {
    const income = {};

    // Total income
    const incomeMatch = text.match(/(?:Total income in INR|कुल आय)\s*[:\n]?\s*\n*\s*(\d[\d,.]*)/i);
    if (incomeMatch) income.totalIncome = parseInt(incomeMatch[1].replace(/,/g, ''));

    // Net profit
    const netMatch = text.match(/(?:Net Profit|निव्वळ नफा|शुद्ध)\s*[:\n]?\s*\n*\s*(\d[\d,.]*)/i);
    if (netMatch) income.netProfit = parseInt(netMatch[1].replace(/,/g, ''));

    // CB Ratio
    const cbMatch = text.match(/(?:CB Ratio|सीबी अनुपात)\s*[:\n]?\s*\n*\s*([\d.]+)/i);
    if (cbMatch) income.cbRatio = parseFloat(cbMatch[1]);

    // Net Profit per Day
    const perDayMatch = text.match(/(?:Net Profit.*Per D|प्रति दिन)\s*[:\n]?\s*\n*\s*(\d+)/i);
    if (perDayMatch) income.netProfitPerDay = parseInt(perDayMatch[1]);

    return income;
}

function parseDates(text) {
    const dates = {};

    // Sowing/Nursery date
    const sowingMatch = text.match(/(?:Date of Plantation|बुआई\s*तिथि|नर्सरी बुआई की तिथि|नर्सरी तिथि|Date of Nursery)\s*[:\n]?\s*\n*\s*(\d{1,2}[./]\d{1,2}[./]\d{2,4})/i);
    if (sowingMatch) dates.sowing = sowingMatch[1];

    // Transplant date
    const transplantMatch = text.match(/(?:रोपाई की तिथि|Date of Plantation|रोपाई तिथि)\s*[:\n]?\s*\n*\s*(\d{1,2}[./]\d{1,2}[./]\d{2,4})/i);
    if (transplantMatch) dates.transplant = transplantMatch[1];

    // Harvest/excavation date
    const harvestMatch = text.match(/(?:Date of.*(?:excavation|Plucking|खुदाई|तुराई|कटाई)|खुदाई तिथि|फसल कटाई तिथि|अंतिम तुराई)\s*[:\n]?\s*\n*\s*(\d{1,2}[./]\d{1,2}[./]\d{2,4})/i);
    if (harvestMatch) dates.harvest = harvestMatch[1];

    // First plucking
    const firstPluckMatch = text.match(/(?:Date of First Plucking|प्रथम तुराई)\s*[:\n]?\s*\n*\s*(\d{1,2}[./]\d{1,2}[./]\d{2,4})/i);
    if (firstPluckMatch) dates.firstPlucking = firstPluckMatch[1];

    // Last plucking
    const lastPluckMatch = text.match(/(?:Date of Last Plucking|अंतिम तुराई)\s*[:\n]?\s*\n*\s*(\d{1,2}[./]\d{1,2}[./]\d{2,4})/i);
    if (lastPluckMatch) dates.lastPlucking = lastPluckMatch[1];

    return dates;
}

function extractDuration(text) {
    const durMatch = text.match(/(?:Crop Duration|फसल की अवधि|फसल कि अवधि)\s*[:\n(]?\s*\n*\s*(\d+)/i);
    return durMatch ? parseInt(durMatch[1]) : null;
}

function extractTestimonial(text) {
    // Look for fdlku dk earO; / किसान का मंतव्य
    const patterns = [
        /fdlku dk earO[य;]\s*(.+?)(?:\n\n|\n(?:Stage|फोटो|Inference|$))/is,
        /किसान का (?:मंतव्य|विचार|earO[य;])\s*(.+?)(?:\n\n|\n(?:Stage|फोटो|Inference|$))/is,
        /fdlku dk earO;\s*\n*(.+?)(?:\n\n|\n(?:Stage|फोटो|Inference|$))/is,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[1].trim();
    }
    return null;
}

// ─── Document Parsers ──────────────────────────────────────────────────

async function parseDocxFile(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return cleanHindiText(result.value);
}

async function parsePdfFile(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return cleanHindiText(data.text);
}

function classifyDocument(filename, text) {
    const lower = filename.toLowerCase();

    // Check for fact sheet indicators
    const isFactSheet = lower.includes('fact') ||
        lower.includes('फैक्ट') ||
        lower.includes('फेक्टशीट') ||
        lower.includes('factsheet') ||
        lower.includes('फैक्ट शीट') ||
        lower.includes('फक्ट्शीट') ||
        (text.includes('Cost Benefit Analysis') || text.includes('लागत खर्च')) ||
        (text.includes('Trial Profile') || text.includes('परीक्षण प्रोफ़ाइल'));

    // Check for case study indicators
    const isCaseStudy = lower.includes('case') ||
        lower.includes('केस') ||
        lower.includes('केश') ||
        lower.includes('कहानी') ||
        (text.includes('केस स्टडी') || text.includes('केश स्टडी') || text.includes('केस स्टडी'));

    if (isFactSheet && !isCaseStudy) return 'factsheet';
    if (isCaseStudy && !isFactSheet) return 'casestudy';
    if (isFactSheet && isCaseStudy) {
        // Check text content more carefully
        if (text.includes('Cost Benefit Analysis') || text.includes('Trial Profile')) return 'factsheet';
        return 'casestudy';
    }
    return 'unknown';
}

function extractFactSheetData(filename, text) {
    const data = {
        sourceFile: path.basename(filename),
        type: 'factsheet',
    };

    // Factsheet number
    const fsNumMatch = text.match(/Factsheet Number\s*[:\s]*No[.\s]*(\d+)/i);
    if (fsNumMatch) data.factsheetNumber = fsNumMatch[1];

    // Farmer info
    data.farmerName = extractField(text, 'किसान का नाम', 'Farmer');
    data.husbandName = extractField(text, 'पति का नाम', "Husband");
    data.aasGroup = extractField(text, 'आस', 'AAS');
    data.village = extractField(text, 'गाँव', 'Village');
    data.block = extractField(text, 'ब्लाक', 'Block');
    data.district = extractField(text, 'जिला', 'District');
    data.state = extractField(text, 'राज्य', 'State');

    // Crop info
    data.crop = extractField(text, 'फसल', 'Crop');
    data.variety = extractField(text, 'प्रजाति', 'Variety');

    // Area
    const areaRaw = extractField(text, 'रकवा', 'Area');
    data.areaRaw = areaRaw;
    data.areaAcres = parseAreaToAcres(areaRaw);

    // Dates
    data.dates = parseDates(text);

    // Duration
    data.cropDurationDays = extractDuration(text);

    // Production
    data.production = parseProduction(text);

    // Costs
    data.costs = parseCostLines(text);

    // Income
    data.income = parseIncome(text);

    // Testimonial
    data.testimonial = extractTestimonial(text);

    // Per-acre calculations if we have both
    if (data.areaAcres && data.income.netProfit) {
        data.netProfitPerAcre = Math.round(data.income.netProfit / data.areaAcres);
    }
    if (data.areaAcres && data.income.totalIncome) {
        data.incomePerAcre = Math.round(data.income.totalIncome / data.areaAcres);
    }

    return data;
}

function extractCaseStudyData(filename, text) {
    const data = {
        sourceFile: path.basename(filename),
        type: 'casestudy',
    };

    // Title (first meaningful line)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 10);
    data.title = lines[0] || null;

    // Author detection
    const authorPatterns = [
        /(?:राम नारायण|टीम लीडर|समुदाय समन्वयक|देहात)/,
        /(?:प्राकृतिक संसाधन प्रबंधन दल|NRM)/,
    ];
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
        for (const pat of authorPatterns) {
            if (pat.test(lines[i])) {
                data.author = lines[i];
                break;
            }
        }
        if (data.author) break;
    }

    // Village extraction
    const villagePatterns = [
        /(?:गाँव|गांव)\s*(?:के|में|है)?\s*([\u0900-\u097F]+(?:पुरवा|पुरी|टांडा|गढ़|पुर|कोट|गंज)[\u0900-\u097F\s]*)/,
        /(?:ग्राम|village)\s*[:\s]*([\u0900-\u097F\w\s]+)(?:में|पर|के|है|।)/,
    ];
    for (const pat of villagePatterns) {
        const match = text.match(pat);
        if (match) {
            data.village = match[1].trim();
            break;
        }
    }

    // GP extraction
    const gpMatch = text.match(/(?:पंचायत|Gram Panchayat)\s*(?:के|में|है|का)?\s*([\u0900-\u097F\w]+)(?:।|में|पंचायत|के|है)/);
    if (gpMatch) data.gramPanchayat = gpMatch[1].trim();

    // AAS group
    const aasMatch = text.match(/(?:आजीविका अधिकार संगठन|आस|AAS)\s*(?:का|के|में|है|।)?\s*([\u0900-\u097F\w\s]*?)(?:।|गठन|का|की|है|द्वारा)/);
    if (aasMatch) data.aasGroup = aasMatch[1].trim();

    // Theme classification
    const themes = [];
    if (/शराब|नशा|liquor|alcohol/i.test(text)) themes.push('social_issue_alcohol');
    if (/मनरेगा|MNREGA|जॉब कार्ड|job card/i.test(text)) themes.push('mnrega_corruption');
    if (/बिजली|electricity|बिल/i.test(text)) themes.push('advocacy_electricity');
    if (/पैरोकारी|वकालत|सामूहिक|collective|advocacy/i.test(text)) themes.push('collective_advocacy');
    if (/जैविक|organic|वैज्ञानिक|scientific/i.test(text)) themes.push('organic_farming');
    if (/विधवा|widow|एकल महिला/i.test(text)) themes.push('widow_vulnerability');
    if (/शिक्षा|पढ़ाई|school|education/i.test(text)) themes.push('education');
    if (/सब्जी|vegetable|फसल विविधीकरण|crop diversification/i.test(text)) themes.push('crop_diversification');
    if (/आय|income|लाभ|profit|मुनाफा/i.test(text) && /बढ़|increase|improve/i.test(text)) themes.push('income_transformation');
    if (/पक्का मकान|मोटरसाइकिल|जमीन खरीद/i.test(text)) themes.push('asset_building');
    if (/शौचालय|toilet|खुले में|sanitation/i.test(text)) themes.push('sanitation');
    if (/महिला|women|gender|लड़की/i.test(text)) themes.push('women_empowerment');
    data.themes = themes;

    // Extract financial figures mentioned
    const financialFigures = [];
    const moneyPatterns = [
        /(\d[\d,]*)\s*(?:रुपये|रुपया|रु\.|Rs\.|INR|₹)/g,
        /(?:रुपये|रु\.|₹)\s*(\d[\d,]*)/g,
        /(\d[\d,]*)\s*(?:हजार|लाख|करोड़)/g,
    ];
    for (const pat of moneyPatterns) {
        let m;
        while ((m = pat.exec(text)) !== null) {
            const val = parseInt(m[1].replace(/,/g, ''));
            if (val > 100 && !financialFigures.includes(val)) {
                financialFigures.push(val);
            }
        }
    }
    data.financialFigures = financialFigures.slice(0, 10); // Top 10

    // Extract land mentioned
    const landPatterns = [
        /(\d+[.]?\d*)\s*(?:एकड़|एकड|acre)/g,
        /(\d+)\s*(?:बीघा|बिघा|bigha)/g,
        /(\d+)\s*(?:बिसवा|biswa)/g,
    ];
    const landFigures = [];
    for (const pat of landPatterns) {
        let m;
        while ((m = pat.exec(text)) !== null) {
            landFigures.push(m[0].trim());
        }
    }
    data.landMentioned = [...new Set(landFigures)].slice(0, 5);

    // Extract people/family counts
    const familyMatch = text.match(/(\d+)\s*(?:सदस्य|लोग|members|व्यक्ति)/);
    if (familyMatch) data.familySize = parseInt(familyMatch[1]);

    // Extract programme interventions
    const interventions = [];
    if (/देहात|DEHAT/i.test(text)) interventions.push('DEHAT_engagement');
    if (/प्रशिक्षण|training|ट्रेनिंग/i.test(text)) interventions.push('training');
    if (/कृषि मित्र|Krishi Mitra/i.test(text)) interventions.push('krishi_mitra');
    if (/फैलोशिप|fellowship/i.test(text)) interventions.push('fellowship_program');
    if (/बीज|seed|बीज वितरण/i.test(text)) interventions.push('seed_support');
    data.interventions = interventions;

    // Summary (first 300 chars after title)
    const bodyStart = lines.findIndex((l, i) => i > 0 && l.length > 20 && !l.includes('केस स्टडी') && !l.includes('केश स्टडी'));
    if (bodyStart > 0) {
        data.summary = lines.slice(bodyStart, bodyStart + 5).join(' ').substring(0, 500);
    }

    return data;
}

// ─── Main Extraction ───────────────────────────────────────────────────

async function extractAll() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = fs.readdirSync(FACT_SHEETS_DIR);
    const factsheets = [];
    const casestudies = [];
    const errors = [];

    console.log(`\n🔍 Scanning ${files.length} files in "${FACT_SHEETS_DIR}"...\n`);

    for (const file of files) {
        const filePath = path.join(FACT_SHEETS_DIR, file);
        const ext = path.extname(file).toLowerCase();

        if (ext !== '.docx' && ext !== '.pdf') {
            console.log(`  ⏭️  Skipping non-docx/pdf: ${file}`);
            continue;
        }

        console.log(`  📄 Processing: ${file}`);

        try {
            let text;
            if (ext === '.docx') {
                text = await parseDocxFile(filePath);
            } else if (ext === '.pdf') {
                text = await parsePdfFile(filePath);
            }

            if (!text || text.length < 20) {
                console.log(`    ⚠️  No text extracted (${text ? text.length : 0} chars)`);
                errors.push({ file, error: 'No text extracted or too short' });
                continue;
            }

            console.log(`    📝 Extracted ${text.length} chars`);

            const docType = classifyDocument(file, text);
            console.log(`    🏷️  Classified as: ${docType}`);

            if (docType === 'factsheet') {
                const data = extractFactSheetData(file, text);
                factsheets.push(data);
                console.log(`    ✅ Farmer: ${data.farmerName || 'N/A'}, Crop: ${data.crop || 'N/A'}`);
            } else if (docType === 'casestudy') {
                const data = extractCaseStudyData(file, text);
                casestudies.push(data);
                console.log(`    ✅ Title: ${(data.title || 'N/A').substring(0, 60)}`);
                console.log(`       Themes: ${data.themes.join(', ') || 'N/A'}`);
            } else {
                console.log(`    ⚠️  Unknown document type - checking manually`);
                // Try as fact sheet first
                const fsData = extractFactSheetData(file, text);
                if (fsData.farmerName || fsData.crop) {
                    fsData.type = 'factsheet_auto';
                    factsheets.push(fsData);
                    console.log(`    ✅ Auto-classified as factsheet`);
                } else {
                    const csData = extractCaseStudyData(file, text);
                    csData.type = 'casestudy_auto';
                    casestudies.push(csData);
                    console.log(`    ✅ Auto-classified as casestudy`);
                }
            }
        } catch (err) {
            console.log(`    ❌ Error: ${err.message}`);
            errors.push({ file, error: err.message });
        }
    }

    // ─── Write Outputs ──────────────────────────────────────────────────

    // Fact sheets JSON
    const fsOutputPath = path.join(OUTPUT_DIR, 'extracted_fact_sheets.json');
    fs.writeFileSync(fsOutputPath, JSON.stringify(factsheets, null, 2), 'utf-8');

    // Case studies JSON
    const csOutputPath = path.join(OUTPUT_DIR, 'extracted_case_studies.json');
    fs.writeFileSync(csOutputPath, JSON.stringify(casestudies, null, 2), 'utf-8');

    // Summary report
    const summary = {
        extractedAt: new Date().toISOString(),
        totalFiles: files.length,
        factsheetsExtracted: factsheets.length,
        casestudiesExtracted: casestudies.length,
        errors: errors.length,
        errorDetails: errors,
        factsheetSummary: factsheets.map(f => ({
            file: f.sourceFile,
            farmer: f.farmerName,
            crop: f.crop,
            village: f.village,
            aas: f.aasGroup,
            areaAcres: f.areaAcres,
            netProfit: f.income?.netProfit,
            netProfitPerAcre: f.netProfitPerAcre,
        })),
        casestudySummary: casestudies.map(c => ({
            file: c.sourceFile,
            title: c.title?.substring(0, 80),
            village: c.village,
            themes: c.themes,
            interventions: c.interventions,
        })),
    };

    const summaryPath = path.join(OUTPUT_DIR, 'extraction_summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');

    console.log(`\n📊 EXTRACTION COMPLETE`);
    console.log(`   Fact Sheets: ${factsheets.length}`);
    console.log(`   Case Studies: ${casestudies.length}`);
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Output: ${OUTPUT_DIR}/`);
    console.log(`     - extracted_fact_sheets.json`);
    console.log(`     - extracted_case_studies.json`);
    console.log(`     - extraction_summary.json\n`);

    return { factsheets, casestudies, errors, summary };
}

extractAll().catch(console.error);