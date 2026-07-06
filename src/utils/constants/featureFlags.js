export const FEATURE_FLAGS = {
  VOICE_NOTES: false,
  AI_SUMMARIES: false,
  MEDICATION_ASSIST: false,
  USE_SUPABASE: Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  ),
};
