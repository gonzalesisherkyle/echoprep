import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

export function TranscriptBlock({ transcript, speechMetrics }) {
  const { wpm, fillerWordCount, confidenceScore } = speechMetrics || {};
  const confidencePercent = Math.round((confidenceScore || 0) * 100);

  return (
    <Card padding="lg" as="section" className="bg-surface-container-low border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
          Voice Transcript
        </h3>
        <div className="flex gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
           <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-75" />
           <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-150" />
        </div>
      </div>

      <div className="relative mb-8">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/10 rounded-full" />
        <p className="text-base text-text leading-relaxed font-medium italic opacity-90">
          "{transcript}"
        </p>
      </div>

      {speechMetrics && (
        <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
          <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest">Speech Analysis</h4>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1 px-4 py-2 rounded-lg bg-white/2 border border-white/5">
               <span className="text-[10px] text-muted uppercase font-bold">Pace</span>
               <span className="text-sm font-bold text-text">{Math.round(wpm)} WPM</span>
            </div>
            <div className="flex flex-col gap-1 px-4 py-2 rounded-lg bg-white/2 border border-white/5">
               <span className="text-[10px] text-muted uppercase font-bold">Fillers</span>
               <span className={`text-sm font-bold ${fillerWordCount === 0 ? 'text-primary' : 'text-error'}`}>
                {fillerWordCount} {fillerWordCount === 1 ? 'word' : 'words'}
               </span>
            </div>
            <div className="flex flex-col gap-1 px-4 py-2 rounded-lg bg-white/2 border border-white/5">
               <span className="text-[10px] text-muted uppercase font-bold">AI Conf.</span>
               <span className="text-sm font-bold text-text">{confidencePercent}%</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default TranscriptBlock;

