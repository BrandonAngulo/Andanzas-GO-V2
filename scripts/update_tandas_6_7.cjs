require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const sitios = [
    {
        nombre: 'Swing Latino',
        descripcion: 'Swing Latino es la escuela de baile que llevó el estilo caleño de la salsa a los escenarios más grandes del mundo. Su fundador y alma, Luis Eduardo Hernández "El Mulato" —nacido en 1968 y llegado a Cali a los cinco años—, empezó su vida artística en 1982 dentro del Programa El Diamante, dirigido por Orlando Cajamarca, el mismo del grupo Teatro Esquina Latina. De esa semilla comunitaria, en un barrio popular del oriente, creció a lo largo de los años noventa una de las compañías de salsa más premiadas del planeta.\n\nLo que distingue a Swing Latino es el "estilo caleño": pies vertiginosos, swing y acrobacias imposibles que la escuela ayudó a consolidar como una categoría propia del baile de salsa. Sus bailarines han sido campeones mundiales en múltiples ocasiones, han recorrido más de 120 países y bailaron en el show central del Super Bowl 2020 junto a Jennifer López y Shakira. Pero detrás del brillo hay una misión social intacta: la fundación sigue formando a niñas, niños y jóvenes de sectores vulnerables, usando el baile como herramienta de cambio.',
        importancia: 'Una de las escuelas de salsa más premiadas del mundo y gran embajadora del "estilo caleño"; proyecto artístico y social nacido en un barrio popular de Cali.',
        datos_historicos: 'El Mulato inició su camino artístico en 1982 en el Programa El Diamante (dirigido por Orlando Cajamarca, de Esquina Latina), y a lo largo de los años noventa consolidó la Fundación Escuela de Baile Swing Latino. Ganó el Mundial de la Federación de Baile de Salsa (Miami, 2005) y el Campeonato de Salsa de Las Vegas (2006 y 2007, transmitido por ESPN).',
        datos_curiosos: [
            "Bailaron en el show central del Super Bowl 2020 junto a Jennifer López y Shakira.",
            "El Mulato fue nombrado primer \"Embajador Naranja\" del país por el Ministerio de Cultura (2020).",
            "La compañía ha llevado la salsa caleña a más de 120 países."
        ],
        horario: 'Escuela con clases y ensayos; consultar programación.',
        tarifa: 'Clases y espectáculos con costo según programación.',
        direccion: 'Cali (sede vinculada al centro de danzas del proyecto).'
    },
    {
        nombre: 'Mulato Cabaret', // The user provided 'El Mulato Cabaret', I will match using ILIKE
        nombre_buscar: '%Mulato Cabaret%',
        descripcion: 'El Mulato Cabaret es el primer cabaret latino de Colombia: un espectáculo de salsa de gran formato creado por Luis Eduardo Hernández "El Mulato" y la compañía Swing Latino. Nacido hacia 2017, lleva la salsa caleña al terreno del show teatral —vestuario, luces, coreografía de alto vuelo—, construido, en palabras de la propia compañía, "desde y para el baile", con la ambición de volverse un referente internacional del espectáculo latino.\n\nEs la cara escénica y nocturna del universo Swing Latino: donde la escuela forma y compite, el cabaret celebra y muestra. Un plan pensado para vivir la salsa de Cali como espectáculo, con la factura de una compañía que ha pisado los escenarios más exigentes del mundo.',
        importancia: 'Primer cabaret latino de Colombia y vitrina escénica del estilo caleño de la salsa, de la mano de Swing Latino.',
        datos_historicos: 'Fue inaugurado hacia 2017 por El Mulato y Swing Latino, como espectáculo insignia con el que se abrió su propio cabaret.',
        datos_curiosos: [
            "Es reconocido como el primer cabaret latino del país.",
            "Forma parte del mismo proyecto de la escuela Swing Latino, campeona mundial de salsa.",
            "Se ha presentado en temporadas asociadas a la Feria de Cali."
        ],
        horario: 'Funciones según temporada y programación.',
        tarifa: 'Entrada con costo según función.',
        direccion: 'Cali.'
    },
    {
        nombre_buscar: '%Catedral%San Pedro%',
        descripcion: 'Frente a la Plaza de Cayzedo, en pleno corazón del centro histórico, la Catedral de San Pedro Apóstol es el principal templo de Cali y sede de su arquidiócesis. Su historia es la de una obra paciente: la primera piedra se puso el 1 de septiembre de 1772, con diseño barroco del arquitecto Antonio García y —dato que la ata a la dura historia colonial— mano de obra de presos de las cárceles caleñas. Los retrasos políticos hicieron que solo se terminara en 1841, ya bajo cánones neoclásicos, y los terremotos de 1885, 1906 y 1925 la golpearon una y otra vez: la fachada que hoy vemos data de 1930.\n\nAdentro guarda tesoros: pinturas de la escuela quiteña, altares en pan de oro, la venerada imagen del Amo Caído y un imponente órgano tubular alemán de la casa Walcker —fabricado hacia 1925, de unas diez toneladas—, uno de los más grandes de Latinoamérica. Y bajo el altar mayor reposan los restos de Joaquín de Caicedo y Cuero, prócer de la independencia caleña. Más que un templo, es un testigo de piedra de casi toda la historia de la ciudad.',
        importancia: 'Principal templo católico de Cali, sede de la arquidiócesis y uno de los grandes hitos patrimoniales del centro histórico.',
        datos_historicos: 'La primera piedra se puso el 1 de septiembre de 1772 (párroco José Rivera; diseño de Antonio García); la obra se concluyó en 1841 en estilo neoclásico. Fue elevada a catedral en 1911 y a catedral metropolitana en 1964. Declarada Monumento Nacional (Res. 002 del 12 de marzo de 1982) y Bien de Interés Cultural Nacional (1 de diciembre de 2004).',
        datos_curiosos: [
            "Bajo el altar mayor reposan los restos de Joaquín de Caicedo y Cuero.",
            "Su órgano tubular alemán Walcker pesa cerca de diez toneladas.",
            "La fachada actual se construyó en 1930, tras los daños del terremoto de 1925."
        ],
        horario: 'Abierta al público en horarios de culto.',
        tarifa: 'Entrada libre.',
        direccion: 'Carrera 5 con Calle 11, Plaza de Cayzedo, centro, Cali.'
    },
    {
        nombre_buscar: '%Puente Ortiz%',
        descripcion: 'El Puente Ortiz fue el primer puente construido sobre el río Cali, y sigue siendo uno de los cruces más cargados de historia de la ciudad. La necesidad de un puente firme venía desde el siglo XVIII —los de guadua se deterioraban rápido—, y la obra definitiva la dirigió primero José Montehermoso y la terminó el fraile franciscano Fray José Ignacio Ortiz, oriundo de Candelaria e ingeniero aficionado, que trabajó entre 1842 y 1845 y entregó el puente en calicanto (ladrillo y piedra) en octubre de ese último año. Por él terminó llevando el nombre.\n\nConecta el centro —con La Ermita, el Teatro Jorge Isaacs y el Parque de los Poetas al sur— con la zona del CAM al norte. A lo largo de los años se amplió y hasta llegó a ser vehicular en 1950, para el paso de las "berlinas", antes de volver a ser peatonal. En 2011, durante las obras del hundimiento de la Avenida Colombia, aparecieron secciones originales de la estructura de 1840, hoy visibles bajo vidrio: una ventana literal al pasado de Cali bajo los pies de quien lo cruza.',
        importancia: 'Primer puente sobre el río Cali e ícono patrimonial del centro histórico; nexo entre la ciudad vieja y la moderna.',
        datos_historicos: 'Construido en su fase definitiva por Fray José Ignacio Ortiz entre 1842 y 1845, tras el trabajo inicial de José Montehermoso. Declarado Bien de Interés Cultural Nacional (Res. 0109 del 9 de febrero de 2005). En 2011 se hallaron y expusieron secciones originales de 1840.',
        datos_curiosos: [
            "Fray Ortiz, además de ingeniero aficionado, fundó la primera escuela para mujeres de Cali y trajo la primera imprenta.",
            "En 1950 dejó de ser peatonal para dar paso a las \"berlinas\" (autos de la época).",
            "Bajo un vidrio se pueden ver los restos de su estructura original de 1840."
        ],
        horario: 'Abierto todo el día (espacio público peatonal).',
        tarifa: 'Gratis.',
        direccion: 'Sobre el río Cali, entre La Ermita y el CAM, centro, Cali.'
    },
    {
        nombre_buscar: '%Parque de los Poetas%',
        descripcion: 'A un costado de La Ermita y frente al Teatro Jorge Isaacs, el Parque de los Poetas es un homenaje en bronce a la palabra vallecaucana. Inaugurado en 1995, reúne las esculturas de cinco grandes poetas del Valle —Jorge Isaacs, Carlos Villafañe, Ricardo Nieto, Antonio Llanos y Octavio Gamboa—, obra del maestro José Antonio Moreno. Las figuras, de tamaño real, invitan a sentarse junto a ellas: los visitantes se toman fotos con "su" poeta preferido mientras se refrescan con un cholao.\n\nEl parque se levanta donde alguna vez estuvo el Hotel Alférez Real, en uno de los rincones más simbólicos del centro, entre el río, el Puente Ortiz y la arquitectura republicana. Acoge con frecuencia recitales y eventos literarios, y en su entorno todavía trabajan los mecanógrafos con sus máquinas de escribir: un pequeño teatro cotidiano de la memoria escrita de la ciudad.',
        importancia: 'Homenaje a la poesía del Valle del Cauca y espacio literario del centro histórico, junto a La Ermita y el Teatro Jorge Isaacs.',
        datos_historicos: 'Inaugurado en 1995 como homenaje a la poesía vallecaucana, con cinco esculturas en bronce del maestro José Antonio Moreno. Se construyó donde antes se levantaba el Hotel Alférez Real.',
        datos_curiosos: [
            "Las esculturas, originalmente en bronce, fueron pintadas de verde años después.",
            "Rinde homenaje a Jorge Isaacs, autor de María, la gran novela del romanticismo colombiano.",
            "En sus andenes aún trabajan los tradicionales mecanógrafos con máquinas de escribir."
        ],
        horario: 'Abierto todo el día (espacio público).',
        tarifa: 'Gratis.',
        direccion: 'Entre carreras 1ª y 3ª con calle 12, junto a La Ermita, centro, Cali.'
    },
    {
        nombre_buscar: '%Hacienda Cañasgordas%',
        descripcion: 'En el sur de la ciudad, frente a la Universidad Autónoma de Occidente, la Hacienda Cañasgordas es una de las joyas coloniales más importantes del suroccidente colombiano. Su casona —antes llamada "Casa Grande"— data del siglo XVIII, y fue el corazón de la que llegó a ser la hacienda más grande, rica y productiva de la banda izquierda del río Cauca: un territorio de casi 50 km² trabajado por cientos de personas esclavizadas, cuya memoria afro es parte esencial del lugar.\n\nPerteneció por más de dos siglos a la familia Caicedo, que ostentó durante seis generaciones el título de Alférez Real. Allí vivió Joaquín de Cayzedo y Cuero, quien impulsó la firma del Acta del Cabildo del 3 de julio de 1810 —el Grito de Independencia de Cali, diecisiete días antes del florero de Llorente en Bogotá—. La hacienda es, además, el escenario de la célebre novela El Alférez Real de Eustaquio Palacios (1886). Restaurada entre 2010 y 2018, con excavaciones arqueológicas del ICANH que sacaron a la luz viviendas de esclavizados y un cementerio colonial, hoy es un polo de memoria e historia del sur de Cali.',
        importancia: 'Casa del último Alférez Real y cuna del Grito de Independencia de Cali (1810); escenario de la novela El Alférez Real y sitio de memoria colonial y afro.',
        datos_historicos: 'Casona del siglo XVIII, residencia de Joaquín de Cayzedo y Cuero, donde se firmó el Acta del Cabildo del 3 de julio de 1810. Declarada Bien de Interés Cultural Nacional (decreto 191 del 31 de enero de 1980). El ICANH adelantó investigación arqueológica (2010–2017) y fue restaurada entre 2010 y 2018.',
        datos_curiosos: [
            "Fue construida con la técnica del \"embutido de barro\", hoy casi extinta.",
            "Su cementerio colonial tuvo tumbas en uso hasta 1862.",
            "Inspiró la novela El Alférez Real, que lleva más de treinta ediciones."
        ],
        horario: 'Lunes a viernes desde las 9:00 a.m.',
        tarifa: 'Consultar con la Fundación Cañasgordas.',
        direccion: 'Vía Cali–Jamundí (Panamericana), frente a la Universidad Autónoma de Occidente, sur de Cali.'
    },
    {
        nombre_buscar: '%Teatro La Máscara%',
        descripcion: 'Teatro La Máscara es uno de los grupos de teatro más longevos de Cali y un referente del teatro de mujeres en Colombia. Nació en 1972 alrededor del Teatro Experimental de Cali (TEC), como un colectivo mixto. Pero a comienzos de los años ochenta, en medio de la persecución política que golpeó a artistas y activistas, el grupo quedó conformado por sus mujeres, y bajo la dirección de Lucy Bolaños tomó una decisión pionera: convertirse en un teatro de género, poniendo en escena temas hasta entonces silenciados —el aborto, la prostitución, la violencia contra las mujeres—.\n\nSu compromiso les costó caro: en 1988 debieron exiliarse cerca de año y medio, con giras forzadas por Costa Rica, Nicaragua, México y Cuba, donde se encontraron con la artista Patricia Ariza y montaron Mujeres en trance de viaje, sobre su propia experiencia de destierro. Desde 1994 tienen sala propia en el barrio San Antonio, con aforo para 103 personas. Integran la red internacional Magdalena Project y son parte del programa de Salas Concertadas: medio siglo largo de teatro hecho desde el cuerpo, la palabra y la resistencia.',
        importancia: 'Grupo pionero del teatro de género y feminista en Colombia; sala emblemática de San Antonio con más de cincuenta años de trayectoria.',
        datos_historicos: 'Fundado en 1972 alrededor del TEC. A comienzos de los ochenta, Lucy Bolaños lo transformó en colectivo de teatro de género. En 1988 sufrió un exilio forzado de año y medio por amenazas políticas. Abrió su sala propia en San Antonio en 1994.',
        datos_curiosos: [
            "Es uno de los primeros grupos de teatro feminista de Colombia.",
            "Durante su exilio en Cuba conocieron a la artista Patricia Ariza.",
            "Su sala, en San Antonio, tiene un aforo de 103 personas."
        ],
        horario: 'Funciones y talleres según programación.',
        tarifa: 'Entrada con costo según función.',
        direccion: 'Barrio San Antonio, Cali.'
    },
    {
        nombre_buscar: '%Torre de Cali%',
        descripcion: 'Con 45 pisos y unos 186 metros de altura (211 con la antena), la Torre de Cali es el edificio más alto de la ciudad y uno de los más altos de Colombia. Se levanta a orillas del río Cali, en la Avenida de las Américas, barrio Versalles, en pleno centro financiero. Fue construida entre 1978 y 1984, con diseño del arquitecto Jaime Vélez y la colaboración de Julián Echeverri, y en su base incorpora un sistema antisísmico que fue tecnología de punta para la época. Alberga oficinas de bancos y corporaciones, y un hotel cinco estrellas —el Torre de Cali Plaza Hotel, abierto en 1988—, cuyo mirador y bar en la cima ofrecen una de las mejores vistas de la ciudad.\n\nSu historia también carga capítulos duros que conviene no olvidar: durante la construcción murieron alrededor de veinte obreros al caer un andamio desde el piso 37, y el 5 de mayo de 2001 un carro bomba —atribuido al ELN— explotó frente a la torre, dejando decenas de heridos. La Torre resume, en su silueta, tanto la ambición modernizadora de Cali como las cicatrices de una época violenta.',
        importancia: 'Edificio más alto de Cali e ícono del skyline y del centro financiero de la ciudad; mirador urbano de referencia.',
        datos_historicos: 'Construida entre 1978 y 1984 (arquitecto Jaime Vélez con Julián Echeverri). Su hotel cinco estrellas abrió en 1988. El 5 de mayo de 2001 sufrió un atentado con carro bomba atribuido al ELN.',
        datos_curiosos: [
            "Cuenta con un sistema antisísmico en la base, pionero para su época.",
            "Su mirador, en los pisos más altos, permite ver casi toda la ciudad.",
            "Es el edificio más alto del Valle del Cauca."
        ],
        horario: 'Mirador/bar del hotel, según horario del establecimiento (suele abrir en la tarde).',
        tarifa: 'Acceso al mirador/bar sujeto a consumo.',
        direccion: 'Avenida de las Américas 18N-26, barrio Versalles, norte-centro, Cali.'
    },
    {
        nombre_buscar: '%Museo%Ciencias Naturales%',
        descripcion: 'El Museo de Ciencias Naturales es la gran ventana de Cali a la biodiversidad del Valle del Cauca, y un lugar entrañable en la memoria de varias generaciones de caleños que lo visitaron en salidas escolares. Sus raíces van a 1942, cuando la Gobernación contrató al ictiólogo Cecil Miles para estudiar los peces de la región; de allí creció una colección que en 1963 se formalizó como museo, por iniciativa del biólogo y ornitólogo Federico Carlos Lehmann Valencia, cuyo nombre lleva desde su muerte en los años setenta. Pertenece al INCIVA y desde 2003 ocupa la Manzana del Saber, junto a la Biblioteca Departamental y el Museo Abrakadabra.\n\nQuien creció en Cali recuerda sus piezas icónicas: el esqueleto de ballena jorobada colgado del techo, "Truncho" el tigre de Bengala, "Rina" la rinoceronte, "Carlitos" la tortuga galápago, el águila harpía y el cóndor de los Andes. Importante: el museo cerró sus puertas en 2021 para una renovación completa (proyecto MALVA / Manzana del Saber fase II, con Parque Explora), así que conviene verificar su reapertura antes de programar una visita.',
        importancia: 'Principal museo de historia natural del suroccidente colombiano; espacio de divulgación científica y memoria pedagógica de la ciudad.',
        datos_historicos: 'Con origen en una colección de 1942, fue fundado en 1963 (Decreto 0510 del 20 de agosto) por iniciativa de Federico Carlos Lehmann Valencia, y abrió el 16 de diciembre de ese año como Museo de Historia Natural. Del INCIVA, se trasladó en 2003 a la Manzana del Saber (Av. Roosevelt #24-80).',
        datos_curiosos: [
            "Un esqueleto de ballena jorobada cuelga del techo del área de ingreso.",
            "\"Truncho\", un tigre de Bengala, ha sido su pieza más icónica.",
            "Cerró en 2021 para una renovación museográfica integral."
        ],
        horario: 'Cerrado temporalmente por renovación. Al reabrir: lun–vie 8:00 a.m.–5:00 p.m.; sáb, dom y festivos 10:00 a.m.–4:00 p.m.',
        tarifa: '(Cuando abierto) Adultos $10.000; niños/estudiantes $7.500; adultos mayores y PcD $5.000; extranjeros 10 USD.',
        direccion: 'Avenida Roosevelt #24-80, Manzana del Saber, Cali.'
    },
    {
        nombre_buscar: '%Ciudad Jardín%',
        descripcion: 'Ciudad Jardín es hoy una de las grandes zonas gastronómicas y de vida nocturna de Cali, en el sur de la ciudad (Comuna 22). Lo que empezó en septiembre de 1962 como una urbanización de lujo sobre potreros y cañaduzales —"Ciudad Jardín San Joaquín", diseñada por la firma Cuéllar Serrano Gómez, con lotes que no podían medir menos de 1.500 m²— se transformó, con las décadas, en un sector exclusivo y arborizado que combina residencias, universidades y una densa oferta de restaurantes y bares.\n\nAlrededor de la Carrera 105 y sus calles se despliega alta cocina, cocina internacional, parrillas, terrazas al aire libre y algunas de las discotecas más reconocidas de la ciudad. Está rodeado de universidades (Javeriana, San Buenaventura, ICESI, Libre), grandes centros comerciales como Jardín Plaza y Unicentro, y reservas naturales como el Humedal La Babilla y el Zanjón del Burro, que le dan un respiro verde. Es la puerta natural hacia Pance y Jamundí, y punto de encuentro nocturno del sur caleño.',
        importancia: 'Principal zona gastronómica y de vida nocturna del sur de Cali; sector residencial exclusivo con fuerte oferta de restaurantes, bares y comercio.',
        datos_historicos: 'La urbanización se originó en septiembre de 1962 como "Ciudad Jardín San Joaquín" (firma Cuéllar Serrano Gómez), sobre antiguos potreros y cañaduzales del sur. Con el tiempo se consolidó como zona gastronómica y de entretenimiento de la Comuna 22.',
        datos_curiosos: [
            "Sus lotes originales no podían medir menos de 1.500 m².",
            "Colinda con las reservas naturales del Humedal La Babilla y el Zanjón del Burro.",
            "Es la conexión natural hacia Pance y Jamundí."
        ],
        horario: 'Zona abierta; restaurantes y bares con horarios propios (fuerte movimiento nocturno).',
        tarifa: 'Acceso libre; consumo según cada establecimiento.',
        direccion: 'Comuna 22, sur de Cali (eje Carrera 105 / Avenida Cañasgordas).'
    },
    {
        nombre_buscar: '%Museo Popular de Siloé%',
        descripcion: 'En una casa de fachada pintada a mano en el barrio El Cortijo, comuna 20, funciona uno de los museos más singulares de Colombia: un lugar donde está prohibido hacer silencio. El Museo Popular de Siloé no se parece a ningún otro. Aquí se puede gritar, tocar los objetos, tomar fotos, cantar y dejar la propia huella. Sus creadores lo llaman "contramuseo": una apuesta política y estética que le devuelve al barrio el poder de contar su propia historia, contra la lógica del museo tradicional —silencioso, de vitrinas intocables y curaduría de expertos—. Fue fundado en agosto del año 2000 por David Gómez, líder comunitario, guía voluntario e historiador empírico nacido y criado en la ladera, y lo sostiene la misma comunidad: las piezas son donadas por los vecinos y la curaduría nace del diálogo, la memoria y hasta el conflicto.\n\nEs la casa de David, y también es Siloé entero. Zapatos que cuelgan del techo, una bicicleta quemada en la entrada, violines en la pared, fotos de los años 50, máscaras, cascos, un trozo de carbón, disfraces de diablo. Todo aparente caos que se ordena cuando David narra: cada objeto tiene una historia, y esa historia es memoria del territorio. El museo entiende que el barrio mismo es el museo, y por eso su equipo ofrece desde 1998 la Ruta Turística por Siloé y las "caminatas de memoria" por las empinadas calles, gradas y callejones de la comuna. Practican lo que llaman "museología viva": dar la palabra a quienes históricamente fueron silenciados.',
        importancia: 'Una de las experiencias de memoria comunitaria autogestionada más importantes del país, y un referente de cómo un territorio estigmatizado puede reescribir su propio relato. Frente a la imagen que los grandes medios han fijado de Siloé, el museo custodia y visibiliza las múltiples memorias del barrio.',
        datos_historicos: 'El museo narra a Siloé desde sus raíces más hondas: los indígenas yanaconas, los africanos esclavizados y los mineros de Marmato (Caldas) que llegaron atraídos por el carbón —Siloé está literalmente construido sobre socavones—. Guarda una sala dedicada al conflicto armado y a la memoria del M-19.',
        datos_curiosos: [
            "El lema que recibe al visitante: \"Prohibido hacer silencio. Att. La Memoria de Siloé\".",
            "El único requisito para que un objeto entre al museo es que cuente algo, que sea memoria del territorio.",
            "El museo se articula con el recorrido de la ladera que incluye el mirador de La Estrella de Siloé."
        ],
        horario: 'Abierto a toda hora o por cita previa.',
        tarifa: 'Entrada gratuita.',
        direccion: 'Calle 9 Oeste #50-18, barrio El Cortijo, Siloé, Comuna 20.'
    },
    {
        nombre_buscar: '%Edificio Otero%',
        descripcion: 'En una esquina de la Plaza de Cayzedo, frente al corazón fundacional de Cali, se alza el Edificio Otero: una mole ecléctica de inspiración republicana francesa que cambió para siempre el paisaje del centro. Su historia empieza con un sueño europeo. El empresario Emiliano Otero, deslumbrado por la arquitectura que había visto en sus viajes, decidió traer a Cali un edificio a la altura de los que admiraba en el viejo continente. En 1916 compró la casa del coronel Ocampo, la mandó demoler y encargó la obra a la firma Borrero y Ospina, que la levantó entre 1922 y 1926.\n\nEl Otero fue el primer edificio de Cali construido con estructura en hormigón armado, dejando a los muros el papel de simple cerramiento: una innovación técnica que permitía más altura, más ligereza y más libertad decorativa. Con él prácticamente arrancó la sustitución de la vieja arquitectura colonial por el eclecticismo académico europeo y las técnicas modernas. Su fachada mezcla elementos renacentistas y barrocos, y en la esquina una cúpula con óculos corona un volumen ochavado que le da verticalidad y rompe la simetría.',
        importancia: 'Junto con el Palacio Nacional que tiene enfrente, el Edificio Otero conforma el llamado "costado republicano" de la Plaza de Cayzedo, y es uno de los hitos del paseo patrimonial de la Calle 12. Está declarado Monumento Nacional.',
        datos_historicos: '1916: Emiliano Otero compra y demuele la casa del coronel Ocampo. 1922–1926: construcción por la firma Borrero y Ospina. Durante sus primeros años fue epicentro de la vida social caleña. 25 de julio de 1977: declarado Monumento Nacional.',
        datos_curiosos: [
            "El actor de Hollywood Tyrone Power se hospedó en el Hotel Europa en 1939.",
            "La firma Borrero y Ospina se consolidó, prácticamente con este edificio, como la más importante casa de constructores de Cali.",
            "El edificio también tuvo un capítulo oscuro: en 1984 fue escenario de la llamada \"masacre del Diners Club\"."
        ],
        horario: 'Edificio de oficinas y sedes judiciales; no es de visita turística interior libre.',
        tarifa: 'No aplica (se aprecia desde el exterior).',
        direccion: 'Calle 12 con Carrera 5ª (esquina de la Plaza de Cayzedo).'
    },
    {
        nombre_buscar: '%Barrio Obrero%',
        descripcion: 'Si Cali es la capital mundial de la salsa, el barrio Obrero es su corazón. En este sector tradicional del centro, fundado hacia 1919, nació buena parte de la identidad musical de la ciudad. Desde finales de los años 30, el Obrero fue de los primeros en sintonizar la música cubana que llegaba por las frecuencias de onda corta de la radio, y en enamorarse del cine mexicano de rumberas. En las décadas del 50 y 60 se volvió punto de encuentro de melómanos, bailadores y coleccionistas de vinilos, y ese caldo terminó dando forma a lo que hoy conocemos como salsa caleña.\n\nCaminar el Obrero es caminar entre salsotecas, viejotecas y templos del long play, con la música a todo pulmón saliendo de lugares como Nelly Teka, El Chorrito Antillano, La Matraca o Melassa. Es también el barrio de las agua\'e lulo, de los melómanos que discuten a gritos por qué un acetato suena mejor que lo digital, y del parque Eloy Alfaro, donde —cuentan los vecinos— empezaron a reunirse los aficionados que fundarían el América de Cali.',
        importancia: 'El Obrero es uno de los símbolos más entrañables de la caleñidad y cuna reconocida de la salsa en la ciudad. Aquí se formó la Sonora Juventud en 1952, considerada la primera orquesta reconocida de Cali.',
        datos_historicos: 'Fundación del barrio hacia 1919. En 1952 nace la Sonora Juventud. Entre 2025 y 2026, la Alcaldía adelanta una renovación urbana histórica para consolidar el barrio como meca cultural y turística.',
        datos_curiosos: [
            "Su personaje más emblemático es Edulfamid Molina Díaz, \"Piper Pimienta\", quien hoy tiene su propia estatua.",
            "La renovación arrancó por iniciativa de los propios vecinos.",
            "En temporada de Feria, el \"remate\" natural del Encuentro de Melómanos termina en las aceras del Obrero."
        ],
        horario: 'Barrio abierto; la vida salsera se enciende sobre todo de tarde-noche (aprox. 6:00 p. m. a medianoche).',
        tarifa: 'Recorrido libre; consumos y entradas a salsotecas por aparte.',
        direccion: 'Sector central de Cali; eje aprox. carrera 11B con calle 24 (zona del Museo de la Salsa).'
    },
    {
        nombre_buscar: '%Cali Teatro%',
        descripcion: 'En una casa del tradicional barrio San Antonio funciona Cali Teatro, una de las salas independientes más amplias y mejor equipadas de la ciudad. La Fundación Escénica Cali Teatro nació en 1989 y, desde su sede propia, ha construido un espacio con capacidad para unos 150 espectadores en platea y palco, con antesala, cafetería y una exhibición permanente de material gráfico que da testimonio de su trayectoria. Durante cerca de diez meses al año programa temporadas de teatro con su elenco de planta y grupos invitados de la ciudad, el país y el exterior.',
        importancia: 'Con más de tres décadas de trabajo, Cali Teatro es un patrimonio vivo de las artes escénicas caleñas. Es reconocida como Sala Concertada con el Ministerio de Cultura y la Alcaldía.',
        datos_historicos: 'Fundación de la Fundación Escénica Cali Teatro en 1989. Ha realizado más de 38 montajes a lo largo de su historia. En 2021 se crea el festival "Muestra Alternativa de Teatro pero del Bueno Bueno".',
        datos_curiosos: [
            "Su sala de 150 sillas es de tipo cine, y el escenario cuenta con foso o trampa escénica.",
            "Buena parte de su programación reciente aborda temas sensibles y contemporáneos: salud mental, trastornos alimentarios, población LGBTIQ+."
        ],
        horario: 'Funciones según cartelera.',
        tarifa: 'Boletería según función.',
        direccion: 'Carrera 12 #4-51, barrio San Antonio.'
    },
    {
        nombre_buscar: '%Teatro al Aire Libre Los Cristales%',
        descripcion: 'Trepado en la ladera occidental de Cali, muy cerca de San Antonio, Los Cristales es uno de los escenarios más queridos de la ciudad: un gran anfiteatro al aire libre cuya concha acústica y graderías en terraza forman el marco perfecto para conciertos, cine bajo las estrellas y festivales. Además del escenario, el complejo tiene camerinos, oficinas y, en su parte alta, un amplio parque con nacimiento de agua, flora y una fauna especialmente rica en aves. Por sus tablas han pasado la salsa, el rock, la música clásica, la andina, el jazz y la chirimía.',
        importancia: 'Su concha acústica fue la primera de su tipo en toda Colombia, lo que convierte a Los Cristales en un referente de la infraestructura cultural al aire libre del país.',
        datos_historicos: 'La famosa concha acústica se construyó en 1986, por gestión de Hernando Botero O\'Byrne. Diseñada por el arquitecto Sigifredo Rojas y calculada por el ingeniero Camilo Niño Vélez. En 2025 se logró la titulación del predio a favor del Distrito.',
        datos_curiosos: [
            "El área construida del teatro ronda los 3.920 m²; el aforo teórico se cifra en 15.000 personas.",
            "El escenario mide 10 metros de ancho por dentro y se abre a 25 metros hacia el exterior.",
            "Su parte alta funciona casi como un pequeño ecoparque, con nacimiento de agua y aves."
        ],
        horario: 'Eventos según agenda.',
        tarifa: 'Los eventos públicos suelen ser gratuitos.',
        direccion: 'Carrera 14A Oeste #6-00 (noroccidente / ladera occidental).'
    },
    {
        nombre_buscar: '%Archivo Histórico de Cali%',
        descripcion: 'En el segundo piso del Centro Cultural de Cali se guarda, tomo a tomo, la memoria escrita de la ciudad. El Archivo Histórico de Cali es la entidad encargada de custodiar, organizar y difundir el patrimonio documental de los caleños, siguiendo los lineamientos del Archivo General de la Nación. En sus estantes reposan cerca de 9.000 tomos —unos 800 metros lineales— de documentación producida por las distintas figuras de gobierno que ha tenido la ciudad: el cabildo colonial, el municipio y hoy el distrito. Es uno de los lugares más importantes para investigar la historia de Cali, y también uno de los mejor guardados: su documento más antiguo es un acta del Cabildo de 1564.',
        importancia: 'Es la principal institución archivística de Cali y una ventana única al pasado colonial y republicano de la ciudad y la región. Sus documentos permiten reconstruir cómo Cali pasó de ser una pequeña localidad a una metrópoli.',
        datos_historicos: 'Fue creado mediante el Decreto Municipal N.º 378 del 24 de junio de 1958. Desde febrero del año 2000 se ubica de manera definitiva en el Centro Cultural de la ciudad. Organiza su acervo en cinco fondos documentales.',
        datos_curiosos: [
            "Cali se anticipó diez años a la Real Cédula de 1573 que ordenaba a los cabildos llevar Libros de Actas.",
            "Entre sus documentos hay cartas de libertad de personas esclavizadas.",
            "El documento más antiguo del Archivo de Cali es de 1564."
        ],
        horario: 'Lunes a viernes, 8:00 a. m.–12:00 m. y 2:00–5:30 p. m.',
        tarifa: 'Gratuito.',
        direccion: 'Centro Cultural de Cali, Sala 207 (2.º piso).'
    },
    {
        nombre_buscar: '%Universidad del Valle%',
        descripcion: 'Al sur de Cali, entre la avenida Pasoancho y las colinas de Pance, se extiende uno de los campus universitarios más grandes y hermosos de Colombia: la Ciudad Universitaria Meléndez de la Universidad del Valle. Sobre un millón de metros cuadrados que antes fueron cañaduzal, la "Univalle" levantó una ciudad-parque con lago artificial, arboledas y vista a los Farallones. Es la principal institución de educación superior del suroccidente colombiano, pública y de investigación, con más de 30.000 estudiantes, y su emblema —el búho— preside una vida académica y cultural que ha marcado la historia de la ciudad.',
        importancia: 'Fundada en 1945, Univalle "partió en dos la historia del departamento". Su campus de Meléndez es un hito arquitectónico y paisajístico, ganador del Premio Nacional de Arquitectura en 1972.',
        datos_historicos: 'Creada el 11 de junio de 1945 mediante la Ordenanza 12. En 1954 cambia su nombre a Universidad del Valle. Desde 1965 se construye la Ciudad Universitaria de Meléndez. En 1971 sirvió de villa olímpica para los Juegos Panamericanos.',
        datos_curiosos: [
            "El diseño arquitectónico fue coordinado por los arquitectos Jaime Cruz y Diego Peñalosa.",
            "El símbolo de la universidad es el búho, y su biblioteca central lleva el nombre de Mario Carvajal.",
            "Buena parte del campus permanece deliberadamente sin construir, como reserva verde."
        ],
        horario: 'Campus universitario; acceso según normas de la institución.',
        tarifa: 'No aplica.',
        direccion: 'Ciudad Universitaria Meléndez, Calle 13 #100-00, sur de Cali.'
    },
    {
        nombre_buscar: '%Lago de las Garzas%',
        descripcion: 'En plena comuna 22, al sur de la ciudad, el Ecoparque Lago de las Garzas es un oasis inesperado: un humedal y uno de los pocos remanentes de bosque seco tropical que le quedan a Cali, alimentado por las aguas del río Pance. Alrededor de su espejo de agua conviven garzas, tinguas, tortugas, ardillas, iguanas, mariposas y decenas de especies de aves residentes y migratorias, que llegan a descansar en su viaje entre continentes. Hay un muelle de madera para el avistamiento, senderos ecológicos y un ambiente pensado para la "recreación pasiva": observar, respirar y desconectarse sin alterar el ecosistema.',
        importancia: 'Más allá de su valor ambiental, el Lago de las Garzas es un lugar de memoria, refugio de biodiversidad y aula viva de educación ambiental.',
        datos_historicos: 'Nació de una tragedia: el accidente del vuelo 965 de American Airlines en 1995. En 1996 comenzaron los trabajos de recuperación y se sembraron 400 árboles en memoria de las víctimas. En 2002 fue incluido en el Plan de Ordenamiento Territorial.',
        datos_curiosos: [
            "Tiene una extensión aproximada de 4,7 hectáreas, con un lago de cerca de 0,8 hectáreas.",
            "Alberga más de 80 especies de aves y más de 70 de mariposas.",
            "Recibe alrededor de 60.000 visitantes al año."
        ],
        horario: 'Abierto al público; recorrido de senderos.',
        tarifa: 'Entrada gratuita.',
        direccion: 'Carrera 127 #16A-100, comuna 22 (Ciudad Jardín / Pance).'
    },
    {
        nombre_buscar: '%Galería Alameda%',
        descripcion: 'En el barrio Alameda, en el centro de Cali, hay un mercado que es mucho más que un sitio para comprar: es un viaje de los Andes al Pacífico en pocos pasos. La Galería Alameda —o Plaza de Mercado Alameda— es un laberinto de colores y aromas donde conviven frutas exóticas, verduras fresquísimas, carnes, flores y, sobre todo, la mejor cocina tradicional del Valle y del Pacífico colombiano. Aquí las cocineras venidas de Buenaventura —herederas de saberes culinarios que vienen desde los tiempos de la esclavitud— sirven sancocho de pescado con leche de coco, ceviche de camarón, sudados, rellena y tamal en platos enormes. Recorrerla es entrar en contacto con el espíritu popular, alegre y conversador de los caleños.',
        importancia: 'La Alameda es una de las primeras plazas de mercado de Cali y hoy un verdadero imán del turismo gastronómico, reconocida como guardiana de los sabores populares de la ciudad.',
        datos_historicos: 'El barrio Alameda fue fundado en octubre de 1930. La Plaza de Mercado tiene su origen hacia 1947. Hacia 1970 se levantó la mayor parte del edificio actual. Desde 1994 la maneja ASOALAMEDA.',
        datos_curiosos: [
            "Los primeros vendedores extendían sus productos sobre el piso.",
            "Entre sus tesoros hay frutas poco conocidas: madroño, chachairú, mangostino, zapote, arazá, chirimoya.",
            "Existen 'food tours' que salen desde San Antonio y tienen a la Alameda como parada estrella."
        ],
        horario: 'Abierta a diario; mayor actividad en las mañanas.',
        tarifa: 'Ingreso libre; consumos por aparte.',
        direccion: 'Carrera 26 #8-37, barrio Alameda (comuna 9).'
    },
    {
        nombre_buscar: '%Domus Teatro%',
        descripcion: 'En una vieja casona del barrio San Fernando, adaptada como casa-teatro, late Domus Teatro: una sala-estudio íntima, de esas pensadas no para llenar grandes aforos sino para formar público. Nacida en 1994 de la mano de Manuel Sierra y Luz Stella Gil, la Fundación Domus Teatro ofrece desde entonces una programación cultural permanente que abarca teatro, música, danza, exposiciones pictóricas y conversatorios. Sus salas son pequeñas —para 50 o 70 espectadores—, con la idea de cultivar, función a función, los espectadores que Cali necesita.',
        importancia: 'Con más de tres décadas de actividad ininterrumpida, Domus es una de las salas independientes que sostienen el rico tejido escénico caleño y forma parte de la Red de Teatro Independiente de Cali. Su papel fue decisivo en un momento clave: a finales de los años 90.',
        datos_historicos: '1994: fundación de Domus Teatro por Manuel Sierra y Luz Stella Gil. Finales de los 90: la sala impulsa un Festival de Salas en concierto. Ha mantenido repertorio propio y programación continua durante más de 31 años (dato a 2025).',
        datos_curiosos: [
            "Domus se define como \"sala-estudio\": la formación y la creación son tan importantes como la exhibición.",
            "Ha invitado a grupos de peso como Ditirambo (Bogotá).",
            "Su filosofía la resume una frase de sus fundadores a los artistas que invitan: \"Venga estudiamos\"."
        ],
        horario: 'Funciones según cartelera (habitualmente fines de semana).',
        tarifa: 'Boletería con descuento para estudiantes.',
        direccion: 'Carrera 25 #2-72, barrio San Fernando.'
    }
];

async function updateTanda() {
    console.log("Fetching sites...");
    const { data: dbSites, error: fetchError } = await supabase.from('sites').select('id, nombre');
    
    if (fetchError) {
        console.error("Error", fetchError);
        return;
    }

    for (const sitio of sitios) {
        // Find matching site
        let matchedSite = null;
        if (sitio.nombre_buscar) {
            const regexStr = sitio.nombre_buscar.replace(/%/g, '.*');
            const regex = new RegExp(regexStr, 'i');
            matchedSite = dbSites.find(s => regex.test(s.nombre));
        } else {
            matchedSite = dbSites.find(s => s.nombre.toLowerCase() === sitio.nombre.toLowerCase());
        }

        if (!matchedSite) {
            console.error(`Not found in DB: ${sitio.nombre || sitio.nombre_buscar}`);
            continue;
        }

        const updates = {
            descripcion: sitio.descripcion,
            importancia: sitio.importancia,
            datos_historicos: sitio.datos_historicos,
            datos_curiosos: sitio.datos_curiosos,
            horario: sitio.horario,
            tarifa: sitio.tarifa,
            direccion: sitio.direccion,
            descripcion_en: null,
            importancia_en: null,
            datos_historicos_en: null,
            datos_curiosos_en: null
        };

        const { error } = await supabase.from('sites').update(updates).eq('id', matchedSite.id);
        if (error) {
            console.error(`Error updating ${matchedSite.nombre}:`, error);
        } else {
            console.log(`✓ Updated ${matchedSite.nombre} successfully.`);
        }
    }
    console.log("All done.");
}

updateTanda();
