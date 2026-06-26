const fs = require('fs');
const data = fs.readFileSync('Updated_Fasal Crop wise details_Update _2025.md', 'utf8');

let multiLayer = 0;
let interCrop = 0;
let leisa = 0;
let fruit = 0;

data.split('\n').forEach(line => {
    if (line.includes('|')) {
        if (line.includes('Multi Layer') || line.includes('Multi layer')) multiLayer++;
        if (line.includes('Inter Crop') || line.includes('Inter cropping') || line.includes('Mix Farming')) interCrop++;
        if (line.includes('LIESA') || line.includes('LEISA') || line.includes('Organic')) leisa++;
        if (line.includes('Fruit') || line.includes('Horticulture')) fruit++;
    }
});
console.log('Multi Layer:', multiLayer, 'Inter/Mix:', interCrop, 'LEISA/Organic:', leisa, 'Fruit:', fruit);
