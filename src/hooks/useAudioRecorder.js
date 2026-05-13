import { useState, useRef } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [durationMs, setDurationMs] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);

  function getSupportedMimeType() {
    if (typeof MediaRecorder === 'undefined') return '';
    if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4';
    return '';
  }

  async function startRecording() {
    setError(null);
    setAudioBlob(null);
    setDurationMs(null);
    chunksRef.current = [];

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const isDenied =
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError';
      setError(
        isDenied
          ? 'Microphone permission denied'
          : `Microphone unavailable: ${err.message}`
      );
      setIsRecording(false);
      return;
    }

    streamRef.current = stream;

    const mimeType = getSupportedMimeType();
    const options = mimeType ? { mimeType } : {};

    let recorder;
    try {
      recorder = new MediaRecorder(stream, options);
    } catch (err) {
      setError(`Could not create MediaRecorder: ${err.message}`);
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const resolvedMime = mimeType || 'audio/webm';
      const blob = new Blob(chunksRef.current, { type: resolvedMime });

      setAudioBlob(blob);
      setDurationMs(elapsed);
      setIsRecording(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };

    startTimeRef.current = Date.now();
    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
  }

  function reset() {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    mediaRecorderRef.current = null;
    chunksRef.current = [];
    startTimeRef.current = null;

    setAudioBlob(null);
    setDurationMs(null);
    setError(null);
    setIsRecording(false);
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    reset,
    audioBlob,
    durationMs,
    error,
  };
}

export default useAudioRecorder;

