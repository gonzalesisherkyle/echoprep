import { useEffect, useRef, useState } from 'react';

export function ScoreCard({ label, score, isReducedMotion }) {
  const [displayed, setDisplayed] = useState(isReducedMotion ? score : 0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const DURATION = 800;

  useEffect(() => {
    if (isReducedMotion) { setDisplayed(score); return; }
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    function step(timestamp) {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayed(Math.round(score * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [score, isReducedMotion]);

  const radius = 28; // Smaller radius
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-high border border-white/5 transition-all">
      <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
          <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" className="text-primary transition-all duration-300 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base md:text-lg font-bold text-text tabular-nums">{displayed}%</span>
        </div>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  );
}

export default ScoreCard;

