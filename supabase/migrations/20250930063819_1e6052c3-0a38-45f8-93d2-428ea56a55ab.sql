-- Allow all authenticated users to view all entries
CREATE POLICY "All authenticated users can view all entries"
ON public.ai_entries
FOR SELECT
USING (auth.role() = 'authenticated');