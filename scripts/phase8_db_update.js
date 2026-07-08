import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

// Load env from .env
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newQuestions = [
    // --- EASY (Level 1) ---
    {
        question_text: '¿Cuál es el río más largo de Colombia?',
        question_type: 'multiple_choice',
        category: 'Geografía',
        level: 1,
        options: JSON.stringify(['Río Cauca', 'Río Magdalena', 'Río Amazonas', 'Río Orinoco']),
        correct_answer: JSON.stringify('Río Magdalena'),
        explanation: 'El río Magdalena es la principal arteria fluvial de Colombia, cruzando el país de sur a norte.',
        points_reward: 10,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿En qué ciudad se celebra la Feria de las Flores?',
        question_type: 'multiple_choice',
        category: 'Cultura',
        level: 1,
        options: JSON.stringify(['Bogotá', 'Medellín', 'Cali', 'Barranquilla']),
        correct_answer: JSON.stringify('Medellín'),
        explanation: 'La Feria de las Flores es el evento tradicional más importante de Medellín, Antioquia.',
        points_reward: 10,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Qué baile es considerado el ritmo nacional de Colombia?',
        question_type: 'multiple_choice',
        category: 'Cultura',
        level: 1,
        options: JSON.stringify(['Salsa', 'Vallenato', 'Cumbia', 'Joropo']),
        correct_answer: JSON.stringify('Cumbia'),
        explanation: 'La cumbia, originaria de la costa caribe, es considerada una de las expresiones musicales más representativas de Colombia.',
        points_reward: 10,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Quién escribió la novela "Cien años de soledad"?',
        question_type: 'multiple_choice',
        category: 'Literatura',
        level: 1,
        options: JSON.stringify(['Jorge Isaacs', 'Gabriel García Márquez', 'Álvaro Mutis', 'Rafael Pombo']),
        correct_answer: JSON.stringify('Gabriel García Márquez'),
        explanation: 'Gabo publicó Cien años de soledad en 1967, consolidando el realismo mágico a nivel mundial.',
        points_reward: 10,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Cuál es la flor nacional de Colombia?',
        question_type: 'multiple_choice',
        category: 'Naturaleza',
        level: 1,
        options: JSON.stringify(['Rosa', 'Girasol', 'Orquídea', 'Margarita']),
        correct_answer: JSON.stringify('Orquídea'),
        explanation: 'La orquídea (Cattleya trianae) es la flor emblemática de Colombia debido a su belleza y variedad en el territorio.',
        points_reward: 10,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿De qué región es típico el ajiaco?',
        question_type: 'multiple_choice',
        category: 'Gastronomía',
        level: 1,
        options: JSON.stringify(['Antioquia', 'Valle del Cauca', 'Costa Caribe', 'Cundinamarca/Bogotá']),
        correct_answer: JSON.stringify('Cundinamarca/Bogotá'),
        explanation: 'El ajiaco santafereño es una sopa tradicional originaria de Bogotá y la región cundiboyacense.',
        points_reward: 10,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿En qué año se firmó la actual Constitución Política de Colombia?',
        question_type: 'multiple_choice',
        category: 'Historia',
        level: 1,
        options: JSON.stringify(['1886', '1991', '2000', '1810']),
        correct_answer: JSON.stringify('1991'),
        explanation: 'La actual Constitución Política fue promulgada en 1991, reemplazando a la antigua de 1886.',
        points_reward: 10,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },

    // --- MEDIUM (Level 2) ---
    {
        question_text: '¿Qué comunidad indígena habita principalmente en la Sierra Nevada de Santa Marta?',
        question_type: 'multiple_choice',
        category: 'Cultura',
        level: 2,
        options: JSON.stringify(['Wayuu', 'Koguis', 'Embera', 'Guambianos']),
        correct_answer: JSON.stringify('Koguis'),
        explanation: 'Los Koguis (o Kággaba) son uno de los grupos indígenas que preservan sus tradiciones milenarias en la Sierra Nevada.',
        points_reward: 20,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Cuál es el único país de Suramérica que tiene costas en dos océanos?',
        question_type: 'multiple_choice',
        category: 'Geografía',
        level: 2,
        options: JSON.stringify(['Brasil', 'Venezuela', 'Colombia', 'Argentina']),
        correct_answer: JSON.stringify('Colombia'),
        explanation: 'Colombia es privilegiada al estar bañada tanto por el Océano Pacífico como por el Mar Caribe (Océano Atlántico).',
        points_reward: 20,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Qué artista colombiano es famoso por sus figuras voluminosas y exageradas?',
        question_type: 'multiple_choice',
        category: 'Arte',
        level: 2,
        options: JSON.stringify(['Alejandro Obregón', 'Fernando Botero', 'Omar Rayo', 'David Manzur']),
        correct_answer: JSON.stringify('Fernando Botero'),
        explanation: 'Fernando Botero es mundialmente reconocido por el "Boterismo", estilo que exalta el volumen en sus obras.',
        points_reward: 20,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Cuál es el Parque Nacional Natural más extenso de Colombia?',
        question_type: 'multiple_choice',
        category: 'Naturaleza',
        level: 2,
        options: JSON.stringify(['Tayrona', 'Chiribiquete', 'Macarena', 'Amacayacu']),
        correct_answer: JSON.stringify('Chiribiquete'),
        explanation: 'El Parque Nacional Natural Serranía de Chiribiquete es el área protegida más grande del país y Patrimonio de la Humanidad.',
        points_reward: 20,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿En qué año ocurrió el evento histórico conocido como "El Bogotazo"?',
        question_type: 'multiple_choice',
        category: 'Historia',
        level: 2,
        options: JSON.stringify(['1928', '1948', '1985', '1991']),
        correct_answer: JSON.stringify('1948'),
        explanation: 'El 9 de abril de 1948, tras el asesinato de Jorge Eliécer Gaitán, se desataron disturbios masivos en Bogotá.',
        points_reward: 20,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Qué ingrediente principal distingue al mote de queso?',
        question_type: 'multiple_choice',
        category: 'Gastronomía',
        level: 2,
        options: JSON.stringify(['Plátano maduro', 'Ñame', 'Yuca', 'Papa criolla']),
        correct_answer: JSON.stringify('Ñame'),
        explanation: 'El mote de queso es una sopa insignia de la Costa Caribe, preparada a base de ñame y queso costeño.',
        points_reward: 20,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Qué ciudad es conocida como la "Ciudad Blanca" de Colombia?',
        question_type: 'multiple_choice',
        category: 'Cultura',
        level: 2,
        options: JSON.stringify(['Cartagena', 'Popayán', 'Villa de Leyva', 'Santa Marta']),
        correct_answer: JSON.stringify('Popayán'),
        explanation: 'Popayán es llamada la "Ciudad Blanca" por sus hermosas fachadas coloniales de color blanco.',
        points_reward: 20,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },

    // --- HARD (Level 3) ---
    {
        question_text: '¿Qué cacique indígena lideró una de las más grandes rebeliones contra los españoles en 1537 en la sabana de Bogotá?',
        question_type: 'multiple_choice',
        category: 'Historia',
        level: 3,
        options: JSON.stringify(['Calarcá', 'Tisquesusa', 'Gaitana', 'Tundama']),
        correct_answer: JSON.stringify('Tisquesusa'),
        explanation: 'Tisquesusa, zipa de Bacatá, fue un líder muisca que enfrentó la expedición de Gonzalo Jiménez de Quesada.',
        points_reward: 30,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Cuál es el nombre del primer premio Nobel de Colombia?',
        question_type: 'multiple_choice',
        category: 'Literatura',
        level: 3,
        options: JSON.stringify(['Juan Manuel Santos', 'Gabriel García Márquez', 'Álvaro Mutis', 'Ninguno']),
        correct_answer: JSON.stringify('Gabriel García Márquez'),
        explanation: 'Gabriel García Márquez recibió el Nobel de Literatura en 1982, siendo el primer colombiano en ganar un premio Nobel (antes que Juan Manuel Santos en Paz).',
        points_reward: 30,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿En qué departamento se encuentra el Santuario de Flora y Fauna Iguaque, laguna sagrada de los Muiscas?',
        question_type: 'multiple_choice',
        category: 'Geografía',
        level: 3,
        options: JSON.stringify(['Cundinamarca', 'Boyacá', 'Santander', 'Tolima']),
        correct_answer: JSON.stringify('Boyacá'),
        explanation: 'La Laguna de Iguaque, considerada cuna de la humanidad por los Muiscas, se encuentra cerca de Villa de Leyva, en Boyacá.',
        points_reward: 30,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Quién escribió la obra teatral "La cándida Eréndira y su abuela desalmada"?',
        question_type: 'multiple_choice',
        category: 'Literatura',
        level: 3,
        options: JSON.stringify(['Álvaro Cepeda Samudio', 'Gabriel García Márquez', 'Andrés Caicedo', 'José Eustasio Rivera']),
        correct_answer: JSON.stringify('Gabriel García Márquez'),
        explanation: 'Gabo escribió este cuento que luego fue adaptado tanto al teatro como al cine.',
        points_reward: 30,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: '¿Qué ritmo musical es patrimonio inmaterial originario de la región del Pacífico sur (Nariño, Cauca, Valle)?',
        question_type: 'multiple_choice',
        category: 'Cultura',
        level: 3,
        options: JSON.stringify(['Bullerengue', 'Currulao', 'Bambuco', 'Mapalé']),
        correct_answer: JSON.stringify('Currulao'),
        explanation: 'El currulao es la danza de ancestro africano más representativa del litoral Pacífico sur colombiano.',
        points_reward: 30,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    },
    {
        question_text: 'El "Tratado Mallarino-Bidlack" firmado en 1846 fue crucial para la historia de:',
        question_type: 'multiple_choice',
        category: 'Historia',
        level: 3,
        options: JSON.stringify(['Independencia de Venezuela', 'Separación de Panamá', 'Guerra de los Mil Días', 'Frontera con Perú']),
        correct_answer: JSON.stringify('Separación de Panamá'),
        explanation: 'Este tratado garantizaba el derecho de tránsito de EE.UU. por el istmo, lo cual influyó posteriormente en la separación de Panamá de Colombia.',
        points_reward: 30,
        time_limit_sec: 15,
        status: 'published',
        version: 1
    }
];

async function updateDb() {
    console.log('1. Modificando estructura de la base de datos (games table)...');
    
    // As we can't easily run ALTER TABLE with anon key securely via standard REST if RLS is enabled on DDL, 
    // wait, we can't run DDL via REST API with anon key. We need to use the `supabase-mcp-server` for that, OR the user might need to run it in SQL editor.
    // Let me try to call a standard RPC if I made one, but I didn't.
    // I will print the SQL required so I can execute it via MCP next.
    console.log("Para la estructura DB, el agente debe usar execute_sql desde el MCP.");
    
    console.log('2. Buscando el juego de Trivia para inyectar preguntas...');
    const { data: trivia, error: fetchErr } = await supabase.from('games').select('id').eq('type', 'trivia').limit(1).single();
    
    if (fetchErr || !trivia) {
        console.error('No se pudo encontrar un juego de trivia:', fetchErr);
        return;
    }
    
    console.log('Insertando 20 nuevas preguntas en el juego:', trivia.id);
    
    let sql = `INSERT INTO public.game_questions (game_id, question_text, question_type, category, level, options, correct_answer, explanation, points_reward, time_limit_sec, status, version) VALUES\n`;
    
    const values = newQuestions.map(q => {
        return `('${trivia.id}', '${q.question_text.replace(/'/g, "''")}', '${q.question_type}', '${q.category}', ${q.level}, '${q.options.replace(/'/g, "''")}'::jsonb, '${q.correct_answer.replace(/'/g, "''")}'::jsonb, '${q.explanation.replace(/'/g, "''")}', ${q.points_reward}, ${q.time_limit_sec}, '${q.status}', ${q.version})`;
    });
    
    sql += values.join(',\n') + ';';
    
    fs.writeFileSync('insert_questions.sql', sql, 'utf8');
    console.log('SQL generado en insert_questions.sql');
}

updateDb();
