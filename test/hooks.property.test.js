import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { useAudioRecorder } from '../src/hooks/useAudioRecorder.js';
import { usePrefersReducedMotion } from '../src/hooks/usePrefersReducedMotion.js';

// MediaRecorder shim helpers

/**
 * Builds a MediaRecorder shim class that emits `numChunks` data chunks of
 * fixed size when stop() is called, then fires onstop.
 *
 * @param {number} numChunks  - how many ondataavailable events to fire
 * @param {string} mimeType   - MIME type reported by isTypeSupported / used for Blobs
 */
function buildMediaRecorderShim(numChunks, mimeType) {
  class FakeMediaRecorder {
    static isTypeSupported(type) {
      return type === mimeType;
    }

    constructor(_stream, options) {
      this.state = 'inactive';
      this.ondataavailable = null;
      this.onstop = null;
      this._mimeType = options?.mimeType ?? mimeType;
    }

    start() {
      this.state = 'recording';
    }

    stop() {
      this.state = 'inactive';
      // Emit the requested number of data chunks
      for (let i = 0; i < numChunks; i++) {
        if (this.ondataavailable) {
          const data = new Blob([new Uint8Array(64)], { type: this._mimeType });
          this.ondataavailable({ data });
        }
      }
      if (this.onstop) {
        this.onstop();
      }
    }
  }

  return FakeMediaRecorder;
}

