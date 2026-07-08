-- CareNest — Initial schema (self-contained and idempotent)
-- Safe to run on a brand-new, empty Supabase project, and safe to re-run.
-- Creates the four app-owned tables with per-user ownership (user_id = auth.uid()),
-- timestamps, indexes, constraints, RLS with basic per-user policies, and a
-- trigger that auto-creates a profile row for every new auth user (Google and
-- email/password signups).

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (one per auth user)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Care recipients (owned by the authenticated user)
CREATE TABLE IF NOT EXISTS care_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  health_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Caregivers (owned by the authenticated user)
CREATE TABLE IF NOT EXISTS caregivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notes (owned by the authenticated user; author_id retained for authorship)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  care_recipient_id UUID NOT NULL REFERENCES care_recipients(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'manual' CHECK (type IN ('manual', 'voice', 'ai_summary')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_care_recipients_user ON care_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_caregivers_user ON caregivers(user_id);
-- One caregiver profile per account (MVP)
CREATE UNIQUE INDEX IF NOT EXISTS idx_caregivers_user_unique ON caregivers(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_recipient_created ON notes(care_recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_content_search ON notes USING GIN (to_tsvector('english', content));

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Basic per-user policies. With only USING, Postgres reuses the expression as
-- the WITH CHECK for inserts/updates, so isolation is enforced immediately.
-- Migration 004 restates these explicitly with USING + WITH CHECK.
DROP POLICY IF EXISTS profiles_own ON profiles;
CREATE POLICY profiles_own ON profiles
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS care_recipients_own ON care_recipients;
CREATE POLICY care_recipients_own ON care_recipients
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS caregivers_own ON caregivers;
CREATE POLICY caregivers_own ON caregivers
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS notes_own ON notes;
CREATE POLICY notes_own ON notes
  FOR ALL USING (auth.uid() = user_id);

-- Auto-create a profile row for every new auth user. Email signups pass
-- first_name/last_name via auth options.data; Google passes full_name/avatar_url.
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
