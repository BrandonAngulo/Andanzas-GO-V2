const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const entries = [
  {
    title: '¿Quién fue Jovita Feijóo, la reina de Cali?',
    city: 'Cali',
    tags: ['identidad', 'Cali Viejo', 'personajes', 'historia'],
    content_full: `Fue una mujer humilde —trabajadora doméstica, lavandera— que se autoproclamó reina de Cali… y la ciudad entera le siguió la corriente. Nació en Palmira el 6 de junio de 1910, llegó a Cali en los años 30, y aunque vivió casi en la pobreza, se paseaba por las calles vestida como una soberana, con ropas finas que le regalaban las damas de la alta sociedad. Murió en 1970 y desde entonces es un ícono de la caleñidad.

Todo empezó en 1937, en un programa de radio en vivo en la Plaza de Caycedo donde la gente del común cantaba, y al que lo hacía mal le soltaban un audio de perros ladrando para burlarse. Jovita cantó, le pusieron los perros… y ella siguió cantando, impávida, con la dignidad de una emperatriz. A los locutores les hizo tanta gracia que la coronaron "Reina de la Simpatía". Ahí nació la leyenda.

Y Jovita se tomó el reinado en serio, como una reina de verdad. Encabezaba el desfile del Cali Viejo, tenía palco fijo en la Plaza de Toros, hacía el saque de honor en los clásicos América–Cali, se sentaba a la derecha de los alcaldes y hasta recibió al presidente Rojas Pinilla. Los hombres se bajaban del andén para dejarla pasar. Unos se burlaban, otros la adoraban; muchos la llamaban "loca". Pero, como dijo su biógrafo, uno no sabe si la loca era Jovita o la ciudad entera que le aceptó la locura.

Murió de un infarto el 15 de julio de 1970, mientras se bañaba, en el barrio El Hoyo. Su entierro fue el más multitudinario en la historia de Cali: la acompañaron desde la Catedral de San Pedro hasta el Cementerio Central, escoltada por la sirena de un carro de bomberos. Hoy vive en una novela de Javier Tafur, en las fotos de Fernell Franco, en una escultura de Diego Pombo en el Parque de los Estudiantes —hoy más conocido como el Parque de Jovita— y en el actor que cada año la encarna en la Feria. En Cali, decir "jovitesco" es como decir "quijotesco".`,
    sabias_que: [
      '¿Sabías que la leyenda de Jovita nació en 1937, cuando le pusieron unos perros ladrando por cantar y ella, tranquila, siguió cantando?',
      '¿Sabías que su entierro fue el más multitudinario en la historia de Cali?',
      '¿Sabías que Jovita reposa en el osario 411 del Cementerio Central?'
    ],
    trivia: {
      question: '¿Cómo se ganó Jovita su primera corona?',
      options: ['Cantando en un programa de radio', 'Ganando un reinado de belleza', 'Heredándola', 'Actuando en cine'],
      correctIndex: 0,
      feedback: "Cantando —o desafinando— en la radio, en 1937. La coronaron 'Reina de la Simpatía'. Leé la historia completa."
    },
    cta: 'Buscá su rastro por la ciudad: la exposición del Teatro La Concha, su tumba en el Cementerio Central, su estatua en el Parque de Jovita. Andanzas te lleva.',
    fuentes: 'El País, "¿Quién fue Jovita, la reina infinita?"; Radio Nacional de Colombia; Wikipedia; Javier Tafur González, Jovita o la biografía de las ilusiones (1976). Nació el 6 jun 1910 (Palmira), murió el 15 jul 1970 (Cali). Monumento de Diego Pombo inaugurado a finales de 2007.',
    site_ids: [],
    route_ids: []
  },
  {
    title: '¿Por qué en Cali se dice "vos" y no "tú"?',
    city: 'Cali',
    tags: ['identidad', 'lenguaje', 'historia'],
    content_full: `Porque el voseo —tratar de "vos" a la otra persona— es una herencia vieja del español que Cali nunca soltó. "Vos" existía en España antes de que el "tú" se impusiera; en el siglo XVIII los españoles se pasaron al "tuteo" y arrinconaron el "vos" como habla de gente "vulgar e ignorante". Esa idea cruzó el mar y quiso borrar el "vos" en América. Pero en Cali —y en el Valle, el Cauca, Antioquia, Nariño— el "vos" aguantó.

Y no solo el "vos": buena parte del acento caleño es español antiguo fosilizado. Ese "mirá, ve" tan nuestro viene del "mirad, ved" del siglo XVI; la "d" final se cayó con el tiempo. Y el acento —esa "s" que suena a "j" entre vocales (el famoso "vojabés" por "vos sabés"), la "n" que se vuelve "m" ("pam" por "pan"), el tonito cantadito y pausado— desciende sobre todo del andaluz, con aportes africanos que entraron por el puerto de Buenaventura y palabras quechuas como "chuspa" (bolsa).

Y aquí está lo bonito: lo que un día fue motivo de burla, hoy es motivo de orgullo. La lingüista caleña Ana María Díaz Collazos, que le ha dedicado la vida a estudiarlo, lo resume así: el voseo se volvió señal de autoestima y afirmación. En Cali lo usa todo el mundo, del estrato que sea —lo que dice, de paso, que aquí hubo más roce entre clases que en otras partes—. Hace medio siglo un experto pronosticó que el "vos" caleño desaparecería pronto; y ahí sigue, más vivo que nunca. Es una forma que el imperio quiso enterrar y que Cali convirtió en bandera.`,
    sabias_que: [
      '¿Sabías que "mirá, ve" viene del "mirad, ved" del español del siglo XVI?',
      '¿Sabías que el "vos" existía en España antes que el "tú"? Allá lo desecharon; Cali lo conservó.',
      '¿Sabías que el acento caleño es primo hermano del andaluz?'
    ],
    trivia: {
      question: 'La expresión caleña "mirá, ve", ¿de dónde viene?',
      options: ['Del "mirad, ved" del español antiguo', 'Del inglés', 'De una canción de salsa', 'Del quechua'],
      correctIndex: 0,
      feedback: "Del 'mirad, ved' del siglo XVI: la 'd' se cayó con los siglos. Enterate de por qué en Cali se habla así."
    },
    cta: 'Todo el mapa de Andanzas está escrito en esta voz. Si venís de afuera, ya sabés: acá se te habla de vos, y es puro cariño.',
    fuentes: 'El País, "¿Vojabés? Por qué los caleños hablamos así" (entrevista a la lingüista Ana María Díaz Collazos); Wikipedia, "Español vallecaucano"; Radiónica. El voseo se conserva en Valle, Cauca, Antioquia, Caldas, Risaralda, Quindío y Nariño.',
    site_ids: [],
    route_ids: []
  },
  {
    title: '¿De dónde salió el cholado?',
    city: 'Cali',
    tags: ['sabores', 'identidad', 'Valle', 'emprendimiento'],
    content_full: `De Jamundí, no de Cali. El cholado —ese vaso de hielo raspado bañado en melado de colores, cargado de frutas, leche condensada y un barquillo— es la bebida más refrescante del Valle, y su patria es Jamundí, el pueblo pegadito al sur de Cali, donde hasta hay un Parque del Cholado.

Nació en la familia Bonilla. Cuentan que doña Rosina raspaba bloques de hielo y los vendía con limón y miel para sostener a su familia; su hijo, Héctor Samuel Bonilla, fue transformando ese raspado —primero lo llamó "Las tres niñas", con piña, lulo y limón; después le echó el melado de colores—. Como caía de perlas para la sed brava del guayabo, al principio le decían "el mataguayabo". A finales de los años 80, uno de los hijos migró a Cali, montó su puesto en las Canchas Panamericanas, lo publicitó hasta en el cine, y lo volvió famoso.

El nombre tiene su gracia: dicen que "cholado" sale de juntar "cholos" —homenaje a la población indígena y mestiza— con "helado" o "raspado". Y otra vez, como con la salsa o el chontaduro, Cali agarró algo que no nació aquí y lo hizo tan suyo que hoy es imposible pensar la ciudad sin un cholado en la mano bajo el solazo. Detrás de cada vaso hay una familia que vive de eso; tanto, que en Jamundí montaron una "Escuela del choladerito" para que la tradición no se pierda.`,
    sabias_que: [
      '¿Sabías que el cholado no nació en Cali, sino en Jamundí?',
      '¿Sabías que al principio le decían "el mataguayabo", porque servía para la resaca?',
      '¿Sabías que en Jamundí han hecho el cholado más grande del mundo, de más de una tonelada?'
    ],
    trivia: {
      question: '¿En qué municipio nació el cholado?',
      options: ['Jamundí', 'Buenaventura', 'Palmira', 'Buga'],
      correctIndex: 0,
      feedback: "En Jamundí, a menos de una hora de Cali. Enterate de cómo llegó a la ciudad y por qué le decían 'mataguayabo'."
    },
    cta: 'En Cali lo encontrás bien frío en las Canchas Panamericanas o en el Bulevar del Río. Es la parada dulce de la Ruta de la Salsa y el Sabor.',
    fuentes: 'Alcaldía de Cali, "Conoce la historia del cholado"; El Tiempo, "El cholado, ¿realmente es de Cali?"; Colombia Visible (familia Bonilla, Jamundí); Wikipedia. Llegó a Cali a finales de los años 80.',
    site_ids: [],
    route_ids: ['route-food']
  },
  {
    title: '¿Quién es el Buziraco, el "diablo" de las Tres Cruces?',
    city: 'Cali',
    tags: ['leyenda', 'historia', 'memoria afro', 'religión'],
    content_full: `Es el demonio de la leyenda más famosa de Cali: un ser con forma de murciélago gigante que, según cuentan, atormentó la ciudad en el siglo XIX y quedó atrapado en la cima del Cerro de las Tres Cruces. Por eso están ahí las tres cruces: para encerrarlo. Dicen que su "celda" queda justo entre la segunda y la tercera.

La historia viene de lejos. Cuentan que el Buziraco fue primero adorado en el Cerro de La Popa, en Cartagena, hasta que un fraile lo desterró; entonces "se mudó" a Cali. En 1837, cuando la ciudad sufría pestes, incendios y muertes, dos frailes hermanos —los Cuesta— subieron al cerro con tres cruces de guadua para exorcizarlo. En 1925, un terremoto tumbó esas cruces, y la gente dijo que el Buziraco se había soltado. Por eso, en 1937, el padre Marco Tulio Collazos mandó levantar las tres cruces de concreto que hoy vemos —terminadas en 1938— para encerrarlo de nuevo.

Pero acá está la vuelta que casi nadie cuenta: el Buziraco probablemente no era ningún diablo. Era una deidad africana e indígena —hay quien la liga a Changó, un orisha— a la que los esclavizados y los pueblos originarios le rendían culto con tambores, danzas y ofrendas. La Iglesia colonial, para borrar esa espiritualidad, la convirtió en "demonio". O sea: el "diablo" del cerro es, en el fondo, la fe negra e indígena que la conquista quiso satanizar. La leyenda es hermosa y da miedo, pero también es un documento del racismo colonial.

Hoy el cerro es punto de deporte, fe y postal caleña; en Semana Santa, miles suben a rezar. Y la leyenda sigue viva en un chiste de la ciudad: dicen que si en una discoteca ves a un hombre negro que baila increíble pero te pide que no le mirés los pies… cuidado, que puede ser Changó.`,
    sabias_que: [
      '¿Sabías que las tres cruces se levantaron, según la leyenda, para "encerrar" a un demonio llamado Buziraco?',
      '¿Sabías que, según los historiadores, ese "demonio" era en realidad una deidad afro e indígena que la Iglesia colonial satanizó?',
      '¿Sabías que la leyenda dice que el Buziraco llegó a Cali desde el Cerro de La Popa, en Cartagena?'
    ],
    trivia: {
      question: 'Según la leyenda, ¿para qué se construyeron las Tres Cruces?',
      options: ['Para encerrar al demonio Buziraco', 'Para honrar a tres santos', 'Para señalar un camino', 'Por los tres fundadores de Cali'],
      correctIndex: 0,
      feedback: "Para encerrar al Buziraco. Pero la historia real es más profunda de lo que parece: metete a la entrada."
    },
    cta: 'Subí al Cerro de las Tres Cruces —temprano y en compañía, que se disfruta más— y mirá la ciudad desde donde, dicen, duerme el Buziraco. Está en la Ruta de la Naturaleza Urbana.',
    fuentes: 'Wikipedia, "Cerro de las Tres Cruces"; El Tiempo; Infobae; El País, "La historia detrás de las tres cruces" (lectura del sincretismo y el racismo colonial); Alcaldía de Cali, "La leyenda del Buziraco". Cruces de concreto: obra iniciada el 26 may 1937, concluida el 6 ene 1938 (padre Marco Tulio Collazos).',
    site_ids: ['s65'],
    route_ids: []
  }
];

async function run() {
  const { data, error } = await supabase.from('learn_entries').insert(entries);
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log('Inserted successfully!');
  }
}
run();
