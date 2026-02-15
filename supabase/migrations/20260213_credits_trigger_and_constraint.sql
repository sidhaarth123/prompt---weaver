-- 1. Ensure user_id is unique on profiles table
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'profiles_user_id_key' 
        AND conrelid = 'public.profiles'::regclass
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 2. Ensure credits_left column exists with default value
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits_left INTEGER NOT NULL DEFAULT 10;

-- 3. Update the handle_new_user function to initialize credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, plan, credits_left)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'free',
    10 -- Default allocation for new users
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Ensure the trigger is active (re-creating if needed)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Backfill any existing users who might be missing a profile (Optional safeguard)
INSERT INTO public.profiles (user_id, display_name, plan, credits_left)
SELECT id, email, 'free', 10
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
