import { FEATURE_FLAGS } from '@/utils/constants/featureFlags';
import { apiClient, getEdgeFunctionUrl } from '@/services/api/client';
import { ok, err, ServiceError } from '@/services/errors';

export const transcriptionService = {
  /**
   * @param {string} audioUrl
   */
  async transcribe(audioUrl) {
    if (!FEATURE_FLAGS.VOICE_NOTES) {
      return err(new ServiceError('Voice notes are not enabled'));
    }
    const url = getEdgeFunctionUrl('transcribe-voice');
    if (!url) {
      return err(new ServiceError('Edge Functions not configured'));
    }
    try {
      const { data } = await apiClient.post(url, { audioUrl });
      return ok(data.transcript);
    } catch (error) {
      return err(new ServiceError('Transcription failed', { cause: error }));
    }
  },
};

export const summaryService = {
  /**
   * @param {string[]} noteIds
   */
  async summarizeNotes(noteIds) {
    if (!FEATURE_FLAGS.AI_SUMMARIES) {
      return err(new ServiceError('AI summaries are not enabled'));
    }
    const url = getEdgeFunctionUrl('summarize-notes');
    if (!url) {
      return err(new ServiceError('Edge Functions not configured'));
    }
    try {
      const { data } = await apiClient.post(url, { noteIds });
      return ok(data.summary);
    } catch (error) {
      return err(new ServiceError('Summary failed', { cause: error }));
    }
  },
};

export const medicationAssistService = {
  /**
   * @param {string} question
   * @param {string} careRecipientId
   */
  async ask(question, careRecipientId) {
    if (!FEATURE_FLAGS.MEDICATION_ASSIST) {
      return err(new ServiceError('Medication assistance is not enabled'));
    }
    const url = getEdgeFunctionUrl('medication-assist');
    if (!url) {
      return err(new ServiceError('Edge Functions not configured'));
    }
    try {
      const { data } = await apiClient.post(url, { question, careRecipientId });
      return ok(data.response);
    } catch (error) {
      return err(new ServiceError('Medication assist failed', { cause: error }));
    }
  },
};
