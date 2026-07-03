const fs = require('fs');

const updates = [
  {
    name: "Museo del Oro Calima",
    horario: "Martes a viernes, 9:00 a. m.–5:00 p. m.; sábados, 10:00 a. m.–5:00 p. m. (cerrado domingos y lunes).",
    precio: "Entrada libre y gratuita.",
    direccion: "Carrera 7 #4-69, Área Cultural del Banco de la República, centro histórico (diagonal al Teatro Municipal).",
    datosHistoricos: "Inaugurado el 9 de mayo de 1991."
  },
  {
    name: "Teatro Jorge Isaacs",
    horario: "Abierto en días de función; taquilla y venta en línea según cartelera.",
    precio: "Boletería según evento.",
    direccion: "Carrera 3 #12-28, centro.",
    datosHistoricos: "Sala de 1.136 sillas en cuatro localidades."
  },
  {
    name: "Jardín Botánico de Cali",
    horario: "Jueves a domingo, 9:00 a. m.–3:00 p. m. (último ingreso hacia las 2:00 p. m.).",
    precio: "Adultos (13+) $17.000; niños (2–12) $15.000; combo con el Zoológico $40.000 / $30.000. Boletas en las taquillas del Zoológico o en TuBoleta.",
    direccion: "Oeste de Cali, sobre la cuenca del río Cali (contiguo al Zoológico de Cali), en terrenos de Celsia.",
    datosHistoricos: "Reabierto al público en septiembre de 2024; administrado por la Fundación Zoológico de Cali."
  },
  {
    name: "Hacienda El Paraíso",
    horario: "Martes a domingo y festivos, 9:30 a. m.–4:30 p. m. (cerrado el martes siguiente a un lunes festivo).",
    precio: "Adultos $18.000; niños $10.500; adultos mayores y PcD $9.000; extranjeros 10 USD (venta solo en taquilla).",
    direccion: "Corregimiento de Santa Elena, El Cerrito (Valle), a ~36 km de Cali.",
    datosHistoricos: "Casa museo administrada por INCIVA; BIC de la Nación."
  },
  {
    name: "La Linterna",
    horario: "Lunes a viernes, 9:00 a. m.–12:30 p. m. y 2:00–5:00 p. m.",
    precio: "Visita libre al taller-tienda (los carteles y productos se venden aparte).",
    direccion: "Carrera 5 #2-70, barrio San Antonio.",
    datosHistoricos: "Funciona desde 1934; en San Antonio desde 1987."
  },
  {
    name: "Museo Caliwood",
    horario: "Lunes a viernes, 8:00 a. m.–6:00 p. m.; sábados, 3:00–6:00 p. m.; domingos, 10:00 a. m.–6:00 p. m.",
    precio: "Entrada $20.000 (a modo de donación para su sostenimiento).",
    direccion: "Avenida Belalcázar (Carrera 2 Oeste) #5A-55, oeste de Cali (junto al Gato de Tejada y el Museo La Tertulia).",
    datosHistoricos: "Fundado el 22 de octubre de 2008 por Hugo Suárez Fiat."
  },
  {
    name: "Iglesia La Ermita",
    horario: "Abierta al público en horarios de culto (misas).",
    precio: "Entrada gratuita.",
    direccion: "Carrera 1ª con Calle 13, a orillas del río Cali.",
    datosHistoricos: "El templo neogótico actual se construyó en la primera mitad del siglo XX (décadas de 1930–1940), en reemplazo de la ermita colonial arruinada por los terremotos; su estilo se inspira en las catedrales góticas europeas.",
    datosCuriosos: ["Conserva la imagen colonial del Señor de la Caña (o Señor de los Milagros), sobreviviente de los sismos."]
  },
  {
    name: "Parque y Capilla de San Antonio",
    horario: "Colina y parque abiertos todo el día; la capilla abre en horarios de misa.",
    precio: "Gratuita.",
    datosHistoricos: "La capilla data de 1747 (construcción iniciada en 1746); es uno de los templos más antiguos de la ciudad (BIC)."
  },
  {
    name: "Parque del Gato de Tejada",
    horario: "Parque abierto todo el día.",
    precio: "Gratuita.",
    descripcion: "El Gato del Río, de Hernando Tejada, se instaló el 3 de julio de 1996; 'Las Gatas del Río' (esculturas intervenidas por distintos artistas) se sumaron en 2006."
  },
  {
    name: "Loma de la Cruz",
    horario: "Abierto a diario, con más ambiente en la tarde-noche.",
    precio: "Ingreso libre (las artesanías y la comida se pagan aparte).",
    descripcion: "Se consolidó como parque y mercado artesanal en las últimas décadas del siglo XX; es punto de referencia del comercio artesanal caleño."
  },
  {
    name: "Plaza de Cayzedo",
    horario: "Plaza pública, abierta.",
    precio: "Libre.",
    descripcion: "La antigua Plaza Mayor colonial (luego Plaza de la Constitución) fue rebautizada Plaza de Caycedo en 1813, en honor al prócer Joaquín de Caycedo y Cuero; el monumento central se erigió en 1913."
  },
  {
    name: "Cerro de las Tres Cruces",
    horario: "Se recomienda el ascenso de madrugada o en la mañana (por seguridad y clima); funciona como ecoparque (Bataclán).",
    precio: "Gratuita.",
    descripcion: "Según la tradición, se erigió una cruz en el cerro para 'conjurar' al diablo Buziraco; las tres cruces actuales, en concreto, datan de finales de los años treinta del siglo XX."
  },
  {
    name: "Bulevar del Río",
    horario: "Espacio público abierto.",
    precio: "Libre.",
    descripcion: "Inaugurado en 2013, tras peatonalizar el antiguo tramo de la Avenida Colombia a orillas del río Cali."
  },
  {
    name: "Ecoparque Río Pance",
    horario: "Abierto; zona de baño en el río y senderos (mayor afluencia los fines de semana).",
    precio: "Ingreso libre (algunos servicios y parqueaderos privados aparte).",
    descripcion: "El río Pance nace en el Parque Nacional Natural Farallones de Cali; su ribera se consolidó como zona de recreación y ecoparque de la ciudad."
  }
];

const path = 'sites.json';
const sites = JSON.parse(fs.readFileSync(path, 'utf8'));

const escape = (str) => {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
};

const escapeArray = (arr) => {
  if (!arr || arr.length === 0) return 'NULL';
  return "ARRAY[" + arr.map(a => escape(a)).join(", ") + "]::text[]";
};

const sqls = [];
let matchCount = 0;

for (const update of updates) {
  let site = sites.find(s => s.nombre.toLowerCase().includes(update.name.toLowerCase()));
  if (!site && update.name === "Parque y Capilla de San Antonio") {
    site = sites.find(s => s.nombre.includes("Capilla de San Antonio") || s.nombre.includes("Colina de San Antonio"));
  }
  if (!site && update.name === "Ecoparque Río Pance") {
    site = sites.find(s => s.nombre.includes("Pance"));
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
       if (site.descripcion) {
         if (!site.descripcion.includes(update.descripcion)) {
           site.descripcion += " " + update.descripcion;
         }
       } else {
         site.descripcion = update.descripcion;
       }
    }
    
    if (update.datosCuriosos) {
      if (!site.datosCuriosos) site.datosCuriosos = [];
      for (const cur of update.datosCuriosos) {
         if (!site.datosCuriosos.includes(cur)) site.datosCuriosos.push(cur);
      }
    }
    
    let sets = [];
    if (update.horario) sets.push(`horario = ${escape(site.horario)}`);
    if (update.precio) sets.push(`tarifa = ${escape(site.precio)}`);
    if (update.direccion) sets.push(`direccion = ${escape(site.direccion)}`);
    if (update.datosHistoricos) sets.push(`datos_historicos = ${escape(site.datosHistoricos)}`);
    if (update.descripcion) sets.push(`descripcion = ${escape(site.descripcion)}`);
    if (update.datosCuriosos) sets.push(`datos_curiosos = ${escapeArray(site.datosCuriosos)}`);
    
    if (sets.length > 0) {
      sqls.push(`UPDATE sites SET ${sets.join(', ')} WHERE id = ${escape(site.id)};`);
    }
    matchCount++;
  } else {
    console.log("NOT FOUND: " + update.name);
  }
}

fs.writeFileSync(path, JSON.stringify(sites, null, 2), 'utf8');
fs.writeFileSync('update_sites_t2.sql', sqls.join('\n'));
console.log(`Updated ${matchCount} sites. SQL generated in update_sites_t2.sql.`);
