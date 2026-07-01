const fs = require('fs');
const path = require('path');

// Load original local sites
const { CULTURAL_SITES } = require('./sites_temp.cjs');

// Mapping for duplicate IDs
const idMapping = {
  'museo-salsa-obrero': 's25',
  'plazoleta-jairo-varela': 's21',
  'teatro-municipal': 's2',
  'biblioteca-centenario': 's53',
  'bulevar-petronio': 's3',
  'iglesia-ermita': 's16',
  'capilla-san-antonio': 's63',
  'gato-tejada': 's8',
  'museo-tertulia': 's1',
  'zoologico-cali': 's13',
  'teatro-jorge-isaacs': 's22',
  'galeria-alameda': 's9',
  'tecoc': 's96'
};

// Rich content for the unmatched local sites & some overrides
const richContent = {
  'audiosca-municipal': {
    descripcion: 'La Audioteca Municipal de Cali, ubicada en el Centro Cultural de Cali (antigua FES), es el templo de la memoria sonora de la región de la salsa y el Pacífico. Custodia miles de registros fonográficos, desde vinilos de 78 rpm de las primeras orquestas de salsa hasta grabaciones de campo de música tradicional del Pacífico. Ofrece cabinas de escucha individuales y una programación constante de audiciones guiadas por melómanos y musicólogos locales. Es un espacio íntimo donde la brisa de la tarde entra por los tragaluces del edificio republicano, ideal para investigadores y entusiastas que buscan rastrear los orígenes del ritmo caleño.',
    descripcion_en: 'The Municipal Audioteca of Cali, located in the Cultural Center of Cali, is the temple of the sound memory of the salsa and Pacific region. It guards thousands of phonographic records, from 78 rpm vinyls of the first salsa orchestras to field recordings of traditional Pacific music. It offers individual listening booths and a constant program of guided auditions by local music lovers and musicologists. It is an intimate space where the afternoon breeze enters through the skylights of the republican building, ideal for researchers and enthusiasts looking to trace the origins of the Cali rhythm.',
    horario: 'Lunes a Viernes: 8:00 - 12:00 y 14:00 - 17:00.',
    horario_en: 'Monday to Friday: 8:00 AM - 12:00 PM and 2:00 PM - 5:00 PM.',
    tarifa: 'Entrada libre.',
    tarifa_en: 'Free entry.'
  },
  'bebidas-san-antonio': {
    descripcion: 'Los tradicionales puestos de bebidas al aire libre en la Colina de San Antonio son el epicentro de la gastronomía refrescante y popular caleña. Aquí se sirven las famosas luladas caleñas (bebida de lulo machacado con limón, hielo y leche condensada opcional), el champús valluno (bebida a base de maíz quebrado, lulo, piña, hojas de naranjo y canela) y raspados de múltiples sabores. Los puestos son atendidos por familias locales que han transmitido las recetas durante generaciones, ofreciendo un descanso perfecto a los caminantes que suben a la capilla colonial en las tardes calurosas.',
    descripcion_en: 'The traditional open-air beverage stalls on the San Antonio Hill are the epicenter of refreshing and popular Cali gastronomy. Here, they serve the famous luladas caleñas (crushed lulo with lemon, ice, and optional condensed milk), champús valluno (a drink made of broken corn, lulo, pineapple, orange leaves, and cinnamon), and shaved ice (raspados). The stalls are run by local families who have passed down recipes for generations, offering a perfect break for walkers climbing to the colonial chapel on hot afternoons.',
    horario: 'Todos los días: 11:00 - 22:00.',
    horario_en: 'Daily: 11:00 AM - 10:00 PM.',
    tarifa: 'Consumo libre (precios desde $4,000 COP).',
    tarifa_en: 'Pay for consumption (prices starting at $4,000 COP).'
  },
  'panaderias-centro': {
    descripcion: 'Las panaderías tradicionales del centro histórico de Cali son el origen del aroma a pan caliente que inunda las mañanas caleñas. En estos locales históricos se hornea el pandebono auténtico (elaborado con almidón de yuca y queso costeño), el pan de yuca caliente y los buñuelos gigantes. Es tradición local desayunar o tomar la merienda de la tarde acompañada de avena helada o café recién colado, en un ambiente que conserva las vitrinas de madera y las tertulias diarias de los habitantes del centro.',
    descripcion_en: 'The traditional bakeries of Cali\'s historic center are the origin of the warm bread aroma that floods Cali mornings. In these historic premises, authentic pandebono (made with cassava starch and costeño cheese), hot pan de yuca, and giant buñuelos are baked. It is a local tradition to have breakfast or afternoon snack accompanied by iced oatmeal or freshly brewed coffee, in an environment preserving wooden showcases and daily social gatherings of downtown residents.',
    horario: 'Lunes a Sábado: 6:00 - 20:00 | Domingo: 7:00 - 14:00.',
    horario_en: 'Monday to Saturday: 6:00 AM - 8:00 PM | Sunday: 7:00 AM - 2:00 PM.',
    tarifa: 'Consumo libre (precios desde $2,000 COP).',
    tarifa_en: 'Pay for consumption (prices starting at $2,000 COP).'
  },
  'muros-bulevar': {
    descripcion: 'El circuito de muralismo urbano en los muros aledaños al Bulevar del Río Cali constituye una galería de arte público que relata la historia de la ciudad y las luchas sociales de sus habitantes. Con intervenciones de artistas callejeros caleños e internacionales, los grafitis combinan retratos hiperrealistas, consignas políticas y representaciones coloridas de la fauna y flora nativas del Valle del Cauca, convirtiendo los muros de contención del río en un lienzo vivo de la memoria urbana.',
    descripcion_en: 'The circuit of urban muralism on the walls adjacent to the Bulevar del Río Cali constitutes a public art gallery recounting the city\'s history and the social struggles of its inhabitants. Featuring works by Caleño and international street artists, the graffiti combines hyperrealistic portraits, political slogans, and colorful representations of the native fauna and flora of the Valle del Cauca, transforming the river containment walls into a living canvas of urban memory.',
    horario: 'Acceso público 24 horas.',
    horario_en: 'Public access 24/7.',
    tarifa: 'Sin costo.',
    tarifa_en: 'Free.'
  },
  'puente-cerveceria': {
    descripcion: 'El Puente de la Cervecería, que conecta el norte de la ciudad con el centro a la altura del río Cali, se ha convertido en un lienzo de arte urbano monumental. Sus muros de contención e infraestructura de soporte están pintados con murales que homenajean la historia industrial de la zona y la riqueza natural del Valle, sirviendo como un hito visual y paso peatonal que une el circuito del Bulevar del Río con el tradicional barrio Granada.',
    descripcion_en: 'The Puente de la Cervecería, which connects the north of the city with downtown over the Cali River, has become a canvas for monumental urban art. Its retaining walls and support infrastructure are painted with murals honoring the industrial history of the zone and the natural wealth of the Valley, serving as a visual landmark and pedestrian pathway linking the Bulevar del Río circuit with the traditional Granada neighborhood.',
    horario: 'Acceso público 24 horas.',
    horario_en: 'Public access 24/7.',
    tarifa: 'Sin costo.',
    tarifa_en: 'Free.'
  },
  'murales-siloe': {
    descripcion: 'Los murales artísticos del barrio Lleras en la comuna 20 (Siloé) representan una de las mayores expresiones de memoria colectiva y transformación comunitaria de Cali. A través del proyecto de turismo local e intervenciones artísticas populares, jóvenes del sector han plasmado en las fachadas de ladrillo y concreto de la ladera relatos de resistencia pacífica, homenajes a las víctimas del conflicto urbano y símbolos de la cultura afro e indígena. Visitar estos murales es adentrarse en la historia popular de Cali, su geografía empinada y su resiliencia cultural.',
    descripcion_en: 'The artistic murals of the Lleras neighborhood in commune 20 (Siloé) represent one of the greatest expressions of collective memory and community transformation in Cali. Through local tourism projects and popular art interventions, local youth have captured stories of peaceful resistance, tributes to victims of urban conflict, and symbols of Afro and indigenous culture on the hillside brick and concrete facades. Visiting these murals is to step into Cali\'s popular history, steep geography, and cultural resilience.',
    horario: 'Se recomienda visitar durante el día, preferiblemente con guías comunitarios locales.',
    horario_en: 'Recommended to visit during the day, preferably with local community guides.',
    tarifa: 'Aporte voluntario sugerido a los guías locales.',
    tarifa_en: 'Suggested voluntary tip to local guides.'
  },
  'edificio-otero': {
    descripcion: 'El Edificio Otero, inaugurado en 1926 en una esquina de la Plaza de Cayzedo, es una joya de la arquitectura republicana caleña declarada Monumento Nacional. Diseñado con una refinada fachada de influencia francesa, cuenta con detalles ornamentales esculpidos en yeso, amplios ventanales y soportales que cobijan a los transeúntes del sol de mediodía. En su época dorada albergó el famoso Hotel Europa y lujosas oficinas de comercio internacional. Hoy en día es un testimonio visual del florecimiento urbano y económico de Cali a principios del siglo XX, destacando como punto de referencia obligatorio para los recorridos de arquitectura del centro histórico.',
    descripcion_en: 'The Otero Building, inaugurated in 1926 on a corner of the Plaza de Cayzedo, is a gem of republican architecture in Cali declared a National Monument. Designed with a refined French-influenced facade, it features plaster-sculpted ornamental details, wide windows, and arcades shielding passersby from the midday sun. In its golden age, it housed the famous Hotel Europa and luxurious international trade offices. Today, it stands as a visual testimony to the urban and economic flourishing of Cali in the early 20th century, highlighting it as a mandatory reference point for historic center architectural tours.',
    horario: 'Solo visible desde el exterior; acceso a locales comerciales según horario de comercio.',
    horario_en: 'Visible from the outside only; access to commercial premises according to business hours.',
    tarifa: 'Sin costo.',
    tarifa_en: 'Free.'
  },
  'monumento-piper': {
    descripcion: 'El Monumento a Piper Pimienta, inaugurado en 1998 en el tradicional barrio Obrero, rinde homenaje a Edulfamid Molina Díaz "Piper Pimienta", el cantante caleño de figura estilizada y pasos de baile elegantes que inmortalizó el himno de la salsa de la ciudad "Las Caleñas son como las Flores". La escultura en bronce, obra del maestro Diego Pombo, captura al artista con el micrófono alzado y el brazo extendido en actitud festiva. Es un punto de peregrinación musical donde melómanos de todo el mundo se toman fotos para rendir tributo al sabor y al estilo del baile tradicional caleño.',
    descripcion_en: 'The Monument to Piper Pimienta, inaugurated in 1998 in the traditional Barrio Obrero, pays tribute to Edulfamid Molina Díaz "Piper Pimienta", the slender Cali singer with elegant dance steps who immortalized the city\'s salsa anthem "Las Caleñas son como las Flores". The bronze sculpture, created by master Diego Pombo, captures the artist with microphone raised and arm extended in a festive pose. It is a point of musical pilgrimage where music lovers from around the world take photos to pay tribute to the flavor and style of traditional Cali dance.',
    horario: 'Acceso público 24 horas.',
    horario_en: 'Public access 24/7.',
    tarifa: 'Sin costo.',
    tarifa_en: 'Free.'
  },
  'plaza-afro': {
    descripcion: 'La Plaza de la Afrocolombianidad es un espacio público cívico dedicado a honrar el aporte fundamental de las comunidades negras al desarrollo social, político y cultural de Santiago de Cali. Ubicada en el centro de la ciudad, cuenta con placas conmemorativas y bustos de líderes e intelectuales afrodescendientes del suroccidente colombiano. Es un lugar de encuentro donde se realizan muestras gastronómicas de cocina del Pacífico, audiciones musicales espontáneas de marimba de chonta y eventos comunitarios en el marco de la Semana de la Afrocolombianidad.',
    descripcion_en: 'The Plaza de la Afrocolombianidad is a civic public space dedicated to honoring the fundamental contribution of black communities to the social, political, and cultural development of Santiago de Cali. Located in the city center, it features commemorative plaques and busts of Afro-descendant leaders and intellectuals from southwestern Colombia. It is a meeting place hosting Pacific cuisine food tastings, spontaneous marimba music auditions, and community events during the Week of Afrocolombianity.',
    horario: 'Acceso público 24 horas.',
    horario_en: 'Public access 24/7.',
    tarifa: 'Sin costo.',
    tarifa_en: 'Free.'
  },
  'edificio-gobernacion': {
    descripcion: 'El Palacio de San Francisco, sede de la Gobernación del Valle del Cauca, es un imponente complejo arquitectónico de estilo modernista ubicado frente a la Plaza de San Francisco. Diseñado a mediados del siglo XX, el edificio destaca por sus líneas limpias, murales interiores que retratan la historia y la diversidad agraria del departamento, y su gran plazoleta cívica empedrada que sirve como punto de protestas, ceremonias oficiales y encuentros ciudadanos diarios.',
    descripcion_en: 'The Palacio de San Francisco, headquarters of the Valle del Cauca Government, is an imposing architectural complex of modernist style located in front of the Plaza de San Francisco. Designed in the mid-20th century, the building stands out for its clean lines, interior murals depicting the department\'s history and agricultural diversity, and its large stone civic plaza serving as a point for protests, official ceremonies, and daily citizen gatherings.',
    horario: 'Lunes a Viernes: 8:00 - 12:00 y 14:00 - 18:00 (Áreas administrativas).',
    horario_en: 'Monday to Friday: 8:00 AM - 12:00 PM and 2:00 PM - 6:00 PM (Administrative areas).',
    tarifa: 'Sin costo.',
    tarifa_en: 'Free.'
  },
  'casa-comedia': {
    descripcion: 'Casa Comedia es un espacio teatral independiente y sala concertada dedicada a promover el teatro de humor, el stand-up comedy y el clown en Cali. Ubicada en una acogedora sede del sur de la ciudad, ofrece una nutrida programación semanal con comediantes locales e invitados nacionales, además de talleres de formación actoral y oratoria. Cuenta con un pequeño café-bar donde los espectadores pueden conversar y tomar algo antes de las funciones.',
    descripcion_en: 'Casa Comedia is an independent theatrical space and concerted hall dedicated to promoting comedy theater, stand-up comedy, and clowning in Cali. Located in a cozy venue in the south of the city, it offers a rich weekly schedule with local and national guest comedians, as well as acting and public speaking workshops. It features a small cafe-bar where spectators can chat and have a drink before shows.',
    horario: 'Funciones de Jueves a Sábado: 19:30 - 22:30.',
    horario_en: 'Shows from Thursday to Saturday: 7:30 PM - 10:30 PM.',
    tarifa: 'Precios desde $25,000 COP según la obra.',
    tarifa_en: 'Prices starting at $25,000 COP depending on the show.'
  },
  'archivo-historico': {
    descripcion: 'El Archivo Histórico de Cali, ubicado en el Centro Cultural de Cali, resguarda los tesoros documentales más antiguos e importantes de la ciudad, con folios que datan de la época colonial del siglo XVI. Su colección incluye actas de cabildo originales, planos históricos de desarrollo urbano, crónicas coloniales y correspondencia de próceres de la independencia. Es un espacio abierto a historiadores, investigadores y ciudadanos que desean explorar la memoria escrita de la ciudad, contando con una sala de consulta y exposiciones documentales periódicas.',
    descripcion_en: 'The Cali Historical Archive, located in the Cali Cultural Center, shields the oldest and most important documentary treasures of the city, with folios dating back to the 16th-century colonial era. Its collection includes original town council minutes, historical urban development plans, colonial chronicles, and correspondence of independence heroes. It is a space open to historians, researchers, and citizens wishing to explore the written memory of the city, featuring a consultation room and periodic documentary exhibitions.',
    horario: 'Lunes a Viernes: 8:00 - 12:00 y 14:00 - 17:00.',
    horario_en: 'Monday to Friday: 8:00 AM - 12:00 PM and 2:00 PM - 5:00 PM.',
    tarifa: 'Entrada libre.',
    tarifa_en: 'Free entry.'
  },
  'museos-ladera': {
    descripcion: 'El proyecto de Museos de Ladera es una iniciativa de museología comunitaria y autogestionada que agrupa pequeños centros de memoria en los sectores de ladera de la Comuna 20 (Siloé). Estos espacios rescatan la historia de la autoconstrucción del barrio, la llegada de las familias migrantes y desplazadas, la minería artesanal de carbón y las tradiciones populares de la zona. A través de objetos cotidianos donados por los vecinos, fotografías históricas y relatos orales, los museos ofrecen una visión íntima y dignificante de la identidad comunitaria del sector oeste.',
    descripcion_en: 'The Ladera Museums project is a community-based and self-managed museology initiative grouping small memory centers in the hillside sectors of Commune 20 (Siloé). These spaces rescue the history of the neighborhood\'s self-construction, the arrival of migrant and displaced families, artisanal coal mining, and popular local traditions. Through everyday objects donated by neighbors, historical photographs, and oral histories, the museums offer an intimate and magnifying view of the community identity of the western sector.',
    horario: 'Sábados y Domingos: 10:00 - 16:00 (Se recomienda coordinar con colectivos locales).',
    horario_en: 'Saturdays and Sundays: 10:00 AM - 4:00 PM (Coordinating with local collectives recommended).',
    tarifa: 'Aporte voluntario sugerido.',
    tarifa_en: 'Suggested voluntary tip.'
  },
  'canchas-panamericanas': {
    descripcion: 'La Unidad Deportiva Jaime Aparicio, conocida popularmente como Canchas Panamericanas, es el corazón deportivo y de recreación de Cali, la "Capital Deportiva de América". Construida originalmente para los VI Juegos Panamericanos de 1971, este gran complejo alberga escenarios para atletismo, natación, tenis, baloncesto y fútbol. Por las tardes y fines de semana, se convierte en un punto de encuentro cívico masivo donde miles de caleños entrenan, trotan, disfrutan de la gastronomía típica (como cholados, champús y ensaladas de frutas en los puestos aledaños) o se reúnen para practicar disciplinas urbanas.',
    descripcion_en: 'The Jaime Aparicio Sports Complex, popularly known as Canchas Panamericanas, is the sporting and recreational heart of Cali, the "Sports Capital of America". Originally built for the 1971 VI Pan American Games, this grand complex houses facilities for athletics, swimming, tennis, basketball, and soccer. In the afternoons and weekends, it becomes a massive civic meeting point where thousands of Caleños train, jog, enjoy typical gastronomy (like cholados, champús, and fruit salads at nearby stalls), or gather for urban sports.',
    horario: 'Todos los días: 5:00 - 22:00.',
    horario_en: 'Daily: 5:00 AM - 10:00 PM.',
    tarifa: 'Acceso libre a zonas comunes; reservas específicas según tarifa del escenario.',
    tarifa_en: 'Free access to common areas; specific reservations according to venue fee.'
  },
  'polideportivos-barriales': {
    descripcion: 'La red de polideportivos barriales de Cali representa la infraestructura de base para la recreación, el deporte y el encuentro social en las comunas populares de la ciudad. Estos espacios, dotados de canchas múltiples techadas, parques infantiles y zonas verdes, son la sede de escuelas de formación deportiva infantil y torneos comunitarios de microfútbol los fines de semana. Funcionan como verdaderos pulmones sociales de los barrios, permitiendo a jóvenes y familias apropiarse del espacio público en un ambiente saludable y de convivencia pacífica.',
    descripcion_en: 'The network of neighborhood sports centers in Cali represents the grassroots infrastructure for recreation, sports, and social gatherings in the city\'s popular communes. These spaces, equipped with roofed multi-purpose courts, playgrounds, and green areas, host children\'s sports training schools and weekend community indoor soccer (microfútbol) tournaments. They function as true social lungs of the neighborhoods, allowing youth and families to embrace public space in a healthy and peaceful coexistence environment.',
    horario: 'Todos los días: 6:00 - 21:00.',
    horario_en: 'Daily: 6:00 AM - 9:00 PM.',
    tarifa: 'Acceso libre.',
    tarifa_en: 'Free access.'
  }
};

// Map original sites to new sites
const updatedSites = CULTURAL_SITES.map(site => {
  const originalId = site.id;
  const mappedId = idMapping[originalId] || originalId;
  
  const updated = {
    ...site,
    id: mappedId
  };
  
  // Inject rich content if present
  const rich = richContent[originalId] || richContent[mappedId];
  if (rich) {
    Object.assign(updated, rich);
  }
  
  return updated;
});

// Format as nice TypeScript output
let fileContent = `import { Site } from '../types';\n\nexport const CULTURAL_SITES: Site[] = [\n`;

for (const s of updatedSites) {
  fileContent += `    {\n`;
  fileContent += `        id: '${s.id}',\n`;
  fileContent += `        nombre: '${s.nombre.replace(/'/g, "\\'")}',\n`;
  fileContent += `        tipo: '${s.tipo.replace(/'/g, "\\'")}',\n`;
  fileContent += `        lat: ${s.lat},\n`;
  fileContent += `        lng: ${s.lng},\n`;
  fileContent += `        rating: ${s.rating},\n`;
  fileContent += `        visitas: ${s.visitas},\n`;
  fileContent += `        logoUrl: '${s.logoUrl}',\n`;
  fileContent += `        descripcion: \`${s.descripcion.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,\n`;
  fileContent += `        descripcion_en: \`${s.descripcion_en.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,\n`;
  if (s.horario) {
    fileContent += `        horario: '${s.horario.replace(/'/g, "\\'")}',\n`;
    fileContent += `        horario_en: '${s.horario_en.replace(/'/g, "\\'")}',\n`;
    fileContent += `        tarifa: '${s.tarifa.replace(/'/g, "\\'")}',\n`;
    fileContent += `        tarifa_en: '${s.tarifa_en.replace(/'/g, "\\'")}',\n`;
  }
  fileContent += `    },\n`;
}

fileContent += `];\n`;

fs.writeFileSync(path.join(__dirname, '../data/sites.ts'), fileContent, 'utf8');
console.log("Successfully wrote updated data/sites.ts with mapping and rich descriptions!");
