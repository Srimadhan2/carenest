-- CareNest — Auth & persistence hardening
-- Makes per-account data isolation functional with the app's direct-ownership model:
-- each authenticated user owns their caregiver row, care recipient(s), and notes.

-- 1. Care recipients: direct ownership (the app creates recipients without care_relationships)
ALTER TABLE care_recipients
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Stamp ownership automatically on insert; the client never sends user_id
ALTER TABLE care_recipients
  ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS idx_care_recipients_user ON care_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_caregivers_user ON caregivers(user_id);

-- One caregiver profile per account (MVP: single caregiver per user)
CREATE UNIQUE INDEX IF NOT EXISTS idx_caregivers_user_unique ON caregivers(user_id);

-- 2. RLS: care recipients visible/writable only by their owner
DROP POLICY IF EXISTS care_recipients_own ON care_recipients;
CREATE POLICY care_recipients_own ON care_recipients
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. RLS: notes accessible only through an owned care recipient.
-- Replaces the care_relationships-based policy (that table is not populated by the MVP app).
DROP POLICY IF EXISTS notes_via_relationship ON notes;
DROP POLICY IF EXISTS notes_own ON notes;
CREATE POLICY notes_own ON notes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM care_recipients cr
      WHERE cr.id = notes.care_recipient_id
        AND cr.user_id = auth.uid()
    )
  )
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM care_recipients cr
      WHERE cr.id = notes.care_recipient_id
        AND cr.user_id = auth.uid()
    )
  );

-- 4. Profiles: auto-create one row per new auth user (Google metadata included)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
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
