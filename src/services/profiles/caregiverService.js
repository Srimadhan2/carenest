import { getSupabase } from '@/lib/supabase';
import { ok, err, fromSupabaseError } from '@/services/errors';

export const caregiverService = {
  /**
   * @param {string} userId
   */
  async getCaregiver(userId) {
    const { data, error } = await getSupabase()
      .from('caregivers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      return err(fromSupabaseError(error, 'Could not load the caregiver.'));
    }
    return ok(data ? mapFromDb(data) : null);
  },

  /** Caregiver row for the signed-in user (RLS-scoped), or null. */
  async getActiveCaregiver() {
    const { data, error } = await getSupabase()
      .from('caregivers')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (error) {
      return err(fromSupabaseError(error, 'Could not load the caregiver.'));
    }
    return ok(data ? mapFromDb(data) : null);
  },

  /**
   * @param {Omit<import('@/services/types.js').Caregiver, 'id' | 'createdAt'>} data
   */
  async createCaregiver(data) {
    const { data: row, error } = await getSupabase()
      .from('caregivers')
      .insert(mapToDb(data))
      .select()
      .single();
    if (error) {
      return err(fromSupabaseError(error, 'Could not save the caregiver.'));
    }
    return ok(mapFromDb(row));
  },

  /**
   * @param {string} id
   * @param {Partial<import('@/services/types.js').Caregiver>} data
   */
  async updateCaregiver(id, data) {
    const { data: row, error } = await getSupabase()
      .from('caregivers')
      .update(mapToDb(data))
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return err(fromSupabaseError(error, 'Could not save the caregiver.'));
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
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps app fields to DB columns, omitting undefined so partial updates only
 * touch provided columns. updated_at is set by the set_updated_at trigger.
 * @param {Partial<import('@/services/types.js').Caregiver>} record
 */
function mapToDb(record) {
  const row = {
    user_id: record.userId,
    first_name: record.firstName,
    last_name: record.lastName,
    date_of_birth: record.dateOfBirth,
    gender: record.gender,
  };
  Object.keys(row).forEach((key) => row[key] === undefined && delete row[key]);
  return row;
}
