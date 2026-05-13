import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAnswerUpload } from './useAnswerUpload.js';

// Mock the answer API service
vi.mock('../services/answer.api.js', () => ({
  uploadAnswer: vi.fn(),
}));

import { uploadAnswer } from '../services/answer.api.js';

const MOCK_BLOB = new Blob(['audio data'], { type: 'audio/webm' });
const MOCK_OPTIONS = { sessionId: 'session-123', questionId: 'question-456' };

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('useAnswerUpload – initial state', () => {
  it('returns correct initial values', () => {
    const { result } = renderHook(() => useAnswerUpload());
    expect(result.current.isUploading).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.error).toBeNull();
    expect(result.current.lastAnswerId).toBeNull();
    expect(typeof result.current.upload).toBe('function');
  });
});

describe('useAnswerUpload – successful upload', () => {
  it('calls uploadAnswer with a FormData containing audio, sessionId, and questionId', async () => {
    uploadAnswer.mockResolvedValue({ answerId: 'ans-001' });

    const { result } = renderHook(() => useAnswerUpload());
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    expect(uploadAnswer).toHaveBeenCalledOnce();
    const [formData] = uploadAnswer.mock.calls[0];
    expect(formData).toBeInstanceOf(FormData);
    // jsdom wraps a Blob appended to FormData as a File (a Blob subclass); check type and size.
    const audioEntry = formData.get('audio');
    expect(audioEntry).toBeInstanceOf(Blob);
    expect(audioEntry.size).toBe(MOCK_BLOB.size);
    expect(audioEntry.type).toBe(MOCK_BLOB.type);
    expect(formData.get('sessionId')).toBe('session-123');
    expect(formData.get('questionId')).toBe('question-456');
  });

  it('sets lastAnswerId from answerId field in response', async () => {
    uploadAnswer.mockResolvedValue({ answerId: 'ans-001' });

    const { result } = renderHook(() => useAnswerUpload());
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    expect(result.current.lastAnswerId).toBe('ans-001');
  });

  it('sets lastAnswerId from _id field when answerId is absent', async () => {
    uploadAnswer.mockResolvedValue({ _id: 'ans-002' });

    const { result } = renderHook(() => useAnswerUpload());
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    expect(result.current.lastAnswerId).toBe('ans-002');
  });

  it('sets progress to 100 after a successful upload', async () => {
    uploadAnswer.mockResolvedValue({ answerId: 'ans-003' });

    const { result } = renderHook(() => useAnswerUpload());
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    expect(result.current.progress).toBe(100);
  });

  it('sets isUploading to false after a successful upload', async () => {
    uploadAnswer.mockResolvedValue({ answerId: 'ans-004' });

    const { result } = renderHook(() => useAnswerUpload());
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    expect(result.current.isUploading).toBe(false);
  });

  it('clears error after a successful upload', async () => {
    // First upload fails, second succeeds — error should be cleared.
    uploadAnswer
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ answerId: 'ans-005' });

    const { result } = renderHook(() => useAnswerUpload());

    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });
    expect(result.current.error).toBe('Network error');

    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });
    expect(result.current.error).toBeNull();
  });
});

describe('useAnswerUpload – upload in progress', () => {
  it('sets isUploading to true while the request is in flight', async () => {
    let resolveUpload;
    uploadAnswer.mockReturnValue(
      new Promise((resolve) => {
        resolveUpload = resolve;
      })
    );

    const { result } = renderHook(() => useAnswerUpload());

    act(() => {
      result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    await waitFor(() => expect(result.current.isUploading).toBe(true));

    await act(async () => {
      resolveUpload({ answerId: 'ans-006' });
    });

    expect(result.current.isUploading).toBe(false);
  });

  it('resets progress to 0 at the start of a new upload', async () => {
    uploadAnswer.mockResolvedValue({ answerId: 'ans-007' });

    const { result } = renderHook(() => useAnswerUpload());

    // First upload sets progress to 100.
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });
    expect(result.current.progress).toBe(100);

    // Second upload should reset progress to 0 before completing.
    let resolveUpload;
    uploadAnswer.mockReturnValue(
      new Promise((resolve) => {
        resolveUpload = resolve;
      })
    );

    act(() => {
      result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    await waitFor(() => expect(result.current.progress).toBe(0));

    await act(async () => {
      resolveUpload({ answerId: 'ans-008' });
    });
  });
});

describe('useAnswerUpload – upload failure', () => {
  it('sets error message when uploadAnswer rejects', async () => {
    uploadAnswer.mockRejectedValue(new Error('Upload failed'));

    const { result } = renderHook(() => useAnswerUpload());
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    expect(result.current.error).toBe('Upload failed');
  });

  it('sets isUploading to false after a failed upload', async () => {
    uploadAnswer.mockRejectedValue(new Error('Upload failed'));

    const { result } = renderHook(() => useAnswerUpload());
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    expect(result.current.isUploading).toBe(false);
  });

  it('leaves lastAnswerId null after a failed upload', async () => {
    uploadAnswer.mockRejectedValue(new Error('Upload failed'));

    const { result } = renderHook(() => useAnswerUpload());
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    expect(result.current.lastAnswerId).toBeNull();
  });

  it('uses a fallback error message when the error has no message', async () => {
    uploadAnswer.mockRejectedValue({});

    const { result } = renderHook(() => useAnswerUpload());
    await act(async () => {
      await result.current.upload(MOCK_BLOB, MOCK_OPTIONS);
    });

    expect(result.current.error).toBe('Upload failed');
  });
});

