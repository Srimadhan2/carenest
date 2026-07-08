/** @typedef {'idle' | 'listening' | 'unsupported'} SpeechStatus */

/**
 * @returns {typeof SpeechRecognition | null}
 */
export function getSpeechRecognitionConstructor() {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function isSpeechRecognitionSupported() {
  return Boolean(getSpeechRecognitionConstructor());
}

/**
 * Map Web Speech API error codes to friendly messages.
 * @param {string} [errorCode]
 * @returns {string}
 */
export function mapSpeechError(errorCode) {
  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone permission was denied. Allow access in your browser settings.';
    case 'audio-capture':
      return 'No microphone was found. Check that your device is connected.';
    case 'network':
      return 'Voice input needs a network connection. Check your connection and try again.';
    case 'no-speech':
      return 'No speech was detected. Try speaking again.';
    case 'language-not-supported':
      return 'This language is not supported for voice input.';
    case 'aborted':
      return '';
    default:
      return 'Voice input failed. Please try again.';
  }
}

/**
 * Join a text prefix with new transcript segments without double spaces.
 * @param {string} prefix
 * @param {string} transcript
 * @returns {string}
 */
export function joinTranscript(prefix, transcript) {
  const left = prefix.trimEnd();
  const right = transcript.trim();
  if (!left) {
    return right;
  }
  if (!right) {
    return left;
  }
  return `${left} ${right}`;
}
