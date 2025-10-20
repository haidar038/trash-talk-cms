DROP POLICY IF EXISTS "View profiles is enabled for all users" ON public.profiles;
CREATE POLICY "View profiles is enabled for all users" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
