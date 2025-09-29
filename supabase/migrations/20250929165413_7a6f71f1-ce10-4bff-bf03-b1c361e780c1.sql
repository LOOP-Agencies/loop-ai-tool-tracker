-- Add conceptual_only and final_used_asset columns to ai_entries table
ALTER TABLE public.ai_entries 
ADD COLUMN conceptual_only BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN final_used_asset BOOLEAN NOT NULL DEFAULT false;