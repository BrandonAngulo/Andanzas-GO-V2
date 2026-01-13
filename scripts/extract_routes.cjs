const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../constants.ts');
const outputFile = path.join(__dirname, '../routes_data.json');

const content = fs.readFileSync(inputFile, 'utf8');

const startMarker = 'export const RUTAS_TEMATICAS: Ruta[] = [';
const startIndex = content.indexOf(startMarker);

if (startIndex !== -1) {
    let openBrackets = 0;
    let foundStart = false;
    let endIndex = -1;

    const arrayStartIndex = startIndex + startMarker.length - 1; // pointing to '['

    for (let i = arrayStartIndex; i < content.length; i++) {
        const char = content[i];

        if (char === '[') {
            openBrackets++;
            foundStart = true;
        } else if (char === ']') {
            openBrackets--;
        }

        if (foundStart && openBrackets === 0) {
            endIndex = i + 1;
            break;
        }
    }

    if (endIndex !== -1) {
        let block = content.substring(arrayStartIndex, endIndex);

        try {
            const data = new Function(`return ${block}`)();
            fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
            console.log(`Successfully extracted ${data.length} routes to ${outputFile}`);
        } catch (e) {
            console.error("Error evaluating extracted block:", e);
            console.log("Block content preview:", block.substring(0, 200));
        }
    } else {
        console.error('Could not find end of RUTAS_TEMATICAS array');
    }
} else {
    console.error('Could not find RUTAS_TEMATICAS start marker');
}
