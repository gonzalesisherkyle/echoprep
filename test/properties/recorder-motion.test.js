import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { useAudioRecorder } from '../../src/hooks/useAudioRecorder.js';
import { usePrefersReducedMotion } from '../../src/hooks/usePrefersReducedMotion.js';

// MediaRecorder shim

/**
 * Creates a MediaRecorder shim that produces chunks of the given sizes.
 * Each chunk is a Blob of the specified size filled with zeros.
 */
function createMediaRecorderShim(chunkSizes, mimeType = 'audio/webm') {
  class FakeMediaRecorder {
    static isTypeSupported(type) {
      return type === mimeType;
    }

    constructor(stream, options) {
      this.stream = stream;
      this.state = 'inactive';
      this.ondataavailable = null;
      this.onstop = null;
      this._mimeType = options?.mimeType || mimeType;
    }

    start() {
      this.state = 'recording';
    }

    stop() {
      this.state = 'inactive';
      // Emit chunks
      for (const size of chunkSizes) {
        if (this.ondataavailable) {
          const data = new Blob([new Uint8Array(size)], { type: this._mimeType });
          this.ondataavailable({ data });
        }
      }
      // Fire onstop
      if (this.onstop) {
        this.onstop();
      }
    }
  }

  return FakeMediaRecorder;
}

/**
 * Creates a fake MediaStream with a stop-able track.
 */
function createFakeStream() {
  return {
    getTracks: () => [{ stop: vi.fn() }],
  };
}

// **Validates: Requirements 7.3**

describe('Property 18: Audio recorder output shape', () => {
  let originalMediaRecorder;
  let originalMediaDevices;

  beforeEach(() => {
    originalMediaRecorder = globalThis.MediaRecorder;
    originalMediaDevices = navigator.mediaDevices;

    // Ensure navigator.mediaDevices exists in jsdom
    if (!navigator.mediaDevices) {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: { getUserMedia: vi.fn() },
        writable: true,
        configurable: true,
      });
    }
  });

  afterEach(() => {
    globalThis.MediaRecorder = originalMediaRecorder;
    if (originalMediaDevices) {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: originalMediaDevices,
        writable: true,
        configurable: true,
      });
    }
    vi.restoreAllMocks();
  });

  it('after a successful recording, audioBlob is a Blob with MIME audio/webm or audio/mp4, and durationMs is non-negative', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate an array of chunk sizes (1 to 10 chunks, each 1-10000 bytes)
        fc.array(fc.integer({ min: 1, max: 10000 }), { minLength: 1, maxLength: 10 }),
        // Generate which MIME type to support
        fc.constantFrom('audio/webm', 'audio/mp4'),
        // Generate a simulated recording duration (1ms to 5000ms)
        fc.integer({ min: 1, max: 5000 }),
        async (chunkSizes, mime, simulatedDuration) => {
          // Set up the shim
          const FakeMediaRecorder = createMediaRecorderShim(chunkSizes, mime);
          globalThis.MediaRecorder = FakeMediaRecorder;

          // Mock getUserMedia to return a fake stream
          const fakeStream = createFakeStream();
          Object.defineProperty(navigator, 'mediaDevices', {
            value: { getUserMedia: vi.fn().mockResolvedValue(fakeStream) },
            writable: true,
            configurable: true,
          });

          // Mock Date.now to control duration
          const startTime = 1000000;
          let callCount = 0;
          vi.spyOn(Date, 'now').mockImplementation(() => {
            callCount++;
            // First call is in startRecording (startTimeRef), second is in onstop
            if (callCount <= 1) return startTime;
            return startTime + simulatedDuration;
          });

          const { result } = renderHook(() => useAudioRecorder());

          // Start recording
          await act(async () => {
            await result.current.startRecording();
          });

          // Stop recording
          act(() => {
            result.current.stopRecording();
          });

          // Wait for state to settle
          await waitFor(() => {
            expect(result.current.isRecording).toBe(false);
          });

          // Assertions for Property 18
          const { audioBlob, durationMs, error } = result.current;

          // audioBlob must be a Blob
          expect(audioBlob).toBeInstanceOf(Blob);

          // MIME type must be audio/webm or audio/mp4
          expect(['audio/webm', 'audio/mp4']).toContain(audioBlob.type);
          expect(audioBlob.type).toBe(mime);

          // durationMs must be a non-negative number
          expect(typeof durationMs).toBe('number');
          expect(durationMs).toBeGreaterThanOrEqual(0);
          expect(durationMs).toBe(simulatedDuration);

          // No error
          expect(error).toBeNull();
        }
      ),
      { numRuns: 50 }
    );
  });
});

// **Validates: Requirements 20.8**

describe('Property 43: Reduced-motion honors user preference', () => {
  let originalMatchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('for arbitrary boolean values of prefers-reduced-motion, the hook returns the matching boolean', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (prefersReduced) => {
          // Mock matchMedia to return the generated boolean
          const listeners = [];
          const mockMediaQueryList = {
            matches: prefersReduced,
            media: '(prefers-reduced-motion: reduce)',
            addEventListener: (event, handler) => {
              listeners.push(handler);
            },
            removeEventListener: (event, handler) => {
              const idx = listeners.indexOf(handler);
              if (idx >= 0) listeners.splice(idx, 1);
            },
          };

          window.matchMedia = vi.fn((query) => {
            if (query === '(prefers-reduced-motion: reduce)') {
              return mockMediaQueryList;
            }
            return { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
          });

          const { result } = renderHook(() => usePrefersReducedMotion());

          // The hook should return the same boolean as matchMedia.matches
          expect(result.current).toBe(prefersReduced);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('when a change event fires with a new value, the hook updates to reflect it', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        fc.boolean(),
        async (initialValue, updatedValue) => {
          // Mock matchMedia with an initial value and capture the change listener
          const listeners = [];
          const mockMediaQueryList = {
            matches: initialValue,
            media: '(prefers-reduced-motion: reduce)',
            addEventListener: (event, handler) => {
              listeners.push(handler);
            },
            removeEventListener: (event, handler) => {
              const idx = listeners.indexOf(handler);
              if (idx >= 0) listeners.splice(idx, 1);
            },
          };

          window.matchMedia = vi.fn((query) => {
            if (query === '(prefers-reduced-motion: reduce)') {
              return mockMediaQueryList;
            }
            return { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
          });

          const { result } = renderHook(() => usePrefersReducedMotion());

          // Initial value should match
          expect(result.current).toBe(initialValue);

          // Simulate a change event with the updated value
          act(() => {
            mockMediaQueryList.matches = updatedValue;
            for (const listener of listeners) {
              listener({ matches: updatedValue });
            }
          });

          // After the change event, the hook should reflect the updated value
          expect(result.current).toBe(updatedValue);
        }
      ),
      { numRuns: 100 }
    );
  });
});

