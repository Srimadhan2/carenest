import { describe, expect, it } from 'vitest';
import { joinTranscript, mapSpeechError } from './speechRecognition';

describe('mapSpeechError', () => {
  it('maps permission errors', () => {
    expect(mapSpeechError('not-allowed')).toMatch(/permission/i);
    expect(mapSpeechError('service-not-allowed')).toMatch(/permission/i);
  });

  it('maps microphone and network errors', () => {
    expect(mapSpeechError('audio-capture')).toMatch(/microphone/i);
    expect(mapSpeechError('network')).toMatch(/network/i);
  });

  it('returns empty string for aborted', () => {
    expect(mapSpeechError('aborted')).toBe('');
  });
});

describe('joinTranscript', () => {
  it('joins prefix and transcript with a single space', () => {
    expect(joinTranscript('Hello', 'world')).toBe('Hello world');
  });

  it('returns transcript when prefix is empty', () => {
    expect(joinTranscript('', 'Hello')).toBe('Hello');
  });

  it('returns prefix when transcript is empty', () => {
    expect(joinTranscript('Hello', '')).toBe('Hello');
  });
});
