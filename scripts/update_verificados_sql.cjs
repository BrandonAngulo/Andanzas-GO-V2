const fs = require('fs');

const lugares = [
    {
        id: 's16',
        nombre: "Iglesia de La Ermita",
        descripcion: "La estampa neogótica de La Ermita, azul y blanca junto al río, es una de las postales más reconocidas de Cali. Pero la iglesia que hoy vemos es relativamente joven: la ermita original, levantada a comienzos del siglo XVII, quedó destruida por el terremoto del 7 de junio de 1925; de ella solo se salvó la venerada imagen del Señor de la Caña. Sobre esas ruinas, dos hermanas caleñas —Micaela y Asunción Castro Borrero— impulsaron la construcción del templo actual, inspirado en la catedral de Ulm, en Alemania.\n\nTerminado en concreto e inaugurado en 1942, La Ermita es casi un catálogo del mundo traído a Cali: mármol de Carrara en sus altares, campanas fundidas en Francia, y un reloj musical y vitrales con los doce apóstoles encargados en Ámsterdam. Un pedacito de Europa a la orilla del río, que sobrevivió donde la ciudad perdió casi toda su arquitectura antigua.",
        importancia: "Templo emblemático y una de las principales postales arquitectónicas de Cali; joya del estilo neogótico en Colombia y Bien de Interés Cultural.",
        datos_historicos: "La ermita primitiva, de comienzos del siglo XVII, fue destruida por el terremoto de 1925. El templo neogótico actual, impulsado por las hermanas Castro Borrero y construido bajo la dirección del ingeniero Pablo Emilio Páez, se inauguró el 21 de abril de 1942, dedicado a Nuestra Señora de los Dolores.",
        datos_curiosos: [
            "Su diseño se inspiró en la catedral de Ulm (Alemania).",
            "El reloj musical y los vitrales de los doce apóstoles se trajeron de Ámsterdam; las campanas, de Francia.",
            "Las puertas de hierro se fabricaron en Cali en 1937."
        ],
        horario: "Según horarios de culto (generalmente diurno).",
        tarifa: "Entrada libre.",
        direccion: "Carrera 1 con Calle 13, junto al Puente Ortiz, centro, Cali."
    },
    {
        id: 's19',
        nombre: "Capilla y barrio San Antonio", 
        descripcion: "Encaramada sobre su colina, la Capilla de San Antonio preside el barrio más bohemio de Cali. El terreno lo donó Juan Francisco Garcés de Aguilar en su testamento de 1746, y al año siguiente ya estaba erigida la capilla, dedicada a San Antonio de Padua. Es arquitectura sencilla y honesta —piso de ladrillo, muros blancos, fachada de ladrillo con arco de medio punto—, emparentada con las capillas de las haciendas del Valle. Desde su atrio se abre una de las vistas más queridas de la ciudad.\n\nAlrededor creció uno de los barrios tradicionales de Cali, hoy hito patrimonial: calles empinadas, casas de colores, cafés, cuenteros, restaurantes y el cielo lleno de cometas en agosto. Es el lugar donde la ciudad va a enamorarse, a oír historias y a ver el atardecer. Patrimonio y vida cotidiana en la misma loma.",
        importancia: "Uno de los conjuntos coloniales y barrios tradicionales más emblemáticos de Cali; epicentro bohemio y Monumento Nacional.",
        datos_historicos: "La capilla se erigió en 1747, sobre terreno donado por Juan Francisco Garcés de Aguilar. La capilla y su colina fueron declaradas Monumento Nacional en 1993, y el barrio reconocido como área de interés patrimonial en el año 2000.",
        datos_curiosos: [
            "Es escenario tradicional de cuenteros y de la bohemia caleña.",
            "En agosto, la colina se llena de personas elevando cometas.",
            "Su estilo remite a las capillas de las antiguas haciendas del Valle del Cauca."
        ],
        horario: "Capilla abierta principalmente los fines de semana (misas); colina de acceso libre.",
        tarifa: "Entrada libre.",
        direccion: "Calle 2 Oeste con Carrera 10, barrio San Antonio, Cali."
    },
    {
        id: 's8',
        nombre: "El Gato del Río",
        descripcion: "A la orilla del río Cali, un gato de bronce de tres toneladas se ha convertido en mascota de la ciudad. Es obra del pintor y escultor Hernando Tejada, \"Tejadita\" (Pereira, 1924 – Cali, 1998), quien lo donó a Cali; se fundió en Bogotá y se inauguró el 3 de julio de 1996. Con sus más de tres metros, su sonrisa pícara y su gesto juguetón, rompió con la solemnidad de los monumentos tradicionales.\n\nDiez años después, al Gato le buscaron compañía: nacieron \"las gatas del río\", una galería al aire libre de esculturas decoradas por distintos artistas —Ómar Rayo, Maripaz Jaramillo, Nadín Ospina, Jacanamijoy, entre otros—, cada una con su propio estilo y personalidad. Hoy el paseo del Gato es uno de los rincones más fotografiados de Cali: arte público que la gente siente suyo.",
        importancia: "Uno de los símbolos populares de Cali y punto de una galería de escultura al aire libre a orillas del río.",
        datos_historicos: "Escultura en bronce de Hernando Tejada, inaugurada el 3 de julio de 1996 a orillas del río Cali. En 2006 se sumaron \"las novias/gatas del gato\", esculturas intervenidas por diversos artistas, impulsadas por la familia Tejada y la Cámara de Comercio.",
        datos_curiosos: [
            "Pesa alrededor de tres toneladas y fue fundido en Bogotá.",
            "Cada una de \"las gatas\" fue decorada por un artista diferente.",
            "Es uno de los monumentos más visitados y fotografiados de la ciudad."
        ],
        horario: "Espacio público al aire libre, siempre abierto.",
        tarifa: "Gratis.",
        direccion: "Avenida del Río (Av. Colombia) con Calle 4 Oeste, sector El Peñón / Normandía, Cali."
    },
    {
        id: 's28', // Assuming s28, I will check IDs below by fetching them! Wait! I don't know the exact IDs for Cayzedo, Loma, Tres Cruces, Bulevar, Pance, Peñón, Granada, Parque del Perro, Jairo Varela.
        // Let me query Supabase for their IDs first!
    }
];
