import { Card } from '../ui/Card.jsx';

export function FeedbackPanel({ feedback }) {
  const { summary, improvementTips } = feedback || {};

  if (!summary) return (
    <Card padding="lg" className="border-white/5 bg-white/2 animate-pulse">
       <p className="text-sm text-muted italic">Awaiting AI Feedback Analysis...</p>
    </Card>
  );

  return (
    <Card padding="lg" as="section" className="relative overflow-hidden group border-white/5 border-l-4 border-l-primary/80">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
      
      <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        Feedback Summary
      </h3>
      
      <p className="text-base text-text leading-relaxed mb-8 font-medium">
        {summary}
      </p>

      {improvementTips && improvementTips.length > 0 && (
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2 border-b border-white/5 pb-2">
            Improvement Tips
          </h4>
          <ul className="grid gap-3" role="list">
            {improvementTips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-white/2 border border-white/5 border-l-4 border-l-amber-500/70 hover:border-primary/20 hover:border-l-primary transition-all group/tip"
              >
                <span className="text-primary font-bold text-xs mt-0.5">0{index + 1}</span>
                <p className="text-sm text-muted group-hover/tip:text-text transition-colors leading-relaxed">
                  {tip}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

export default FeedbackPanel;

