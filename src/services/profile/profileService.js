import { getSupabase } from '@/lib/supabase';
import { ok, err, fromSupabaseError } from '@/services/errors';

export const profileService = {
  /** Account profile for the signed-in user (RLS-scoped), or null. */
  async getProfile() {
    const { data, error } = await getSupabase().from('profiles').select('*').limit(1).maybeSingle();
    if (error) {
      return err(fromSupabaseError(error, 'Could not load your profile.'));
    }
    return ok(data ? mapFromDb(data) : null);
  },

  /**
   * Ensure a profile row exists for the authenticated user, creating it if the
   * signup trigger has not (e.g. older accounts). Reused if it already exists.
   * @param {import('@/services/types.js').User} user
   */
  async ensureProfile(user) {
    const supabase = getSupabase();
    const { data: existing, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (selectError) {
      return err(fromSupabaseError(selectError, 'Could not load your profile.'));
    }
    if (existing) {
      return ok(mapFromDb(existing));
    }

    const payload = {
      user_id: user.id,
      email: user.email ?? null,
      display_name: user.displayName ?? null,
      avatar_url: user.avatarUrl ?? null,
    };
    const { data, error } = await supabase.from('profiles').insert(payload).select().single();
    if (error) {
      // Possibly created concurrently (trigger/another tab): read it back.
      const { data: after } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (after) {
        return ok(mapFromDb(after));
      }
      return err(fromSupabaseError(error, 'Could not create your profile.'));
    }
    return ok(mapFromDb(data));
  },

  /**
   * @param {string} userId
   * @param {{ firstName?: string, lastName?: string }} data
   */
  async updateProfile(userId, data) {
    const patch = {
      first_name: data.firstName,
      last_name: data.lastName,
      display_name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
    };
    const { data: row, error } = await getSupabase()
      .from('profiles')
      .update(patch)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) {
      return err(fromSupabaseError(error, 'Could not save your profile.'));
    }
    return ok(mapFromDb(row));
  },
};

/**
 * @param {Record<string, unknown>} row
 */
function mapFromDb(row) {
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    email: row.email ?? '',
    displayName: row.display_name ?? '',
    avatarUrl: row.avatar_url ?? null,
  };
}
