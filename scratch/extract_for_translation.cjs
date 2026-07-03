const fs = require('fs');

const sites = JSON.parse(fs.readFileSync('sites.json', 'utf8'));

const targetIds = [
  // Tanda 7 & 8
  's119', 's108', 's69', 's121', 's113', 's122', 's38', 's9', 's68', 's118', 's70', 's123', 's124', 's132', 's133', 's41', 's134', 's135', 's127',
  // Tanda 3 & 4
  's25', 's32', 's15', 's7', 's28', 's29', 's42', 's97', 's33', 's60', 's61', 's24',
  // Tanda 2
  's10', 's22', 's18', 's36', 's43', 's34', 's16', 's63', 's8', 's11', 's39', 's65', 's3', 's20'
];

const toTranslate = [];

for (const id of targetIds) {
  const site = sites.find(s => s.id === id);
  if (!site) continue;
  
  toTranslate.push({
    id: site.id,
    nombre: site.nombre,
    horario: site.horario,
    tarifa: site.precio || site.tarifa,
    datos_historicos: site.datosHistoricos,
    descripcion: site.descripcion,
    datos_curiosos: site.datosCuriosos
  });
}

fs.writeFileSync('scratch/to_translate.json', JSON.stringify(toTranslate, null, 2), 'utf8');
console.log(`Extracted ${toTranslate.length} sites for translation.`);
