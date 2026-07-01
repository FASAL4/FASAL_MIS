/**
 * Overwrite all testimonials with clean English translations
 * Each translation is based on reading the actual source .docx document
 */
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'src', 'data');

const factsheets = JSON.parse(fs.readFileSync(path.join(DATA, 'extracted_fact_sheets.json'), 'utf-8'));

const cleanTranslations = {
    'FACT SHEET ONION  2026 राम वचन राम पुरवा.docx': 'In less time and at low cost, I earned good profit from onion cultivation. We got enough onions for our household needs throughout the season.',
    'FACT SHEET Onion Kusuma Devi Fakirpuri.docx': 'I produced 50 kg of onions in my homestead garden, which made me very happy. Earlier we did not get seeds, so we used to buy vegetables from the market. Now with the organization\'s support, we get seeds on time, and we have fresh vegetables for our family.',
    'FACT SHEET Onion Mamta  Devi Badhiyanpurwa  2026.docx': 'I produced 55 kg of onions in my homestead garden. Earlier we did not get seeds, so we used to buy from the market. Now with the organization\'s support, we get timely seeds. No chemicals were used — this is completely organic and good for our health. Since our family income is limited, we could not afford to buy onions daily from the market, but now we have our own produce.',
    'FACT SHEET Tomato Arpana Ji.docx': 'With low cost on a small plot of land, I got very high profit. This is a profitable crop. After feeding the family for the entire season, I still earned a profit of ₹10,000, which is not possible with any other crop.',
    'FACT SHEET भिन्डी राम वचन राम पुरवा.docx': 'I grew early okra using plastic mulch netting. Although it required some investment, the crop started producing earlier than usual. When okra was selling at ₹120 per kg in the market, my crop had already started fruiting, so I got a much better price and higher returns.',
    'FACT SHEET मसूर  बासमती जी फ़क़ीरपूरी.docx': 'Without any input cost, this is the best crop. It does not require any fertilizer or chemicals, and needs very little irrigation. Growing lentils also strengthens the soil for the next crop.',
    'FACT SHEET शांति देवी.docx': 'I am Shanti Devi and my family of 6 members depends on farming for our livelihood. Earlier I did not grow vegetables, but for the past two years I have also been growing spice crops alongside vegetables, which has increased our income. I use organic inputs like Jeevamrit and Chaar Chatni, which saves the cost of buying harmful chemicals from the market. We now have vegetables and spices available at home, reducing our need to go to the market.',
    'FACT SHEET हल्दी For Geeta Devi _ Kanchan.docx': 'Turmeric cultivation gives four times more profit than traditional paddy-wheat farming. Therefore, turmeric is much more suitable for farmers like us.',
    'FACT SHEET हल्दी कौशल्या लोहरा.docx': 'Turmeric cultivation gives three to four times more profit than paddy-wheat farming. Therefore, turmeric is much more suitable for farmers.',
    'FACT SHEET हल्दी Formate.docx': '',
    'Factsheet of Bitter guard, Lalaram ji.docx': 'I grew bitter gourd this season using my own saved seeds, and got a good yield. I am very happy because I learned this method during a visit to Rajasthan. The technique was successful and I hope other farmers will also adopt this method.',
    'Factsheet of Onion and bitter guard,Geeta devi.docx': 'I am very happy. This season I grew bitter gourd and onions. Both the onion and bitter gourd gave good yields. I thank the DEHAT organization for their support.',
    'Factsheet of Onion, Radheshyam ji.docx': 'I planted the indigenous Jiraat variety of onions, which gave a good yield. This is completely organic, so I will grow more of this variety next season.',
    'जमुना जी फेक्टशीट.docx': 'I followed the method taught by DEHAT organization to grow turmeric, and as a result, my yield has doubled. I am very happy. I only used cow dung manure and Jeevamrit organic fertilizer. I urge all farmers to adopt this method.',
    'द्वारिका प्रसाद जी की फैक्ट शीट.docx': 'Cabbage cultivation is very suitable for the local climate and soil here. It does not require much fertilizer or water, and the heads form quickly. It is also very tasty to eat.',
    'फूलगोभी FACT Sheet.docx': 'Cauliflower gives three to four times more profit than paddy-wheat cultivation. Therefore cauliflower is much more suitable for farmers. No other crop can generate this much income from such a small plot. This is especially good for small landholder farmers.',
    'फैक्ट शीट कल्लू जी की.docx': 'I cultivated cauliflower on 10 biswa of land with the support of DEHAT organization. I sold cauliflower worth ₹17,500 at very low cost. Earlier I only grew wheat and paddy, which required a lot of hard work with very little savings. Now vegetable farming gives much higher profit, so I will definitely continue growing vegetables.',
    'राजकुमारी जी की हल्दी की फक्ट्शीट.docx': 'I followed the method taught by DEHAT to grow turmeric, and my yield has doubled. I am very happy. I only used cow dung manure and Jeevamrit. I urge all farmers to adopt this method.',
};

for (const fs of factsheets) {
    const file = fs.sourceFile;
    if (cleanTranslations[file] !== undefined) {
        fs.testimonialEn = cleanTranslations[file];
        console.log(`  ✓ ${file.substring(0, 50)}... → clean English`);
    } else if (fs.testimonial) {
        console.log(`  ? No translation for: ${file}`);
    }
}

fs.writeFileSync(path.join(DATA, 'extracted_fact_sheets.json'), JSON.stringify(factsheets, null, 2), 'utf-8');
console.log('\nDone. All testimonials now have clean English translations.');