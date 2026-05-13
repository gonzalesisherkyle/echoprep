import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useScoring } from './useScoring.js';

// Mock the scoring API service
vi.mock('../services/scoring.api.js', () => ({
  evaluateAnswer: vi.fn(),
}));

import { evaluateAnswer } from '../services/scoring.api.js';

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('useScoring – initial state', () => {
  it('returns correct initial values', () => {
    const { result } = renderHook(() => useScoring());
    expect(result.current.isScoring).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.evaluate).toBe('function');
  });
});

describe('useScoring – successful evaluation', () => {
  it('calls evaluateAnswer with the correct answerId', async () => {
    evaluateAnswer.mockResolvedValue({ score: 85 });

    const { result } = renderHook(() => useScoring());
    await act(async () => {
      await result.current.evaluate('ans-001');
    });

    expect(evaluateAnswer).toHaveBeenCalledOnce();
    expect(evaluateAnswer).toHaveBeenCalledWith({ answerId: 'ans-001' });
  });

  it('returns the evaluation result from the API', async () => {
    const mockResult = { score: 90, feedback: 'Great answer' };
    evaluateAnswer.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useScoring());
    let returnValue;
    await act(async () => {
      returnValue = await result.current.evaluate('ans-002');
    });

    expect(returnValue).toEqual(mockResult);
  });

  it('sets isScoring to false after a successful evaluation', async () => {
    evaluateAnswer.mockResolvedValue({ score: 75 });

    const { result } = renderHook(() => useScoring());
    await act(async () => {
      await result.current.evaluate('ans-003');
    });

    expect(result.current.isScoring).toBe(false);
  });

  it('clears error after a successful evaluation', async () => {
    evaluateAnswer
      .mockRejectedValueOnce(new Error('Scoring failed'))
      .mockResolvedValueOnce({ score: 80 });

    const { result } = renderHook(() => useScoring());

    await act(async () => {
      await result.current.evaluate('ans-004');
    });
    expect(result.current.error).toBe('Scoring failed');

    await act(async () => {
      await result.current.evaluate('ans-004');
    });
    expect(result.current.error).toBeNull();
  });
});

describe('useScoring – evaluation in progress', () => {
  it('sets isScoring to true while the request is in flight', async () => {
    let resolveEvaluate;
    evaluateAnswer.mockReturnValue(
      new Promise((resolve) => {
        resolveEvaluate = resolve;
      })
    );

    const { result } = renderHook(() => useScoring());

    act(() => {
      result.current.evaluate('ans-005');
    });

    await waitFor(() => expect(result.current.isScoring).toBe(true));

    await act(async () => {
      resolveEvaluate({ score: 70 });
    });

    expect(result.current.isScoring).toBe(false);
  });
});

describe('useScoring – evaluation failure', () => {
  it('sets error message when evaluateAnswer rejects', async () => {
    evaluateAnswer.mockRejectedValue(new Error('Scoring service unavailable'));

    const { result } = renderHook(() => useScoring());
    await act(async () => {
      await result.current.evaluate('ans-006');
    });

    expect(result.current.error).toBe('Scoring service unavailable');
  });

  it('sets isScoring to false after a failed evaluation', async () => {
    evaluateAnswer.mockRejectedValue(new Error('Scoring failed'));

    const { result } = renderHook(() => useScoring());
    await act(async () => {
      await result.current.evaluate('ans-007');
    });

    expect(result.current.isScoring).toBe(false);
  });

  it('uses a fallback error message when the error has no message', async () => {
    evaluateAnswer.mockRejectedValue({});

    const { result } = renderHook(() => useScoring());
    await act(async () => {
      await result.current.evaluate('ans-008');
    });

    expect(result.current.error).toBe('Evaluation failed');
  });

  it('returns undefined when evaluation fails', async () => {
    evaluateAnswer.mockRejectedValue(new Error('Scoring failed'));

    const { result } = renderHook(() => useScoring());
    let returnValue;
    await act(async () => {
      returnValue = await result.current.evaluate('ans-009');
    });

    expect(returnValue).toBeUndefined();
  });
});

