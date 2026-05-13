import { useState, useEffect, useCallback } from 'react';
import { listQuestions, generateQuestions } from '../services/question.api.js';

export function useQuestions(sessionId) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await listQuestions(sessionId);
      setQuestions(data ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  /**
   * generate
   *
   * Calls question.api.generateQuestions for the current session, then
   * refreshes the question list so the UI reflects the new questions.
   */
  const generate = useCallback(async () => {
    if (!sessionId) return;

    setIsGenerating(true);
    setError(null);
    try {
      await generateQuestions({ sessionId });
      await fetchQuestions();
    } catch (err) {
      setError(err.message || 'Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  }, [sessionId, fetchQuestions]);

  return {
    questions,
    generate,
    isGenerating,
    isLoading,
    error,
  };
}

export default useQuestions;

