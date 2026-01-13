const fs = require('fs');
const sites = require('../sites.json');
sites.sort((a, b) => {
    const idA = parseInt(a.id.replace('s', ''));
    const idB = parseInt(b.id.replace('s', ''));
    return idA - idB;
});

let output = "| ID | Nombre | Latitud | Longitud |\n|---|---|---|---|\n";
sites.forEach(site => {
    output += `| ${site.id} | ${site.nombre} | ${site.lat} | ${site.lng} |\n`;
});

fs.writeFileSync('sites_list_utf8.md', output, 'utf8');
