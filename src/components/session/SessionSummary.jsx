import { Card } from '../ui/Card.jsx';
import { ScoreCard } from '../ui/ScoreCard.jsx';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

function formatScore(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return Math.round(value).toString();
}

export function SessionSummary({ session, answers }) {
  const isReducedMotion = usePrefersReducedMotion();
  const overallScore = Number.isFinite(session?.overallScore) ? session.overallScore : 0;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-center text-center gap-6">
        <ScoreCard
          label="Cumulative Interview Score"
          score={overallScore}
          isReducedMotion={isReducedMotion}
        />
        <div className="max-w-md">
           <h3 className="text-xl font-bold text-text mb-2">
            {overallScore >= 80 ? 'Mastery Level' : overallScore >= 60 ? 'Competent' : 'Growth Needed'}
           </h3>
           <p className="text-sm text-muted">
            Your performance indicates a strong foundation in role-specific communication. Focus on consistency to reach the next tier.
           </p>
        </div>
      </div>

      <Card padding="lg" className="bg-surface-container-low border-white/5">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
           <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
            Answer Performance Matrix
           </h3>
           <span className="text-[10px] font-mono text-muted">{answers.length} Questions Analyzed</span>
        </div>

        {answers.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted italic">No data available for this session.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {answers.map((answer, index) => {
              const scores = answer.scores ?? {};
              const key = answer._id ?? answer.questionId ?? String(index);
              return (
                <div
                  key={key}
                  className="flex flex-col gap-4 p-5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                      Question 0{index + 1}
                     </span>
                     <div className="h-px flex-1 mx-4 bg-white/5 hidden sm:block" />
                     <div className="flex gap-4">
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] uppercase font-bold text-muted">Avg</span>
                           <span className="text-sm font-bold text-text">
                            {Math.round(((scores.clarity || 0) + (scores.relevance || 0) + (scores.confidence || 0)) / 3)}%
                           </span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 border-t border-white/5 pt-4">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[10px] uppercase font-bold text-muted">Clarity</span>
                       <span className="text-sm font-mono text-text">{formatScore(scores.clarity)}%</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[10px] uppercase font-bold text-muted">Relevance</span>
                       <span className="text-sm font-mono text-text">{formatScore(scores.relevance)}%</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[10px] uppercase font-bold text-muted">Confidence</span>
                       <span className="text-sm font-mono text-text">{formatScore(scores.confidence)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

export default SessionSummary;

