const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'src', 'data');
const factsheets = JSON.parse(fs.readFileSync(path.join(DATA, 'extracted_fact_sheets.json'), 'utf-8'));

const names = {
    'राम वचन': 'Ram Vachan', 'सगी राम': 'Sagi Ram',
    'कमला देवी': 'Kamla Devi', 'ख़ुशी राम': 'Khushi Ram',
    'ममता  देवी': 'Mamta Devi', 'सत्य प्रकाश': 'Satya Prakash',
    'अर्पणा': 'Arpana', 'पावन कुमार': 'Pavan Kumar',
    'बासमती': 'Basmati', 'राम सगीर': 'Ram Sagir',
    'शांति देवी': 'Shanti Devi', 'राजेश कुमार': 'Rajesh Kumar',
    'गीता देवी': 'Geeta Devi', 'कंचन': 'Kanchan',
    'कौशल्या': 'Kaushalya', 'महेश': 'Mahesh',
    'लालाराम': 'Lalaram', 'कुंवर': 'Kunwar',
    'राधेश्याम': 'Radheshyam', 'शिवचरण': 'Shivcharan',
    'jamuna': 'Jamuna', 'Harihar': 'Harihar',
    'द्वारिका प्रसाद': 'Dwarika Prasad', 'हीरा लाल': 'Hira Lal',
    'विशनी': 'Vishni', 'आत्माराम': 'Atmaram',
    'कल्लू': 'Kallu', 'तेजी': 'Teji',
    'राज कुमारी': 'Raj Kumari', 'भिखारी': 'Bhikhari',
};

for (const fs of factsheets) {
    if (fs.farmerName && names[fs.farmerName]) {
        fs.farmerNameEn = names[fs.farmerName];
        console.log(`  ${fs.farmerName} → ${fs.farmerNameEn}`);
    }
    if (fs.husbandName && names[fs.husbandName]) {
        fs.husbandNameEn = names[fs.husbandName];
    }
    if (fs.block && fs.block === 'Mihipurwa') fs.block = 'Mihinpurwa';
    if (fs.district && fs.district === 'Baharaich') fs.district = 'Bahraich';
    if (fs.state && fs.state === 'UP') fs.state = 'Uttar Pradesh';
}

fs.writeFileSync(path.join(DATA, 'extracted_fact_sheets.json'), JSON.stringify(factsheets, null, 2), 'utf-8');
console.log('\nDone.');