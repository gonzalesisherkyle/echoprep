import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAudioRecorder } from './useAudioRecorder.js';

// MediaRecorder / getUserMedia mocks

/**
 * Build a minimal MediaRecorder mock that synchronously fires ondataavailable
 * and onstop when stop() is called.
 */
function createMockMediaRecorder(mimeType = 'audio/webm') {
  const recorder = {
    state: 'inactive',
    mimeType,
    ondataavailable: null,
    onstop: null,
    start() {
      this.state = 'recording';
    },
    stop() {
      if (this.state === 'inactive') return;
      this.state = 'inactive';
      // Fire ondataavailable with a small chunk.
      if (this.ondataavailable) {
        this.ondataavailable({ data: new Blob(['audio'], { type: mimeType }) });
      }
      if (this.onstop) {
        this.onstop();
      }
    },
  };
  return recorder;
}

function createMockStream() {
  const tracks = [{ stop: vi.fn(), kind: 'audio' }];
  return {
    getTracks: () => tracks,
    _tracks: tracks,
  };
}

let mockStream;
let mockRecorder;

beforeEach(() => {
  mockStream = createMockStream();
  mockRecorder = createMockMediaRecorder('audio/webm');

  // Stub navigator.mediaDevices.getUserMedia
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockResolvedValue(mockStream),
    },
    writable: true,
    configurable: true,
  });

  // Stub MediaRecorder
  global.MediaRecorder = vi.fn().mockImplementation(() => mockRecorder);
  global.MediaRecorder.isTypeSupported = vi.fn((type) => type === 'audio/webm');
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Tests

describe('useAudioRecorder – initial state', () => {
  it('returns correct initial values', () => {
    const { result } = renderHook(() => useAudioRecorder());
    expect(result.current.isRecording).toBe(false);
    expect(result.current.audioBlob).toBeNull();
    expect(result.current.durationMs).toBeNull();
    expect(result.current.error).toBeNull();
    expect(typeof result.current.startRecording).toBe('function');
    expect(typeof result.current.stopRecording).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });
});

describe('useAudioRecorder – startRecording', () => {
  it('calls getUserMedia with audio:true (Req 7.1)', async () => {
    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => {
      await result.current.startRecording();
    });
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it('sets isRecording to true after start', async () => {
    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => {
      await result.current.startRecording();
    });
    expect(result.current.isRecording).toBe(true);
  });

  it('creates MediaRecorder with audio/webm when supported (Req 7.3)', async () => {
    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => {
      await result.current.startRecording();
    });
    expect(global.MediaRecorder).toHaveBeenCalledWith(mockStream, { mimeType: 'audio/webm' });
  });

  it('falls back to audio/mp4 when webm is not supported (Req 7.3)', async () => {
    global.MediaRecorder.isTypeSupported = vi.fn((type) => type === 'audio/mp4');
    mockRecorder = createMockMediaRecorder('audio/mp4');
    global.MediaRecorder = vi.fn().mockImplementation(() => mockRecorder);
    global.MediaRecorder.isTypeSupported = vi.fn((type) => type === 'audio/mp4');

    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => {
      await result.current.startRecording();
    });
    expect(global.MediaRecorder).toHaveBeenCalledWith(mockStream, { mimeType: 'audio/mp4' });
  });
});

describe('useAudioRecorder – stopRecording', () => {
  it('sets isRecording to false after stop', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });
    expect(result.current.isRecording).toBe(true);

    act(() => {
      result.current.stopRecording();
    });

    await waitFor(() => expect(result.current.isRecording).toBe(false));
  });

  it('produces an audioBlob with correct MIME type (Req 7.3)', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    await waitFor(() => expect(result.current.audioBlob).not.toBeNull());
    expect(result.current.audioBlob).toBeInstanceOf(Blob);
    expect(result.current.audioBlob.type).toBe('audio/webm');
  });

  it('sets durationMs to a non-negative number (Req 7.3)', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    await waitFor(() => expect(result.current.durationMs).not.toBeNull());
    expect(typeof result.current.durationMs).toBe('number');
    expect(result.current.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('stops stream tracks after recording ends', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    await waitFor(() => expect(result.current.isRecording).toBe(false));
    expect(mockStream._tracks[0].stop).toHaveBeenCalled();
  });
});

describe('useAudioRecorder – permission errors (Req 7.4)', () => {
  it('sets error message when permission is denied (NotAllowedError)', async () => {
    const permissionError = new DOMException('Permission denied', 'NotAllowedError');
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(permissionError);

    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.error).toBe('Microphone permission denied');
    expect(result.current.isRecording).toBe(false);
  });

  it('sets error message when permission is denied (PermissionDeniedError)', async () => {
    const permissionError = new DOMException('Permission denied', 'PermissionDeniedError');
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(permissionError);

    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.error).toBe('Microphone permission denied');
    expect(result.current.isRecording).toBe(false);
  });

  it('sets a descriptive error for non-permission failures', async () => {
    const deviceError = new DOMException('Device not found', 'NotFoundError');
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(deviceError);

    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.error).toMatch(/Microphone unavailable/);
    expect(result.current.isRecording).toBe(false);
  });

  it('does not set audioBlob when permission is denied', async () => {
    const permissionError = new DOMException('Permission denied', 'NotAllowedError');
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(permissionError);

    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.audioBlob).toBeNull();
  });
});

describe('useAudioRecorder – reset', () => {
  it('clears audioBlob, durationMs, and error after a completed recording', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });
    act(() => {
      result.current.stopRecording();
    });
    await waitFor(() => expect(result.current.audioBlob).not.toBeNull());

    act(() => {
      result.current.reset();
    });

    expect(result.current.audioBlob).toBeNull();
    expect(result.current.durationMs).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isRecording).toBe(false);
  });

  it('clears error state set by a permission denial', async () => {
    const permissionError = new DOMException('Permission denied', 'NotAllowedError');
    navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(permissionError);

    const { result } = renderHook(() => useAudioRecorder());
    await act(async () => {
      await result.current.startRecording();
    });
    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.error).toBeNull();
  });
});

