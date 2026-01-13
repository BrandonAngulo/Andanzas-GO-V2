-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    phone TEXT,
    ticket_type TEXT NOT NULL CHECK (ticket_type IN ('callback', 'contact')),
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own tickets
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Anyone can insert tickets (for unauthenticated support requests, or just authenticated)
-- If we want to allow guests, we need to allow public insert. 
-- For now, let's assume authenticated users or at least public insert with some rate limiting (out of scope here).
-- Let's allow insert for everyone for 'contact' form flexibility.
CREATE POLICY "Anyone can insert tickets" ON public.support_tickets
    FOR INSERT
    WITH CHECK (true);
