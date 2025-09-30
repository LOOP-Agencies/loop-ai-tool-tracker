-- Add RLS policy for admins to view all entries
CREATE POLICY "Admins can view all entries"
ON public.ai_entries
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy for admins to update all entries
CREATE POLICY "Admins can update all entries"
ON public.ai_entries
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy for admins to delete all entries
CREATE POLICY "Admins can delete all entries"
ON public.ai_entries
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for profiles table (for user management)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));