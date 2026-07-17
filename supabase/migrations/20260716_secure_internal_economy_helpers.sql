-- Estas funciones son bloques internos de composición. Las RPC públicas verificadas
-- se ejecutan con su propietario y no necesitan exponer estos helpers al cliente.

REVOKE ALL ON FUNCTION economy.apply_rewards(uuid,bigint,bigint,bigint,bigint,text,text,text,text,jsonb)
FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION economy.refresh_lives(uuid)
FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION economy.roll_gem_reward(uuid,numeric,integer)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION economy.apply_rewards(uuid,bigint,bigint,bigint,bigint,text,text,text,text,jsonb)
TO service_role;
GRANT EXECUTE ON FUNCTION economy.refresh_lives(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION economy.roll_gem_reward(uuid,numeric,integer) TO service_role;
