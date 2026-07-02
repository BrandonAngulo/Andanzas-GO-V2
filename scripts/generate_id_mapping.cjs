const fs = require('fs');

const sitesToFix = [
  {"id":"89fe0741-f9c6-4a73-ab0b-4838b953190e","nombre":"Colegio de Santa Librada"},
  {"id":"428a313b-4463-48f3-ab38-2728e4e7a691","nombre":"Teatro La Concha"},
  {"id":"new_siloemuseo","nombre":"Museo Popular de Siloé"},
  {"id":"new_barrio_obrero","nombre":"Barrio Obrero"},
  {"id":"new_teatro_cristales","nombre":"Teatro al Aire Libre Los Cristales"},
  {"id":"new_univalle","nombre":"Universidad del Valle (Ciudad Universitaria Meléndez)"},
  {"id":"5573b365-19ad-42d0-a035-d8f098ec7da0","nombre":"Espacio T"},
  {"id":"9f41a840-80ef-427a-b842-e4fd037c4b96","nombre":"Fundación AESCENA"},
  {"id":"new_1768272722685_455","nombre":"Acuaparque de la Caña"},
  {"id":"new_1768272723371_563","nombre":"Orquideorama"},
  {"id":"d14b3cbe-a76c-4b65-a366-bd75a7aab976","nombre":"Cementerio Central de Cali"},
  {"id":"new_1768272724018_46","nombre":"La Estrella De Siloé"},
  {"id":"new_1768272722278_963","nombre":"Centro Campestre Comfandi Pance"},
  {"id":"b063363c-0345-4b3b-b659-5f35a75bc803","nombre":"Iglesia de San Antonio"},
  {"id":"new_1768272721586_95","nombre":"Centro Recreacional y Deportivo Club Cañasgordas Comfenalco Valle Delagente"},
  {"id":"68e25bcd-c347-4e2b-a834-dc52ab5e5e84","nombre":"Teatro Casa Naranja"},
  {"id":"2dbb7c30-5bf9-4b90-82b1-fbc970299543","nombre":"Instituto Popular de Cultura (IPC)"},
  {"id":"2027d6af-bb78-45da-b497-f7b3927a9647","nombre":"Teatro de Títeres Castillo Sol y Luna"},
  {"id":"65f7f8a8-9c90-446e-9ebf-f7685652cdda","nombre":"Colectivo Teatral Infinito"},
  {"id":"041fedd1-e5a1-4ac7-8af9-ca8a0e06251b","nombre":"Iglesia de San Nicolás"},
  {"id":"81802130-39db-4b11-97e9-21d0e8aa22c5","nombre":"Estadio Olímpico Pascual Guerrero"},
  {"id":"e1dc91df-788b-4323-9dc0-2be82f05c79d","nombre":"Coliseo El Pueblo"}
];

let nextId = 117;
const idMapping = {};
const sqlStatements = [];

for (const site of sitesToFix) {
    const newId = 's' + (nextId++);
    idMapping[site.id] = newId;
    sqlStatements.push(`UPDATE sites SET id = '${newId}' WHERE id = '${site.id}';`);
}

// Save the SQL and mapping to files
fs.writeFileSync('fix_ids_sql.sql', sqlStatements.join('\n'));
fs.writeFileSync('id_mapping.json', JSON.stringify(idMapping, null, 2));

console.log('Mapping generated for ' + sitesToFix.length + ' sites.');
