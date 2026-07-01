/**
 * Phase 1 V2: Line-aware extraction of Fact Sheets and Case Studies
 * Fixes: field boundary bleeding, PDF parsing, correct farmer name extraction
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const FACT_SHEETS_DIR = path.join(__dirname, '..', 'Fact sheets with case studies');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

// Known field labels in order of appearance
const FIELD_LABELS = [
    'किसान का नाम', 'Farmer', 'Farmer  किसान का नाम',
    'पति का नाम', "Husband's पति का नाम", 'Husband',
    'आस', 'AAS- आस', 'AAS',
    'गाँव', 'Village गाँव', 'Village',
    'ब्लाक', 'Block ब्लाक', 'Block',
    'जिला', 'District जिला', 'District',
    'राज्य', 'State राज्य', 'State',
    'फसल', 'Crop फसल', 'Crop', 'Cropफसल',
    'प्रजाति', 'Variety प्रजाति', 'Variety',
    'रकवा', 'Area  रकवा', 'Area',
];

function cleanLine(text) {
    return text.replace(/[\r\t]/g, '').trim();
}

function extractFieldByLines(lines, labelPatterns) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const pat of labelPatterns) {
            if (line.includes(pat)) {
                // The value is typically on the same line after the label, or on the next line
                const afterLabel = line.split(pat).pop()?.trim();
                if (afterLabel && afterLabel.length > 0 && afterLabel.length < 80) {
                    return afterLabel;
                }
                // Check next line
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine && !FIELD_LABELS.some(fl => nextLine.includes(fl))) {
                        return nextLine;
                    }
                }
                break;
            }
        }
    }
    return null;
}

function parseDocxLines(filePath) {
    return mammoth.extractRawText({ path: filePath }).then(result => {
        return result.value.split('\n').map(cleanLine).filter(l => l.length > 0);
    });
}

async function parsePdfLines(filePath) {
    const { PDFParse } = require('pdf-parse');
    const buf = fs.readFileSync(filePath);
    const data = await PDFParse(buf);
    return data.text.split('\n').map(cleanLine).filter(l => l.length > 0);
}

function parseNumericVal(text) {
    if (!text) return null;
    const cleaned = text.replace(/[,₹\s]/g, '');
    const m = cleaned.match(/(\d+\.?\d*)/);
    return m ? parseFloat(m[1]) : null;
}

function parseAreaAcres(text) {
    if (!text) return null;
    const num = parseNumericVal(text);
    if (num === null) return null;
    const lower = text.toLowerCase();
    if (lower.includes('एकड़') || lower.includes('एकड') || lower.includes('acre')) return num;
    if (lower.includes('बीघा') || lower.includes('बिघा') || lower.includes('bigha')) return num * 0.2;
    if (lower.includes('बिसवा') || lower.includes('बिस्वा') || lower.includes('biswa')) return num * 0.01;
    if (lower.includes('बीसा')) return num * 0.01;
    // Default: assume bigha
    return num * 0.2;
}

function extractFactSheetData(filename, lines) {
    const data = {
        sourceFile: path.basename(filename),
        type: 'factsheet',
    };

    // Factsheet number
    const joined = lines.join(' ');
    const fsNumMatch = joined.match(/Factsheet Number\s*:?\s*No[.\s]*(\d+)/i);
    if (fsNumMatch) data.factsheetNumber = fsNumMatch[1];

    // Extract farmer profile fields
    data.farmerName = extractFieldByLines(lines, ['किसान का नाम', 'Farmer  किसान का नाम']);

    // Clean up farmer name - sometimes it bleeds with husband name
    if (data.farmerName) {
        // If it contains labels, truncate
        for (const label of ['पति का नाम', "Husband's", 'AAS', 'आस', 'Village', 'गाँव']) {
            const idx = data.farmerName.indexOf(label);
            if (idx > 0) {
                data.farmerName = data.farmerName.substring(0, idx).trim();
                break;
            }
        }
    }

    data.husbandName = extractFieldByLines(lines, ['पति का नाम', "Husband's पति का नाम", "Husband's"]);
    if (data.husbandName) {
        for (const label of ['AAS', 'आस', 'Village', 'गाँव', 'Block', 'ब्लाक']) {
            const idx = data.husbandName.indexOf(label);
            if (idx > 0) {
                data.husbandName = data.husbandName.substring(0, idx).trim();
                break;
            }
        }
    }

    data.aasGroup = extractFieldByLines(lines, ['आस', 'AAS- आस', 'AAS']);
    if (data.aasGroup) {
        for (const label of ['Village', 'गाँव', 'Block', 'ब्लाक']) {
            const idx = data.aasGroup.indexOf(label);
            if (idx > 0) {
                data.aasGroup = data.aasGroup.substring(0, idx).trim();
                break;
            }
        }
    }

    data.village = extractFieldByLines(lines, ['गाँव', 'Village गाँव', 'Village']);
    if (data.village) {
        for (const label of ['Block', 'ब्लाक', 'District', 'जिला']) {
            const idx = data.village.indexOf(label);
            if (idx > 0) {
                data.village = data.village.substring(0, idx).trim();
                break;
            }
        }
    }

    data.block = extractFieldByLines(lines, ['ब्लाक', 'Block ब्लाक', 'Block']);
    if (data.block) {
        for (const label of ['District', 'जिला', 'State', 'राज्य']) {
            const idx = data.block.indexOf(label);
            if (idx > 0) {
                data.block = data.block.substring(0, idx).trim();
                break;
            }
        }
    }

    data.district = extractFieldByLines(lines, ['जिला', 'District जिला', 'District']);
    if (data.district) {
        for (const label of ['State', 'राज्य']) {
            const idx = data.district.indexOf(label);
            if (idx > 0) {
                data.district = data.district.substring(0, idx).trim();
                break;
            }
        }
    }

    data.state = extractFieldByLines(lines, ['राज्य', 'State राज्य', 'State']);

    // Crop info
    data.crop = extractFieldByLines(lines, ['फसल', 'Crop फसल', 'Cropफसल', 'Crop']);
    if (data.crop) {
        for (const label of ['Variety', 'प्रजाति', 'Area', 'रकवा']) {
            const idx = data.crop.indexOf(label);
            if (idx > 0) {
                data.crop = data.crop.substring(0, idx).trim();
                break;
            }
        }
    }

    data.variety = extractFieldByLines(lines, ['प्रजाति', 'Variety प्रजाति', 'Variety']);
    if (data.variety) {
        for (const label of ['Area', 'रकवा']) {
            const idx = data.variety.indexOf(label);
            if (idx > 0) {
                data.variety = data.variety.substring(0, idx).trim();
                break;
            }
        }
    }

    // Area
    const areaRaw = extractFieldByLines(lines, ['रकवा', 'Area  रकवा', 'Area']);
    data.areaRaw = areaRaw;
    if (areaRaw) {
        for (const label of ['Date', 'बुआई', 'नर्सरी', 'Nursery', 'रोपाई']) {
            const idx = data.areaRaw.indexOf(label);
            if (idx > 0) {
                data.areaRaw = areaRaw.substring(0, idx).trim();
                break;
            }
        }
    }
    data.areaAcres = parseAreaAcres(data.areaRaw);

    // Dates
    data.dates = {};
    const fullText = lines.join(' ');
    const datePattern = /(\d{1,2}[./]\d{1,2}[./]\d{2,4})/g;
    const dates = [];
    let dm;
    while ((dm = datePattern.exec(fullText)) !== null) {
        dates.push(dm[1]);
    }

    // Map dates heuristically
    if (dates.length >= 1) {
        // Find nursery/sowing date
        for (let i = 0; i < lines.length; i++) {
            const l = lines[i];
            if (l.includes('नर्सरी') || l.includes('Nursery') || l.includes('बुआई') || l.includes('Plantation')) {
                const m = l.match(datePattern);
                if (m) data.dates.sowing = m[1];
                else if (i + 1 < lines.length && datePattern.test(lines[i + 1])) {
                    data.dates.sowing = lines[i + 1].match(datePattern)[1];
                }
                break;
            }
        }
        // Find transplant date
        for (let i = 0; i < lines.length; i++) {
            const l = lines[i];
            if (l.includes('रोपाई') && !l.includes(data.dates.sowing || '')) {
                const m = l.match(datePattern);
                if (m) data.dates.transplant = m[1];
                else if (i + 1 < lines.length && datePattern.test(lines[i + 1])) {
                    data.dates.transplant = lines[i + 1].match(datePattern)[1];
                }
                break;
            }
        }
        // Find harvest date
        for (let i = 0; i < lines.length; i++) {
            const l = lines[i];
            if (l.includes('खुदाई') || l.includes('तुराई') || l.includes('कटाई') || l.includes('excavation') || l.includes('Plucking')) {
                const m = l.match(datePattern);
                if (m) data.dates.harvest = m[1];
                else if (i + 1 < lines.length && datePattern.test(lines[i + 1])) {
                    data.dates.harvest = lines[i + 1].match(datePattern)[1];
                }
            }
        }
    }

    // Production
    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.includes('Total Production') || l.includes('कुल उत्पादन')) {
            const val = l.match(/(\d+\.?\d*)\s*(?:Q|क्वी|क्विं|कुंतल|क्विंटल|kg|किलो|कि)/i);
            if (val) {
                data.production = { quintals: parseFloat(val[1]) };
                if (l.includes('kg') || l.includes('किलो') || l.includes('कि०')) {
                    data.production.kg = parseFloat(val[1]);
                    data.production.quintals = data.production.kg / 100;
                }
            } else if (i + 1 < lines.length) {
                const nv = parseNumericVal(lines[i + 1]);
                if (nv !== null) {
                    data.production = { quintals: nv };
                    if (lines[i + 1].includes('kg') || lines[i + 1].includes('किलो')) {
                        data.production.kg = nv;
                        data.production.quintals = nv / 100;
                    }
                }
            }
            break;
        }
    }

    // Costs - find "Input Cost" section and parse following numeric lines
    data.costs = {};
    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.includes('Input Cost') || l.includes('लागत खर्च') || l.includes('Cost Benefit')) {
            // Scan subsequent lines for cost items
            for (let j = i; j < Math.min(i + 30, lines.length); j++) {
                const cl = lines[j];
                if (cl.includes('Total Input') || cl.includes('कुल लागत') || cl.includes('कुल उत्पादन') || cl.includes('Total income')) break;

                const num = parseNumericVal(cl);
                if (num === null) continue;

                if (cl.includes('Seed') || cl.includes('बीज')) data.costs.seed = num;
                else if (cl.includes('Land Rent') || cl.includes('भाड़ा') || cl.includes('भाड़ा')) data.costs.landRent = num;
                else if (cl.includes('preparation') || cl.includes('तैयारी')) data.costs.landPreparation = num;
                else if (cl.includes('fertilizer') || cl.includes('खाद') || cl.includes('गोबर') || cl.includes('कीटनाशक') || cl.includes('Fungicide')) data.costs.fertilizer = num;
                else if (cl.includes('Irrigation') || cl.includes('सिंचाई')) data.costs.irrigation = num;
                else if (cl.includes('Labour') || cl.includes('मजदुर') || cl.includes('मजदूरी') || cl.includes('मजदूर')) data.costs.labour = num;
                else if (cl.includes('मल्चिंग') || cl.includes('Mulching')) data.costs.mulching = num;
                else if (cl.includes('निकाई')) data.costs.weeding = num;
                else if (cl.includes('कतराइ')) data.costs.cutting = num;
                else if (cl.includes('ढुलाई') || cl.includes('transport')) data.costs.transport = num;
                else if (cl.includes('खुदाई') || cl.includes('excavation')) data.costs.harvesting = num;
            }
            break;
        }
    }

    // Total input cost
    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.includes('Total Input Cost') || l.includes('कुल लागत खर्च') || l.includes('कुल लागत')) {
            const num = parseNumericVal(l);
            if (num !== null) {
                data.costs.totalInput = num;
            } else if (i + 1 < lines.length) {
                const nv2 = parseNumericVal(lines[i + 1]);
                if (nv2 !== null) data.costs.totalInput = nv2;
            }
            break;
        }
    }

    // Income
    data.income = {};
    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.includes('Total income') || l.includes('कुल आय')) {
            const num = parseNumericVal(l);
            if (num !== null) {
                data.income.totalIncome = num;
            } else if (i + 1 < lines.length) {
                const val = lines[i + 1].replace(/,/g, '').replace(/\./g, '').match(/(\d+)/);
                if (val) data.income.totalIncome = parseInt(val[1]);
            }
            break;
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.includes('Net Profit') || l.includes('निव्वळ नफा') || l.includes('शुद्ध') || l.includes('शुद्ध लाभ')) {
            const num = parseNumericVal(l);
            if (num !== null) {
                data.income.netProfit = num;
            } else if (i + 1 < lines.length) {
                const val = parseNumericVal(lines[i + 1]);
                if (val !== null) data.income.netProfit = val;
            }
        }
    }

    // Testimonial
    for (let i = 0; i < lines.length; i++) {
        const l = lines[i].toLowerCase();
        if (l.includes('fdlku dk earo') || l.includes('किसान का मंतव्य') || l.includes('किसान का earo') || l.includes('किसान का विचार')) {
            // Take next several lines until Stage/फोटो/Inference
            let testimonial = '';
            for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
                if (lines[j].includes('Stage') || lines[j].includes('फोटो') || lines[j].includes('Inference')) break;
                testimonial += lines[j] + ' ';
            }
            data.testimonial = testimonial.trim();
            break;
        }
    }

    // Per-acre calculations
    if (data.areaAcres && data.income.netProfit) {
        data.netProfitPerAcre = Math.round(data.income.netProfit / data.areaAcres);
    }
    if (data.areaAcres && data.income.totalIncome) {
        data.incomePerAcre = Math.round(data.income.totalIncome / data.areaAcres);
    }

    return data;
}

function extractCaseStudyData(filename, lines) {
    const data = {
        sourceFile: path.basename(filename),
        type: 'casestudy',
    };

    const fullText = lines.join('\n');

    // Title
    data.title = lines[0] || null;

    // Author
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
        if (/राम नारायण|टीम लीडर|समुदाय समन्वयक|प्राकृतिक संसाधन|NRM/i.test(lines[i])) {
            data.author = lines[i];
            break;
        }
    }

    // Village
    for (const l of lines) {
        const vm = l.match(/(?:गाँव|गांव|ग्राम)\s*(?:के|में|है)?\s*([\u0900-\u097F]+(?:पुरवा|पुरी|टांडा|गढ़|पुर|नगर)[\u0900-\u097F\s]*)/);
        if (vm) {
            data.village = vm[1].trim();
            break;
        }
    }

    // GP
    for (const l of lines) {
        const gm = l.match(/(?:पंचायत)\s*(?:के|में|है|का)?\s*([\u0900-\u097F]+)/);
        if (gm) {
            data.gramPanchayat = gm[1].trim();
            break;
        }
    }

    // Themes
    const themes = [];
    if (/शराब|नशा|liquor|alcohol/i.test(fullText)) themes.push('social_issue_alcohol');
    if (/मनरेगा|MNREGA|जॉब कार्ड|job card/i.test(fullText)) themes.push('mnrega_corruption');
    if (/बिजली|electricity|बिल/i.test(fullText)) themes.push('advocacy_electricity');
    if (/पैरोकारी|वकालत|सामूहिक|collective|advocacy/i.test(fullText)) themes.push('collective_advocacy');
    if (/जैविक|organic|वैज्ञानिक|scientific/i.test(fullText)) themes.push('organic_farming');
    if (/विधवा|widow|एकल महिला/i.test(fullText)) themes.push('widow_vulnerability');
    if (/शिक्षा|पढ़ाई|school|education/i.test(fullText)) themes.push('education');
    if (/सब्जी|vegetable|फसल विविधीकरण|crop diversification/i.test(fullText)) themes.push('crop_diversification');
    if ((/आय|income|लाभ|profit|मुनाफा/i.test(fullText)) && (/बढ़|increase|improve/i.test(fullText))) themes.push('income_transformation');
    if (/पक्का मकान|मोटरसाइकिल|जमीन खरीद/i.test(fullText)) themes.push('asset_building');
    if (/शौचालय|toilet|खुले में|sanitation/i.test(fullText)) themes.push('sanitation');
    if (/महिला|women|gender|लड़की/i.test(fullText)) themes.push('women_empowerment');
    data.themes = themes;

    // Interventions
    const interventions = [];
    if (/देहात|DEHAT/i.test(fullText)) interventions.push('DEHAT_engagement');
    if (/प्रशिक्षण|training|ट्रेनिंग/i.test(fullText)) interventions.push('training');
    if (/कृषि मित्र|Krishi Mitra/i.test(fullText)) interventions.push('krishi_mitra');
    if (/फैलोशिप|fellowship/i.test(fullText)) interventions.push('fellowship_program');
    if (/बीज|seed/i.test(fullText)) interventions.push('seed_support');
    data.interventions = interventions;

    // Summary
    const bodyLines = lines.slice(1).filter(l => l.length > 30 && !l.includes('केस स्टडी') && !l.includes('केश स्टडी'));
    data.summary = bodyLines.slice(0, 3).join(' ').substring(0, 500);

    return data;
}

// ─── Main ──────────────────────────────────────────────────────────────

async function extractAll() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = fs.readdirSync(FACT_SHEETS_DIR);
    const factsheets = [];
    const casestudies = [];
    const errors = [];

    console.log(`\n📋 V2 Line-Aware Extraction - ${files.length} files\n`);

    for (const file of files) {
        const filePath = path.join(FACT_SHEETS_DIR, file);
        const ext = path.extname(file).toLowerCase();
        if (ext !== '.docx' && ext !== '.pdf') continue;

        const fname = path.basename(file);
        process.stdout.write(`  📄 ${fname.substring(0, 60)}... `);

        try {
            let lines;
            if (ext === '.docx') {
                lines = await parseDocxLines(filePath);
            } else {
                lines = await parsePdfLines(filePath);
            }

            if (!lines || lines.length < 3) {
                console.log(`❌ Too few lines (${lines?.length || 0})`);
                errors.push({ file, error: 'Too few lines extracted' });
                continue;
            }

            console.log(`${lines.length} lines`);
            const lowerFile = file.toLowerCase();
            const isFact = lowerFile.includes('fact') || lowerFile.includes('फैक्ट') || lowerFile.includes('फेक्टशीट') || lowerFile.includes('factsheet') || lowerFile.includes('फक्ट्शीट');
            const isCase = lowerFile.includes('case') || lowerFile.includes('केस') || lowerFile.includes('केश') || lowerFile.includes('कहानी');

            if (isFact && !isCase) {
                const data = extractFactSheetData(file, lines);
                factsheets.push(data);
                console.log(`     ✅ Factsheet: ${data.farmerName || '?'} | ${data.crop || '?'} | ${data.village || '?'}`);
            } else if (isCase && !isFact) {
                const data = extractCaseStudyData(file, lines);
                casestudies.push(data);
                console.log(`     ✅ CaseStudy: ${(data.title || '').substring(0, 50)} | ${data.village || '?'}`);
            } else {
                // Try fact sheet first
                const fsData = extractFactSheetData(file, lines);
                if (fsData.farmerName && fsData.crop) {
                    factsheets.push(fsData);
                    console.log(`     ✅ Factsheet(auto): ${fsData.farmerName} | ${fsData.crop}`);
                } else {
                    const csData = extractCaseStudyData(file, lines);
                    casestudies.push(csData);
                    console.log(`     ✅ CaseStudy(auto): ${(csData.title || '').substring(0, 50)}`);
                }
            }
        } catch (err) {
            console.log(`❌ ${err.message}`);
            errors.push({ file, error: err.message });
        }
    }

    // Write outputs
    fs.writeFileSync(path.join(OUTPUT_DIR, 'extracted_fact_sheets.json'), JSON.stringify(factsheets, null, 2), 'utf-8');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'extracted_case_studies.json'), JSON.stringify(casestudies, null, 2), 'utf-8');

    const summary = {
        extractedAt: new Date().toISOString(),
        version: 'v2-line-aware',
        totalFiles: files.length,
        factsheetsCount: factsheets.length,
        casestudiesCount: casestudies.length,
        errorsCount: errors.length,
        errors,
    };
    fs.writeFileSync(path.join(OUTPUT_DIR, 'extraction_summary.json'), JSON.stringify(summary, null, 2), 'utf-8');

    console.log(`\n📊 V2 EXTRACTION COMPLETE`);
    console.log(`   Fact Sheets: ${factsheets.length} | Case Studies: ${casestudies.length} | Errors: ${errors.length}\n`);
}

extractAll().catch(console.error);