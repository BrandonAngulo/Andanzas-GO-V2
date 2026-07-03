const fs = require('fs');

const updates = [
  // TANDA 3
  {
    name: "Museo de la Salsa",
    horario: "Lunes a sábado, recorridos guiados a las 11:00 a. m., 2:30 p. m. y 5:00 p. m.; domingos a las 3:00 p. m. (festivos cerrado).",
    precio: "$16.000 por persona (aporte cultural).",
    direccion: "Carrera 11B #24-44, barrio Obrero.",
    datosHistoricos: "Fundado en 1968 por Carlos Alfredo Molina; el museo de salsa más antiguo del mundo, con 40.000+ fotografías."
  },
  {
    name: "Instituto Departamental de Bellas Artes",
    horario: "Según programación; las salas de exposición y buena parte de los conciertos son de acceso libre, en horario institucional (lunes a viernes).",
    precio: "Programas académicos con matrícula; muchas exposiciones y conciertos de entrada libre."
  },
  {
    name: "Biblioteca Departamental",
    horario: "Lunes a viernes 9:00 a. m.–7:00 p. m.; sábados 9:00 a. m.–6:00 p. m.; domingos 10:00 a. m.–3:00 p. m.",
    precio: "Gratuito (todos los servicios básicos).",
    direccion: "Calle 5 #24A-91 (Manzana del Saber), centro."
  },
  {
    name: "La Topa Tolondra",
    horario: "Miércoles y jueves 6:00 p. m.–1:00 a. m.; viernes y sábado 6:00 p. m.–3:00 a. m.",
    precio: "Cover ~$10.000.",
    direccion: "Calle 5 #13-27.",
    datosHistoricos: "Abrió en 2011."
  },
  {
    name: "Zaperoco Bar",
    horario: "Noches, habitualmente de jueves a sábado (desde las 9:00–11:00 p. m.).",
    precio: "Cover / consumo según la noche.",
    direccion: "Avenida 5 Norte #16-46.",
    datosHistoricos: "Fundado en 1993."
  },
  {
    name: "Tin Tin Deo",
    horario: "Jueves a sábado, aprox. 8:00 p. m.–3:00 a. m. (jueves de salsa y bachata; viernes de taxi dancer; sábado de rumba caleña).",
    precio: "Cover según la noche (desde ~$5.000).",
    direccion: "Calle 5 #38-71, sur.",
    datosHistoricos: "Fundado en 1985."
  },
  
  // TANDA 4
  {
    name: "Teatro Esquina Latina",
    horario: "Obras para jóvenes y adultos: sábados 7:30 p. m.; funciones familiares: domingos 11:00 a. m. (con inscripción previa); conciertos: un viernes al mes, 7:30 p. m. (la programación varía; se consulta en redes).",
    precio: "Boletería según función (Sala Concertada).",
    direccion: "Calle 4 Oeste #35-30, barrio Tejares de San Fernando (junto al Parque de las Piedras).",
    datosHistoricos: "Fundado en 1973 por Orlando Cajamarca."
  },
  {
    name: "Delirio",
    horario: "El último viernes de cada mes (apertura de puertas 7:00 p. m.; inicio del show hacia las 9:30 p. m.); ediciones especiales en la Feria de Cali (diciembre). Ingreso solo para mayores de 18 años.",
    precio: "Boletería por zonas y localidades (compra anticipada por TuBoleta y canales oficiales).",
    direccion: "Carpa Delirio, Centro de Eventos Valle del Pacífico, Carrera 26 #12-328, vía Cali–Yumbo.",
    datosHistoricos: "La Fundación Delirio también opera el parque temático Paseo de la Aurora, sáb–dom 12:00 m.–8:00 p. m."
  },
  {
    name: "Tecnocentro Cultural Somos Pacífico",
    horario: "Lunes a sábado, 8:00 a. m.–5:00 p. m.",
    precio: "Programas de formación comunitaria, gratuitos o de bajo costo.",
    direccion: "Carrera 28B #121B-55, barrio Potrero Grande (comuna 21), oriente de Cali.",
    datosHistoricos: "Fundado en 2011."
  },
  {
    name: "El Peñón",
    horario: "Zona abierta; fuerte vida gastronómica y nocturna.",
    precio: "Libre (consumos aparte).",
    descripcion: "Uno de los barrios tradicionales de Cali, a orillas del río Cali, contiguo a San Antonio y al Museo La Tertulia; con los años se consolidó como zona bohemia, gastronómica y de anticuarios. En su entorno (Bulevar del Río) se realizan mercados de antigüedades y pulgas los fines de semana."
  },
  {
    name: "Barrio Granada",
    horario: "Zona abierta; fuerte movimiento nocturno.",
    precio: "Libre (consumos aparte).",
    descripcion: "Barrio residencial del norte de Cali, desarrollado a mediados del siglo XX, que con el tiempo se consolidó como uno de los principales epicentros gastronómicos y de vida nocturna de la ciudad."
  },
  {
    name: "Parque del Perro",
    horario: "Zona abierta; fuerte vida nocturna.",
    precio: "Libre (consumos aparte).",
    descripcion: "Parque tradicional del barrio San Fernando, cuyo nombre proviene de una escultura de un perro instalada en el lugar; con los años se transformó en una de las principales zonas de gastronomía y rumba de Cali."
  }
];

const path = 'sites.json';
const sites = JSON.parse(fs.readFileSync(path, 'utf8'));

const escape = (str) => {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
};

const sqls = [];
let matchCount = 0;

for (const update of updates) {
  let site = sites.find(s => s.nombre.toLowerCase().includes(update.name.toLowerCase()));
  if (!site && update.name === "El Peñón") {
    site = sites.find(s => s.nombre === "El Peñón");
  }
  if (!site && update.name === "Delirio") {
     // I know Delirio is s97 in supabase, but is it in sites.json?
     // If not, I will just generate SQL for it manually.
  }
  
  if (site) {
    if (update.horario) site.horario = update.horario;
    if (update.precio) site.precio = update.precio;
    if (update.direccion) site.direccion = update.direccion;
    if (update.datosHistoricos) {
      if (site.datosHistoricos) {
        if (!site.datosHistoricos.includes(update.datosHistoricos)) {
           site.datosHistoricos += " " + update.datosHistoricos;
        }
      } else {
        site.datosHistoricos = update.datosHistoricos;
      }
    }
    if (update.descripcion) {
       site.descripcion = update.descripcion;
    }
    
    let sets = [];
    if (update.horario) sets.push(`horario = ${escape(site.horario)}`);
    if (update.precio) sets.push(`tarifa = ${escape(site.precio)}`);
    if (update.direccion) sets.push(`direccion = ${escape(site.direccion)}`);
    if (update.datosHistoricos) sets.push(`datos_historicos = ${escape(site.datosHistoricos)}`);
    if (update.descripcion) sets.push(`descripcion = ${escape(site.descripcion)}`);
    
    if (sets.length > 0) {
      sqls.push(`UPDATE sites SET ${sets.join(', ')} WHERE id = ${escape(site.id)};`);
    }
    matchCount++;
  } else {
    // Generate manual SQL for Delirio (s97)
    if (update.name === 'Delirio') {
      let sets = [];
      if (update.horario) sets.push(`horario = ${escape(update.horario)}`);
      if (update.precio) sets.push(`tarifa = ${escape(update.precio)}`);
      if (update.direccion) sets.push(`direccion = ${escape(update.direccion)}`);
      // For Delirio, it might not have existing datosHistoricos locally so I will just set it
      if (update.datosHistoricos) sets.push(`datos_historicos = ${escape(update.datosHistoricos)}`);
      sqls.push(`UPDATE sites SET ${sets.join(', ')} WHERE id = 's97';`);
      matchCount++;
    } else {
      console.log("NOT FOUND: " + update.name);
    }
  }
}

fs.writeFileSync(path, JSON.stringify(sites, null, 2), 'utf8');
fs.writeFileSync('update_sites_t34.sql', sqls.join('\n'));
console.log(`Updated ${matchCount} sites. SQL generated in update_sites_t34.sql.`);
