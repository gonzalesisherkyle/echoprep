
import { Card } from '../ui/Card.jsx';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

function plural(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
}

export function formatLastActive(iso) {
  if (iso === null || iso === undefined || iso === '') {
    return 'Never';
  }

  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) {
    return 'Never';
  }

  const diff = Date.now() - then.getTime();

  if (diff < MINUTE) {
    return 'Just now';
  }
  if (diff < HOUR) {
    return plural(Math.floor(diff / MINUTE), 'minute');
  }
  if (diff < DAY) {
    return plural(Math.floor(diff / HOUR), 'hour');
  }
  if (diff < MONTH) {
    return plural(Math.floor(diff / DAY), 'day');
  }
  if (diff < YEAR) {
    return plural(Math.floor(diff / MONTH), 'month');
  }
  return plural(Math.floor(diff / YEAR), 'year');
}

export function StreakTracker({ streakCount, lastActiveDate }) {
  const safeCount = Number.isFinite(streakCount) ? Math.max(0, Math.trunc(streakCount)) : 0;
  const dayLabel = safeCount === 1 ? 'day' : 'days';
  const relative = formatLastActive(lastActiveDate);
  const hasStreak = safeCount > 0;

  return (
    <Card 
      padding="lg" 
      className={`relative overflow-hidden transition-all duration-500 ${
        hasStreak 
          ? 'border-amber-500/20 bg-gradient-to-br from-surface-container-high to-amber-500/[0.03] shadow-[0_0_20px_rgba(245,158,11,0.03)]' 
          : 'border-white/5 bg-surface-container-high'
      }`}
    >
      {/* Background glow blob */}
      {hasStreak && (
        <div className="absolute top-1/2 -right-4 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full -translate-y-1/2" />
      )}

      <div className="flex items-center justify-between gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
            Current Streak
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-bold tabular-nums transition-all ${hasStreak ? 'text-amber-500' : 'text-muted'}`}>
              {safeCount}
            </span>
            <span className="text-xl font-semibold text-text">{dayLabel}</span>
          </div>
          <span className="text-[11px] text-muted">
            Last active: <span className="text-text font-medium">{relative}</span>
          </span>
        </div>

        <div className="flex items-center justify-center shrink-0">
          <svg 
            className={`w-12 h-12 transition-all duration-700 ${
              hasStreak 
                ? 'text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-110 animate-pulse' 
                : 'text-white/10'
            }`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.8" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
          </svg>
        </div>
      </div>
    </Card>
  );
}

export default StreakTracker;

