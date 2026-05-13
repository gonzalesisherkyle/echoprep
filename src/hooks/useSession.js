import { useState, useEffect, useCallback } from 'react';
import { getSession } from '../services/session.api.js';

export function useSession(sessionId) {
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getSession(sessionId);
      setSession(data);
      // The session response may embed questions; fall back to empty array.
      setQuestions(data.questions ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load session');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    questions,
    isLoading,
    error,
    refetch: fetchSession,
  };
}

export default useSession;

