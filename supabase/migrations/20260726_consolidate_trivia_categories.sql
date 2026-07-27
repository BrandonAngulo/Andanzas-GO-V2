-- Consolida las ~40 categorías fragmentadas de TRIVIA GO en 16 canónicas.
-- Seguro: solo toca `category`. `campaign` (territorio) y los question_topics (maestría
-- adaptativa, por topic_id) quedan intactos; el selector de temas usa campañas, no categorías.
-- Reversible: game_questions_category_backup guarda la categoría original de cada pregunta.
-- El progreso por categoría (user_category_progress) se fusiona sumando, para no romper el PK.

create table if not exists public.game_questions_category_backup as
  select id, category as old_category
  from public.game_questions
  where game_id = '81111111-1111-1111-1111-111111111111';

update public.game_questions q
set category = m.newc
from (values
  ('Deporte','Deportes'),
  ('Salsa y cultura','Música y salsa'),
  ('Música salsa y sonidos del Pacífico','Música y salsa'),
  ('Valle comestible','Gastronomía'),
  ('Personajes ilustres','Personajes'),
  ('Personajes y comunidades','Personajes'),
  ('Leyendas memoria oral e identidad','Leyendas'),
  ('Economía educación y desarrollo urbano','Economía y desarrollo'),
  ('Geografía mundial','Geografía y territorio'),
  ('Geografía de Colombia','Geografía y territorio'),
  ('Geografía y barrios','Geografía y territorio'),
  ('Geografía barrios y territorio','Geografía y territorio'),
  ('Municipios y territorio','Geografía y territorio'),
  ('Naturaleza y entorno','Naturaleza y ambiente'),
  ('Naturaleza de Colombia','Naturaleza y ambiente'),
  ('Ciencia y naturaleza','Naturaleza y ambiente'),
  ('Valle natural','Naturaleza y ambiente'),
  ('Historia y patrimonio','Historia'),
  ('Historia y monumentos','Historia'),
  ('Historia de Colombia','Historia'),
  ('Historia universal','Historia'),
  ('Historia y economía','Historia'),
  ('Artes visuales y escénicas','Arte y cultura'),
  ('Arte y literatura','Arte y cultura'),
  ('Literatura','Arte y cultura'),
  ('Cultura colombiana','Cultura e identidad'),
  ('Culturas del mundo','Cultura e identidad'),
  ('General','Cultura e identidad'),
  ('Entretenimiento cine y Caliwood','Cine y Caliwood')
) as m(oldc, newc)
where q.game_id = '81111111-1111-1111-1111-111111111111' and q.category = m.oldc;

create temp table _ucp_new as
  select ucp.user_id, ucp.game_id, coalesce(m.newc, ucp.category) as category,
    sum(ucp.attempts) as attempts, sum(ucp.correct_answers) as correct_answers,
    avg(ucp.mastery) as mastery, sum(ucp.xp) as xp, max(ucp.level) as level, max(ucp.updated_at) as updated_at
  from public.user_category_progress ucp
  left join (values
    ('Deporte','Deportes'),('Salsa y cultura','Música y salsa'),('Música salsa y sonidos del Pacífico','Música y salsa'),
    ('Valle comestible','Gastronomía'),('Personajes ilustres','Personajes'),('Personajes y comunidades','Personajes'),
    ('Leyendas memoria oral e identidad','Leyendas'),('Economía educación y desarrollo urbano','Economía y desarrollo'),
    ('Geografía mundial','Geografía y territorio'),('Geografía de Colombia','Geografía y territorio'),
    ('Geografía y barrios','Geografía y territorio'),('Geografía barrios y territorio','Geografía y territorio'),
    ('Municipios y territorio','Geografía y territorio'),('Naturaleza y entorno','Naturaleza y ambiente'),
    ('Naturaleza de Colombia','Naturaleza y ambiente'),('Ciencia y naturaleza','Naturaleza y ambiente'),
    ('Valle natural','Naturaleza y ambiente'),('Historia y patrimonio','Historia'),('Historia y monumentos','Historia'),
    ('Historia de Colombia','Historia'),('Historia universal','Historia'),('Historia y economía','Historia'),
    ('Artes visuales y escénicas','Arte y cultura'),('Arte y literatura','Arte y cultura'),('Literatura','Arte y cultura'),
    ('Cultura colombiana','Cultura e identidad'),('Culturas del mundo','Cultura e identidad'),('General','Cultura e identidad'),
    ('Entretenimiento cine y Caliwood','Cine y Caliwood')
  ) as m(oldc, newc) on m.oldc = ucp.category
  where ucp.game_id = '81111111-1111-1111-1111-111111111111'
  group by 1, 2, 3;

delete from public.user_category_progress where game_id = '81111111-1111-1111-1111-111111111111';

insert into public.user_category_progress (user_id, game_id, category, attempts, correct_answers, mastery, xp, level, updated_at)
select user_id, game_id, category, attempts, correct_answers, mastery, xp, level, updated_at from _ucp_new;

drop table _ucp_new;
