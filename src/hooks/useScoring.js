import { useState, useCallback } from 'react';
import { evaluateAnswer } from '../services/scoring.api.js';

export function useScoring() {
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState(null);

  /**
   * evaluate
   *
   * Calls evaluateAnswer with the given answerId. Sets isScoring while the
   * request is in flight and captures any error message on failure.
   *
   * @param {string} answerId
   * @returns {Promise<any>} the evaluation result returned by the server, or undefined on error
   */
  const evaluate = useCallback(async (answerId) => {
    setIsScoring(true);
    setError(null);

    try {
      const result = await evaluateAnswer({ answerId });
      return result;
    } catch (err) {
      setError(err?.message ?? 'Evaluation failed');
    } finally {
      setIsScoring(false);
    }
  }, []);

  return { evaluate, isScoring, error };
}

export default useScoring;

