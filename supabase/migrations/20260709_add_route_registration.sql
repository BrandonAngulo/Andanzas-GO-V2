-- Migration: add_registration_to_rutas
-- Description: Add fields for route registration capacity and status, and create the registrations table.

-- Add new columns to `rutas`
ALTER TABLE public.rutas 
  ADD COLUMN IF NOT EXISTS requires_registration BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS current_registrations INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS registration_status TEXT DEFAULT 'open';

-- Create `ruta_registrations` table
CREATE TABLE IF NOT EXISTS public.ruta_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ruta_id UUID NOT NULL REFERENCES public.rutas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(ruta_id, user_id)
);

-- RLS for ruta_registrations
ALTER TABLE public.ruta_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations" 
ON public.ruta_registrations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registrations" 
ON public.ruta_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations (e.g. cancel)" 
ON public.ruta_registrations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and manage all registrations" 
ON public.ruta_registrations FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
