const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../constants.ts');
const outputFile = path.join(__dirname, '../badges_data.json');

const content = fs.readFileSync(inputFile, 'utf8');

const startMarker = 'export const INSIGNIAS: Insignia[] = [';
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

        // Mock icons locally to extract their names strings
        const Heart = 'Heart';
        const PenTool = 'PenTool';
        const MapIcon = 'MapIcon';
        const Flag = 'Flag';
        // Add others if needed: Calendar, Compass, Megaphone (for notifications/feed but checking INSIGNIAS specifically)

        try {
            // Evaluator code
            const evalCode = `
                const Heart = 'Heart';
                const PenTool = 'PenTool';
                const MapIcon = 'MapIcon';
                const Flag = 'Flag';
                return ${block};
            `;
            const data = new Function(evalCode)();
            fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
            console.log(`Successfully extracted ${data.length} badges to ${outputFile}`);
        } catch (e) {
            console.error("Error evaluating extracted block:", e);
            console.log("Block content preview:", block.substring(0, 200));
        }
    } else {
        console.error('Could not find end of INSIGNIAS array');
    }
} else {
    console.error('Could not find INSIGNIAS start marker');
}
