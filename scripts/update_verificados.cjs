require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const lugares = [
    {
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
        nombre: "Capilla de San Antonio", // Note: The user called it "Capilla y barrio San Antonio", but in DB it's probably "Capilla de San Antonio"
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
        nombre: "Plaza de Cayzedo",
        descripcion: "Es el corazón histórico de Cali y su punto de encuentro por excelencia. Fue la Plaza Mayor colonial, luego Plaza de la Constitución, y desde 1913 lleva el nombre de Joaquín de Cayzedo y Cuero, prócer de la independencia, cuya estatua de bronce preside el lugar bajo las altas palmas reales. Alrededor se levantan los edificios que cuentan la historia del poder en la ciudad: el Palacio Nacional, el señorial Edificio Otero y la Catedral de San Pedro, todos monumentos nacionales.\n\nDurante siglos fue mercado público, luego parque, y hoy es la sala de estar de la ciudad: lustrabotas, jubilados, palomas, manifestaciones y turistas comparten sus bancas. Un lugar donde se toma el pulso de Cali sin necesidad de más.",
        importancia: "Plaza principal y núcleo histórico de Cali; conjunto de monumentos nacionales alrededor de su perímetro.",
        datos_historicos: "Antigua Plaza Mayor colonial, fue rebautizada en 1913 como Plaza de Cayzedo en honor al prócer Joaquín de Cayzedo y Cuero, cuya estatua se erigió ese mismo año. Funcionó como mercado público hasta finales del siglo XIX y fue remodelada en 1986, con motivo de los 450 años de la ciudad.",
        datos_curiosos: [
            "Sus palmas reales son parte inseparable de su imagen.",
            "Está rodeada por el Palacio Nacional, el Edificio Otero y la Catedral de San Pedro.",
            "Ocupa cerca de 6.500 metros cuadrados en pleno centro."
        ],
        horario: "Espacio público abierto.",
        tarifa: "Gratis.",
        direccion: "Entre Calles 11 y 12 y Carreras 4 y 5, centro, Cali."
    },
    {
        nombre: "Loma de la Cruz", // Or Parque Artesanal Loma de la Cruz
        descripcion: "La Loma de la Cruz es el gran mercado artesanal de Cali y un punto de cultura popular a cielo abierto. Nació a finales de los ochenta de una iniciativa de Artesanías de Colombia para darles a los artesanos un espacio digno y organizado; se inauguró oficialmente en 1990 y desde 1993 lo administra la ciudad. En sus cuatro niveles y su teatrino trabajan alrededor de 120 familias artesanas, con piezas de todo el país y de países vecinos.\n\nSu nombre viene de la cruz que corona la colina, ligada a viejas leyendas caleñas —la de los esclavos Crescencio y Juana, la \"mano del negro\"—, y a la cruz que los franciscanos dejaron allí a comienzos del siglo XX. Más que un mercado, es un centro cultural vivo: hay cine, cuentería y poesía al aire libre. Un lugar donde el trabajo hecho a mano y la memoria popular se dan la mano.",
        importancia: "Principal centro artesanal de Cali y espacio de cultura popular; punto de encuentro de artesanos del país.",
        datos_historicos: "El proyecto se inició en 1987 por iniciativa de Artesanías de Colombia (impulsado por María Cristina Palau Londoño) y se inauguró oficialmente el 12 de julio de 1990. En 1993 pasó a administración municipal.",
        datos_curiosos: [
            "Debe su nombre a la cruz de la colina, envuelta en leyendas caleñas del siglo XVI.",
            "Reúne a cerca de 120 familias artesanas en sus cuatro niveles.",
            "Su teatrino acoge cine, cuentería y recitales de poesía."
        ],
        horario: "Diariamente, aprox. 9:00 a.m. – 10:00 p.m.",
        tarifa: "Entrada libre.",
        direccion: "Calle 5 con Carrera 14 (aprox.), centro-occidente, Cali."
    },
    {
        nombre: "Tres Cruces", // Or Cerro de las Tres Cruces
        descripcion: "A 1.480 metros de altura, el Cerro de las Tres Cruces es el gimnasio al aire libre y el mirador espiritual de Cali. Cada madrugada, sobre todo los fines de semana, cientos de caleños suben por sus empinados senderos para hacer ejercicio y premiarse con una vista completa de la ciudad, el valle y los Farallones. Es rito de salud y postal a la vez.\n\nSus tres cruces tienen origen de leyenda: se dice que en 1837 unos frailes franciscanos plantaron tres cruces de guadua para exorcizar al \"Buziraco\", un demonio al que atribuían las desgracias de la ciudad. El terremoto de 1925 las derribó, y en su lugar se levantaron las cruces de concreto actuales, hacia 1937. Fe, deporte y paisaje se juntan en la cima más caleña de todas.",
        importancia: "Cerro tutelar y mirador emblemático de Cali; lugar de deporte popular y de tradición religiosa.",
        datos_historicos: "Según la tradición, en 1837 frailes franciscanos colocaron tres cruces de guadua para conjurar la leyenda del \"Buziraco\". Las cruces de concreto que hoy coronan el cerro se erigieron hacia 1937-1938, tras la caída de las anteriores en el terremoto de 1925.",
        datos_curiosos: [
            "La cruz central mide unos 26 metros de altura.",
            "Cada 3 de mayo, Día de la Cruz, y en Semana Santa se realizan peregrinaciones.",
            "Es uno de los ascensos deportivos más populares de la ciudad."
        ],
        horario: "Recomendable subir de día, en especial en las primeras horas de la mañana.",
        tarifa: "Gratis.",
        direccion: "Corregimiento de Montebello; ascenso habitual desde Altos de Normandía, Cali."
    },
    {
        nombre: "Bulevar del Río",
        descripcion: "El Bulevar del Río —o Bulevar de la Avenida Colombia— es el gran salón peatonal de Cali a orillas del río. Antes por allí pasaban los carros; hoy circulan por un túnel subterráneo (el más largo de Colombia en zona urbana) mientras arriba la gente pasea bajo las palmas. Inaugurado en 2013 dentro de las \"Megaobras\" de la ciudad, se convirtió en el espacio público más grande de Cali, con miles de personas caminándolo cada día.\n\nEn menos de un kilómetro conecta buena parte de la memoria de la ciudad: La Ermita, el Teatro Jorge Isaacs, el Parque de los Poetas, el Puente Ortiz y el Paseo Bolívar. Con sus torres de acero, sus restaurantes y su \"puente del amor\" lleno de candados, es el lugar donde el centro histórico se volvió paseo, especialmente los viernes al caer la tarde.",
        importancia: "El espacio público peatonal más importante de Cali; eje de conexión del centro histórico a orillas del río.",
        datos_historicos: "Construido a partir de 2012 dentro del programa \"Megaobras\" de la administración del alcalde Rodrigo Guerrero, se inauguró el 16 de mayo de 2013, sobre el túnel urbano más largo del país.",
        datos_curiosos: [
            "El paseo peatonal se extiende cerca de 980 metros sobre el \"Túnel Mundialista\".",
            "Por él caminan a diario entre 6.000 y 7.000 personas.",
            "Su \"puente del amor\" se llenó de candados, al estilo del Pont des Arts de París."
        ],
        horario: "Espacio público abierto; los establecimientos, con horario propio.",
        tarifa: "Gratis.",
        direccion: "Avenida Colombia, entre el Puente Ortiz y la Calle 5, centro, Cali."
    },
    {
        nombre: "Río Pance", // Or Ecoparque Río Pance
        descripcion: "Pance es el río del alma de los caleños. El Ecoparque, en la zona rural del sur de la ciudad, nació hacia 1970 cuando la Gobernación del Valle compró predios para crear un balneario popular —el \"Parque de la Salud\"—, con el fin de que no se perdiera la tradición vallecaucana de bañarse en los ríos. El agua baja fría y cristalina desde los Farallones de Cali, donde el río nace a unos 4.000 metros de altura.\n\nHoy es refugio de fin de semana: senderos, avistamiento de aves, zonas verdes, restaurantes de comida típica y charcos para meter los pies. Está dentro de un área protegida, y por eso convive la recreación con la conservación de un ecosistema que abastece de agua a la ciudad. Naturaleza a media hora del calor urbano.",
        importancia: "Principal espacio de recreación en la naturaleza de los caleños y símbolo del vínculo de la ciudad con sus ríos.",
        datos_historicos: "La Gobernación del Valle adquirió los predios hacia 1970 para crear el Balneario Popular y Recreativo del Río Pance. Desde 1985 lo administra la Corporación para la Recreación Popular, que consolidó el \"Parque de la Salud\".",
        datos_curiosos: [
            "El río Pance nace en el Parque Nacional Natural Farallones de Cali, a unos 4.000 m s. n. m.",
            "Los fines de semana soleados puede recibir decenas de miles de visitantes.",
            "Su nombre proviene del pueblo indígena Pance, antiguo habitante de la zona."
        ],
        horario: "Recomendable de día; mayor afluencia fines de semana y festivos.",
        tarifa: "Acceso al ecoparque libre; algunos servicios tienen costo.",
        direccion: "Corregimiento de Pance, km 12-15 vía a La Vorágine, sur de Cali."
    },
    {
        nombre: "El Peñón",
        descripcion: "El Peñón es uno de los barrios más antiguos y señoriales de Cali, formado a comienzos del siglo XX en la orilla del río. Conserva un aire tranquilo y artístico que lo distingue: casas tradicionales, tiendas de antigüedades, galerías, hoteles boutique, cafés y restaurantes. A pocos pasos están el Museo La Tertulia y el Gato del Río, lo que lo convierte en remate natural de una jornada cultural por el oeste de la ciudad.\n\nEs un barrio para caminar sin afán, donde el pasado residencial de Cali dialoga con una escena gastronómica cada vez más viva. Circuito de arte, buena mesa y memoria urbana, todo junto al río.",
        importancia: "Barrio tradicional y circuito cultural-gastronómico junto al río; puerta de entrada al polo museístico del oeste.",
        datos_historicos: "Uno de los primeros barrios de Cali, surgido a comienzos del siglo XX en la ribera del río Cali, históricamente ligado al desarrollo residencial y cultural del sector de La Tertulia.",
        datos_curiosos: [
            "Es tradicional zona de anticuarios y galerías de arte de la ciudad.",
            "Su cercanía a La Tertulia y al Gato del Río lo integra al circuito cultural del oeste."
        ],
        horario: "Zona abierta; restaurantes y comercios con horarios propios.",
        tarifa: "Acceso libre; consumo según establecimiento.",
        direccion: "Barrio El Peñón, centro-oeste de Cali."
    },
    {
        nombre: "Granada",
        descripcion: "Granada nació como barrio residencial a comienzos del siglo XX y con los años se transformó en la cara más cosmopolita del gusto caleño. En sus calles arboladas se concentra buena parte de la alta cocina de la ciudad: restaurantes de mantel largo, propuestas internacionales, cafés de especialidad y coctelería de autor. Es la \"zona gourmet\" de Cali y punto de partida frecuente de las rutas gastronómicas.\n\nPero no todo es mesa: en una casa del barrio funciona Lugar a Dudas, uno de los espacios de arte contemporáneo más importantes de la ciudad. Así, Granada mezcla el placer de comer bien con una vida cultural que se cuela entre restaurantes y galerías.",
        importancia: "Principal zona gastronómica de alta cocina de la ciudad y escenario de su escena culinaria contemporánea.",
        datos_historicos: "Barrio residencial tradicional del norte de Cali, surgido a comienzos del siglo XX, que con el tiempo se consolidó como epicentro gastronómico y de vida nocturna.",
        datos_curiosos: [
            "Concentra buena parte de los restaurantes de alta cocina de Cali.",
            "Alberga el espacio de arte contemporáneo Lugar a Dudas.",
            "Es punto de partida habitual de recorridos gastronómicos por la ciudad."
        ],
        horario: "Zona abierta; establecimientos con horarios propios.",
        tarifa: "Acceso libre; consumo según establecimiento.",
        direccion: "Barrio Granada, norte de Cali."
    },
    {
        nombre: "Parque del Perro",
        descripcion: "Lo que empezó como un parque de barrio en San Fernando —tan curvo que lo apodaban \"Parque del Corazón\"— es hoy uno de los epicentros gastronómicos y de rumba de Cali. Su nombre viene de la estatua de \"Teddy\", un perro muy querido por un grupo de jóvenes en los años cincuenta, cuya historia terminó en tragedia. Uno de esos muchachos, Víctor Alberto Delgado Mallarino, llegó con los años a ser director de la Policía Nacional y mandó erigir en 1970 el monumento donde reposan los restos del animal.\n\nAlrededor de la estatua se agolpan restaurantes, cervecerías, heladerías, boutiques y bares con ambiente de calle casi toda la semana. De día invita a caminar y tomar café; de noche es una de las zonas de rumba más animadas de la ciudad. Un homenaje a un perro convertido en corazón bohemio de Cali.",
        importancia: "Epicentro bohemio y gastronómico de San Fernando; punto de encuentro nocturno emblemático de la ciudad.",
        datos_historicos: "La estatua del perro Teddy fue instalada en 1970 por Víctor Alberto Delgado Mallarino, en un parque tradicional del barrio San Fernando que, con el tiempo, se convirtió en zona de gastronomía y vida nocturna.",
        datos_curiosos: [
            "El parque se llamaba antes \"Parque del Corazón\" por su forma.",
            "Bajo la estatua reposan los restos del perro Teddy.",
            "Está cerca de las salsotecas de la Calle 5 y de la Loma de la Cruz."
        ],
        horario: "Zona abierta; establecimientos con horarios propios (fuerte ambiente nocturno).",
        tarifa: "Acceso libre; consumo según establecimiento.",
        direccion: "Barrio San Fernando, Calle 3A con Carrera 36 (aprox.), Cali."
    },
    {
        nombre: "Sebastián de Belalcázar",
        descripcion: "Sobre una colina del oeste, la estatua del conquistador Sebastián de Belalcázar —fundador de Cali en 1536— señala con el brazo derecho hacia el Pacífico. Fue encargada en los años treinta al reconocido escultor español Victorio Macho, hecha en España y traída en barco hasta Buenaventura y luego a lomo de mula hasta Cali; se inauguró en 1937, para los 400 años de la ciudad. Durante décadas fue mirador clásico y una de las mejores panorámicas de Cali.\n\nPero el monumento es hoy también un lugar en disputa. En abril de 2021, durante el Paro Nacional, la comunidad indígena Misak lo derribó, señalando que la figura de Belalcázar representa la violencia de la conquista. Tras año y medio de debate, la estatua volvió a su pedestal en 2022, esta vez con una placa nueva que reconoce el papel de los pueblos indígenas de la región. El sitio se lee en dos claves a la vez: mirador de la ciudad y memoria en debate sobre cómo se cuenta su fundación.",
        importancia: "Monumento al fundador de la ciudad y mirador histórico; hoy también un espacio de debate sobre la memoria de la conquista.",
        datos_historicos: "Estatua en bronce del escultor español Victorio Macho, inaugurada el 25 de julio de 1937 en el marco de los 400 años de Cali. El 28 de abril de 2021 fue derribada por la comunidad Misak durante el Paro Nacional, y reinstalada el 4 de noviembre de 2022 con una nueva placa que reconoce a los pueblos indígenas.",
        datos_curiosos: [
            "La escultura se elaboró en España y llegó a Cali a lomo de mula desde Buenaventura.",
            "Belalcázar aparece señalando al Pacífico, con la mano izquierda sobre su espada Tizona.",
            "Ofrece una de las panorámicas más amplias de la ciudad."
        ],
        horario: "Mirador al aire libre (se recomienda visitarlo de día).",
        tarifa: "Gratis.",
        direccion: "Barrio Arboleda, Carrera 2 Oeste con Calle 9 Oeste (aprox.), oeste de Cali."
    },
    {
        nombre: "Jairo Varela",
        descripcion: "Frente al CAM, en pleno centro, esta plazoleta convierte la memoria salsera de Cali en espacio público. Está dedicada a Jairo Varela (1949-2012), el músico chocoano fundador y director del Grupo Niche, autor de \"Cali pachanguero\", ese himno no oficial de la ciudad. En vez de un busto tradicional, su homenaje es una escultura sonora: una estructura dorada de ocho metros, obra del arquitecto Freddy Pantoja, que forma la palabra \"NICHE\" con trompetas y trombones y por cuyas campanas suena, de verdad, la música del grupo.\n\nLa gente se acerca, descubre el nombre escondido en el instrumento, se mete debajo a escuchar y termina bailando unos pasos antes de seguir su camino. Junto a la escultura está el museo dedicado al maestro. Es el reconocimiento urbano a que en Cali la salsa no es solo rumba: es patrimonio e identidad.",
        importancia: "Homenaje urbano a Jairo Varela y al Grupo Niche; reconocimiento de la salsa como patrimonio e identidad de la ciudad.",
        datos_historicos: "Plazoleta dedicada a Jairo Varela, en el centro de Cali frente al CAM. Su escultura sonora \"Niche\", del arquitecto Freddy Pantoja, ganó un concurso público (con jurado que incluyó a la hija del maestro, Cristina Varela, y al escritor Umberto Valverde) y se inauguró en diciembre de 2015.",
        datos_curiosos: [
            "La escultura, de unos 8 metros, forma la palabra \"NICHE\" con trompetas y trombones.",
            "Por sus campanas suena música grabada por el propio Grupo Niche.",
            "Junto a la plazoleta funciona el museo dedicado a Jairo Varela."
        ],
        horario: "Espacio público abierto; museo con horario propio.",
        tarifa: "Plazoleta gratuita; museo con entrada (aprox. $10.000).",
        direccion: "Avenida 2 Norte, frente al CAM, centro, Cali."
    }
];

async function updateVerificados() {
    console.log("Iniciando actualización de 13 sitios verificados...");

    for (const site of lugares) {
        // Encontrar por ILIKE en nombre
        const { data: existing, error: searchError } = await supabase
            .from('sites')
            .select('id, nombre')
            .ilike('nombre', `%${site.nombre}%`)
            .limit(1);

        if (searchError) {
            console.error(`Error buscando ${site.nombre}:`, searchError);
            continue;
        }

        if (existing && existing.length > 0) {
            console.log(`Actualizando sitio existente: ${existing[0].nombre} (Buscado como: ${site.nombre})`);
            const updateData = {
                descripcion: site.descripcion,
                importancia: site.importancia,
                datos_historicos: site.datos_historicos,
                datos_curiosos: site.datos_curiosos,
                horario: site.horario,
                tarifa: site.tarifa,
                direccion: site.direccion
            };

            const { error: updateError } = await supabase
                .from('sites')
                .update(updateData)
                .eq('id', existing[0].id);

            if (updateError) {
                console.error(`Error al actualizar ${site.nombre}:`, updateError);
            } else {
                console.log(`✓ Actualizado correctamente.`);
            }
        } else {
            console.warn(`! Sitio no encontrado: ${site.nombre}`);
        }
    }
    console.log("¡Actualización de 13 sitios completada!");
}

updateVerificados();
