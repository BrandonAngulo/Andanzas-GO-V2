const fs = require('fs');

const sitios = [
    // Tanda 8
    {
        nombre: 'Teatro La Concha',
        descripcion: 'En una casa declarada Patrimonio Arquitectónico-Urbano de Cali, en pleno barrio San Antonio, funciona el Teatro La Concha: un espacio escénico al servicio de la comunidad artística iberoamericana. Fundado en 2007, hace parte de la Fundación de Teatro y Artes "Yolanda García Reina" y cuenta con una sala de mediano formato, una sala de exposición y un salón alterno para ensayos y montajes de pequeño formato. La casa guarda, además, una capa de memoria caleña: alberga de manera permanente la exposición del artista plástico Carlos Zuluaga sobre Jovita Feijóo, uno de los personajes populares más entrañables de la ciudad.',
        importancia: 'La Concha es una de las salas que sostienen el tejido teatral independiente de Cali. Su programación mezcla obras propias y coproducciones con otros grupos de la ciudad y del país, muchas de ellas de fuerte carga contemporánea: memoria, identidad, salud mental, género. Su sede patrimonial en San Antonio la integra al circuito de salas de la colina —junto a Cali Teatro y otras— que ha convertido al barrio en uno de los corazones escénicos de la ciudad.',
        datos_historicos: '2007: fundación del Teatro La Concha, dentro de la Fundación de Teatro y Artes "Yolanda García Reina".\nSu sede es una casa del centro histórico catalogada como Patrimonio Arquitectónico-Urbano de Cali.\nHa desarrollado coproducciones (por ejemplo, con Entropía Teatro) y participa activamente en la Red de Teatro Independiente de Cali.',
        datos_curiosos: [
            "En la misma casa se puede visitar la exposición permanente sobre Jovita Feijóo, figura mítica del \"Cali viejo\".",
            "Durante la pandemia fue una de las primeras salas de Cali en habilitar una plataforma web para transmitir sus obras."
        ],
        horario: 'Funciones habitualmente viernes y sábado; consultar cartelera.',
        tarifa: 'Boletería según función.',
        direccion: 'Calle 4 #10-48, barrio San Antonio.',
        tipo: 'Arte y Teatro'
    },
    {
        nombre: 'Teatro del Presagio',
        descripcion: 'El Teatro del Presagio nació en 2005 como una agrupación teatral profesional formada por licenciados en arte dramático de Cali, dedicada a la investigación, creación y producción escénica. Tras casi diez años de trabajo itinerante, en noviembre de 2014 abrió su propia sala —un espacio cultural— en el barrio Granada, una zona de cafés, restaurantes y anticuarios que hasta entonces no tenía un verdadero escenario para las artes. Su propuesta huye de los grandes espectáculos comerciales: se construye, como ellos mismos dicen, "a partir del asombro y de las breves emociones que brotan entre la luz".',
        importancia: 'Es una de las agrupaciones más destacadas del panorama escénico caleño y nacional, y ha representado a Colombia en Europa. Su sala en Granada programa teatro, danza, música y espectáculos infantiles y familiares, con artistas locales, nacionales e internacionales. El Presagio tiene, además, una vocación clara por la diversidad: organiza desde 2019 el Encuentro Nacional (hoy internacional) de Arte Queer y el Encuentro de Mujeres Artistas Latinoamericanas, apostándole a una Cali "diversa, creativa e incluyente".',
        datos_historicos: '2005: se conforma el grupo, con dramaturgia y dirección de Diego Fernando Montoya.\nNoviembre de 2014: inaugura su sede propia en el barrio Granada.\nDesde 2019: realiza el Encuentro de Arte Queer, con una nutrida agenda artística y académica.',
        datos_curiosos: [
            "Su programación habitual es viernes y sábado a las 7:30 p. m., con temporada familiar los domingos a las 4:00 p. m.",
            "Tiene un programa dedicado a formar nuevos públicos entre niños y jóvenes de instituciones educativas."
        ],
        horario: 'Viernes y sábado 7:30 p. m.; domingo (familiar) 4:00 p. m.',
        tarifa: 'Boletería según función.',
        direccion: 'Avenida 9AN #10N-50, barrio Granada.',
        tipo: 'Arte y Teatro'
    },
    {
        nombre: 'Espacio T',
        descripcion: 'Espacio T le trajo a Cali un formato que no existía en la ciudad: el microteatro. En una hermosa casa antigua del barrio San Antonio, sus alcobas se convirtieron en salas mínimas donde se presentan tres piezas de unos 15 minutos, en espacios de 15 m², para apenas 15 espectadores cada una. Las obras rotan cada media hora entre las 8 y las 11 de la noche, y la experiencia se completa con restaurante y bar de bebidas artesanales: teatro y sobremesa en un mismo plan. Lo inauguraron el 3 de diciembre de 2015 Leandro Fernández —actor y director caleño radicado en Miami— y su esposa Ángela María Osorio, que trajeron el concepto desde su sala en esa ciudad.',
        importancia: 'Espacio T es la única sala de Cali dedicada al microteatro, un formato nacido en Madrid, y se ha vuelto un referente de teatro alternativo e íntimo. Al no exigir la profesionalización previa, se ha convertido en plataforma para nuevos actores y directores de la ciudad. Desde 2023 sumó "La Carpa T", un escenario en su patio para 100 personas donde caben montajes de largo formato, conciertos, conversatorios y ensayos de grupos sin sala propia. Es Sala Concertada del Ministerio de Cultura y la Secretaría de Cultura.',
        datos_historicos: '3 de diciembre de 2015: inauguración de Espacio T en el centro histórico.\n2023: apertura de La Carpa T, su escenario de patio para largo formato.',
        datos_curiosos: [
            "La fórmula que lo define: obras de 15 minutos, para 15 personas, en salas de 15 metros cuadrados.",
            "Leandro Fernández, su fundador, es hermano de algunos de los creadores del TEC (Teatro Experimental de Cali).",
            "Entre función y función suele sonar salsa viejita."
        ],
        horario: 'Funciones de microteatro entre 8:00 y 11:00 p. m., por temporadas (habitualmente jueves a sábado).',
        tarifa: 'Boletería por función; consumos de comida y bebida por aparte.',
        direccion: 'Carrera 6 #4-80, barrio San Antonio.',
        tipo: 'Arte y Teatro'
    },
    {
        nombre: 'Fundación AESCENA',
        descripcion: 'AESCENA (Arte Escénico Nacional) es una fundación artística profesional que, desde hace más de dos décadas, funciona a la vez como escuela y como sala independiente. En su "Casa Aescena" ofrece programación permanente de teatro para adultos, jóvenes y niños —comedia, drama, experimental—, y una línea de formación integral en interpretación, dramaturgia y expresión corporal a cargo de docentes reconocidos de la escena local. Su equipo es interdisciplinario: al arte suma la sociología, el derecho, la comunicación social y la pedagogía.',
        importancia: 'AESCENA es un referente cultural de la escena caleña y parte de la Red de Teatro Independiente de Cali. Su apuesta va más allá del escenario: tiene un fuerte componente social —entiende el arte como agente de transformación y de descentralización cultural— y organiza festivales, encuentros y actividades comunitarias que fortalecen la identidad caleña.',
        datos_historicos: 'Lleva más de dos décadas de trabajo continuo como escuela y sala independiente.\nSu Casa Aescena cuenta con una sala para unas 50 personas y un escenario de 4,80 × 5,60 m, además de espacios para talleres y ensayos.',
        datos_curiosos: [
            "Organiza espacios abiertos como la \"Jam Actoral\", para actores y no actores que quieran subirse a improvisar sin guion.",
            "Su trabajo articula varias disciplinas del conocimiento en torno a la escena."
        ],
        horario: 'Funciones y talleres según programación.',
        tarifa: 'Boletería según función; talleres con inscripción.',
        direccion: 'Cra. 37A #5E-07, sector San Fernando / El Templete.',
        tipo: 'Arte y Teatro'
    },
    {
        nombre: 'Teatro Casa Naranja',
        descripcion: 'En una casa de tres pisos pintada de naranja, en el barrio El Poblado I, en pleno Distrito de Aguablanca, está el único teatro del oriente de Cali. Casa Naranja es una historia de terquedad y de amor por el arte: la levantó, ladrillo a ladrillo, John Jairo Perdomo, líder comunitario y artista escénico, para que los niños y jóvenes de una de las zonas más golpeadas de la ciudad tuvieran un lugar donde descubrir su talento. Aquí la entrada tiene un precio insólito y hermoso: se paga con comida. Un huevo es una entrada; dos huevos, dos; media libra de arroz o de azúcar, o una panela, valen por tres; un atún, por cuatro. Lo que se recoge alimenta a los artistas y a la comunidad.',
        importancia: 'Casa Naranja es mucho más que una sala: es un proyecto de transformación social a través del arte, en un territorio donde el teatro casi no tenía presencia. Cada sábado ofrece talleres gratuitos de teatro, danza, música, zancos y técnicas de circo para los niños del sector, y presenta funciones abiertas a todos. Es Sala Concertada del Ministerio de Cultura y trabaja con la estrategia de "lo bello como ejercicio de transformación social": la convicción de que el oriente de Cali también merece espacios dignos y hermosos.',
        datos_historicos: 'Sus raíces están en el "Colectivo Teatral Espejos", hacia 1998; la sala como tal funciona desde 2004.\nSe estima que por sus tablas han pasado más de 7.600 niños y jóvenes formados de manera gratuita; cada año pasan más de 400.\nCuenta con el respaldo de Compromiso Valle, la Fundación Fanalca, Bolívar Davivienda, la Cámara de Comercio, ProPacífico y la Alcaldía, entre otros.',
        datos_curiosos: [
            "Su filosofía es la \"vitamina C\": Cristo, confianza, cultura, carnaval, cariño, convivencia, comunidad y celebración. De ahí el nombre.",
            "Su lema es \"Todos somos los otros\".",
            "Uno de sus proyectos insignia es el \"Desfile de la Luz\", cada 7 de agosto por las calles del oriente (ha reunido hasta 800 participantes). Nació tras el asesinato de seis jóvenes, como un acto para llevar luz y honrar la vida de los muchachos del sector.",
            "En su terraza guarda muñecos gigantes del Gato de Tejada, de Jovita y de la vendedora de chontaduros, destinados a un futuro Museo del Cali Viejo."
        ],
        horario: 'Funciones habitualmente los sábados hacia las 7:00 p. m.; talleres los sábados.',
        tarifa: 'La entrada se paga con alimentos (un huevo, arroz, panela, atún…).',
        direccion: 'Carrera 29A #45-72, barrio El Poblado I (Distrito de Aguablanca).',
        tipo: 'Arte y Teatro'
    },
    {
        nombre: 'Instituto Popular de Cultura (IPC)',
        descripcion: 'El Instituto Popular de Cultura —el IPC— es una de las instituciones que más ha marcado la vida artística de Cali. Nació por iniciativa del Concejo Municipal el 18 de diciembre de 1947, en pleno contexto de la "República Liberal", con una misión pionera: dar formación artístico-cultural a los sectores populares de la ciudad, entendiendo el arte como herramienta para educar y transformar la realidad social. Con el tiempo consolidó cuatro escuelas —Artes Plásticas, Danza, Música y Teatro— por donde han pasado generaciones de artistas, docentes y gestores culturales caleños.',
        importancia: 'El IPC es patrimonio artístico de Cali y del Valle del Cauca. Además de sus escuelas, tiene un departamento de extensión cultural que ha formado a más de 12.000 personas en talleres por toda la ciudad, y un departamento de investigación del folclor considerado uno de los más completos en su especialidad. De sus aulas salieron figuras que luego fundaron buena parte del circuito escénico de la ciudad: directores como Harold Molina (Colectivo Teatral Infinito) o Reynel Osorio (Castillo Sol y Luna) se formaron aquí. Está profundamente ligado a las culturas del Pacífico y al Festival Petronio Álvarez.',
        datos_historicos: '18 de diciembre de 1947: creación mediante el Acuerdo No. 450 del Concejo Municipal.\n2011: se transforma en Establecimiento Público Descentralizado, vinculado a la Secretaría de Educación (Acuerdo 0313), con autonomía y patrimonio propios.\n2023: al cumplir 76 años, el Ministerio de Educación aprueba la creación de la Institución Universitaria de las Culturas y las Artes Populares IPC (IUIPC), la primera de su tipo en el país, en el rehabilitado Edificio Coltabaco.',
        datos_curiosos: [
            "En sus inicios enseñaba también historia patria, educación cívica, geografía, higiene y urbanidad a las clases obreras.",
            "Su publicación y sus encuentros han documentado, entre otras memorias, la de la ladera (\"Siloé resiste\"), enlazando con el Museo Popular de Siloé."
        ],
        horario: 'Atención administrativa y clases según calendario académico.',
        tarifa: 'Formación pública; programas con matrícula según la institución.',
        direccion: 'Sede histórica en San Fernando (Calle 4 #27-140); nueva sede IUIPC en el Edificio Coltabaco (Calle 12 #1-12).',
        tipo: 'Museos y Cultura'
    },
    {
        nombre: 'Teatro de Títeres Castillo Sol y Luna',
        descripcion: 'A veinte minutos de la ciudad, en la vereda Los Limones del corregimiento La Castilla, al oeste de Cali, hay un castillo de verdad: dos torres de aire medieval, zona verde y cielo abierto, hechas para que los niños tengan su teatro de títeres. Es el Castillo Sol y Luna, la única sala en forma de castillo y en zona rural de la ciudad. Lo soñó y lo construyó el maestro Reynel Osorio Torres —titiritero, actor y docente con más de 45 años de oficio— cuando se jubiló del Instituto Popular de Cultura e invirtió sus ahorros en levantar, con su familia, este espacio para la primera infancia.',
        importancia: 'Castillo Sol y Luna es un centro pedagógico, cultural y recreativo rural, sin ánimo de lucro, dedicado en especial al teatro de títeres para niños y familias de las zonas urbana y rural. Su valor es doble: por un lado, un repertorio de más de 23 montajes —adaptaciones de la narrativa popular y de autores argentinos, checos y españoles, junto a obras propias—; por otro, un profundo trabajo social. Los Limones y las veredas vecinas están habitadas por campesinos, familias desplazadas por la violencia y madres trabajadoras, y el Castillo les ofrece a esos niños un lugar para jugar, imaginar y sanar. Es Sala Concertada del Ministerio de Cultura.',
        datos_historicos: 'Fundado en 2002 por el maestro Reynel Osorio, junto a su esposa Luz Myriam García Franco y su hija Melisa Osorio García.\nHa participado en festivales de títeres departamentales, nacionales e internacionales.',
        datos_curiosos: [
            "Tiene programas de inclusión (\"Somos diversos con derechos\") para niños en situación de discapacidad, riesgo social o enfermedad: con niños ciegos, por ejemplo, dejan tocar los muñecos antes de la función para reconocerlos por la voz.",
            "En el campus viven patos, gallinas, conejos, palomos y hasta una oveja llamada Cornelia, que pide guayabas.",
            "Los niños de la vereda siempre entran gratis."
        ],
        horario: 'Funciones los domingos; programación entre semana para colegios y grupos.',
        tarifa: 'Boletería para público general; gratuito para los niños de la vereda.',
        direccion: 'Vereda Los Limones, corregimiento La Castilla (occidente rural de Cali).',
        tipo: 'Arte y Teatro'
    },
    {
        nombre: 'Colectivo Teatral Infinito',
        descripcion: 'El Colectivo Teatral Infinito es uno de los proyectos más conmovedores de la escena caleña: la primera —y durante mucho tiempo única— escuela de formación teatral para personas con discapacidad del país. Fundado en 2005 por el maestro Harold Molina (egresado del IPC) y Paula Macía, el CTI integra a niños, jóvenes y adultos, y muy especialmente a actores y actrices con Síndrome de Down, en producciones de nivel profesional. Su apuesta es demostrar, sobre las tablas, que lejos de la idea de "discapacidad" hay un talento enorme por mostrar.',
        importancia: 'El CTI le dio a Cali —y a Colombia— una de las poquísimas salas del país con actores con Síndrome de Down como protagonistas. Nació de la investigación de Harold Molina sobre el trabajo corporal, que aplicó a la formación de población en situación de discapacidad, proponiendo un teatro con dimensión terapéutica y procesos reales de inclusión. Su trabajo, reconocido por la Secretaría de Cultura, celebra la diferencia y transforma vidas a través del arte.',
        datos_historicos: '2 de diciembre de 2005: constitución de la Fundación Artística y Cultural Colectivo Teatral Infinito.\nHa construido un repertorio de obras propias (como *Mío Amor*) que han representado a la ciudad dentro y fuera de Cali.\n2023: gracias a la Ley de Espectáculos Públicos (LEP) y la gestión de la Secretaría de Cultura, estrenó por fin su propia sala.\n2025: celebración de 20 años de trabajo.',
        datos_curiosos: [
            "Es reconocida como la primera y única escuela de formación teatral para población con discapacidad en el país.",
            "Su director, Harold Molina, se formó en el IPC —otro hilo que enlaza a esta institución con el circuito escénico de la ciudad."
        ],
        horario: 'Funciones y talleres según programación.',
        tarifa: 'Boletería según función.',
        direccion: 'Barrio San Fernando (Calle 5B #26-46 / #25-70).',
        tipo: 'Arte y Teatro'
    },
    {
        nombre: 'Cementerio Central de Cali',
        descripcion: 'En el centro-norte de la ciudad, el Cementerio Central es mucho más que un camposanto: es un archivo vivo donde reposa buena parte de la memoria de Cali. Instalado oficialmente en este punto hacia 1852, fue el tercer emplazamiento del cementerio católico de la ciudad —el primero estuvo donde hoy está la Plaza de Cayzedo y el segundo en el actual Parque de San Nicolás—. Y el terreno tiene raíces aún más hondas: fue el antiguo asentamiento indígena de San Diego de Alcalá de Yanaconas, de donde los yanaconas fueron trasladados en 1778. Entre su arquitectura funeraria republicana y su capilla, una de las más antiguas de la ciudad, se recorre como una alameda de la historia caleña.',
        importancia: 'Administrado por la Arquidiócesis de Cali ("Camposanto Metropolitano Central"), con más de un siglo al servicio de la ciudad, el Cementerio Central guarda un valioso patrimonio material e inmaterial: mausoleos de arte funerario de distintas épocas, tumbas de personajes ilustres y también las prácticas culturales populares alrededor de la muerte. Allí descansan figuras como Jovita Feijóo —ícono del "Cali viejo"— y Adolfo Aristizábal, el empresario que trajo los primeros carros a Cali y fundó el Hotel Aristi, entre familias que ayudaron a construir la ciudad.',
        datos_historicos: 'Hacia 1852 se adjudicó el terreno actual y se instaló allí el cementerio (tercera ubicación del camposanto católico de Cali).\nEl sitio fue, en tiempos coloniales, el asentamiento indígena de San Diego de Alcalá de Yanaconas.\nHa sido investigado por especialistas en patrimonio funerario, como el arquitecto Ricardo Hincapié (Universidad del Valle).',
        datos_curiosos: [
            "Junto a los mausoleos de mármol conviven \"santos populares\": tumbas convertidas en lugar de devoción, adornadas con flores, cartas, fotos y ofrendas.",
            "La tumba de Jovita Feijóo enlaza este lugar con el Teatro La Concha (que le dedica una exposición) y con los muñecos del Cali viejo de Casa Naranja.",
            "La presencia de los yanaconas en su origen conecta el sitio con el Museo Popular de Siloé, que también narra esa raíz indígena de la ciudad."
        ],
        horario: 'Abierto al público en horario diurno.',
        tarifa: 'Ingreso libre.',
        direccion: 'Centro-norte de Cali.',
        tipo: 'Sitios Históricos / Otros'
    },

    // Tanda 9
    {
        nombre: 'Iglesia de San Antonio',
        descripcion: 'Coronando la colina que lleva su nombre, al occidente del centro, la Capilla de San Antonio es una de las reliquias coloniales más queridas de Cali. Su fachada blanca de adobe contrasta con el verde de la loma, y desde su atrio se abre una de las mejores panorámicas de la ciudad. Construida entre 1746 y 1747 con la técnica del calicanto, reúne tres estilos: barroco en el altar interior, mudéjar en el frente —con su arco de medio punto— y colonial en el techo de teja. En su interior guarda un altar mayor barroco y valiosas tallas de madera del siglo XVII, de estilo quiteño, presididas por San Antonio de Padua.',
        importancia: 'Es una de las iglesias más antiguas de Cali y un Bien de Interés Cultural (BIC N-20). La colina, la capilla y el parque que la rodea forman uno de los rincones más entrañables de la caleñidad: allí sube la gente al atardecer a comer obleas, tumbarse en el césped, escuchar cuenteros los fines de semana y contemplar la ciudad. La capilla dio nombre a la colina y al barrio San Antonio, hoy corazón bohemio y patrimonial de Cali.',
        datos_historicos: '1742: el párroco José de Alegría y Cayzedo impulsa una viceparroquia en la colina para facilitar la misa a los fieles de San Fernando, La Chanca y El Peñón.\n1746: Juan Francisco Garcés de Aguilar dona el terreno; se inicia la construcción, erigida en 1747.\n1944: al cumplir 200 años se restaura; ese mismo año la venta de la colina generó tal rechazo comunitario que el municipio debió comprarla y convertirla en parque público.',
        datos_curiosos: [
            "A San Antonio se le pide pareja con la frase popular \"San Antonio, dame novio\", además de ayudar a encontrar objetos perdidos y proteger a los hijos.",
            "La colina detrás de la iglesia conecta con el parque del acueducto que baja hacia el Zoológico."
        ],
        horario: 'La colina y el parque están abiertos todo el día; la capilla abre en horarios de misa y visita.',
        tarifa: 'Entrada gratuita.',
        direccion: 'Cima de la Colina de San Antonio, barrio San Antonio.',
        tipo: 'Sitios Históricos / Otros'
    },
    {
        nombre: 'Iglesia de San Nicolás',
        descripcion: 'En el centro de Cali, frente al parque de San Nicolás (o Parque 20 de Julio), se levanta la iglesia que le dio nombre a uno de los barrios fundacionales de la ciudad. La antigua capilla de adobe, dedicada a San Nicolás de Bari, se comenzó hacia 1770 frente a la plaza; el barrio, que primero se llamó "El Vallano", fue adoptando poco a poco el nombre del templo. El edificio que hoy vemos, más amplio, se empezó a construir en 1880 y se terminó en 1926, tras demoler la vieja capilla averiada por el terremoto de 1925.',
        importancia: 'San Nicolás es uno de los barrios más antiguos y con más historia de Cali, y su iglesia es su corazón simbólico. El sector se convirtió con el tiempo en la cuna de la industria de las artes gráficas de la ciudad —allí se consolidó, entre otras, la Carvajal S.A.—, y fue escenario de una de las mayores tragedias de la historia de Cali: la explosión del 7 de agosto de 1956, cuando estallaron unos camiones cargados de dinamita cerca de la estación del ferrocarril, arrasando buena parte del sector.',
        datos_historicos: 'Hacia 1770: se inicia la capilla de adobe dedicada a San Nicolás de Bari.\n4 de enero de 1848: es erigida como parroquia, segregada del curato de San Pedro.\n1880–1926: se construye el templo actual, tras el terremoto de 1925.',
        datos_curiosos: [
            "En el parque contiguo se levanta la estatua del prócer caleño Ignacio de Herrera y Vergara.",
            "Junto a la iglesia se encuentra también el histórico Teatro San Nicolás."
        ],
        horario: 'Abierta al público en horas del día y en horarios de misa; se recomienda visitarla de día.',
        tarifa: 'Entrada gratuita.',
        direccion: 'Carreras 5ª–6ª con Calles 19–20, barrio San Nicolás.',
        tipo: 'Sitios Históricos / Otros'
    },
    {
        nombre: 'Estadio Olímpico Pascual Guerrero',
        descripcion: 'En el barrio San Fernando, entre la Calle 5ª y la Avenida Roosevelt, late uno de los templos deportivos más históricos de América Latina: el estadio Olímpico Pascual Guerrero, "El Pascual". Inaugurado el 20 de julio de 1937 —el mismo año en que Cali celebraba su IV Centenario—, lleva el nombre del poeta y dirigente deportivo palmireño Pascual Guerrero, que donó los terrenos de su finca e impulsó la obra. Nació con capacidad para 6.500 espectadores bajo el nombre de "Estadio Departamental"; hoy, tras sucesivas remodelaciones, alberga cerca de 38.000.',
        importancia: 'Es la casa del América de Cali y corazón de la Unidad Deportiva San Fernando, el complejo que le valió a la ciudad el título de "Capital Deportiva de América". El Pascual ha sido sede de los tres eventos deportivos más importantes celebrados en Colombia: los VI Juegos Panamericanos (1971), la Copa Mundial Sub-20 (2011) y los Juegos Mundiales (2013), además de la Copa América 2001 y la Copa América Femenina 2022. Su peso en la identidad caleña es tal que aparece nombrado en "Cali Pachanguero", el himno salsero del Grupo Niche.',
        datos_historicos: '20 de julio de 1937: inauguración, con un Torneo Panamericano de Fútbol por los 400 años de Cali; el primer partido, Colombia 3 - México 1.\n1971: gran ampliación para los Juegos Panamericanos; allí se encendió el pebetero y se realizó la ceremonia inaugural.\n2009–2011: remodelación integral para el Mundial Sub-20.',
        datos_curiosos: [
            "Curiosamente, las hinchadas de América y Deportivo Cali ocupan la misma tribuna (la parte alta del sur), al revés de la costumbre mundial.",
            "El 17 de noviembre de 1982, durante un Clásico Vallecaucano, una trágica estampida en los minutos finales dejó una veintena de muertos: uno de los episodios más dolorosos de su historia."
        ],
        horario: 'Abierto en días de partido y eventos; el exterior y sus alrededores se pueden recorrer libremente.',
        tarifa: 'Boletería según el evento.',
        direccion: 'Barrio San Fernando, entre la Calle 5ª y la Avenida Roosevelt.',
        tipo: 'Deportes y Recreación'
    },
    {
        nombre: 'Coliseo El Pueblo',
        descripcion: 'Con su silueta que parece una nave espacial posada en el sur de Cali, el Coliseo El Pueblo es uno de los íconos de la arquitectura moderna de la ciudad. Fue diseñado por los arquitectos Enrique Richardson y Libia Yusti —pioneros de la modernidad caleña, formados en Francia—, con el cálculo estructural del ingeniero Guillermo González Zuleta. Se inauguró en julio de 1971 para los VI Juegos Panamericanos y tiene capacidad para unos 12.000 espectadores.',
        importancia: 'El Coliseo El Pueblo es parte del legado de los Juegos Panamericanos de 1971, el evento que "partió en dos la historia de Cali": modernizó la ciudad con su aeropuerto, la villa panamericana, las piscinas Alberto Galindo, el velódromo y las grandes avenidas, y la consagró como Capital Deportiva de América. En sus graderías se han vivido eventos de talla mundial, como los Campeonatos Mundiales de Baloncesto de 1975 y 1982, los Juegos Mundiales de 2013 y el Mundial de Fútbol de Salón de la FIFA.',
        datos_historicos: '22 de julio de 1967: Cali es elegida sede de los Panamericanos en Winnipeg (Canadá), superando a Santiago de Chile.\n6 de noviembre de 1968: para organizar los Juegos, el gobierno crea Coldeportes (hoy Ministerio del Deporte).\nJulio de 1971: inauguración del coliseo, dentro del complejo de la Unidad Deportiva Alberto Galindo.',
        datos_curiosos: [
            "El emblema de aquellos Juegos se inspiró en una figura de la orfebrería de la cultura Calima, y sus colores (rojo, blanco y negro) vinieron del América de Cali.",
            "El campus de la Universidad del Valle sirvió de villa olímpica para varias delegaciones."
        ],
        horario: 'Abierto en días de evento deportivo o cultural, según agenda.',
        tarifa: 'Boletería según el evento.',
        direccion: 'Unidad Deportiva Alberto Galindo, sur de Cali.',
        tipo: 'Deportes y Recreación'
    },
    {
        nombre: 'Colegio de Santa Librada',
        descripcion: 'En el centro de Cali, el Colegio de Santa Librada es el más antiguo de la ciudad y una de las primeras instituciones de educación pública del suroccidente colombiano. Fue fundado el 29 de enero de 1823 por decreto del general Francisco de Paula Santander, entonces vicepresidente de la Gran Colombia, aprovechando la ley que suprimía conventos menores para financiar la educación republicana. Su nombre honra a Santa Librada, mártir portuguesa cuya festividad cae el 20 de julio, día de la independencia. Su edificación conserva rasgos coloniales, republicanos y modernos que lo hacen parte del interés patrimonial de Cali.',
        importancia: 'Santa Librada es un pilar de la memoria caleña: por sus aulas pasaron los intelectuales que moldearon la ciudad y la región durante dos siglos, y su historia está entretejida con la política nacional —participó, de una u otra forma, en las guerras del siglo XIX, sirvió de cuartel y fue foco del movimiento estudiantil—. Su hito más importante para la ciudad: en 1945 fue la primera sede de la recién creada Universidad Industrial del Valle, que años después sería la Universidad del Valle. Es, literalmente, la cuna de Univalle.',
        datos_historicos: '29 de enero de 1823: fundación por decreto de Santander; instalación solemne el 18 de octubre de 1823, con los primeros 27 estudiantes.\nDécadas de 1940: el colegio se traslada de su antigua sede (el Convento de San Agustín, Carrera 4 con Calle 13) a su ubicación actual en el barrio San Bosco.\n2023: celebra su bicentenario; ese mismo año el Distrito obtuvo el título que lo reconoce como patrimonio público de los caleños.',
        datos_curiosos: [
            "Entre sus egresados está el poeta nadaísta Jotamario Arbeláez.",
            "Se eligió el nombre de la santa por coincidir su fiesta (20 de julio) con la fecha del grito de independencia nacional."
        ],
        horario: 'Institución educativa pública en funcionamiento.',
        tarifa: 'No aplica.',
        direccion: 'Carrera 15 con Calle 7ª, barrio San Bosco.',
        tipo: 'Institucional'
    }
];

let sql = `INSERT INTO public.sites (nombre, descripcion, importancia, datos_historicos, datos_curiosos, horario, tarifa, direccion, tipo) VALUES\n`;
sql += sitios.map(s => `(
    '${s.nombre.replace(/'/g, "''")}',
    '${s.descripcion.replace(/'/g, "''")}',
    '${s.importancia.replace(/'/g, "''")}',
    '${s.datos_historicos.replace(/'/g, "''")}',
    ARRAY[${s.datos_curiosos.map(x => `'${x.replace(/'/g, "''")}'`).join(',')}]::text[],
    '${s.horario.replace(/'/g, "''")}',
    '${s.tarifa.replace(/'/g, "''")}',
    '${s.direccion.replace(/'/g, "''")}',
    '${s.tipo.replace(/'/g, "''")}'
)`).join(',\n') + ';';

fs.writeFileSync('insert_8_9.sql', sql);
console.log('SQL generated in insert_8_9.sql');
