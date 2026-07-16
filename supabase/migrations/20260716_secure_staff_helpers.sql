CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND (role IN ('admin','editor') OR lower(email)='gruesobrandon@gmail.com'))
$$;
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id=auth.uid() AND (role='admin' OR lower(email)='gruesobrandon@gmail.com'))
$$;
REVOKE ALL ON FUNCTION public.is_staff(),public.is_admin() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.is_staff(),public.is_admin() TO authenticated;
