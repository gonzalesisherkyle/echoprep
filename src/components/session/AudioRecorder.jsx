import { useEffect, useRef } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder.js';

export function AudioRecorder({ onRecorded, isReducedMotion, isDisabled = false }) {
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    durationMs,
    error,
  } = useAudioRecorder();

  const lastEmittedRef = useRef(null);
  useEffect(() => {
    if (audioBlob && audioBlob !== lastEmittedRef.current) {
      lastEmittedRef.current = audioBlob;
      onRecorded(audioBlob, durationMs);
    }
  }, [audioBlob, durationMs, onRecorded]);

  const disabled = isDisabled || Boolean(error);
  function handleClick() {
    if (disabled) return;
    isRecording ? stopRecording() : startRecording();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {isRecording && !isReducedMotion && (
          <div className="absolute inset-0 rounded-full animate-pulse-ring bg-primary/20" />
        )}
        
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={`
            relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
            transition-all duration-300 active:scale-95
            ${isRecording 
              ? 'bg-error text-on-error shadow-lg shadow-error/20 animate-pulse' 
              : 'bg-primary text-on-primary shadow-lg shadow-primary/20'}
            ${disabled ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isRecording ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" />
              <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.93V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.07A7 7 0 0 0 19 11Z" />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <div className="text-[10px] text-error font-bold flex items-center gap-1">
          <span>⚠️</span> {error}
        </div>
      )}

      {isRecording && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">Live</span>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;

