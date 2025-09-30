-- Allow all authenticated users to view all profiles so they can see who submitted entries
CREATE POLICY "All authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated'::text);