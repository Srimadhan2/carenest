import { getSupabase } from '@/lib/supabase';
import { ok, err, fromSupabaseError } from '@/services/errors';

const DEFAULT_PARAMS = {
  page: 1,
  limit: 20,
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const notesService = {
  /**
   * @param {string} careRecipientId
   * @param {import('@/services/types.js').PaginationParams} [params]
   */
  async getNotes(careRecipientId, params = {}) {
    const { page, limit, search, sortBy, sortOrder } = { ...DEFAULT_PARAMS, ...params };
    let query = getSupabase()
      .from('notes')
      .select('*', { count: 'exact' })
      .eq('care_recipient_id', careRecipientId)
      .is('deleted_at', null);

    if (search) {
      query = query.ilike('content', `%${search}%`);
    }

    const ascending = sortOrder === 'asc';
    query = query.order(sortBy === 'updatedAt' ? 'updated_at' : 'created_at', { ascending });

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) {
      return err(fromSupabaseError(error, 'Could not load notes.'));
    }

    return ok({
      data: (data ?? []).map(mapFromDb),
      total: count ?? 0,
      page,
      limit,
      hasMore: from + limit < (count ?? 0),
    });
  },

  /**
   * @param {string} id
   */
  async getNoteById(id) {
    const { data, error } = await getSupabase().from('notes').select('*').eq('id', id).single();
    if (error) {
      return err(fromSupabaseError(error, 'Could not load the note.'));
    }
    return ok(mapFromDb(data));
  },

  /**
   * @param {Omit<import('@/services/types.js').Note, 'id' | 'createdAt' | 'updatedAt'>} data
   */
  async createNote(data) {
    const { data: row, error } = await getSupabase()
      .from('notes')
      .insert(mapToDb({ ...data, type: data.type ?? 'manual' }))
      .select()
      .single();
    if (error) {
      return err(fromSupabaseError(error, 'Could not save the note.'));
    }
    return ok(mapFromDb(row));
  },

  /**
   * @param {string} id
   * @param {Partial<Pick<import('@/services/types.js').Note, 'content'>>} data
   */
  async updateNote(id, data) {
    const { data: row, error } = await getSupabase()
      .from('notes')
      .update({ content: data.content })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return err(fromSupabaseError(error, 'Could not save the note.'));
    }
    return ok(mapFromDb(row));
  },

  /**
   * @param {string} id
   */
  async deleteNote(id) {
    const { error } = await getSupabase()
      .from('notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      return err(fromSupabaseError(error, 'Could not delete the note.'));
    }
    return ok(undefined);
  },
};

/**
 * @param {Record<string, unknown>} row
 */
function mapFromDb(row) {
  return {
    id: row.id,
    careRecipientId: row.care_recipient_id,
    authorId: row.author_id,
    content: row.content,
    type: row.type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * user_id is set by the DB (DEFAULT auth.uid()); updated_at by the trigger.
 * @param {Partial<import('@/services/types.js').Note>} note
 */
function mapToDb(note) {
  return {
    care_recipient_id: note.careRecipientId,
    author_id: note.authorId,
    content: note.content,
    type: note.type,
  };
}
