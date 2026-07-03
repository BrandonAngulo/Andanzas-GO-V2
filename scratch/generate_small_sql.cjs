const fs = require('fs');

const updates = [
  { name: "Museo Popular de Siloé", horario: "Abierto al público; se recomienda coordinar la visita o el recorrido (Ruta de Siloé) directamente con el museo (David Gómez / canal @siloécitytv).", precio: "Gratuita." },
  { name: "Edificio Otero", horario: "Edificio de uso comercial y de oficinas; se aprecia desde la Plaza de Cayzedo (sin visita turística interior).", direccion: "Calle 12 con Carrera 5ª, costado sur de la Plaza de Cayzedo, centro histórico." },
  { name: "Cali Teatro", horario: "Funciones según cartelera (habitualmente de jueves a domingo); atención administrativa L–V.", precio: "Boletería según función." },
  { name: "Teatro al Aire Libre Los Cristales", horario: "Abierto en días de evento (conciertos de Feria, festival Ajazzgo, cine); el parque superior es de acceso público." },
  { name: "Archivo Histórico de Cali", direccion: "Centro Cultural de Cali (Carrera 5 No. 6-05, barrio La Merced), 2.º piso, Sala 207." },
  { name: "Universidad del Valle (Ciudad Universitaria Meléndez)", horario: "Campus de acceso público en horarios de la institución; la Biblioteca Mario Carvajal y las zonas verdes se pueden recorrer según normas." },
  { name: "Ecoparque Lago de las Garzas", horario: "Martes a domingo, 8:00 a. m.–5:00 p. m. (lunes cerrado).", precio: "Entrada gratuita." },
  { name: "Plaza de Mercado Alameda", horario: "Abierta a diario; los días de plaza —con más surtido y ambiente— son martes, jueves y sábado, sobre todo en la mañana." },
  { name: "Domus Teatro", horario: "Funciones según cartelera (habitualmente fines de semana).", precio: "Boletería, con descuento para estudiantes." },
  { name: "Teatro La Concha", horario: "Funciones habitualmente viernes y sábado, 7:30 p. m.", precio: "Boletería según función." },
  { name: "Teatro del Presagio", horario: "Viernes y sábado 7:30 p. m.; temporada familiar los domingos 4:00 p. m.", precio: "Boletería según función." },
  { name: "Espacio T", horario: "Microteatro por temporadas, habitualmente de jueves a sábado, entre las 8:00 y las 11:00 p. m.", precio: "Boletería por función; consumos de comida y bebida aparte.", direccion: "Carrera 6 #4-80, barrio San Antonio." },
  { name: "Fundación AESCENA", horario: "Funciones y talleres según programación (habitualmente fines de semana).", precio: "Boletería según función; talleres con inscripción.", direccion: "Carrera 37A #5E-07, San Fernando / El Templete." },
  { name: "Teatro Casa Naranja", horario: "Funciones y talleres los sábados." },
  { name: "Instituto Popular de Cultura (IPC)", horario: "Según calendario académico.", precio: "Formación pública; programas con matrícula según la institución.", direccion: "Sede histórica en San Fernando (Calle 4 #27-140); nueva sede IUIPC en el Edificio Coltabaco (Calle 12 #1-12)." },
  { name: "Teatro Calima", horario: "Según programación de eventos.", precio: "Boletería según evento.", direccion: "Avenida Sexta (Calle 12 Nte #4-20)." },
  { name: "Teatro de Títeres Castillo Sol y Luna", horario: "Funciones los domingos; entre semana para colegios y grupos con reserva previa.", precio: "Entrada general aprox. $15.000; gratuita para los niños de la vereda." },
  { name: "Colectivo Teatral Infinito", horario: "Funciones y talleres según programación (fines de semana).", precio: "Boletería según función.", direccion: "Calle 5B #26-46, barrio San Fernando." },
  { name: "Cementerio Central de Cali", horario: "Jardines abiertos al público de lunes a domingo, 9:00 a. m.–4:00 p. m. (jornada continua).", precio: "Ingreso libre.", direccion: "Calle 30 con Carrera 1, centro-norte (Camposanto Metropolitano Central, Arquidiócesis de Cali)." }
];

const path = 'C:/Users/grues/.gemini/antigravity/brain/76153fe8-bf01-41c5-9da3-28bff63bb62b/supabase_sites_export.json';
const sites = JSON.parse(fs.readFileSync(path, 'utf8'));

const escape = (str) => {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
};

const sqls = [];
for (const update of updates) {
  const site = sites.find(s => s.nombre.toLowerCase() === update.name.toLowerCase());
  if (site) {
    let sets = [];
    if (update.horario) sets.push(`horario = ${escape(update.horario)}`);
    if (update.precio) sets.push(`tarifa = ${escape(update.precio)}`);
    if (update.direccion) sets.push(`direccion = ${escape(update.direccion)}`);
    if (sets.length > 0) {
      sqls.push(`UPDATE sites SET ${sets.join(', ')} WHERE id = ${escape(site.id)};`);
    }
  } else {
    console.log("NOT FOUND IN SITES: " + update.name);
  }
}

fs.writeFileSync('update_sites.sql', sqls.join('\n'));
console.log("SQL generated for " + sqls.length + " sites.");
