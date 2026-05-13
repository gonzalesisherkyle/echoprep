import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { AudioRecorder } from '../components/session/AudioRecorder.jsx';
import { QuestionCard } from '../components/session/QuestionCard.jsx';
import { useSession } from '../hooks/useSession.js';
import { useAnswerUpload } from '../hooks/useAnswerUpload.js';
import { useScoring } from '../hooks/useScoring.js';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';

const MIN_DURATION_MS = 2_000;
const MAX_DURATION_MS = 300_000;

function validateDuration(durationMs) {
  if (durationMs < MIN_DURATION_MS) return `Too short (${(durationMs/1000).toFixed(1)}s). Min 2s.`;
  if (durationMs > MAX_DURATION_MS) return `Too long. Max 5m.`;
  return null;
}

export function SessionRunPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const isReducedMotion = usePrefersReducedMotion();

  const { session, questions, isLoading, error: sessionError } = useSession(sessionId);
  const { upload, isUploading, error: uploadError, lastAnswerId } = useAnswerUpload();
  const { evaluate, isScoring, error: scoringError } = useScoring();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingBlob, setPendingBlob] = useState(null);
  const [pendingDurationMs, setPendingDurationMs] = useState(null);
  const [durationError, setDurationError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecorded = useCallback((blob, durationMs) => {
    setDurationError(validateDuration(durationMs));
    setPendingBlob(blob);
    setPendingDurationMs(durationMs);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!pendingBlob || durationError) return;
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    setIsProcessing(true);
    try {
      await upload(pendingBlob, {
        sessionId,
        questionId: currentQuestion._id ?? currentQuestion.id,
      });
    } catch { } finally { setIsProcessing(false); }
  }, [pendingBlob, durationError, questions, currentIndex, sessionId, upload]);

  const handleScoreAndAdvance = useCallback(async () => {
    if (!lastAnswerId) return;
    setIsProcessing(true);
    try { await evaluate(lastAnswerId); } catch { }
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      navigate(`/sessions/${sessionId}/review`);
    } else {
      setCurrentIndex(nextIndex);
      setPendingBlob(null);
      setPendingDurationMs(null);
      setDurationError(null);
    }
    setIsProcessing(false);
  }, [lastAnswerId, currentIndex, questions.length, sessionId, navigate, evaluate]);

  if (isLoading) return (
    <AppShell>
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        <p className="text-muted font-bold uppercase text-[10px] tracking-widest">Loading Session</p>
      </div>
    </AppShell>
  );

  if (sessionError) return (
    <AppShell>
      <Card className="border-error/20 bg-error/5 text-center p-8">
        <h2 className="text-xl font-bold text-error mb-2">Error</h2>
        <p className="text-sm text-muted mb-6">{sessionError}</p>
        <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>Dashboard</Button>
      </Card>
    </AppShell>
  );

  if (questions.length === 0) return (
    <AppShell>
      <Card className="border-error/20 bg-error/5 text-center p-8">
        <h2 className="text-xl font-bold text-error mb-2">No Questions Found</h2>
        <p className="text-sm text-muted mb-6">We couldn't generate questions for this session. Please try again with a different job description.</p>
        <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </Card>
    </AppShell>
  );

  const currentQuestion = questions[currentIndex];
  const hasRecording = Boolean(pendingBlob);
  const uploadDone = Boolean(lastAnswerId);
  const isBusy = isUploading || isScoring || isProcessing;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl flex flex-col gap-8 md:gap-12">
        <header className="flex flex-col gap-3">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">In Progress</span>
              <span className="text-xs font-mono text-muted">{currentIndex + 1} of {questions.length}</span>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out shadow-sm" 
                style={{ width: `${progress}%` }} 
              />
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <QuestionCard question={currentQuestion} total={questions.length} />
            <div className="p-4 rounded-lg bg-white/2 border border-white/5 text-xs text-muted leading-relaxed">
               <strong>Quick Tip:</strong> Use the <strong>STAR</strong> method for behavioral questions.
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card padding="md" className="flex flex-col items-center gap-6 bg-surface-container-high border-white/5">
              <div className="text-center">
                <h2 className="text-base font-bold text-text">Record Answer</h2>
                <p className="text-[10px] text-muted">Tap to start/stop</p>
              </div>

              <AudioRecorder
                onRecorded={handleRecorded}
                isReducedMotion={isReducedMotion}
                isDisabled={isBusy || uploadDone}
              />

              {pendingDurationMs !== null && !durationError && (
                <div className="text-center">
                   <span className="text-lg font-mono font-bold text-primary">
                    {(pendingDurationMs / 1000).toFixed(1)}s
                   </span>
                </div>
              )}

              {durationError && (
                <div className="px-3 py-1.5 rounded bg-error/10 border border-error/20 text-xs text-error font-medium text-center">
                  {durationError}
                </div>
              )}
            </Card>

            <div className="flex flex-col gap-3">
               {hasRecording && !uploadDone && (
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isUploading || isProcessing}
                  isDisabled={isBusy || Boolean(durationError)}
                  onClick={handleSubmit}
                  className="w-full"
                >
                  {isUploading ? 'Uploading...' : 'Submit Answer'}
                </Button>
              )}

              {uploadDone && (
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isScoring || isProcessing}
                  isDisabled={isBusy}
                  onClick={handleScoreAndAdvance}
                  className="w-full"
                >
                  {isScoring ? 'Scoring...' : currentIndex + 1 >= questions.length ? 'Finish Session' : 'Next Question'}
                </Button>
              )}

              {hasRecording && !uploadDone && !isBusy && (
                <button 
                  onClick={() => { setPendingBlob(null); setPendingDurationMs(null); }}
                  className="text-[10px] uppercase tracking-widest text-muted hover:text-text mx-auto"
                >
                  Discard & Retake
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default SessionRunPage;

