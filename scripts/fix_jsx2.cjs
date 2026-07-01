const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the extra </div>\n              )}\n that appears between the triangulation block and the audit tab
// The pattern is: </div> followed by empty lines, then </div> and )}
const pattern = '</div>\r\n\r\n\r\n                </div>\r\n              )}\r\n\r\n              {activeTab === "audit"';
const replacement = '</div>\r\n\r\n                </div>\r\n              )}\r\n\r\n              {activeTab === "audit"';

if (content.includes(pattern)) {
    content = content.replace(pattern, replacement);
    console.log('Fixed: removed extra closing tags');
} else {
    // Try without \r
    const pattern2 = '</div>\n\n\n                </div>\n              )}\n\n              {activeTab === "audit"';
    const replacement2 = '</div>\n\n                </div>\n              )}\n\n              {activeTab === "audit"';
    if (content.includes(pattern2)) {
        content = content.replace(pattern2, replacement2);
        console.log('Fixed: removed extra closing tags (no \\r)');
    } else {
        // Try mixed
        const pattern3 = '</div>\r\n\r\n\r\n                </div>\r\n              )}';
        const replacement3 = '</div>\r\n\r\n                </div>\r\n              )}';
        if (content.includes(pattern3)) {
            content = content.replace(pattern3, replacement3);
            console.log('Fixed: removed extra closing tags (pattern3)');
        } else {
            console.log('Pattern not found, trying line-by-line removal');
            let lines = content.split('\n');
            // Find the triangulation methodology end and remove extra tags
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('triangulated_insights.json') && i + 10 < lines.length) {
                    // Found the methodology note, now look for the extra </div> and )}
                    for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
                        if (lines[j].trim() === '</div>' && lines[j + 1] && lines[j + 1].trim() === ')}' &&
                            lines[j + 2] && lines[j + 2].trim() === '' &&
                            lines[j + 3] && lines[j + 3].includes('activeTab === "audit"')) {
                            // Check if there's already a </div> and )} before this (the correct ones)
                            if (lines[j - 1].trim() === '' && lines[j - 2].trim() === '' && lines[j - 3].trim() === '') {
                                lines.splice(j, 2);
                                console.log('Fixed: removed extra closing tags at line', j + 1);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            content = lines.join('\n');
        }
    }
}

fs.writeFileSync('src/App.tsx', content);
console.log('File saved');