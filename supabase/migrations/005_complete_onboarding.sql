-- CareNest — Atomic onboarding
-- Commits the profile, care recipient, and caregiver in a single transaction so
-- onboarding is all-or-nothing. Any failure raises and rolls back the whole
-- function, leaving the database unchanged (no partially created records).
--
-- SECURITY INVOKER: runs as the calling user so RLS WITH CHECK (user_id = auth.uid())
-- still applies to every insert.

CREATE OR REPLACE FUNCTION public.complete_onboarding(
  p_recipient jsonb,
  p_caregiver jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_recipient care_recipients;
  v_caregiver caregivers;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  -- Ensure the profile row exists (trigger normally creates it; this is a safety net).
  INSERT INTO profiles (user_id)
  VALUES (v_uid)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO care_recipients (
    user_id, first_name, last_name, date_of_birth, gender, health_description
  )
  VALUES (
    v_uid,
    p_recipient ->> 'firstName',
    p_recipient ->> 'lastName',
    (p_recipient ->> 'dateOfBirth')::date,
    p_recipient ->> 'gender',
    NULLIF(p_recipient ->> 'healthDescription', '')
  )
  RETURNING * INTO v_recipient;

  INSERT INTO caregivers (
    user_id, first_name, last_name, date_of_birth, gender
  )
  VALUES (
    v_uid,
    p_caregiver ->> 'firstName',
    p_caregiver ->> 'lastName',
    (p_caregiver ->> 'dateOfBirth')::date,
    p_caregiver ->> 'gender'
  )
  RETURNING * INTO v_caregiver;

  RETURN jsonb_build_object(
    'careRecipient', to_jsonb(v_recipient),
    'caregiver', to_jsonb(v_caregiver)
  );
END;
$$;

-- Expose to authenticated users only (PostgREST rpc endpoint).
REVOKE ALL ON FUNCTION public.complete_onboarding(jsonb, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_onboarding(jsonb, jsonb) TO authenticated;
