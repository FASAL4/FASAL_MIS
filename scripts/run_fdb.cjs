const fs = require('fs');
const data = fs.readFileSync('FDB Booklet.md', 'utf8');
let nrmLeisa = 0;
let kitchenGarden = 0;
let multiLayer = 0;
let interCrop = 0;
let veg = 0;

data.split('\n').forEach(line => {
    if (line.includes('|')) {
        if (line.includes('NRM LIESA') || line.includes('LEISA')) nrmLeisa++;
        if (line.includes('Kitchen')) kitchenGarden++;
        if (line.includes('Multi layer')) multiLayer++;
        if (line.includes('Mix Farming') || line.includes('Inter')) interCrop++;
        if (line.includes('Vegetable') || line.includes('vegetable')) veg++;
    }
});
console.log('NRM LIESA:', nrmLeisa, 'Kitchen Garden:', kitchenGarden, 'Multi Layer:', multiLayer, 'Inter/Mix:', interCrop, 'Vegetable:', veg);
