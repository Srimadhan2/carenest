import { FEATURE_FLAGS } from '@/utils/constants/featureFlags';
import { supabase } from '@/lib/supabase';
import { sessionStorageAdapter } from '@/services/storage/sessionStorageAdapter';
import { ok, err, ServiceError } from '@/services/errors';

const STORAGE_KEY = 'notes:list';

const DEFAULT_PARAMS = {
  page: 1,
  limit: 20,
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

function generateId() {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * @returns {import('@/services/types.js').Note[]}
 */
function getMockNotes() {
  const raw = sessionStorageAdapter.get(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * @param {import('@/services/types.js').Note[]} notes
 */
function setMockNotes(notes) {
  sessionStorageAdapter.set(STORAGE_KEY, JSON.stringify(notes));
}

/**
 * @param {import('@/services/types.js').Note[]} notes
 * @param {import('@/services/types.js').PaginationParams} params
 */
function paginateNotes(notes, params) {
  const { page, limit, search, sortBy, sortOrder } = { ...DEFAULT_PARAMS, ...params };

  let filtered = [...notes];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((n) => n.content.toLowerCase().includes(q));
  }

  filtered.sort((a, b) => {
    const aVal = a[sortBy] ?? '';
    const bVal = b[sortBy] ?? '';
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    total,
    page,
    limit,
    hasMore: start + limit < total,
  };
}

export const notesService = {
  /**
   * @param {string} careRecipientId
   * @param {import('@/services/types.js').PaginationParams} [params]
   */
  async getNotes(careRecipientId, params = {}) {
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      const { page, limit, search, sortBy, sortOrder } = { ...DEFAULT_PARAMS, ...params };
      let query = supabase
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
        return err(new ServiceError(error.message));
      }

      return ok({
        data: (data ?? []).map(mapFromDb),
        total: count ?? 0,
        page,
        limit,
        hasMore: from + limit < (count ?? 0),
      });
    }

    const all = getMockNotes().filter((n) => n.careRecipientId === careRecipientId);
    return ok(paginateNotes(all, params));
  },

  /**
   * @param {string} id
   */
  async getNoteById(id) {
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
      if (error) {
        return err(new ServiceError(error.message));
      }
      return ok(mapFromDb(data));
    }

    const note = getMockNotes().find((n) => n.id === id);
    if (!note) {
      return err(new ServiceError('Note not found'));
    }
    return ok(note);
  },

  /**
   * @param {Omit<import('@/services/types.js').Note, 'id' | 'createdAt' | 'updatedAt'>} data
   */
  async createNote(data) {
    const now = new Date().toISOString();
    const note = {
      ...data,
      id: generateId(),
      createdAt: now,
      type: data.type ?? 'manual',
    };

    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      const { data: row, error } = await supabase
        .from('notes')
        .insert(mapToDb(note))
        .select()
        .single();
      if (error) {
        return err(new ServiceError(error.message));
      }
      return ok(mapFromDb(row));
    }

    const notes = getMockNotes();
    notes.unshift(note);
    setMockNotes(notes);
    return ok(note);
  },

  /**
   * @param {string} id
   * @param {Partial<Pick<import('@/services/types.js').Note, 'content'>>} data
   */
  async updateNote(id, data) {
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      const { data: row, error } = await supabase
        .from('notes')
        .update({ content: data.content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        return err(new ServiceError(error.message));
      }
      return ok(mapFromDb(row));
    }

    const notes = getMockNotes();
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) {
      return err(new ServiceError('Note not found'));
    }
    notes[index] = { ...notes[index], ...data, updatedAt: new Date().toISOString() };
    setMockNotes(notes);
    return ok(notes[index]);
  },

  /**
   * @param {string} id
   */
  async deleteNote(id) {
    if (FEATURE_FLAGS.USE_SUPABASE && supabase) {
      const { error } = await supabase
        .from('notes')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
      if (error) {
        return err(new ServiceError(error.message));
      }
      return ok(undefined);
    }

    const notes = getMockNotes().filter((n) => n.id !== id);
    setMockNotes(notes);
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
