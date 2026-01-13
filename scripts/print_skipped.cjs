const fs = require('fs');
const list = require('./skipped_sites.json');

// We need to read the file carefully because 'type' command output was truncated in the view.
// Actually, I can just require the file in this script if I save the script in the same dir.
// But wait, the previous `run_command` created `skipped_sites.json`.
// Let's print the IDs and Names cleanly so I can use them in the next tool call agent-side.

list.forEach(s => {
    console.log(`ID: ${s.id} | NAME: ${s.nombre}`);
});
