
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const events = [
    {
        titulo: "Candlelight – Tributo a Coldplay",
        titulo_en: "Candlelight – Tribute to Coldplay",
        fecha: "2026-01-17T18:00:00-05:00",
        lugar: "Auditorio Diego Garcés Giraldo (Biblioteca Departamental)",
        lugar_en: "Diego Garcés Giraldo Auditorium (Departmental Library)",
        resumen: "Conciertos íntimos a la luz de las velas.",
        resumen_en: "Intimate concerts by candlelight.",
        descripcion: "Serie de conciertos íntimos a la luz de las velas; un cuarteto de cuerdas reinterpreta los éxitos de Coldplay.",
        descripcion_en: "Series of intimate concerts by candlelight; a string quartet reinterprets Coldplay's greatest hits.",
        img: "https://images.unsplash.com/photo-1470229722913-7ea038627e77?q=80&w=2070&auto=format&fit=crop",
        site_id: "s15"
    },
    {
        titulo: "Candlelight – Las Cuatro Estaciones de Vivaldi",
        titulo_en: "Candlelight – Vivaldi's Four Seasons",
        fecha: "2026-01-17T20:30:00-05:00",
        lugar: "Auditorio Diego Garcés Giraldo (Biblioteca Departamental)",
        resumen: "La obra de Vivaldi en un ambiente de velas.",
        resumen_en: "Vivaldi's work in a candlelight setting.",
        descripcion: "La obra de Vivaldi interpretada por un ensamble clásico en un ambiente de velas.",
        descripcion_en: "Vivaldi's work performed by a classical ensemble in a candlelight setting.",
        img: "https://images.unsplash.com/photo-1514117445516-2ec90dd9051a?q=80&w=2070&auto=format&fit=crop",
        site_id: "s15"
    },
    {
        titulo: "The Jazz Room: Un viaje al corazón de Nueva Orleans",
        titulo_en: "The Jazz Room: A trip to the heart of New Orleans",
        fecha: "2026-01-23T21:00:00-05:00",
        lugar: "Nuevo Teatro San Fernando",
        resumen: "Revive la atmósfera del jazz de Nueva Orleans.",
        resumen_en: "Relive the atmosphere of New Orleans jazz.",
        descripcion: "Espectáculo que revive la atmósfera del jazz de Nueva Orleans con banda en vivo.",
        descripcion_en: "Show that revives the atmosphere of New Orleans jazz with a live band.",
        img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop",
        lat: 3.432,
        lng: -76.545
    },
    {
        titulo: "Candlelight – Rock Classics",
        fecha: "2026-01-31T18:00:00-05:00",
        lugar: "Auditorio Diego Garcés Giraldo (Biblioteca Departamental)",
        resumen: "Versiones clásicas de éxitos de Queen, Led Zeppelin.",
        resumen_en: "Classical versions of Queen, Led Zeppelin hits.",
        descripcion: "Versiones clásicas de éxitos de Queen, Led Zeppelin y otros grupos de rock.",
        descripcion_en: "Classical versions of hits by Queen, Led Zeppelin and other rock bands.",
        img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=2070&auto=format&fit=crop",
        site_id: "s15"
    },
    {
        titulo: "Candlelight – Tributo a Adele",
        titulo_en: "Candlelight – Tribute to Adele",
        fecha: "2026-01-31T20:30:00-05:00",
        lugar: "Auditorio Diego Garcés Giraldo (Biblioteca Departamental)",
        resumen: "Reinterpretación acústica de Adele.",
        resumen_en: "Acoustic reinterpretation of Adele.",
        descripcion: "Reinterpretación en versión acústica de los grandes éxitos de Adele.",
        descripcion_en: "Acoustic reinterpretation of Adele's greatest hits.",
        img: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop",
        site_id: "s15"
    },
    {
        titulo: "Flow – Cali",
        fecha: "2026-02-06T14:00:00-05:00",
        lugar: "Centro de Eventos Valle del Pacífico",
        resumen: "Festival de música electrónica.",
        resumen_en: "Electronic music festival.",
        descripcion: "Festival de música electrónica con sets de house y techno; presenta a Franky Rizardo, Manda Moor y otros DJs.",
        descripcion_en: "Electronic music festival featuring house and techno sets; presenting Franky Rizardo, Manda Moor and other DJs.",
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
        lat: 3.530,
        lng: -76.480
    },
    {
        titulo: "Blessd – El mejor hombre del mundo Tour",
        fecha: "2026-02-13T21:00:00-05:00",
        lugar: "Diamante de Béisbol",
        resumen: "Concierto del cantante de música urbana.",
        resumen_en: "Urban music singer concert.",
        descripcion: "Concierto del cantante de música urbana, parte de su gira nacional.",
        descripcion_en: "Concert by the urban music singer, part of his national tour.",
        img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop",
        site_id: "s87"
    },
    {
        titulo: "Candlelight – Queen vs ABBA",
        fecha: "2026-02-14T18:00:00-05:00",
        lugar: "Auditorio Diego Garcés Giraldo",
        resumen: "Duelo musical entre clásicos.",
        resumen_en: "Musical duel between classics.",
        descripcion: "Duelo musical entre los clásicos de las dos bandas.",
        descripcion_en: "Musical duel between the classics of both bands.",
        img: "https://images.unsplash.com/photo-1459749411177-d4a414c9ff5f?q=80&w=2070&auto=format&fit=crop",
        site_id: "s15"
    },
    {
        titulo: "Candlelight – Especial de San Valentín",
        titulo_en: "Candlelight – Valentine's Special",
        fecha: "2026-02-14T20:30:00-05:00",
        lugar: "Auditorio Diego Garcés Giraldo",
        resumen: "Recital romántico con piano y cuerdas.",
        resumen_en: "Romantic recital with piano and strings.",
        descripcion: "Recital romántico con piezas de piano y cuerdas.",
        descripcion_en: "Romantic recital with piano and specific pieces.",
        img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2070&auto=format&fit=crop",
        site_id: "s15"
    },
    {
        titulo: "Maca & Gero – Tour 2026",
        fecha: "2026-02-21T19:00:00-05:00",
        lugar: "Teatrino del Teatro Municipal",
        resumen: "Dúo argentino de pop.",
        resumen_en: "Argentine pop duo.",
        descripcion: "Dúo argentino de pop presenta su gira en Colombia.",
        descripcion_en: "Argentine pop duo presents their tour in Colombia.",
        img: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070&auto=format&fit=crop",
        site_id: "s2"
    },
    {
        titulo: "El Cuarteto de Nos y Kany García",
        fecha: "2026-02-25T18:00:00-05:00",
        lugar: "CIDS",
        resumen: "Show en el Centro Internacional de Desarrollo Social.",
        resumen_en: "Show at the International Social Development Center.",
        descripcion: "Banda uruguaya de rock y hip‑hop conocida por sus letras satíricas.",
        descripcion_en: "Uruguayan rock and hip-hop band known for their satirical lyrics.",
        img: "https://images.unsplash.com/photo-1459305272254-33a7d593a851?q=80&w=2070&auto=format&fit=crop",
        lat: 3.420,
        lng: -76.510
    },
    {
        titulo: "BiblioFest 2026",
        fecha: "2026-02-28T19:30:00-05:00",
        lugar: "Teatro Municipal Enrique Buenaventura",
        resumen: "Festival musical y cultural.",
        resumen_en: "Musical and cultural festival.",
        descripcion: "Festival musical y cultural en el Teatro Municipal, con conciertos y lecturas.",
        descripcion_en: "Musical and cultural festival at the Municipal Theater, with concerts and readings.",
        img: "https://images.unsplash.com/photo-1503095392237-736240200117?q=80&w=2070&auto=format&fit=crop",
        site_id: "s2"
    },
    {
        titulo: "Candlelight: A Tribute to Coldplay",
        fecha: "2026-03-14T20:30:00-05:00",
        lugar: "Auditorio Diego Garces Giraldo",
        resumen: "Tributo sinfónico a Coldplay.",
        resumen_en: "Symphonic tribute to Coldplay.",
        descripcion: "Tributo sinfónico al repertorio de Coldplay con cientos de velas.",
        descripcion_en: "Symphonic tribute to Coldplay performed by candlelight.",
        img: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2070&auto=format&fit=crop",
        site_id: "s15"
    },
    {
        titulo: "J Balvin – Ciudad Primavera Tour",
        fecha: "2026-03-21T20:00:00-05:00",
        lugar: "Estadio Olímpico Pascual Guerrero",
        resumen: "Show de estadio con invitados sorpresa.",
        resumen_en: "Stadium show with surprise guests.",
        descripcion: "Uno de los artistas de reggaeton más importantes; show de estadio con invitados sorpresa.",
        descripcion_en: "One of the most important reggaeton artists; stadium show with surprise guests.",
        img: "https://images.unsplash.com/photo-1501386761106-e84b72d13ec2?q=80&w=2069&auto=format&fit=crop",
        lat: 3.429,
        lng: -76.536
    },
    {
        titulo: "Procesiones de Semana Santa en San Antonio",
        titulo_en: "Holy Week Processions in San Antonio",
        fecha: "2026-04-02T18:00:00-05:00",
        lugar: "Barrio San Antonio",
        resumen: "Procesiones íntimas por las calles empedradas.",
        resumen_en: "Intimate processions through cobblestone streets.",
        descripcion: "Procesiones íntimas por las calles empedradas del barrio San Antonio; los vecinos sacan sillas, ofrecen agua de panela y crean una comunidad efímera alrededor de la fe.",
        descripcion_en: "Intimate processions through the cobblestone streets of the San Antonio neighborhood.",
        img: "https://images.unsplash.com/photo-1533568971488-84dc24838b05?q=80&w=2070&auto=format&fit=crop",
        site_id: "s1"
    },
    {
        titulo: "Grupo Frontera – Triste pero bien C*brón Tour",
        fecha: "2026-04-17T21:00:00-05:00",
        lugar: "Arena Cañaveralejo (Plaza de Toros)",
        resumen: "Concierto de música regional mexicana.",
        resumen_en: "Mexican regional music concert.",
        descripcion: "Concierto de la agrupación de música regional mexicana.",
        descripcion_en: "Concert by the Mexican regional music group.",
        img: "https://images.unsplash.com/photo-1533174072545-e8d4aa97d848?q=80&w=2070&auto=format&fit=crop",
        site_id: "s88"
    },
    {
        titulo: "Grupo Firme – La Última Peda Tour",
        fecha: "2026-04-25T20:00:00-05:00",
        lugar: "Estadio Pascual Guerrero",
        resumen: "Banda mexicana de corridos y banda.",
        resumen_en: "Mexican corrido and banda group.",
        descripcion: "La banda mexicana regresa a Colombia con su gira de corridos y banda.",
        descripcion_en: "The Mexican band returns to Colombia with their corridos and banda tour.",
        img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop",
        lat: 3.429,
        lng: -76.536
    },
    {
        titulo: "Festival de Cometas",
        titulo_en: "Kite Festival",
        fecha: "2026-05-01T15:00:00-05:00",
        lugar: "Cerro de las Tres Cruces",
        resumen: "Evento familiar para elevar cometas.",
        resumen_en: "Family event to fly kites.",
        descripcion: "Evento familiar en el que las familias elevan cometas artesanales desde temprano.",
        descripcion_en: "Family event where families fly handmade kites starting early in the day.",
        img: "https://images.unsplash.com/photo-1534944883477-9caea66b8dd8?q=80&w=1974&auto=format&fit=crop",
        site_id: "s65"
    },
    {
        titulo: "Kany García – Tour El amor que merecemos",
        fecha: "2026-05-24T19:00:00-05:00",
        lugar: "Plaza de Toros Cañaveralejo",
        resumen: "Cantautora puertorriqueña ganadora de varios Latin Grammy",
        resumen_en: "Puerto Rican singer-songwriter and multi Latin Grammy winner.",
        descripcion: "Cantautora puertorriqueña ganadora de varios Latin Grammy que regresa a Colombia con nueva producción.",
        descripcion_en: "Puerto Rican singer-songwriter and multi Latin Grammy winner returning to Colombia with a new production.",
        img: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop",
        site_id: "s88"
    },
    {
        titulo: "Festival Mundial de Salsa",
        titulo_en: "World Salsa Festival",
        fecha: "2026-05-25T10:00:00-05:00",
        lugar: "Varios espacios (Estadio Pascual Guerrero, Otros)",
        resumen: "Evento anual de competencia de salsa.",
        resumen_en: "Annual salsa competition event.",
        descripcion: "Evento anual donde cientos de bailarines compiten y enseñan salsa en parques, teatros y academias.",
        descripcion_en: "Annual event where hundreds of dancers compete and teach salsa in parks, theaters, and academies.",
        img: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2070&auto=format&fit=crop",
        lat: 3.429,
        lng: -76.536
    },
    {
        titulo: "Pre-Feria de la Salsa",
        fecha: "2026-06-15T10:00:00-05:00",
        lugar: "Academias de salsa",
        resumen: "Actividades previas a la Feria de Cali.",
        resumen_en: "Pre-Cali Fair activities.",
        descripcion: "Actividades previas a la Feria de Cali; academias y bailarines muestran sus coreografías.",
        descripcion_en: "Activities leading up to the Cali Fair; academies and dancers showcase their choreographies.",
        img: "https://images.unsplash.com/photo-1518834107812-cf790870a4a7?q=80&w=2070&auto=format&fit=crop",
        lat: 3.44,
        lng: -76.52
    },
    {
        titulo: "Fiestas de San Pedro",
        fecha: "2026-06-28T10:00:00-05:00",
        lugar: "Distrito de Aguablanca",
        resumen: "Celebración con música, danza y comida tradicional.",
        resumen_en: "Celebration with music, dance, and traditional food.",
        descripcion: "Celebración en el Distrito de Aguablanca con música, danza y comida tradicional organizada por la comunidad afrodescendiente.",
        descripcion_en: "Celebration in the Aguablanca District with music, dance, and traditional food organized by the Afro-descendant community.",
        img: "https://images.unsplash.com/photo-1533174072545-e8d4aa97d848?q=80&w=2070&auto=format&fit=crop",
        lat: 3.42,
        lng: -76.49
    },
    {
        titulo: "Media Maratón de Cali (New Balance)",
        titulo_en: "Cali Half Marathon",
        fecha: "2026-06-28T06:00:00-05:00",
        lugar: "Bulevar del Río, Plaza de Cayzedo",
        resumen: "Competencia atlética de 21 km y 10 km.",
        resumen_en: "21 km and 10 km athletic competition.",
        descripcion: "Competencia atlética que ofrece distancias de 21 km y 10 km; miles de corredores recorren las principales avenidas.",
        descripcion_en: "Athletic competition offering 21 km and 10 km distances; thousands of runners traverse the main avenues.",
        img: "https://images.unsplash.com/photo-1552674605-5d28c4e1902c?q=80&w=2070&auto=format&fit=crop",
        site_id: "s3"
    },
    {
        titulo: "Feria de Cali 2026",
        titulo_en: "Cali Fair 2026",
        fecha: "2026-07-25T12:00:00-05:00",
        lugar: "Estadio Pascual Guerrero, Autopista Sur",
        resumen: "Principal fiesta de la ciudad con desfiles y conciertos.",
        resumen_en: "Main city festival with parades and concerts.",
        descripcion: "Principal fiesta de la ciudad con desfiles (Salsódromo, Carnavalito), cabalgatas, conciertos y ferias gastronómicas.",
        descripcion_en: "Main festival of the city with parades (Salsódromo, Carnavalito), cavalcades, concerts, and gastronomic fairs.",
        img: "https://images.unsplash.com/photo-1543026366-0775d8208429?q=80&w=2070&auto=format&fit=crop",
        lat: 3.429,
        lng: -76.536
    },
    {
        titulo: "Ricardo Montaner – El Último Regreso",
        fecha: "2026-08-06T20:00:00-05:00",
        lugar: "Centro de Eventos CIDS",
        resumen: "Gira de despedida del intérprete venezolano.",
        resumen_en: "Farewell tour of the Venezuelan performer.",
        descripcion: "Gira de despedida del intérprete venezolano; puertas abren a las 18:00.",
        descripcion_en: "Farewell tour of the Venezuelan performer; doors open at 18:00.",
        img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop",
        lat: 3.420,
        lng: -76.510
    },
    {
        titulo: "Festival de Jazz de Cali",
        titulo_en: "Cali Jazz Festival",
        fecha: "2026-08-10T19:00:00-05:00",
        lugar: "Teatro Municipal, Teatro Jorge Isaacs",
        resumen: "Festival internacional con presentaciones en teatros y bares.",
        resumen_en: "International festival with performances in theaters and bars.",
        descripcion: "Festival internacional con presentaciones en teatros y bares, ofrece un contraste tranquilo después de la Feria.",
        descripcion_en: "International festival with performances in theaters and bars, offering a quiet contrast after the Fair.",
        img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070&auto=format&fit=crop",
        site_id: "s22"
    },
    {
        titulo: "Festival Petronio Álvarez 2026",
        fecha: "2026-08-12T10:00:00-05:00",
        lugar: "Coliseo del Pueblo",
        resumen: "Mayor celebración de la cultura afro-pacífica.",
        resumen_en: "Largest celebration of Afro-Pacific culture.",
        descripcion: "Mayor celebración de la cultura afro-pacífica; incluye música, danzas, gastronomía y artesanía.",
        descripcion_en: "Largest celebration of Afro-Pacific culture; includes music, dance, gastronomy, and crafts.",
        img: "https://images.unsplash.com/photo-1559530432-84950e38605c?q=80&w=2070&auto=format&fit=crop",
        site_id: "s87"
    },
    {
        titulo: "Cuarteto de Nos – Tour Puertas",
        fecha: "2026-08-19T20:00:00-05:00",
        lugar: "Centro de Eventos CIDS",
        resumen: "Banda uruguaya de rock alternativo.",
        resumen_en: "Uruguayan alternative rock band.",
        descripcion: "Banda uruguaya de rock alternativo; el grupo presenta en Cali su aclamado Tour Puertas.",
        descripcion_en: "Uruguayan alternative rock band; the group presents their acclaimed Puertas Tour in Cali.",
        img: "https://images.unsplash.com/photo-1459305272254-33a7d593a851?q=80&w=2070&auto=format&fit=crop",
        lat: 3.420,
        lng: -76.510
    },
    {
        titulo: "Festival de Música Andina",
        titulo_en: "Andean Music Festival",
        fecha: "2026-09-20T10:00:00-05:00",
        lugar: "El Queremal y Teatros de Cali",
        resumen: "Homenaje a la música campesina y andina.",
        resumen_en: "Tribute to peasant and Andean music.",
        descripcion: "Evento que rinde homenaje a la música campesina y andina.",
        descripcion_en: "Event paying tribute to peasant and Andean music.",
        img: "https://images.unsplash.com/photo-1516972403217-463d12269df9?q=80&w=2070&auto=format&fit=crop",
        site_id: "s2"
    },
    {
        titulo: "Festival de Cine de Cali",
        titulo_en: "Cali Film Festival",
        fecha: "2026-11-15T18:00:00-05:00",
        lugar: "Cinemateca La Tertulia",
        resumen: "Proyecciones de películas nacionales e internacionales.",
        resumen_en: "Screenings of national and international films.",
        descripcion: "Proyecciones de películas nacionales e internacionales; actividades académicas y conferencias.",
        descripcion_en: "Screenings of national and international films; academic activities and conferences.",
        img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
        site_id: "s45"
    },
    {
        titulo: "Festival Internacional de Arte de Cali",
        titulo_en: "Cali International Art Festival",
        fecha: "2026-11-20T10:00:00-05:00",
        lugar: "Varios espacios (Teatro Municipal, Parque de los Poetas)",
        resumen: "Evento bienal de arte.",
        resumen_en: "Biennial art event.",
        descripcion: "Evento bienal que convierte las calles de Cali en escenarios para exposiciones, conciertos de música, teatro y poesía.",
        descripcion_en: "Biennial event that turns Cali's streets into stages for exhibitions, music concerts, theater, and poetry.",
        img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop",
        site_id: "s2"
    },
    {
        titulo: "Festival de Salsa al Parque",
        titulo_en: "Salsa in the Park Festival",
        fecha: "2026-12-10T16:00:00-05:00",
        lugar: "Parque El Ingenio",
        resumen: "Bailatón y conciertos gratuitos.",
        resumen_en: "Dance-a-thon and free concerts.",
        descripcion: "Bailatón y conciertos gratuitos en parques como El Ingenio; cierra el año en un ambiente festivo.",
        descripcion_en: "Dance-a-thon and free concerts in parks like El Ingenio; closes the year in a festive atmosphere.",
        img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2070&auto=format&fit=crop",
        site_id: "s48"
    }
];

function generateSQL() {
    let sql = 'DELETE FROM events;\n';

    events.forEach(e => {
        const cols = Object.keys(e);
        const vals = Object.values(e).map(v => {
            if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
            if (typeof v === 'number') return v;
            return 'NULL';
        });

        sql += `INSERT INTO events (${cols.join(', ')}) VALUES (${vals.join(', ')});\n`;
    });

    fs.writeFileSync('seed_events.sql', sql, 'utf8');
}

generateSQL();
