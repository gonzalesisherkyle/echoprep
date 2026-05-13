
import { Button } from './Button.jsx';

/**
 * @param {{
 *   title: string,
 *   description: string,
 *   icon?: React.ReactNode,
 *   ctaLabel?: string,
 *   onCta?: () => void,
 * }} props
 */
export function EmptyState({ title, description, icon, ctaLabel, onCta }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-surface-raised text-muted">
          {icon}
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-sm">
        <h2 className="text-xl font-semibold text-text">{title}</h2>
        <p className="text-sm text-muted">{description}</p>
      </div>

      {ctaLabel && onCta && (
        <Button variant="primary" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

