import { FEATURE_FLAGS } from '@/utils/constants/featureFlags';
import { supabase } from '@/lib/supabase';
import { sessionStorageAdapter } from '@/services/storage/sessionStorageAdapter';
import { ok, err, ServiceError } from '@/services/errors';

const STORAGE_KEY = 'profile:account';

function supabaseReady() {
  return Boolean(FEATURE_FLAGS.USE_SUPABASE && supabase);
}

function getMock() {
  const raw = sessionStorageAdapter.get(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const profileService = {
  /** Account profile for the signed-in user (RLS-scoped), or null. */
  async getProfile() {
    if (supabaseReady()) {
      const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      if (error) {
        return err(new ServiceError(error.message));
      }
      return ok(data ? mapFromDb(data) : null);
    }
    return ok(getMock());
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
      updated_at: new Date().toISOString(),
    };

    if (supabaseReady()) {
      const { data: row, error } = await supabase
        .from('profiles')
        .update(patch)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) {
        return err(new ServiceError(error.message));
      }
      return ok(mapFromDb(row));
    }

    const stored = getMock() ?? {};
    const updated = { ...stored, userId, firstName: data.firstName, lastName: data.lastName };
    sessionStorageAdapter.set(STORAGE_KEY, JSON.stringify(updated));
    return ok(updated);
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
