import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Inserting second game (draft)...');
  const { data: game, error: errGame } = await supabase.from('games').insert({
    title: 'Misterios de San Antonio',
    title_en: 'Mysteries of San Antonio',
    description: 'Descubre los secretos mejor guardados del barrio más tradicional de Cali.',
    description_en: 'Discover the best kept secrets of Cali\'s most traditional neighborhood.',
    difficulty_level: 'medium',
    base_points_reward: 100,
    status: 'draft'
  }).select().single();

  if (errGame) {
    console.error('Error inserting game:', errGame);
    return;
  }
  
  console.log('Game inserted:', game.id);

  // Insert questions
  const q1 = {
    game_id: game.id,
    question_text: '¿En qué año se construyó la Capilla de San Antonio?',
    question_text_en: 'In what year was the San Antonio Chapel built?',
    options: ['1744', '1747', '1800', '1905'],
    correct_index: 1,
    correct_answer: '1747',
    category: 'Historia',
    points_reward: 15,
    time_limit_sec: 25,
    explanation: 'La capilla de San Antonio fue construida en 1747 en lo alto de la colina que lleva su nombre.',
    explanation_en: 'The San Antonio chapel was built in 1747 atop the hill that bears its name.'
  };

  const q2 = {
    game_id: game.id,
    question_text: '¿Qué dulce tradicional es famoso en los alrededores de San Antonio?',
    question_text_en: 'What traditional sweet is famous around San Antonio?',
    options: ['Maceta', 'Cholado', 'Manjar Blanco', 'Lulada'],
    correct_index: 0,
    correct_answer: 'Maceta',
    category: 'Gastronomía',
    points_reward: 10,
    time_limit_sec: 20,
    explanation: 'Las macetas, hechas de alfeñique, son un dulce muy tradicional que se vende especialmente en la época de los ahijados, y San Antonio es un lugar clave para encontrarlas.',
    explanation_en: 'Macetas, made of alfeñique, are a very traditional sweet sold especially during the godchildren season, and San Antonio is a key place to find them.'
  };

  const { error: errQ } = await supabase.from('game_questions').insert([q1, q2]);
  if (errQ) {
    console.error('Error inserting questions:', errQ);
  } else {
    console.log('Second game and questions inserted successfully as INACTIVE (draft).');
  }
}

run();
