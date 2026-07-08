import { getSupabase } from '@/lib/supabase';
import { ok, err, fromSupabaseError } from '@/services/errors';

export const onboardingService = {
  /**
   * Atomically create the care recipient and caregiver (and ensure the profile)
   * via the complete_onboarding RPC. All-or-nothing: on failure the database is
   * left unchanged.
   * @param {Record<string, unknown>} recipient
   * @param {Record<string, unknown>} caregiver
   */
  async completeOnboarding(recipient, caregiver) {
    const { data, error } = await getSupabase().rpc('complete_onboarding', {
      p_recipient: recipient,
      p_caregiver: caregiver,
    });
    if (error) {
      return err(fromSupabaseError(error, 'Could not complete setup. Please try again.'));
    }
    return ok({
      careRecipient: mapCareRecipient(data?.careRecipient),
      caregiver: mapCaregiver(data?.caregiver),
    });
  },
};

function mapCareRecipient(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    healthDescription: row.health_description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCaregiver(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
