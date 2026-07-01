const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// Fix line 1629 (0-indexed 1628): remove backtick
const backtickChar = String.fromCharCode(96);
if (lines[1628].includes(backtickChar)) {
    lines[1628] = lines[1628].split(backtickChar).join('');
    console.log('Removed backtick from line 1629:', lines[1628]);
}

// Find and remove the extra closing tags (</div> and )}) 
// that appear between the triangulation block and the audit tab
// Look for the pattern: empty lines followed by </div> and )}
for (let i = 1628; i < lines.length; i++) {
    if (lines[i].trim() === '</div>' && lines[i + 1] && lines[i + 1].trim() === ')}' && lines[i + 2] && lines[i + 2].includes('activeTab === "audit"')) {
        // Check if there are extra empty lines before this
        if (lines[i - 1].trim() === '' && lines[i - 2].trim() === '' && lines[i - 3].trim() === '') {
            // Remove the extra </div> and )} lines
            lines.splice(i, 2);
            console.log('Removed extra closing tags at line', i + 1);
            break;
        }
    }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('File saved with', lines.length, 'lines');