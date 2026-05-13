
const STATUS_CLASSES = {
  completed: 'bg-success/20 text-success',
  in_progress: 'bg-warning/20 text-warning',
  created: 'bg-muted/20 text-muted',
};

const STATUS_LABELS = {
  completed: 'Completed',
  in_progress: 'In Progress',
  created: 'Created',
};

/**
 * Formats a date string into a short human-readable label.
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncates a job description to a maximum length for display.
 */
function truncate(text, maxLen = 60) {
  if (!text || text.length <= maxLen) return text ?? '';
  return text.slice(0, maxLen).trimEnd() + '…';
}

/**
 * @param {{ sessions: Array<{ _id: string, jobDescription: string, status: string, overallScore: number, createdAt: string }>, onOpen: (id: string) => void }} props
 */
export function SessionHistoryList({ sessions, onOpen }) {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg bg-surface border border-border">
      <h3 className="text-lg font-semibold text-text px-5 pt-5 pb-3">
        Recent Sessions
      </h3>
      <ul className="divide-y divide-border" role="list">
        {sessions.map((session) => (
          <li key={session._id}>
            <button
              type="button"
              onClick={() => onOpen(session._id)}
              className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left transition-default hover:bg-surface-raised focus-visible:bg-surface-raised"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-medium text-text truncate">
                  {truncate(session.jobDescription)}
                </span>
                <span className="text-xs text-muted">
                  {formatDate(session.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {session.status === 'completed' && (
                  <span className="text-sm font-semibold text-primary tabular-nums">
                    {session.overallScore}%
                  </span>
                )}
                <span
                  className={[
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    STATUS_CLASSES[session.status] ?? STATUS_CLASSES.created,
                  ].join(' ')}
                >
                  {STATUS_LABELS[session.status] ?? session.status}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SessionHistoryList;

