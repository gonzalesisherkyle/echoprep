import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

const TYPE_TONE = {
  behavioral: 'info',
  technical: 'success',
};

const TYPE_LABEL = {
  behavioral: 'Behavioral',
  technical: 'Technical',
};

export function QuestionCard({ question, total }) {
  if (!question) return null;

  const tone = TYPE_TONE[question.type] ?? 'neutral';
  const typeLabel = TYPE_LABEL[question.type] ?? question.type;

  return (
    <Card padding="md" className="relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
      
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5">
           <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
           <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Interview Question</span>
        </div>
        <Badge tone={tone} className="text-[8px] px-1.5 py-0">
          {typeLabel}
        </Badge>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-text leading-snug tracking-tight">
        {question.text}
      </h2>
      
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
         <span className="text-[9px] uppercase font-bold text-muted">Q{question.order} of {total}</span>
         <div className="flex gap-1">
            {[...Array(total)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-1 rounded-full transition-all duration-300 ${i + 1 === question.order ? 'bg-primary w-6' : 'bg-white/10'}`} 
              />
            ))}
         </div>
      </div>
    </Card>
  );
}

export default QuestionCard;

