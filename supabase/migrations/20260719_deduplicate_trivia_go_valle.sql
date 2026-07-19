-- Auditoría posterior a la consolidación regional.
-- Esta pregunta del paquete Valle comprobaba el mismo hecho que la pregunta
-- general 1f7e28ad-8a3b-40bb-aa6e-8671a23ad4c7 sobre el Festival Petronio
-- Álvarez. Se archiva, no se elimina, para conservar trazabilidad editorial.

UPDATE public.game_questions
SET
  status = 'archived',
  version = version + 1,
  updated_at = now()
WHERE id = 'c528483e-e744-4531-a4aa-aea823653420'
  AND game_id = '81111111-1111-1111-1111-111111111111'
  AND campaign = 'region_valle_del_cauca'
  AND status <> 'archived';
