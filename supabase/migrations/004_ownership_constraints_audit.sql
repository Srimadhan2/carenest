-- CareNest — Ownership, RLS, constraints, and audit hardening
-- Standardizes every user-owned table on user_id = auth.uid(), enforces the MVP
-- business rules in the database, adds audit columns, and maintains updated_at
-- automatically via a trigger. Additive migration: 001-003 stay untouched.

-- 1. Notes: direct per-user ownership so isolation no longer relies on a join
ALTER TABLE notes
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill from the existing author_id, then lock down the column
UPDATE notes SET user_id = author_id WHERE user_id IS NULL;

ALTER TABLE notes ALTER COLUMN user_id SET DEFAULT auth.uid();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM notes WHERE user_id IS NULL) THEN
    ALTER TABLE notes ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);

-- 2. Audit columns on every user-owned table (created_by/updated_by optional)
ALTER TABLE profiles        ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE profiles        ADD COLUMN IF NOT EXISTS updated_by UUID DEFAULT auth.uid();
ALTER TABLE care_recipients ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE care_recipients ADD COLUMN IF NOT EXISTS updated_by UUID DEFAULT auth.uid();
ALTER TABLE caregivers      ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE caregivers      ADD COLUMN IF NOT EXISTS updated_by UUID DEFAULT auth.uid();
ALTER TABLE notes           ADD COLUMN IF NOT EXISTS created_by UUID DEFAULT auth.uid();
ALTER TABLE notes           ADD COLUMN IF NOT EXISTS updated_by UUID DEFAULT auth.uid();

-- 3. Auto-maintain updated_at (and updated_by) on every UPDATE
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

-- 4. Business-rule constraints (MVP)
-- One profile per user (profiles.user_id is already UNIQUE from 001).
-- One caregiver per user (idx_caregivers_user_unique already exists from 002).
-- One ACTIVE care recipient per user: enforce with a partial unique index.
CREATE UNIQUE INDEX IF NOT EXISTS idx_care_recipients_active_user
  ON care_recipients(user_id)
  WHERE deleted_at IS NULL;

-- 5. Explicit CRUD RLS: each user may SELECT/INSERT/UPDATE/DELETE only their own
-- rows (FOR ALL covers all four commands; WITH CHECK constrains writes).
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

-- Replace the earlier relationship/ownership-join policy with direct user_id.
DROP POLICY IF EXISTS notes_via_relationship ON notes;
DROP POLICY IF EXISTS notes_own ON notes;
CREATE POLICY notes_own ON notes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
