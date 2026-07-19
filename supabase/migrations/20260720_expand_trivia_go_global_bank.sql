-- Amplía TRIVIA GO como juego mundial y convierte Cali, Valle, Colombia y Mundo
-- en recorridos elegibles. La carga es idempotente por texto normalizado.

UPDATE public.game_questions
SET campaign = 'city_cali',
    updated_at = timezone('utc', now())
WHERE game_id = '81111111-1111-1111-1111-111111111111'
  AND status = 'published'
  AND campaign IS NULL;

UPDATE public.games
SET description = 'Recorre el mundo con preguntas de cultura, ciencia, lugares e historias. Elige un modo y descubre algo nuevo con Andi.'
WHERE id = '81111111-1111-1111-1111-111111111111';

WITH
capitals(country, answer, wrong_1, wrong_2, wrong_3) AS (
  VALUES
    ('Francia','París','Lyon','Marsella','Toulouse'),
    ('Japón','Tokio','Osaka','Kioto','Nagoya'),
    ('Australia','Canberra','Sídney','Melbourne','Perth'),
    ('Canadá','Ottawa','Toronto','Vancouver','Montreal'),
    ('Brasil','Brasilia','Río de Janeiro','São Paulo','Salvador'),
    ('Argentina','Buenos Aires','Córdoba','Mendoza','Rosario'),
    ('Perú','Lima','Cusco','Arequipa','Trujillo'),
    ('Ecuador','Quito','Guayaquil','Cuenca','Loja'),
    ('Chile','Santiago','Valparaíso','Concepción','Antofagasta'),
    ('México','Ciudad de México','Guadalajara','Monterrey','Puebla'),
    ('Estados Unidos','Washington D. C.','Nueva York','Los Ángeles','Chicago'),
    ('Alemania','Berlín','Múnich','Hamburgo','Fráncfort'),
    ('Italia','Roma','Milán','Nápoles','Turín'),
    ('Portugal','Lisboa','Oporto','Braga','Faro'),
    ('Grecia','Atenas','Salónica','Patras','Heraclión'),
    ('Egipto','El Cairo','Alejandría','Guiza','Luxor'),
    ('Kenia','Nairobi','Mombasa','Kisumu','Nakuru'),
    ('Marruecos','Rabat','Casablanca','Marrakech','Fez'),
    ('Nigeria','Abuya','Lagos','Kano','Ibadán'),
    ('India','Nueva Delhi','Mumbai','Calcuta','Chennai'),
    ('China','Pekín','Shanghái','Cantón','Shenzhen'),
    ('Corea del Sur','Seúl','Busan','Incheon','Daegu'),
    ('Tailandia','Bangkok','Chiang Mai','Phuket','Pattaya'),
    ('Vietnam','Hanói','Ciudad Ho Chi Minh','Da Nang','Hue'),
    ('Filipinas','Manila','Cebú','Dávao','Quezón'),
    ('Nueva Zelanda','Wellington','Auckland','Christchurch','Hamilton'),
    ('Noruega','Oslo','Bergen','Trondheim','Stavanger'),
    ('Suecia','Estocolmo','Gotemburgo','Malmö','Upsala'),
    ('Finlandia','Helsinki','Turku','Tampere','Espoo'),
    ('Dinamarca','Copenhague','Aarhus','Odense','Aalborg'),
    ('Islandia','Reikiavik','Akureyri','Keflavík','Selfoss'),
    ('Irlanda','Dublín','Cork','Galway','Limerick'),
    ('Austria','Viena','Salzburgo','Graz','Innsbruck'),
    ('Suiza','Berna','Zúrich','Ginebra','Basilea'),
    ('Bélgica','Bruselas','Amberes','Brujas','Gante'),
    ('Polonia','Varsovia','Cracovia','Gdansk','Lodz'),
    ('República Checa','Praga','Brno','Ostrava','Pilsen'),
    ('Hungría','Budapest','Debrecen','Szeged','Pécs'),
    ('Turquía','Ankara','Estambul','Esmirna','Bursa'),
    ('Arabia Saudita','Riad','Yeda','La Meca','Medina')
),
continents(country, answer, wrong_1, wrong_2, wrong_3) AS (
  VALUES
    ('Nepal','Asia','Europa','África','Oceanía'),
    ('Ghana','África','Asia','Europa','América del Sur'),
    ('Uruguay','América del Sur','América del Norte','Europa','Oceanía'),
    ('Jamaica','América del Norte','América del Sur','África','Oceanía'),
    ('Fiyi','Oceanía','Asia','África','Europa'),
    ('Albania','Europa','Asia','África','Oceanía'),
    ('Mongolia','Asia','Europa','África','América del Norte'),
    ('Senegal','África','Asia','Europa','América del Sur'),
    ('Bolivia','América del Sur','América del Norte','Europa','Asia'),
    ('Costa Rica','América del Norte','América del Sur','Europa','Oceanía'),
    ('Samoa','Oceanía','Asia','América del Sur','Europa'),
    ('Croacia','Europa','Asia','África','Oceanía'),
    ('Bután','Asia','Europa','África','América del Sur'),
    ('Tanzania','África','Asia','Europa','Oceanía'),
    ('Paraguay','América del Sur','América del Norte','Europa','África'),
    ('Panamá','América del Norte','América del Sur','Europa','Asia'),
    ('Papúa Nueva Guinea','Oceanía','Asia','África','América del Sur'),
    ('Serbia','Europa','Asia','África','Oceanía'),
    ('Laos','Asia','Europa','África','Oceanía'),
    ('Namibia','África','Asia','Europa','América del Sur')
),
currencies(country, answer, wrong_1, wrong_2, wrong_3) AS (
  VALUES
    ('Japón','Yen','Won','Yuan','Baht'),
    ('Reino Unido','Libra esterlina','Euro','Franco','Corona'),
    ('Estados Unidos','Dólar estadounidense','Libra','Euro','Peso'),
    ('México','Peso mexicano','Real','Sol','Quetzal'),
    ('Brasil','Real','Peso','Sol','Bolívar'),
    ('India','Rupia india','Yuan','Yen','Dinar'),
    ('China','Yuan','Yen','Won','Rupia'),
    ('Suiza','Franco suizo','Euro','Corona','Libra'),
    ('Corea del Sur','Won','Yen','Yuan','Baht'),
    ('Sudáfrica','Rand','Naira','Cedi','Dinar'),
    ('Turquía','Lira turca','Euro','Dinar','Rublo'),
    ('Polonia','Esloti','Euro','Corona','Florín'),
    ('Suecia','Corona sueca','Euro','Franco','Libra'),
    ('Noruega','Corona noruega','Euro','Franco','Rublo'),
    ('Tailandia','Baht','Yen','Won','Rupia')
),
department_capitals(department, answer, wrong_1, wrong_2, wrong_3) AS (
  VALUES
    ('Antioquia','Medellín','Manizales','Pereira','Armenia'),
    ('Atlántico','Barranquilla','Cartagena','Santa Marta','Sincelejo'),
    ('Bolívar','Cartagena','Barranquilla','Montería','Valledupar'),
    ('Boyacá','Tunja','Duitama','Sogamoso','Yopal'),
    ('Caldas','Manizales','Pereira','Armenia','Ibagué'),
    ('Cauca','Popayán','Pasto','Neiva','Mocoa'),
    ('Cesar','Valledupar','Riohacha','Santa Marta','Montería'),
    ('Córdoba','Montería','Sincelejo','Cartagena','Valledupar'),
    ('Cundinamarca','Bogotá','Tunja','Ibagué','Villavicencio'),
    ('Huila','Neiva','Florencia','Ibagué','Popayán'),
    ('Magdalena','Santa Marta','Barranquilla','Cartagena','Riohacha'),
    ('Meta','Villavicencio','Yopal','San José del Guaviare','Bogotá'),
    ('Nariño','Pasto','Popayán','Mocoa','Ipiales'),
    ('Norte de Santander','Cúcuta','Bucaramanga','Arauca','Tunja'),
    ('Quindío','Armenia','Pereira','Manizales','Ibagué'),
    ('Risaralda','Pereira','Armenia','Manizales','Medellín'),
    ('Santander','Bucaramanga','Cúcuta','Tunja','Barrancabermeja'),
    ('Tolima','Ibagué','Neiva','Armenia','Girardot'),
    ('Sucre','Sincelejo','Montería','Cartagena','Valledupar'),
    ('Amazonas','Leticia','Mitú','Inírida','Florencia')
),
custom_facts(campaign, category, level, question, answer, wrong_1, wrong_2, wrong_3, explanation) AS (
  VALUES
    ('world_general','Geografía mundial',1,'¿Cuál es el océano más grande del planeta?','Océano Pacífico','Océano Atlántico','Océano Índico','Océano Ártico','El Pacífico ocupa más superficie que cualquier otro océano.'),
    ('world_general','Geografía mundial',1,'¿En qué continente se encuentra el desierto del Sahara?','África','Asia','Oceanía','América del Sur','El Sahara se extiende por gran parte del norte de África.'),
    ('world_general','Geografía mundial',2,'¿Qué río atraviesa la ciudad de El Cairo?','Nilo','Danubio','Ganges','Mekong','El Cairo se desarrolló junto al río Nilo.'),
    ('world_general','Geografía mundial',2,'¿En qué cordillera se encuentra el monte Everest?','Himalaya','Andes','Alpes','Cáucaso','El Everest forma parte de la cordillera del Himalaya.'),
    ('world_general','Geografía mundial',1,'¿Qué mar separa principalmente Europa de África?','Mar Mediterráneo','Mar Caribe','Mar Rojo','Mar Báltico','El Mediterráneo se encuentra entre el sur de Europa y el norte de África.'),
    ('world_general','Geografía mundial',2,'¿Qué país tiene forma de bota en los mapas?','Italia','Grecia','Portugal','Croacia','La península italiana es reconocida por su forma de bota.'),
    ('world_general','Geografía mundial',2,'¿Cuál es la isla más grande del mundo, sin contar continentes?','Groenlandia','Madagascar','Borneo','Nueva Guinea','Groenlandia es la isla más extensa del planeta.'),
    ('world_general','Geografía mundial',2,'¿Qué estrecho separa Asia de América del Norte?','Estrecho de Bering','Estrecho de Gibraltar','Estrecho de Malaca','Estrecho de Ormuz','El estrecho de Bering separa Rusia de Alaska.'),
    ('world_general','Geografía mundial',1,'¿En qué país se encuentra la ciudad histórica de Petra?','Jordania','Egipto','Líbano','Turquía','Petra es una antigua ciudad excavada en roca situada en Jordania.'),
    ('world_general','Geografía mundial',2,'¿Qué lago comparten Perú y Bolivia?','Titicaca','Victoria','Baikal','Maracaibo','El lago Titicaca se ubica en la frontera entre Perú y Bolivia.'),
    ('world_general','Geografía mundial',2,'¿Cuál es el río más largo de Europa?','Volga','Danubio','Rin','Sena','El Volga es el río más largo de Europa.'),
    ('world_general','Geografía mundial',2,'¿En qué país se encuentra el monte Kilimanjaro?','Tanzania','Kenia','Etiopía','Uganda','El Kilimanjaro se levanta en el noreste de Tanzania.'),
    ('world_general','Geografía mundial',2,'¿Qué cataratas están en la frontera entre Zambia y Zimbabue?','Cataratas Victoria','Cataratas del Niágara','Cataratas del Iguazú','Salto Ángel','Las cataratas Victoria forman parte del río Zambeze.'),
    ('world_general','Geografía mundial',1,'¿Qué país alberga la mayor parte de la selva amazónica?','Brasil','Perú','Colombia','Bolivia','La mayor extensión de la Amazonía se encuentra en Brasil.'),
    ('world_general','Geografía mundial',2,'¿Qué canal conecta el mar Mediterráneo con el mar Rojo?','Canal de Suez','Canal de Panamá','Canal de Corinto','Canal de Kiel','El canal de Suez atraviesa Egipto y une ambos mares.'),
    ('world_general','Geografía mundial',2,'¿En qué país se encuentra la región de Transilvania?','Rumania','Hungría','Bulgaria','Serbia','Transilvania es una región histórica del centro de Rumania.'),
    ('world_general','Geografía mundial',1,'¿Qué país es conocido como la Tierra del Sol Naciente?','Japón','China','Corea del Sur','Tailandia','El nombre tradicional de Japón se relaciona con el origen del sol.'),
    ('world_general','Geografía mundial',2,'¿Qué río atraviesa París?','Sena','Támesis','Tíber','Rin','El Sena recorre París y divide parte de la ciudad en dos orillas.'),
    ('world_general','Geografía mundial',1,'¿En qué país se encuentran las pirámides de Guiza?','Egipto','Sudán','México','Irak','Las pirámides de Guiza se encuentran cerca de El Cairo, en Egipto.'),
    ('world_general','Geografía mundial',2,'¿Qué cadena montañosa marca una frontera natural entre Francia y España?','Pirineos','Alpes','Apeninos','Cárpatos','Los Pirineos se extienden entre Francia y España.'),
    ('world_general','Ciencia y naturaleza',1,'¿Qué planeta es conocido como el planeta rojo?','Marte','Venus','Júpiter','Mercurio','El óxido de hierro de su superficie da a Marte su color rojizo.'),
    ('world_general','Ciencia y naturaleza',1,'¿Cuál es el órgano más grande del cuerpo humano?','La piel','El hígado','El pulmón','El corazón','La piel cubre y protege todo el cuerpo.'),
    ('world_general','Ciencia y naturaleza',1,'¿Qué gas absorben las plantas durante la fotosíntesis?','Dióxido de carbono','Oxígeno','Nitrógeno','Helio','Las plantas utilizan dióxido de carbono para producir materia orgánica.'),
    ('world_general','Ciencia y naturaleza',1,'¿Cuál es la sustancia natural más dura?','Diamante','Cuarzo','Granito','Hierro','El diamante ocupa el valor máximo en la escala de dureza de Mohs.'),
    ('world_general','Ciencia y naturaleza',2,'¿Qué parte de la célula contiene principalmente el material genético?','Núcleo','Membrana','Citoplasma','Ribosoma','En las células eucariotas, la mayor parte del ADN está en el núcleo.'),
    ('world_general','Ciencia y naturaleza',1,'¿Cuántos huesos tiene normalmente un ser humano adulto?','206','186','226','246','El esqueleto adulto humano suele estar formado por 206 huesos.'),
    ('world_general','Ciencia y naturaleza',2,'¿Qué fuerza mantiene a los planetas en órbita alrededor del Sol?','Gravedad','Magnetismo','Fricción','Electricidad','La gravedad del Sol mantiene a los planetas en sus órbitas.'),
    ('world_general','Ciencia y naturaleza',1,'¿Qué mamífero puede volar de forma sostenida?','Murciélago','Ardilla voladora','Pingüino','Avestruz','Los murciélagos son los únicos mamíferos con vuelo activo sostenido.'),
    ('world_general','Ciencia y naturaleza',2,'¿Qué escala se usa para medir la acidez o alcalinidad?','pH','Richter','Kelvin','Beaufort','La escala de pH indica qué tan ácida o básica es una sustancia.'),
    ('world_general','Ciencia y naturaleza',1,'¿Qué estrella está más cerca de la Tierra?','El Sol','Sirio','Próxima Centauri','Betelgeuse','El Sol es la estrella de nuestro sistema planetario.'),
    ('world_general','Ciencia y naturaleza',2,'¿Qué vitamina produce la piel con ayuda de la luz solar?','Vitamina D','Vitamina C','Vitamina B12','Vitamina K','La radiación solar permite que la piel sintetice vitamina D.'),
    ('world_general','Ciencia y naturaleza',1,'¿Cuál es el animal terrestre más grande?','Elefante africano','Rinoceronte blanco','Hipopótamo','Jirafa','El elefante africano es el mayor animal terrestre actual.'),
    ('world_general','Ciencia y naturaleza',2,'¿Qué metal es líquido a temperatura ambiente?','Mercurio','Aluminio','Cobre','Plata','El mercurio permanece líquido en condiciones ambientales habituales.'),
    ('world_general','Ciencia y naturaleza',1,'¿Qué instrumento mide la temperatura?','Termómetro','Barómetro','Anemómetro','Higrómetro','El termómetro se utiliza para medir la temperatura.'),
    ('world_general','Ciencia y naturaleza',2,'¿Qué fenómeno transforma un líquido en gas desde su superficie?','Evaporación','Condensación','Fusión','Sublimación','La evaporación ocurre cuando moléculas de un líquido pasan al estado gaseoso.'),
    ('world_general','Ciencia y naturaleza',2,'¿Cuál es el planeta más grande del sistema solar?','Júpiter','Saturno','Neptuno','Urano','Júpiter es el planeta con mayor tamaño y masa del sistema solar.'),
    ('world_general','Ciencia y naturaleza',2,'¿Qué tipo de animal es una ballena?','Mamífero','Pez','Reptil','Anfibio','Las ballenas respiran aire, amamantan a sus crías y son mamíferos.'),
    ('world_general','Ciencia y naturaleza',2,'¿Qué capa protege a la Tierra de gran parte de la radiación ultravioleta?','Capa de ozono','Ionosfera','Troposfera','Núcleo terrestre','El ozono estratosférico absorbe gran parte de la radiación ultravioleta.'),
    ('world_general','Ciencia y naturaleza',1,'¿Qué elemento químico tiene el símbolo O?','Oxígeno','Oro','Osmio','Plata','O es el símbolo químico del oxígeno.'),
    ('world_general','Ciencia y naturaleza',2,'¿Cómo se llama el proceso por el que una oruga se convierte en mariposa?','Metamorfosis','Fotosíntesis','Germinación','Hibernación','La transformación completa de la oruga es una metamorfosis.'),
    ('world_general','Historia universal',2,'¿Qué civilización construyó Machu Picchu?','Inca','Maya','Azteca','Moche','Machu Picchu fue construido por la civilización inca.'),
    ('world_general','Historia universal',1,'¿En qué país comenzó el Renacimiento europeo?','Italia','Francia','Alemania','España','El Renacimiento comenzó en ciudades italianas y luego se extendió por Europa.'),
    ('world_general','Historia universal',2,'¿Qué ciudad quedó sepultada por la erupción del Vesubio en el año 79?','Pompeya','Esparta','Cartago','Troya','La erupción del Vesubio sepultó Pompeya y otras poblaciones romanas.'),
    ('world_general','Historia universal',2,'¿Qué imperio utilizó una extensa red de caminos en los Andes?','Imperio inca','Imperio romano','Imperio otomano','Imperio persa','El Qhapaq Ñan conectó gran parte del territorio inca.'),
    ('world_general','Historia universal',1,'¿Quién fue la primera persona en pisar la Luna?','Neil Armstrong','Yuri Gagarin','Buzz Aldrin','John Glenn','Neil Armstrong descendió a la superficie lunar en 1969.'),
    ('world_general','Historia universal',2,'¿Qué antigua ciudad fue centro de la democracia ateniense?','Atenas','Esparta','Corinto','Tebas','Atenas desarrolló una forma temprana de democracia directa.'),
    ('world_general','Historia universal',2,'¿Qué ruta comercial conectó durante siglos Asia y Europa?','Ruta de la Seda','Camino Inca','Ruta del Ámbar','Camino de Santiago','La Ruta de la Seda enlazó redes comerciales entre Asia y Europa.'),
    ('world_general','Historia universal',2,'¿Qué pueblo antiguo desarrolló la escritura cuneiforme?','Sumerios','Vikingos','Fenicios','Celtas','Los sumerios emplearon la escritura cuneiforme en Mesopotamia.'),
    ('world_general','Historia universal',1,'¿En qué país se originaron los Juegos Olímpicos antiguos?','Grecia','Italia','Egipto','Turquía','Los Juegos Olímpicos antiguos se celebraban en Olimpia, Grecia.'),
    ('world_general','Historia universal',2,'¿Qué muro cayó en 1989 y simbolizó el fin de una división europea?','Muro de Berlín','Muralla de Adriano','Muro de las Lamentaciones','Gran Muralla China','La caída del Muro de Berlín marcó el final de la división de la ciudad.'),
    ('world_general','Historia universal',2,'¿Qué civilización construyó Chichén Itzá?','Maya','Inca','Romana','Egipcia','Chichén Itzá fue una importante ciudad maya.'),
    ('world_general','Historia universal',2,'¿Qué ciudad fue la capital del Imperio bizantino?','Constantinopla','Roma','Atenas','Alejandría','Constantinopla fue la capital del Imperio bizantino.'),
    ('world_general','Historia universal',1,'¿Qué invento de Gutenberg aceleró la difusión de libros en Europa?','Imprenta de tipos móviles','Telescopio','Brújula','Máquina de vapor','La imprenta de tipos móviles permitió reproducir textos con mayor rapidez.'),
    ('world_general','Historia universal',2,'¿Qué cultura antigua levantó los moáis de Rapa Nui?','Rapanui','Maorí','Inca','Polinesia samoana','El pueblo rapanui creó los moáis de la isla de Pascua.'),
    ('world_general','Historia universal',2,'¿Qué ciudad romana fue fundada, según la tradición, por Rómulo y Remo?','Roma','Milán','Florencia','Venecia','La tradición romana atribuye la fundación de Roma a Rómulo y Remo.'),
    ('world_general','Arte y literatura',1,'¿Quién pintó La noche estrellada?','Vincent van Gogh','Claude Monet','Pablo Picasso','Salvador Dalí','Vincent van Gogh pintó La noche estrellada en 1889.'),
    ('world_general','Arte y literatura',1,'¿Quién escribió Don Quijote de la Mancha?','Miguel de Cervantes','Lope de Vega','Federico García Lorca','Benito Pérez Galdós','Miguel de Cervantes es el autor de Don Quijote de la Mancha.'),
    ('world_general','Arte y literatura',2,'¿En qué museo se exhibe la Mona Lisa?','Museo del Louvre','Museo del Prado','Museo Británico','Galería Uffizi','La Mona Lisa se exhibe en el Museo del Louvre de París.'),
    ('world_general','Arte y literatura',1,'¿Quién escribió Cien años de soledad?','Gabriel García Márquez','Jorge Luis Borges','Mario Vargas Llosa','Julio Cortázar','Gabriel García Márquez publicó Cien años de soledad en 1967.'),
    ('world_general','Arte y literatura',2,'¿Qué compositor creó la Novena Sinfonía?','Ludwig van Beethoven','Wolfgang Amadeus Mozart','Johann Sebastian Bach','Frédéric Chopin','La Novena Sinfonía es una de las obras más conocidas de Beethoven.'),
    ('world_general','Arte y literatura',1,'¿Qué instrumento tiene normalmente 88 teclas?','Piano','Violín','Arpa','Acordeón','El piano moderno estándar tiene 88 teclas.'),
    ('world_general','Arte y literatura',2,'¿Quién esculpió el David renacentista de Florencia?','Miguel Ángel','Donatello','Bernini','Rodin','Miguel Ángel creó su David a comienzos del siglo XVI.'),
    ('world_general','Arte y literatura',1,'¿Quién escribió Romeo y Julieta?','William Shakespeare','Charles Dickens','Oscar Wilde','Jane Austen','Romeo y Julieta es una tragedia de William Shakespeare.'),
    ('world_general','Arte y literatura',2,'¿Qué movimiento artístico se asocia con Monet y Renoir?','Impresionismo','Cubismo','Surrealismo','Barroco','Monet y Renoir son figuras centrales del impresionismo.'),
    ('world_general','Arte y literatura',2,'¿Qué autora creó al detective Hércules Poirot?','Agatha Christie','Virginia Woolf','Mary Shelley','Emily Brontë','Agatha Christie creó a Hércules Poirot para numerosas novelas policiales.'),
    ('world_general','Culturas del mundo',1,'¿Con qué país se asocia tradicionalmente el sushi?','Japón','India','México','Grecia','El sushi forma parte de la tradición culinaria japonesa.'),
    ('world_general','Culturas del mundo',1,'¿Qué celebración india es conocida como el festival de las luces?','Diwali','Holi','Vesak','Songkran','Diwali se celebra con lámparas, luces y reuniones familiares.'),
    ('world_general','Culturas del mundo',2,'¿Qué danza nació en la región del Río de la Plata?','Tango','Flamenco','Samba','Vals','El tango surgió en ciudades del Río de la Plata, especialmente Buenos Aires y Montevideo.'),
    ('world_general','Culturas del mundo',1,'¿Qué alimento es la base tradicional de las tortillas mexicanas?','Maíz','Arroz','Trigo sarraceno','Yuca','El maíz es fundamental en la cocina mesoamericana y mexicana.'),
    ('world_general','Culturas del mundo',2,'¿En qué país se celebra el Día de Muertos como una tradición emblemática?','México','España','Perú','Italia','El Día de Muertos mexicano honra la memoria de familiares y seres queridos.'),
    ('world_general','Culturas del mundo',1,'¿Qué bebida se prepara tradicionalmente con hojas de Camellia sinensis?','Té','Café','Chocolate','Mate','El té proviene de hojas de la planta Camellia sinensis.'),
    ('world_general','Culturas del mundo',2,'¿Qué instrumento de cuerda es característico de la música flamenca?','Guitarra','Sitar','Koto','Banjo','La guitarra flamenca acompaña el cante y el baile.'),
    ('world_general','Culturas del mundo',2,'¿Qué plato español combina arroz y suele cocinarse en una sartén amplia?','Paella','Gazpacho','Tortilla española','Fabada','La paella tiene su origen en la Comunidad Valenciana.'),
    ('world_general','Culturas del mundo',1,'¿Qué prenda tradicional japonesa se ajusta con un obi?','Kimono','Sari','Poncho','Kilt','El obi es la faja que acompaña al kimono.'),
    ('world_general','Culturas del mundo',2,'¿Qué bebida rioplatense se comparte en un recipiente con bombilla?','Mate','Té chai','Café turco','Lassi','El mate se prepara con yerba mate y se bebe con bombilla.'),
    ('country_colombia','Geografía de Colombia',1,'¿Qué mar bordea la costa norte de Colombia?','Mar Caribe','Mar Mediterráneo','Mar Rojo','Mar Negro','La costa norte continental de Colombia se abre al mar Caribe.'),
    ('country_colombia','Geografía de Colombia',1,'¿Qué océano bordea la costa occidental de Colombia?','Océano Pacífico','Océano Atlántico','Océano Índico','Océano Ártico','La costa occidental colombiana está frente al océano Pacífico.'),
    ('country_colombia','Geografía de Colombia',2,'¿Qué río recorre gran parte del centro de Colombia de sur a norte?','Río Magdalena','Río Meta','Río Sinú','Río Atrato','El Magdalena es uno de los principales ejes fluviales e históricos del país.'),
    ('country_colombia','Geografía de Colombia',2,'¿Cuál es el punto más septentrional de la Colombia continental?','Punta Gallinas','Cabo de la Vela','Punta Ardita','Cabo Corrientes','Punta Gallinas se encuentra en La Guajira.'),
    ('country_colombia','Geografía de Colombia',2,'¿En qué región natural colombiana se encuentra Leticia?','Amazonía','Orinoquía','Caribe','Andina','Leticia está en el extremo sur del país, en la región Amazónica.'),
    ('country_colombia','Geografía de Colombia',1,'¿Qué archipiélago colombiano está en el mar Caribe?','San Andrés, Providencia y Santa Catalina','Gorgona y Gorgonilla','Malpelo','Islas del Rosario únicamente','San Andrés, Providencia y Santa Catalina forman un departamento insular caribeño.'),
    ('country_colombia','Geografía de Colombia',2,'¿Qué río forma parte de la frontera entre Colombia y Venezuela?','Río Orinoco','Río Cauca','Río Patía','Río San Jorge','Un tramo del Orinoco sirve como frontera entre ambos países.'),
    ('country_colombia','Geografía de Colombia',2,'¿Cuál es el desierto más conocido de La Guajira?','Desierto de la Guajira','Desierto de la Tatacoa','Desierto de Occidente','Desierto de Sabrinsky','El paisaje árido de La Guajira ocupa el extremo norte del país.'),
    ('country_colombia','Historia de Colombia',1,'¿En qué fecha se conmemora la Independencia de Colombia?','20 de julio','7 de agosto','11 de noviembre','12 de octubre','El 20 de julio recuerda el inicio del proceso independentista de 1810.'),
    ('country_colombia','Historia de Colombia',2,'¿Qué batalla del 7 de agosto de 1819 fue decisiva para la independencia?','Batalla de Boyacá','Batalla de Palonegro','Batalla de Ayacucho','Batalla de Bomboná','La Batalla de Boyacá aseguró el control patriota de Santafé.'),
    ('country_colombia','Historia de Colombia',2,'¿Cómo se llamó la unión republicana que integró a Colombia, Venezuela, Ecuador y Panamá?','Gran Colombia','Nueva Granada','Confederación Peruano-Boliviana','Provincias Unidas','La Gran Colombia existió entre 1819 y 1831.'),
    ('country_colombia','Historia de Colombia',2,'¿Quién tradujo y publicó en Santafé los Derechos del Hombre en 1794?','Antonio Nariño','Francisco de Paula Santander','José Celestino Mutis','Camilo Torres','Antonio Nariño difundió una traducción de la Declaración de los Derechos del Hombre.'),
    ('country_colombia','Historia de Colombia',2,'¿Qué expedición científica dirigió José Celestino Mutis?','Real Expedición Botánica','Comisión Corográfica','Expedición del Orinoco','Misión Geodésica','Mutis dirigió la Real Expedición Botánica del Nuevo Reino de Granada.'),
    ('country_colombia','Historia de Colombia',1,'¿Qué líder es conocido como el Libertador en Colombia y otros países suramericanos?','Simón Bolívar','Antonio José de Sucre','José María Córdova','Rafael Núñez','Simón Bolívar lideró campañas independentistas en el norte de Suramérica.'),
    ('country_colombia','Historia de Colombia',2,'¿Qué constitución cambió el nombre del país a República de Colombia en 1886?','Constitución de 1886','Constitución de 1821','Constitución de Rionegro','Constitución de 1991','La Constitución de 1886 reemplazó la organización federal previa.'),
    ('country_colombia','Historia de Colombia',1,'¿En qué año entró en vigor la actual Constitución Política de Colombia?','1991','1886','1957','2001','La Constitución vigente fue promulgada en 1991.'),
    ('country_colombia','Cultura colombiana',1,'¿Qué género musical tradicional se asocia con acordeón, caja y guacharaca?','Vallenato','Bambuco','Currulao','Joropo','El vallenato tradicional utiliza acordeón, caja y guacharaca.'),
    ('country_colombia','Cultura colombiana',1,'¿Qué ritmo del Pacífico colombiano suele interpretarse con marimba de chonta?','Currulao','Cumbia','Torbellino','Pasillo','La marimba de chonta es central en varias músicas del Pacífico, incluido el currulao.'),
    ('country_colombia','Cultura colombiana',2,'¿Qué sombrero es símbolo artesanal de la región Caribe colombiana?','Sombrero vueltiao','Sombrero aguadeño','Montera llanera','Ruana','El sombrero vueltiao es tejido tradicionalmente con caña flecha.'),
    ('country_colombia','Cultura colombiana',1,'¿Qué bebida tradicional colombiana se prepara con panela y agua?','Aguapanela','Masato','Champús','Refajo','La aguapanela se obtiene al disolver panela en agua caliente o fría.'),
    ('country_colombia','Cultura colombiana',2,'¿Qué carnaval colombiano fue reconocido por la Unesco y se celebra antes de la Cuaresma?','Carnaval de Barranquilla','Carnaval de Riosucio','Carnaval de Negros y Blancos','Festival del Bambuco','El Carnaval de Barranquilla reúne tradiciones musicales y dancísticas del Caribe.'),
    ('country_colombia','Cultura colombiana',1,'¿Qué alimento se elabora principalmente a partir de masa de maíz y puede llevar distintos rellenos?','Arepa','Almojábana','Achira','Pandeyuca','La arepa es una preparación de maíz con numerosas variantes regionales.'),
    ('country_colombia','Naturaleza de Colombia',2,'¿Qué país es reconocido por tener costas tanto en el Caribe como en el Pacífico?','Colombia','Bolivia','Paraguay','Uruguay','Colombia tiene litoral en el mar Caribe y el océano Pacífico.'),
    ('country_colombia','Naturaleza de Colombia',2,'¿Qué parque nacional colombiano protege la Sierra Nevada de Santa Marta y su gradiente de ecosistemas?','Parque Nacional Natural Sierra Nevada de Santa Marta','Parque Nacional Natural El Tuparro','Parque Nacional Natural Amacayacu','Parque Nacional Natural Utría','Este parque protege ecosistemas que van desde zonas cálidas hasta cumbres nevadas.'),
    ('country_colombia','Naturaleza de Colombia',2,'¿Qué especie de palma es el árbol nacional de Colombia?','Palma de cera del Quindío','Palma de coco','Palma real','Palma de moriche','La palma de cera del Quindío fue declarada árbol nacional.'),
    ('country_colombia','Naturaleza de Colombia',1,'¿Cuál es el ave nacional de Colombia?','Cóndor de los Andes','Águila arpía','Flamenco rosado','Tucán del Caribe','El cóndor de los Andes aparece en el escudo nacional.'),
    ('country_colombia','Naturaleza de Colombia',2,'¿Qué ecosistema de alta montaña almacena agua y es característico de los Andes colombianos?','Páramo','Manglar','Sabana inundable','Bosque seco tropical','Los páramos regulan y almacenan agua en las altas montañas andinas.'),
    ('country_colombia','Naturaleza de Colombia',2,'¿En qué región colombiana son comunes las grandes sabanas y los ríos que fluyen hacia el Orinoco?','Orinoquía','Amazonía','Insular','Pacífica','La Orinoquía colombiana se caracteriza por llanuras y cuencas tributarias del Orinoco.'),
    ('country_colombia','Naturaleza de Colombia',2,'¿Qué isla colombiana del Pacífico es famosa por el avistamiento de ballenas jorobadas?','Gorgona','Múcura','Providencia','Tierra Bomba','Las aguas cercanas a Gorgona reciben ballenas jorobadas durante su migración.'),
    ('country_colombia','Naturaleza de Colombia',2,'¿Qué serranía colombiana alberga Caño Cristales?','Sierra de la Macarena','Serranía del Perijá','Serranía de San Lucas','Sierra Nevada del Cocuy','Caño Cristales se encuentra en la Sierra de la Macarena, Meta.')
),
seed AS (
  SELECT 'world_general'::text AS campaign, 'Geografía mundial'::text AS category, 1 AS level,
         format('¿Cuál es la capital de %s?', country) AS question,
         answer, wrong_1, wrong_2, wrong_3,
         format('%s es la capital de %s.', answer, country) AS explanation
  FROM capitals
  UNION ALL
  SELECT 'world_general', 'Geografía mundial', 1,
         format('¿En qué continente se encuentra %s?', country),
         answer, wrong_1, wrong_2, wrong_3,
         format('%s se encuentra en %s.', country, answer)
  FROM continents
  UNION ALL
  SELECT 'world_general', 'Culturas del mundo', 1,
         format('¿Cuál es la moneda oficial de %s?', country),
         answer, wrong_1, wrong_2, wrong_3,
         format('La moneda oficial de %s es %s.', country, answer)
  FROM currencies
  UNION ALL
  SELECT 'country_colombia', 'Geografía de Colombia', 1,
         format('¿Cuál es la capital del departamento colombiano de %s?', department),
         answer, wrong_1, wrong_2, wrong_3,
         format('%s es la capital del departamento de %s.', answer, department)
  FROM department_capitals
  UNION ALL
  SELECT campaign, category, level, question, answer, wrong_1, wrong_2, wrong_3, explanation
  FROM custom_facts
),
unique_seed AS (
  SELECT DISTINCT ON (
    lower(regexp_replace(translate(question,'áéíóúüñÁÉÍÓÚÜÑ','aeiouunAEIOUUN'),'[^a-z0-9]+','','g'))
  ) *
  FROM seed
  ORDER BY lower(regexp_replace(translate(question,'áéíóúüñÁÉÍÓÚÜÑ','aeiouunAEIOUUN'),'[^a-z0-9]+','','g'))
)
INSERT INTO public.game_questions (
  game_id,
  question_text,
  options,
  correct_index,
  correct_answer,
  points_reward,
  time_limit_sec,
  question_type,
  question_format,
  category,
  level,
  explanation,
  version,
  status,
  campaign
)
SELECT
  '81111111-1111-1111-1111-111111111111'::uuid,
  s.question,
  jsonb_build_array(s.answer, s.wrong_1, s.wrong_2, s.wrong_3),
  0,
  to_jsonb(s.answer),
  10,
  30,
  'multiple_choice',
  'standard',
  s.category,
  s.level,
  s.explanation,
  1,
  'published',
  s.campaign
FROM unique_seed s
WHERE NOT EXISTS (
  SELECT 1
  FROM public.game_questions q
  WHERE q.game_id = '81111111-1111-1111-1111-111111111111'
    AND lower(regexp_replace(translate(q.question_text,'áéíóúüñÁÉÍÓÚÜÑ','aeiouunAEIOUUN'),'[^a-z0-9]+','','g'))
        = lower(regexp_replace(translate(s.question,'áéíóúüñÁÉÍÓÚÜÑ','aeiouunAEIOUUN'),'[^a-z0-9]+','','g'))
);
