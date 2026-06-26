const fs = require('fs');

const data = fs.readFileSync('FASAL MIS - Consolidated.md', 'utf8');

const lines = data.split('\n');

for (const line of lines) {
    if (line.includes('1.1.1 | AAS groups formed')) {
        console.log('AAS groups formed:', line);
    }
    if (line.includes('1.1.4 | Leadership Training Programs')) {
        console.log('Leadership Training:', line);
    }
    if (line.includes('Total Participation in direct training programs')) {
        console.log('Total Participation:', line);
    }
    if (line.includes('3.1 | No of CRP training programs')) {
        console.log('CRP Training Programs:', line);
    }
}
