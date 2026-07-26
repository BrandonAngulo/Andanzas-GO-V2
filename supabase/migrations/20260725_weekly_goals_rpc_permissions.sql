-- Las metas semanales pertenecen a la cuenta autenticada.
-- Aunque ambas funciones comprueban auth.uid(), PostgreSQL concede EXECUTE a PUBLIC
-- por defecto al crearlas. Se restringe el contrato remoto para que coincida con la UI.
REVOKE ALL ON FUNCTION public.get_weekly_goals() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.claim_weekly_goal(text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_weekly_goals() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_weekly_goal(text) TO authenticated;
