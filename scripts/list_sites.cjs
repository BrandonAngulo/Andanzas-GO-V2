const sites = require('../sites.json');
sites.sort((a, b) => {
    // Sort numerically if IDs are like s1, s2, s10...
    const idA = parseInt(a.id.replace('s', ''));
    const idB = parseInt(b.id.replace('s', ''));
    return idA - idB;
});

console.log("| ID | Nombre | Latitud Actual | Longitud Actual |");
console.log("|---|---|---|---|");
sites.forEach(site => {
    console.log(`| ${site.id} | ${site.nombre} | ${site.lat} | ${site.lng} |`);
});
console.log(`\nTotal sites: ${sites.length}`);
