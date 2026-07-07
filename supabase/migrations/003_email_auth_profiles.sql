-- CareNest — Email/password auth support
-- Adds account-identity columns to profiles (collected at Create Account) and
-- teaches the new-user trigger to populate them from auth metadata, so both
-- Google and email/password signups land a complete profile row automatically.

-- 1. Profile identity columns (nullable: existing Google users backfill lazily)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Recreate the trigger to also capture first/last name and email.
-- Email signups pass first_name/last_name via auth options.data; Google passes full_name.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_first TEXT := NEW.raw_user_meta_data ->> 'first_name';
  meta_last TEXT := NEW.raw_user_meta_data ->> 'last_name';
  meta_full TEXT := NEW.raw_user_meta_data ->> 'full_name';
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    meta_first,
    meta_last,
    NEW.email,
    COALESCE(meta_full, NULLIF(TRIM(CONCAT(meta_first, ' ', meta_last)), ''), NEW.email),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
