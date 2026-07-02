const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const startMarker = '{"/* Triangulated Insights: Grant Reports vs Dashboard Data */}';
const actualStart = '{/* Triangulated Insights: Grant Reports vs Dashboard Data */}';

const startIdx = content.indexOf(actualStart);
if (startIdx === -1) {
    console.log('Start marker not found');
    process.exit(1);
}

// Find the end: we need to find the closing </div> of the triangulation block
// followed by the closing tags of the reports tab that come before the audit tab
// The pattern after the triangulation block is:
// </div>  (closes the triangulation container)
// </div>  (closes the max-w-4xl reports container)
// )}
// {activeTab === "audit"

// Find the next occurrence of {activeTab === "audit" after startIdx
const auditIdx = content.indexOf('{activeTab === "audit"', startIdx);
if (auditIdx === -1) {
    console.log('Audit tab marker not found');
    process.exit(1);
}

// Find the last </div> before auditIdx that closes the reports tab
// The structure: ...triangulation block...</div>\n\n                </div>\n              )}\n\n              {activeTab === "audit"
// We need to find the )} that comes right before {activeTab === "audit"

// Find the position of the )} that is closest to auditIdx
const searchStart = auditIdx - 200;
const searchEnd = auditIdx;
const snippet = content.substring(searchStart, searchEnd);
const closeParenIdx = snippet.lastIndexOf(')}');
const reportsTabCloseIdx = searchStart + closeParenIdx;

if (closeParenIdx === -1) {
    console.log('Could not find reports tab closing');
    process.exit(1);
}

// Now we want to keep everything from startIdx to reportsTabCloseIdx + 2 (the )})
// But actually we want to REMOVE from startIdx to reportsTabCloseIdx + 2
const removeEnd = reportsTabCloseIdx + 2;

const before = content.substring(0, startIdx);
const after = content.substring(removeEnd);

console.log('Removing from', startIdx, 'to', removeEnd);
console.log('Length removed:', removeEnd - startIdx);
console.log('Context before:', content.substring(startIdx - 20, startIdx));
console.log('Context after:', content.substring(removeEnd, removeEnd + 50));

fs.writeFileSync('src/App.tsx', before + after);
console.log('Done. New file size:', (before + after).length, 'chars');