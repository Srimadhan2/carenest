import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getSpeechRecognitionConstructor,
  isSpeechRecognitionSupported,
  joinTranscript,
  mapSpeechError,
} from '@/utils/speech/speechRecognition';

/**
 * Browser Web Speech API hook for continuous dictation into a text field.
 * @param {{ onTranscriptChange?: (text: string) => void, onError?: (message: string) => void }} [options]
 */
export function useSpeechRecognition({ onTranscriptChange, onError } = {}) {
  const [isSupported] = useState(() => isSpeechRecognitionSupported());
  const [isListening, setIsListening] = useState(false);
  const [hasVoiceContent, setHasVoiceContent] = useState(false);

  const recognitionRef = useRef(null);
  const prefixRef = useRef('');
  const committedRef = useRef('');
  const interimRef = useRef('');
  const listeningRef = useRef(false);
  const manualStopRef = useRef(false);

  const emitTranscript = useCallback(() => {
    const combined = joinTranscript(
      joinTranscript(prefixRef.current, committedRef.current),
      interimRef.current,
    );
    onTranscriptChange?.(combined);
    setHasVoiceContent(Boolean(committedRef.current || interimRef.current));
  }, [onTranscriptChange]);

  const stopInternal = useCallback(() => {
    manualStopRef.current = true;
    listeningRef.current = false;
    setIsListening(false);
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(
    (prefix = '') => {
      if (!isSupported) {
        return;
      }

      const SpeechRecognition = getSpeechRecognitionConstructor();
      if (!SpeechRecognition) {
        return;
      }

      prefixRef.current = prefix;
      committedRef.current = '';
      interimRef.current = '';
      manualStopRef.current = false;
      listeningRef.current = true;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const text = result[0]?.transcript ?? '';
          if (result.isFinal) {
            committedRef.current = joinTranscript(committedRef.current, text);
          } else {
            interim = joinTranscript(interim, text);
          }
        }
        interimRef.current = interim;
        emitTranscript();
      };

      recognition.onerror = (event) => {
        const message = mapSpeechError(event.error);
        if (message) {
          onError?.(message);
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          listeningRef.current = false;
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (interimRef.current) {
          committedRef.current = joinTranscript(committedRef.current, interimRef.current);
          interimRef.current = '';
          emitTranscript();
        }
        setIsListening(false);
        listeningRef.current = false;
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        onError?.('Voice input is already active.');
        setIsListening(false);
        listeningRef.current = false;
      }
    },
    [emitTranscript, isSupported, onError],
  );

  const stop = useCallback(() => {
    stopInternal();
  }, [stopInternal]);

  const clear = useCallback(() => {
    stopInternal();
    prefixRef.current = '';
    committedRef.current = '';
    interimRef.current = '';
    setHasVoiceContent(false);
    onTranscriptChange?.('');
  }, [onTranscriptChange, stopInternal]);

  const clearVoiceSession = useCallback(() => {
    stopInternal();
    committedRef.current = '';
    interimRef.current = '';
    setHasVoiceContent(false);
    onTranscriptChange?.(prefixRef.current);
  }, [onTranscriptChange, stopInternal]);

  useEffect(() => {
    return () => {
      manualStopRef.current = true;
      recognitionRef.current?.stop();
    };
  }, []);

  return {
    isSupported,
    isListening,
    hasVoiceContent,
    start,
    stop,
    clear,
    clearVoiceSession,
  };
}
