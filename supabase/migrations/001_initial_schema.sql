-- CareNest Database Schema (Phase 10)
-- See docs/Database.md for full design documentation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Care recipients
CREATE TABLE IF NOT EXISTS care_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  health_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Caregivers
CREATE TABLE IF NOT EXISTS caregivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Households (family sharing)
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Care relationships
CREATE TABLE IF NOT EXISTS care_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caregiver_id UUID REFERENCES caregivers(id) ON DELETE CASCADE NOT NULL,
  care_recipient_id UUID REFERENCES care_recipients(id) ON DELETE CASCADE NOT NULL,
  household_id UUID REFERENCES households(id),
  role TEXT DEFAULT 'primary',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(caregiver_id, care_recipient_id)
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  care_recipient_id UUID REFERENCES care_recipients(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'manual' CHECK (type IN ('manual', 'voice', 'ai_summary')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notes_recipient_created ON notes(care_recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_content_search ON notes USING GIN(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_care_relationships_caregiver ON care_relationships(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_care_relationships_recipient ON care_relationships(care_recipient_id);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_relationships ENABLE ROW LEVEL SECURITY;

-- Profiles: users manage own profile
CREATE POLICY profiles_own ON profiles
  FOR ALL USING (auth.uid() = user_id);

-- Caregivers: users manage own caregiver record
CREATE POLICY caregivers_own ON caregivers
  FOR ALL USING (auth.uid() = user_id);

-- Notes: access via care relationship (simplified)
CREATE POLICY notes_via_relationship ON notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM care_relationships cr
      JOIN caregivers cg ON cg.id = cr.caregiver_id
      WHERE cr.care_recipient_id = notes.care_recipient_id
      AND cg.user_id = auth.uid()
    )
  );
