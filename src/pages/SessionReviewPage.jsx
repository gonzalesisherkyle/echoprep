import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ScoreCard } from '../components/ui/ScoreCard.jsx';
import { SessionSummary } from '../components/session/SessionSummary.jsx';
import { FeedbackPanel } from '../components/review/FeedbackPanel.jsx';
import { TranscriptBlock } from '../components/review/TranscriptBlock.jsx';
import { useSession } from '../hooks/useSession.js';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';
import { listAnswers } from '../services/answer.api.js';

export function SessionReviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const isReducedMotion = usePrefersReducedMotion();
  const { session, questions, isLoading: isSessionLoading, error: sessionError } = useSession(sessionId);

  const [answers, setAnswers] = useState([]);
  const [isAnswersLoading, setIsAnswersLoading] = useState(false);
  const [answersError, setAnswersError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    async function fetchAnswers() {
      setIsAnswersLoading(true);
      setAnswersError(null);
      try {
        const data = await listAnswers(sessionId);
        if (cancelled) return;
        const list = data?.data ?? data;
        setAnswers(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!cancelled) setAnswersError(err.message || 'Error loading answers.');
      } finally {
        if (!cancelled) setIsAnswersLoading(false);
      }
    }
    fetchAnswers();
    return () => { cancelled = true; };
  }, [sessionId]);

  const isLoading = isSessionLoading || isAnswersLoading;
  const loadError = sessionError || answersError;

  if (isLoading) return (
    <AppShell>
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        <p className="text-muted font-bold uppercase text-[10px] tracking-widest">Processing Results</p>
      </div>
    </AppShell>
  );

  if (loadError) return (
    <AppShell>
      <Card className="border-error/20 bg-error/5 text-center p-8">
        <h2 className="text-xl font-bold text-error mb-2">Error</h2>
        <p className="text-sm text-muted mb-6">{loadError}</p>
        <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>Dashboard</Button>
      </Card>
    </AppShell>
  );

  const questionMap = Object.fromEntries(questions.map((q) => [q._id ?? q.id, q]));

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl flex flex-col gap-10 md:gap-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Summary Report</span>
            <h1 className="text-2xl md:text-4xl font-bold text-text tracking-tight">Performance</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="md" onClick={() => navigate('/dashboard')}>Done</Button>
            <Button variant="primary" size="md" onClick={() => navigate('/sessions/new')}>New Prep</Button>
          </div>
        </header>

        <section>
          <SessionSummary session={session} answers={answers} />
        </section>

        {answers.length > 0 && (
          <section className="flex flex-col gap-10">
            <h2 className="text-xl font-bold text-text">Detailed Insights</h2>

            <div className="space-y-16 md:space-y-24">
              {answers.map((answer, index) => {
                const answerId = answer._id ?? answer.id ?? String(index);
                const question = questionMap[answer.questionId] ?? null;
                const scores = answer.scores ?? {};
                const feedback = answer.aiFeedback ?? null;
                const transcript = answer.transcript ?? '';
                const speechMetrics = answer.speechMetrics ?? null;

                return (
                  <article key={answerId} className="flex flex-col gap-6 md:gap-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Question {index + 1}</span>
                      <h3 className="text-lg md:text-xl font-bold text-text">
                        {question?.text || 'Question'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <ScoreCard label="Clarity" score={scores.clarity ?? 0} isReducedMotion={isReducedMotion} />
                      <ScoreCard label="Relevance" score={scores.relevance ?? 0} isReducedMotion={isReducedMotion} />
                      <ScoreCard label="Confidence" score={scores.confidence ?? 0} isReducedMotion={isReducedMotion} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                       <TranscriptBlock transcript={transcript} speechMetrics={speechMetrics} />
                       <FeedbackPanel feedback={feedback} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <footer className="border-t border-white/5 pt-10 flex flex-col items-center gap-6">
           <div className="text-center">
              <h2 className="text-xl font-bold text-text mb-1">Consistency is key.</h2>
              <p className="text-xs text-muted">Keep practicing to master your skills.</p>
           </div>
           <Button variant="primary" size="lg" onClick={() => navigate('/sessions/new')}>Start New Session</Button>
        </footer>
      </div>
    </AppShell>
  );
}

export default SessionReviewPage;

