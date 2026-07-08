import { getSupabase } from '@/lib/supabase';
import { ok, err, fromSupabaseError } from '@/services/errors';

export const careRecipientService = {
  /**
   * @param {string} id
   */
  async getCareRecipient(id) {
    const { data, error } = await getSupabase()
      .from('care_recipients')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      return err(fromSupabaseError(error, 'Could not load the care recipient.'));
    }
    return ok(mapFromDb(data));
  },

  /** Care recipient owned by the signed-in user (RLS-scoped), or null. */
  async getActiveCareRecipient() {
    const { data, error } = await getSupabase()
      .from('care_recipients')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) {
      return err(fromSupabaseError(error, 'Could not load the care recipient.'));
    }
    return ok(data ? mapFromDb(data) : null);
  },

  /**
   * @param {Omit<import('@/services/types.js').CareRecipient, 'id' | 'createdAt'>} data
   */
  async createCareRecipient(data) {
    const { data: row, error } = await getSupabase()
      .from('care_recipients')
      .insert(mapToDb(data))
      .select()
      .single();
    if (error) {
      return err(fromSupabaseError(error, 'Could not save the care recipient.'));
    }
    return ok(mapFromDb(row));
  },

  /**
   * @param {string} id
   * @param {Partial<import('@/services/types.js').CareRecipient>} data
   */
  async updateCareRecipient(id, data) {
    const { data: row, error } = await getSupabase()
      .from('care_recipients')
      .update(mapToDb(data))
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return err(fromSupabaseError(error, 'Could not save the care recipient.'));
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
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    healthDescription: row.health_description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps app fields to DB columns, omitting undefined so partial updates only
 * touch provided columns. user_id and updated_at are set by the DB
 * (DEFAULT auth.uid() and the set_updated_at trigger).
 * @param {Partial<import('@/services/types.js').CareRecipient>} record
 */
function mapToDb(record) {
  const row = {
    first_name: record.firstName,
    last_name: record.lastName,
    date_of_birth: record.dateOfBirth,
    gender: record.gender,
    health_description: record.healthDescription,
  };
  Object.keys(row).forEach((key) => row[key] === undefined && delete row[key]);
  return row;
}
