import { useState, useCallback } from 'react';
import { uploadAnswer } from '../services/answer.api.js';

export function useAnswerUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [lastAnswerId, setLastAnswerId] = useState(null);

  const upload = useCallback(async (blob, { sessionId, questionId }) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    setLastAnswerId(null);

    try {
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('sessionId', sessionId);
      formData.append('questionId', questionId);

      const data = await uploadAnswer(formData);
      const answerId = data?.answerId ?? data?._id ?? data?.id ?? null;
      setLastAnswerId(answerId);
      setProgress(100);
    } catch (err) {
      setError(err?.message ?? 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading, progress, error, lastAnswerId };
}

export default useAnswerUpload;

