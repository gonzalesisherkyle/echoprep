
export function ProgressBar({ value, label, ariaLabel }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <span className="text-sm font-medium text-text">{label}</span>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className="w-full h-2 rounded-full bg-surface-raised overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-primary transition-default"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;

