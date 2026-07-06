import { FEATURE_FLAGS } from '@/utils/constants/featureFlags';
import { supabase } from '@/lib/supabase';
import { sessionStorageAdapter } from '@/services/storage/sessionStorageAdapter';
import { ok, err, ServiceError } from '@/services/errors';

const STORAGE_KEY = 'profiles:caregiver';

function generateId() {
  return `cg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * @returns {import('@/services/types.js').Caregiver | null}
 */
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

export const caregiverService = {
  /**
   * @param {string} userId
   */
  async getCaregiver(userId) {
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      const { data, error } = await supabase
        .from('caregivers')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) {
        return err(new ServiceError(error.message));
      }
      return ok(mapFromDb(data));
    }
    const stored = getMock();
    if (!stored || stored.userId !== userId) {
      return ok(stored);
    }
    return ok(stored);
  },

  async getActiveCaregiver() {
    return ok(getMock());
  },

  /**
   * @param {Omit<import('@/services/types.js').Caregiver, 'id' | 'createdAt'>} data
   */
  async createCaregiver(data) {
    const now = new Date().toISOString();
    const record = {
      ...data,
      id: generateId(),
      createdAt: now,
    };

    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      const { data: row, error } = await supabase
        .from('caregivers')
        .insert(mapToDb(record))
        .select()
        .single();
      if (error) {
        return err(new ServiceError(error.message));
      }
      return ok(mapFromDb(row));
    }

    sessionStorageAdapter.set(STORAGE_KEY, JSON.stringify(record));
    return ok(record);
  },

  /**
   * @param {string} id
   * @param {Partial<import('@/services/types.js').Caregiver>} data
   */
  async updateCaregiver(id, data) {
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      const { data: row, error } = await supabase
        .from('caregivers')
        .update(mapToDb({ ...data, updatedAt: new Date().toISOString() }))
        .eq('id', id)
        .select()
        .single();
      if (error) {
        return err(new ServiceError(error.message));
      }
      return ok(mapFromDb(row));
    }

    const stored = getMock();
    if (!stored || stored.id !== id) {
      return err(new ServiceError('Caregiver not found'));
    }
    const updated = { ...stored, ...data, updatedAt: new Date().toISOString() };
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
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * @param {Partial<import('@/services/types.js').Caregiver>} record
 */
function mapToDb(record) {
  return {
    user_id: record.userId,
    first_name: record.firstName,
    last_name: record.lastName,
    date_of_birth: record.dateOfBirth,
    gender: record.gender,
    updated_at: record.updatedAt,
  };
}
