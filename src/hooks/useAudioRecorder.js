import { useState, useRef } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [durationMs, setDurationMs] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

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

    let activeStream;
    try {
      activeStream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

    streamRef.current = activeStream;
    setStream(activeStream);

    const mimeType = getSupportedMimeType();
    const options = mimeType ? { mimeType } : {};

    let recorder;
    try {
      recorder = new MediaRecorder(activeStream, options);
    } catch (err) {
      setError(`Could not create MediaRecorder: ${err.message}`);
      activeStream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setStream(null);
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
      setStream(null);

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
    setStream(null);
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    reset,
    audioBlob,
    durationMs,
    error,
    stream,
  };
}

export default useAudioRecorder;
