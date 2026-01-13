
const fs = require('fs');
const path = require('path');

const constantsPath = path.join(__dirname, '../constants.ts');
const content = fs.readFileSync(constantsPath, 'utf8');

const startMarker = 'export const SITES: Site[] =';
const endMarker = 'export const EVENTOS';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error("Start marker not found");
    process.exit(1);
}

const endIndex = content.indexOf(endMarker, startIndex);
if (endIndex === -1) {
    console.error("End marker not found");
    process.exit(1);
}

let block = content.substring(startIndex + startMarker.length, endIndex);
// block should be " [ ... ]; \n\n"

// Remove trailing semicolon and whitespace
block = block.trim();
if (block.endsWith(';')) {
    block = block.slice(0, -1);
}

// Remove comments safely: 
// 1. Matches line starts: ^\s*//
// 2. Matches " //" but NOT "://"
// Regex: (^|\s)\/\/.*$
// But "https://..." has "//". Preceded by ":".
// We want to match // that is NOT preceded by :
// JS regex lookbehind is supported in modern Node.
// (?<!:)//.*$
// We need 'm' flag for multiline to handle ^ correctly if we use it, but global replace works on string.
block = block.replace(/(?<!:)\/\/.*$/gm, '');

try {
    const sites = eval(block);
    if (!Array.isArray(sites)) {
        console.error("Evaluated result is not an array");
    } else {
        console.log(`Extracted ${sites.length} sites.`);
        fs.writeFileSync(path.join(__dirname, '../sites.json'), JSON.stringify(sites, null, 2));
        console.log("Written sites.json");
    }
} catch (e) {
    console.error("Eval error:", e);
    fs.writeFileSync(path.join(__dirname, '../debug_block.js'), block);
    console.log("Dumped block to debug_block.js");
}
