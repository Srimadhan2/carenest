import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/notes/notesService';

/**
 * @param {string | undefined} careRecipientId
 * @param {import('@/services/types.js').PaginationParams} [params]
 */
export function useNotes(careRecipientId, params = {}) {
  const queryClient = useQueryClient();
  const queryKey = ['notes', careRecipientId, params];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!careRecipientId) {
        return { data: [], total: 0, page: 1, limit: 20, hasMore: false };
      }
      const result = await notesService.getNotes(careRecipientId, params);
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
    enabled: Boolean(careRecipientId),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const result = await notesService.createNote(data);
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', careRecipientId] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }) => {
      const result = await notesService.updateNote(id, { content });
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', careRecipientId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const result = await notesService.deleteNote(id);
      if (result.error) {
        throw result.error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', careRecipientId] }),
  });

  return {
    notes: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    createNote: createMutation.mutateAsync,
    updateNote: updateMutation.mutateAsync,
    deleteNote: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
