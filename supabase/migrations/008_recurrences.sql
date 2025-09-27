-- Create recurrences table for managing recurring invoices
CREATE TABLE IF NOT EXISTS public.recurrences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    cadence VARCHAR(20) NOT NULL CHECK (cadence IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    next_run_at TIMESTAMP WITH TIME ZONE NOT NULL,
    active BOOLEAN DEFAULT true,
    run_count INTEGER DEFAULT 0,
    max_runs INTEGER, -- NULL means unlimited
    end_date DATE, -- Optional end date for the recurrence
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recurrences_user_id ON public.recurrences(user_id);
CREATE INDEX IF NOT EXISTS idx_recurrences_template_invoice_id ON public.recurrences(template_invoice_id);
CREATE INDEX IF NOT EXISTS idx_recurrences_next_run_at ON public.recurrences(next_run_at);
CREATE INDEX IF NOT EXISTS idx_recurrences_active ON public.recurrences(active);
CREATE INDEX IF NOT EXISTS idx_recurrences_cadence ON public.recurrences(cadence);

-- Enable RLS
ALTER TABLE public.recurrences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own recurrences" ON public.recurrences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recurrences" ON public.recurrences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurrences" ON public.recurrences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurrences" ON public.recurrences
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_recurrences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_recurrences_updated_at
    BEFORE UPDATE ON public.recurrences
    FOR EACH ROW
    EXECUTE FUNCTION update_recurrences_updated_at();

-- Create function to calculate next run date
CREATE OR REPLACE FUNCTION calculate_next_run_date(
    base_date TIMESTAMP WITH TIME ZONE,
    cadence_type VARCHAR(20)
) RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    CASE cadence_type
        WHEN 'daily' THEN
            RETURN base_date + INTERVAL '1 day';
        WHEN 'weekly' THEN
            RETURN base_date + INTERVAL '1 week';
        WHEN 'monthly' THEN
            RETURN base_date + INTERVAL '1 month';
        WHEN 'quarterly' THEN
            RETURN base_date + INTERVAL '3 months';
        WHEN 'yearly' THEN
            RETURN base_date + INTERVAL '1 year';
        ELSE
            RETURN base_date;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create function to process recurring invoices
CREATE OR REPLACE FUNCTION process_recurring_invoices()
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    rec RECORD;
BEGIN
    -- Get all active recurrences that are due to run
    FOR rec IN 
        SELECT r.*, i.*
        FROM public.recurrences r
        JOIN public.invoices i ON r.template_invoice_id = i.id
        WHERE r.active = true 
        AND r.next_run_at <= NOW()
        AND (r.max_runs IS NULL OR r.run_count < r.max_runs)
        AND (r.end_date IS NULL OR r.end_date >= CURRENT_DATE)
    LOOP
        -- Create new invoice based on template
        -- This would need to be implemented based on your specific requirements
        -- For now, just update the next run date
        UPDATE public.recurrences 
        SET next_run_at = calculate_next_run_date(rec.next_run_at, rec.cadence),
            run_count = run_count + 1,
            updated_at = NOW()
        WHERE id = rec.id;
        
        processed_count := processed_count + 1;
    END LOOP;
    
    RETURN processed_count;
END;
$$ LANGUAGE plpgsql;
