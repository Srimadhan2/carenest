-- CareNest — Ownership hardening, constraints, and audit columns
-- Additive layer on top of 001. Idempotent and safe to re-run.

-- 1. Audit columns (optional) on every user-owned table
ALTER TABLE profiles        ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE profiles        ADD COLUMN IF NOT EXISTS updated_by UUID DEFAULT auth.uid();
ALTER TABLE care_recipients ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE care_recipients ADD COLUMN IF NOT EXISTS updated_by UUID DEFAULT auth.uid();
ALTER TABLE caregivers      ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE caregivers      ADD COLUMN IF NOT EXISTS updated_by UUID DEFAULT auth.uid();
ALTER TABLE notes           ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE notes           ADD COLUMN IF NOT EXISTS updated_by UUID DEFAULT auth.uid();

-- 2. Auto-maintain updated_at (and updated_by) on every UPDATE
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON care_recipients;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON care_recipients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON caregivers;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON caregivers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON notes;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Business-rule constraint (MVP): one ACTIVE care recipient per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_care_recipients_active_user
  ON care_recipients(user_id)
  WHERE deleted_at IS NULL;

-- 4. Explicit hardened RLS: each user may SELECT/INSERT/UPDATE/DELETE only their
-- own rows. FOR ALL covers all four commands; WITH CHECK constrains writes.
-- Replaces the basic (USING-only) policies from 001.
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes           ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_own ON profiles;
CREATE POLICY profiles_own ON profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS care_recipients_own ON care_recipients;
CREATE POLICY care_recipients_own ON care_recipients
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS caregivers_own ON caregivers;
CREATE POLICY caregivers_own ON caregivers
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS notes_own ON notes;
CREATE POLICY notes_own ON notes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
