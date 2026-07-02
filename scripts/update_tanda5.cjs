require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const tanda5 = [
    {
        nombre: "Iglesia de La Merced",
        tipo: "Iglesia",
        descripcion: "La Merced se levanta justo donde nació Cali: aquí, según la tradición, se ofició la misa de fundación de la ciudad en 1536. Es la construcción más antigua que sobrevive en una urbe que borró casi toda su arquitectura colonial, y por eso funciona como una cápsula de memoria: pisos y altares en piedra sin pulir, un retablo mayor en madera roja con hojilla de oro y la imagen de Nuestra Señora de la Merced, patrona de la ciudad.\n\nMás que un templo, es un complejo que respira historia: junto a la iglesia sobreviven el convento de las Agustinas Recoletas y las capillas de la Virgen de los Remedios —la \"Montañerita Cimarrona\", encontrada en las montañas del occidente hacia 1580— y del Cristo de Letrán. Fue el primer inmueble de Cali declarado Monumento Nacional. Historia sobre historia, como casi todo en esta ciudad.",
        importancia: "La construcción más antigua de Cali y el lugar simbólico de su fundación; primer Monumento Nacional de la ciudad y templo de su patrona.",
        datos_historicos: "En su atrio se ofició la misa de fundación de Santiago de Cali en 1536. En febrero de 1975 el conjunto conventual recibió la declaratoria oficial como Monumento Nacional, siendo el primer inmueble de la ciudad con ese reconocimiento. Está a cargo de la comunidad de Hermanas Agustinas Recoletas.",
        datos_curiosos: [
            "El rosario que adorna a la Virgen fue un obsequio del papa Juan Pablo II durante su visita a Cali en 1986.",
            "La Virgen de la Merced recibió el \"bastón de mando\" de Joaquín de Caycedo y Cuero en 1811 y es considerada, simbólicamente, \"gobernadora\" de la ciudad.",
            "En el complejo aún funciona una fábrica de hostias que abastece a parroquias del país."
        ],
        horario: "Lunes a sábado: 7:00 p.m. Domingos: 8:00 a.m., 10:00 a.m., 6:00 p.m. y 7:00 p.m.",
        tarifa: "Entrada libre a la iglesia.",
        direccion: "Carrera 3 # 6-62, centro histórico, Cali"
    },
    {
        nombre: "Museo Arqueológico La Merced",
        tipo: "Museo",
        descripcion: "En los anexos conventuales del complejo colonial más antiguo de la ciudad, el Museo Arqueológico La Merced guarda el pasado prehispánico del suroccidente colombiano. Administrado por el Banco Popular, exhibe una de las colecciones de cerámica precolombina más representativas del país: piezas de las culturas Calima, Quimbaya, Tolima, Tierradentro, San Agustín, Tumaco y Nariño, organizadas alrededor de temas como el medio ambiente, los oficios, la religión y la muerte.\n\nDoble lectura en un solo lugar: el edificio es patrimonio colonial y por dentro custodia un patrimonio aún más antiguo. Entre sus salas hay hasta una réplica a escala natural de un hipogeo de Tierradentro y estatuaria de San Agustín en el patio. Un lugar donde la historia se cuenta sin grandilocuencia, entre muros que ya son, en sí mismos, una pieza de museo.",
        importancia: "Custodio de una de las colecciones de cerámica precolombina más importantes de Colombia, en el conjunto patrimonial más antiguo de la ciudad.",
        datos_historicos: "Inaugurado en 1978 y en funcionamiento permanente desde 1979, ocupa parte del exconvento de La Merced. Depende del Fondo de Promoción de la Cultura del Banco Popular, que también administra el MUSA de Bogotá.",
        datos_curiosos: [
            "En su interior se conserva una réplica a tamaño natural de un hipogeo (tumba) de Tierradentro.",
            "Comparte complejo con el Museo de Arte Colonial y Religioso, administrado por las Agustinas Recoletas."
        ],
        horario: "Lunes a sábado de 9:00 a.m. a 1:00 p.m. y de 2:00 p.m. a 6:00 p.m.",
        tarifa: "Entrada general ~$5.000 COP",
        direccion: "Carrera 4 # 6-59, Complejo La Merced, centro histórico, Cali"
    },
    {
        nombre: "Iglesia de San Francisco",
        tipo: "Iglesia / Patrimonio",
        descripcion: "El complejo de San Francisco es una narración en ladrillo y fe. Los franciscanos llegaron a Cali hacia 1750 y levantaron un conjunto que hoy reúne el convento de San Joaquín, la Capilla de la Inmaculada, la imponente iglesia neoclásica y —su joya— la Torre Mudéjar. Esa torre de unos 23 metros, construida hacia 1772, con sus cuerpos de ladrillo cortado en trapecio formando geometrías de aire oriental, ha sido calificada por el historiador Santiago Sebastián como \"la torre mudéjar más hermosa de toda América\".\n\nEs la huella del mestizaje que marcó la ciudad: en la torre se respira el legado hispano-musulmán que cruzó el Atlántico, y en la iglesia, el pensamiento racional del neoclásico. Una leyenda le atribuye el diseño a un \"moro\" exiliado, lo que le suma misterio a un monumento único en Colombia. Alrededor, la plaza y sus palomas hacen el resto.",
        importancia: "Conjunto patrimonial franciscano y sede de la Torre Mudéjar, considerada la más bella de América; símbolo del mestizaje arquitectónico caleño.",
        datos_historicos: "El convento se construyó desde 1757, con la Capilla de la Inmaculada terminada hacia 1764. La Torre Mudéjar data de alrededor de 1772. La iglesia neoclásica actual se levantó entre 1803 y 1827, sobre diseños del presbítero Andrés Marcelino Pérez de Arroyo. Fue postulado a Monumento Nacional en 1982.",
        datos_curiosos: [
            "La Torre Mudéjar se compara con la Giralda de Sevilla por sus geometrías en ladrillo.",
            "La iglesia sobrevivió a los terremotos de 1885, 1896 y 1925 conservando su fisonomía.",
            "La plaza contigua está flanqueada por el edificio de la Gobernación del Valle."
        ],
        horario: "Lunes a viernes 7:30 a.m. a 6:30 p.m. (misas en mañana y tarde/noche)",
        tarifa: "Entrada libre a la iglesia.",
        direccion: "Carrera 6 # 9-03, centro histórico, Cali"
    },
    {
        nombre: "Lugar a Dudas",
        tipo: "Espacio de Arte",
        descripcion: "En una casa del barrio Granada, el artista Óscar Muñoz —uno de los nombres más importantes del arte contemporáneo colombiano, con obra en la Tate Modern y el MoMA— y Sally Mizrachi crearon a mediados de los 2000 un espacio independiente que hace honor a su nombre: acá se viene a dudar, no a confirmar. Frente a la solemnidad del museo, Lugar a Dudas es la trastienda experimental de la escena caleña: residencias de artistas, cinemateca, biblioteca especializada, exhibiciones y programas de formación abiertos.\n\nHeredero del espíritu de Ciudad Solar —aquel mítico espacio de la Cali creativa de los años setenta donde orbitaron Andrés Caicedo, Luis Ospina y Carlos Mayolo—, se volvió nodo de una red internacional de residencias que conecta a Cali con Brasil, Bolivia, Argentina y Europa. Es la prueba de que la escena artística de la ciudad no vive solo de sus instituciones grandes, sino de estos espacios pequeños y tercos.",
        importancia: "Espacio independiente de referencia del arte contemporáneo en Cali y nodo de las residencias artísticas latinoamericanas; motor de la escena emergente.",
        datos_historicos: "Fundado a mediados de la década de 2000 por Óscar Muñoz y Sally Mizrachi como asociación y luego fundación sin ánimo de lucro. Recibió apoyo de entidades como la Fundación Daros Latinoamérica (Zúrich) y ayudó a crear la primera red de residencias artísticas de Suramérica.",
        datos_curiosos: [
            "Su nombre es una declaración de principios: un lugar para cuestionarlo todo.",
            "Sigue la senda de Ciudad Solar, epicentro de la contracultura caleña de los años setenta.",
            "Su programa de residencias recibe artistas de todo el mundo en el barrio Granada."
        ],
        horario: "Martes a viernes: 2:00 p.m. a 8:00 p.m. Sábado: 3:00 p.m. a 8:00 p.m.",
        tarifa: "Entrada libre.",
        direccion: "Calle 15N # 8N-41, Barrio Granada, Cali"
    },
    {
        nombre: "Monumento a Sebastián de Belalcázar",
        tipo: "Monumento",
        descripcion: "Sobre una colina del occidente de la ciudad, la estatua del conquistador Sebastián de Belalcázar —fundador de Santiago de Cali en 1536— señala con el brazo extendido hacia el valle. Durante décadas fue mirador clásico y postal de la ciudad, con una de las mejores panorámicas de Cali a sus pies. Pero en los últimos años el monumento se volvió también un lugar de disputa: para los pueblos indígenas del suroccidente, la figura de Belalcázar encarna la violencia de la conquista, y su presencia ha sido cuestionada y confrontada. Hoy el sitio se lee en dos claves a la vez: la del mirador y la de la memoria en debate sobre cómo se cuenta la fundación de la ciudad.",
        importancia: "Monumento al fundador de la ciudad y mirador histórico; hoy también un lugar de debate sobre la memoria de la conquista.",
        datos_historicos: "Estatua del conquistador Sebastián de Belalcázar, obra del escultor español Victorio Macho e inaugurada el 25 de julio de 1937, en el marco de los homenajes al IV Centenario de la ciudad. En años recientes ha sido objeto de acciones de protesta por parte de comunidades indígenas.",
        datos_curiosos: [
            "Ofrece una de las panorámicas más amplias de la ciudad y el valle.",
            "El debate en torno a su permanencia refleja discusiones nacionales sobre los símbolos de la conquista."
        ],
        horario: "Mirador al aire libre abierto 24 horas (se recomienda visita diurna/tarde).",
        tarifa: "Acceso libre.",
        direccion: "Colina del barrio San Antonio, occidente de Cali"
    },
    {
        nombre: "Plazoleta Jairo Varela",
        tipo: "Monumento",
        descripcion: "Dedicada al fundador y director del Grupo Niche, esta plazoleta convierte la memoria musical en espacio público. Es el homenaje urbano al hombre que, con canciones como \"Cali pachanguero\", le puso ritmo al nombre de la ciudad en el mundo entero. Con su monumento interactivo, sus juegos de agua y la salsa que suena en el lugar, reconoce que en Cali la música no es solo entretenimiento: es patrimonio e identidad.",
        importancia: "Homenaje urbano a Jairo Varela y al Grupo Niche; reconocimiento de la salsa como patrimonio de la ciudad.",
        datos_historicos: "Plazoleta creada en homenaje a Jairo Varela (fundador del Grupo Niche, fallecido en 2012). El monumento 'Las Trompetas de Niche', diseñado por el arquitecto Fredy Pantoja, fue instalado y consolidado como hito a finales de 2015 en el centro de la ciudad.",
        datos_curiosos: [
            "El monumento interactivo en forma de trompetas reproduce fragmentos de los éxitos del Grupo Niche cuando te paras debajo de las campanas.",
            "Rinde tributo a \"Cali pachanguero\", casi un segundo himno de la ciudad.",
            "Comparte el espacio con el Museo Jairo Varela, inaugurado a fines de 2014."
        ],
        horario: "Espacio público abierto 24 horas.",
        tarifa: "Gratis.",
        direccion: "Avenida 2 Norte con Calle 10, frente al CAM, Cali"
    }
];

async function updateTanda5() {
    console.log("Iniciando actualización de Tanda 5...");

    for (const site of tanda5) {
        // Buscar el sitio en la base de datos por nombre
        const { data: existing, error: searchError } = await supabase
            .from('sites')
            .select('id, nombre')
            .ilike('nombre', `%${site.nombre}%`)
            .limit(1);

        if (searchError) {
            console.error(`Error buscando ${site.nombre}:`, searchError);
            continue;
        }

        const updateData = {
            descripcion: site.descripcion,
            importancia: site.importancia,
            datos_historicos: site.datos_historicos,
            datos_curiosos: site.datos_curiosos,
            horario: site.horario,
            tarifa: site.tarifa,
            direccion: site.direccion
        };

        if (existing && existing.length > 0) {
            console.log(`Actualizando sitio existente: ${existing[0].nombre}`);
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
            console.log(`Sitio no encontrado, insertando nuevo: ${site.nombre}`);
            
            // Si no existe, hacemos una pequeña consulta a la API de Google Maps para obtener coordenadas
            // O podemos insertar con lat/lng temporal
            let lat = 3.4516;
            let lng = -76.5320;
            let place_id = "";
            let logoUrl = "https://images.unsplash.com/photo-1590523293846-9d3248981f72?auto=format&fit=crop&q=80&w=600";

            if (process.env.VITE_GOOGLE_MAPS_API_KEY) {
                try {
                    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(site.nombre + " Cali")}&inputtype=textquery&fields=place_id,geometry&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`;
                    const res = await fetch(searchUrl);
                    const googleData = await res.json();
                    if (googleData.candidates && googleData.candidates.length > 0) {
                        lat = googleData.candidates[0].geometry.location.lat;
                        lng = googleData.candidates[0].geometry.location.lng;
                        place_id = googleData.candidates[0].place_id;
                    }
                } catch (e) {
                    console.error("Error fetching Google API", e);
                }
            }

            const newSite = {
                id: `site_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                nombre: site.nombre,
                nombre_en: site.nombre,
                tipo: site.tipo,
                tipo_en: site.tipo,
                lat: lat,
                lng: lng,
                rating: 4.5,
                visitas: 100,
                logo_url: logoUrl,
                ...updateData
            };

            const { error: insertError } = await supabase
                .from('sites')
                .insert([newSite]);
            
            if (insertError) {
                console.error(`Error al insertar ${site.nombre}:`, insertError);
            } else {
                console.log(`✓ Insertado correctamente.`);
            }
        }
    }
    console.log("¡Tanda 5 completada!");
}

updateTanda5();
