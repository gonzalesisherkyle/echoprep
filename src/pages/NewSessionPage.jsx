import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { createSession } from '../services/session.api.js';
import { generateQuestions } from '../services/question.api.js';

const MIN_LENGTH = 50;
const MAX_LENGTH = 10_000;

function validateJobDescription(value) {
  const trimmed = value.trim();
  if (trimmed.length < MIN_LENGTH) {
    return `Content too short (min ${MIN_LENGTH} chars).`;
  }
  if (trimmed.length > MAX_LENGTH) {
    return `Content too long (max ${MAX_LENGTH.toLocaleString()} chars).`;
  }
  return null;
}

export function NewSessionPage() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const charCount = jobDescription.length;
  const isOverLimit = charCount > MAX_LENGTH;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitError(null);
      const error = validateJobDescription(jobDescription);
      if (error) { setValidationError(error); return; }

      setIsSubmitting(true);
      try {
        const sessionData = await createSession({ jobDescription: jobDescription.trim() });
        const session = sessionData?.data ?? sessionData;
        const sessionId = session?._id ?? session?.id;
        if (!sessionId) throw new Error('Failed to create session.');
        await generateQuestions({ sessionId });
        navigate(`/sessions/${sessionId}/run`);
      } catch (err) {
        setSubmitError(err.message || 'Error initializing session.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [jobDescription, navigate],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl flex flex-col gap-8 md:gap-10">
        <header className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-text tracking-tight mb-2">
            New Mock Interview
          </h1>
          <p className="text-sm text-muted">
            Paste the job description below to generate role-specific questions.
          </p>
        </header>

        <Card padding="md" className="relative">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="job-description" className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  Job Description
                </label>
                <span className={`text-[10px] font-mono ${isOverLimit ? 'text-error' : 'text-muted'}`}>
                  {charCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
                </span>
              </div>

              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => { setJobDescription(e.target.value); setValidationError(null); }}
                disabled={isSubmitting}
                rows={8}
                placeholder="Ex: We are looking for a Software Engineer..."
                className={`
                  w-full rounded-md bg-surface-container-low border-2 px-4 py-3 text-sm text-text
                  placeholder:text-white/10 resize-none outline-none transition-all duration-200
                  ${validationError ? 'border-error/30' : 'border-white/5 focus:border-primary/30'}
                  ${isSubmitting ? 'opacity-50 grayscale' : ''}
                `}
              />

              {validationError && (
                <p className="text-[11px] text-error font-medium mt-1">
                   {validationError}
                </p>
              )}
            </div>

            {submitError && (
              <div className="rounded-md border border-error/20 bg-error/5 px-4 py-3 text-xs text-error font-medium">
                {submitError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="text-muted text-[10px] italic hidden sm:block">
                AI analysis will take a few seconds.
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                isDisabled={isSubmitting || isOverLimit}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Generating...' : 'Start Session'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="p-4 rounded-lg border border-white/5 bg-white/2 flex gap-3">
              <span className="text-xl">💡</span>
              <div>
                <h4 className="text-xs font-bold text-text mb-0.5">Quick Tip</h4>
                <p className="text-[11px] text-muted leading-relaxed">Focus on 'Requirements' for better accuracy.</p>
              </div>
           </div>
           <div className="p-4 rounded-lg border border-white/5 bg-white/2 flex gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <h4 className="text-xs font-bold text-text mb-0.5">Privacy</h4>
                <p className="text-[11px] text-muted leading-relaxed">Your data is processed securely and privately.</p>
              </div>
           </div>
        </div>
      </div>
    </AppShell>
  );
}

export default NewSessionPage;

