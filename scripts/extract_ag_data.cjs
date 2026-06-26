const fs = require('fs');
const data = fs.readFileSync('FASAL MIS - Consolidated.md', 'utf8');

const lines = data.split('\n');
const practices = [
    '2.1 | Multi-layered vegetable farming',
    '2.2 | LIESA Practices',
    '2.3 | Inter cropping',
    '2.4 | Turmeric',
    '2.5 | Vegetable Cultivation',
    '2.6 | Ginger',
    '2.7 | Fruit - Horticulture Cultivation',
    '2.8 | Nutritional / Kitchen Garden'
];

for (const line of lines) {
    for (const practice of practices) {
        if (line.includes(practice)) {
            console.log(practice);
            console.log(line);
        }
    }
}
