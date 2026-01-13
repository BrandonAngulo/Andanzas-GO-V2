const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../constants.ts');
const outputFile = path.join(__dirname, '../events_data.json');

const content = fs.readFileSync(inputFile, 'utf8');

// Find the start of EVENTOS
const startMarker = 'export const EVENTOS: Evento[] = [';
const startIndex = content.indexOf(startMarker);

if (startIndex !== -1) {
    let openBrackets = 0;
    let foundStart = false;
    let endIndex = -1;

    // Start scanning from the opening bracket of the array
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
        let eventsBlock = content.substring(arrayStartIndex, endIndex);

        // Evaluate the block to get the object
        // We need to ensure it's valid JS. 
        // EVENTOS in constants.ts seems to contain only string literals and basic types.
        // It does NOT appear to have external references like Component names (e.g. Megaphone).

        try {
            const eventsData = new Function(`return ${eventsBlock}`)();
            fs.writeFileSync(outputFile, JSON.stringify(eventsData, null, 2));
            console.log(`Successfully extracted ${eventsData.length} events to ${outputFile}`);
        } catch (e) {
            console.error("Error evaluating extracted block:", e);
            console.log("Block content preview:", eventsBlock.substring(0, 200));
        }
    } else {
        console.error('Could not find end of EVENTOS array');
    }
} else {
    console.error('Could not find EVENTOS start marker');
}
