-- Add title column to ai_entries table
ALTER TABLE public.ai_entries 
ADD COLUMN title TEXT NOT NULL DEFAULT '';