-- Auditoría editorial: corrige 4 preguntas de "Sabores y Saberes del Valle" (borrador)
-- que tenían notas internas del proceso filtradas y/o premisas factualmente erróneas.
-- Reescritas a versiones limpias y verificables. Idempotente (UPDATE por id).
UPDATE public.game_questions SET
  question_text = 'El Teatro Municipal de Cali lleva el nombre de un dramaturgo caleño, fundador del Teatro Experimental de Cali (TEC). ¿Quién es?',
  options = to_jsonb(array['Enrique Buenaventura','Jorge Isaacs','Andrés Caicedo','Jairo Varela']),
  correct_answer = to_jsonb('Enrique Buenaventura'::text),
  explanation = 'El Teatro Municipal de Cali honra a Enrique Buenaventura, dramaturgo caleño y fundador del Teatro Experimental de Cali (TEC).'
WHERE id = '2a9c853d-8acd-4d95-9886-23af61f06460';

UPDATE public.game_questions SET
  question_text = '¿A qué prócer caleño de la independencia está dedicada la estatua central de la Plaza de Cayzedo?',
  options = to_jsonb(array['Joaquín de Cayzedo y Cuero','Antonio Ricaurte','Simón Bolívar','Antonio Nariño']),
  correct_answer = to_jsonb('Joaquín de Cayzedo y Cuero'::text),
  explanation = 'La Plaza de Cayzedo honra a Joaquín de Cayzedo y Cuero, prócer caleño de la independencia.'
WHERE id = 'be3b1cae-0a0e-4bd7-a536-1facf40ea175';

UPDATE public.game_questions SET
  question_text = '¿Con qué título es reconocida Cali por su fuerte identidad salsera?',
  options = to_jsonb(array['Capital Mundial de la Salsa','Ciudad de la Eterna Primavera','La Perla del Otún','La Ciudad Bonita']),
  correct_answer = to_jsonb('Capital Mundial de la Salsa'::text),
  explanation = 'Cali es reconocida internacionalmente como la "Capital Mundial de la Salsa".'
WHERE id = '37bcdb68-5f1b-421b-af1e-eafd67385526';

UPDATE public.game_questions SET
  question_text = '¿Qué orquesta caleña, fundada por Jairo Varela, grabó el himno salsero "Cali Pachanguero"?',
  options = to_jsonb(array['Grupo Niche','Guayacán Orquesta','La Sonora Ponceña','Fruko y sus Tesos']),
  correct_answer = to_jsonb('Grupo Niche'::text),
  explanation = '"Cali Pachanguero", del Grupo Niche (fundado por Jairo Varela), es un himno no oficial de la ciudad.'
WHERE id = 'b253a1ac-139f-4e53-b39d-2e542c66445f';
