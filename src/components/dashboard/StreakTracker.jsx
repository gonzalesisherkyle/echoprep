
import { Card } from '../ui/Card.jsx';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * @param {number} value
 * @param {string} unit
 * @returns {string} pluralised "N unit(s) ago" phrase.
 */
function plural(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
}

/**
 * Format an ISO-8601 (or null) timestamp as a short relative phrase.
 *
 * @param {string|null|undefined} iso
 * @returns {string}
 */
export function formatLastActive(iso) {
  if (iso === null || iso === undefined || iso === '') {
    return 'Never';
  }

  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) {
    return 'Never';
  }

  const diff = Date.now() - then.getTime();

  // Future / clock-skew case — fall back to "just now" rather than "in N".
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

/**
 * @param {{ streakCount: number, lastActiveDate: string | null }} props
 */
export function StreakTracker({ streakCount, lastActiveDate }) {
  const safeCount = Number.isFinite(streakCount) ? Math.max(0, Math.trunc(streakCount)) : 0;
  const dayLabel = safeCount === 1 ? 'day' : 'days';
  const relative = formatLastActive(lastActiveDate);

  return (
    <Card padding="lg">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium uppercase tracking-wide text-muted">
          Current streak
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-primary tabular-nums">
            {safeCount}
          </span>
          <span className="text-2xl font-semibold text-text">{dayLabel}</span>
        </div>
        <span className="text-sm text-muted">
          Last active: <span className="text-text">{relative}</span>
        </span>
      </div>
    </Card>
  );
}

export default StreakTracker;

