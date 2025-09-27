-- Create user_preferences table for storing business defaults and settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Business Defaults
    default_tax_rate DECIMAL(5,2) DEFAULT 18.00,
    default_currency VARCHAR(3) DEFAULT 'INR',
    default_invoice_template VARCHAR(50) DEFAULT 'classic', -- classic, modern, minimal
    default_payment_terms VARCHAR(255) DEFAULT 'Payment due within 30 days',
    default_notes TEXT,
    default_terms_conditions TEXT,
    
    -- Invoice Settings
    invoice_number_prefix VARCHAR(10) DEFAULT 'INV',
    invoice_number_start INTEGER DEFAULT 1,
    auto_generate_invoice_number BOOLEAN DEFAULT true,
    
    -- Notification Settings
    email_notifications BOOLEAN DEFAULT true,
    payment_reminders BOOLEAN DEFAULT true,
    invoice_updates BOOLEAN DEFAULT true,
    
    -- Appearance Settings
    theme VARCHAR(20) DEFAULT 'light', -- light, dark
    language VARCHAR(10) DEFAULT 'en',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one preference record per user
    UNIQUE(user_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for user_preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON public.user_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically create user preferences when a user is created
CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create preferences for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_preferences();
