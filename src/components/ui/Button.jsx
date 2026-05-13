/**
 * Button — primary/secondary/ghost action control.
 */

const SIZE_CLASSES = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base font-semibold',
};

const VARIANT_CLASSES = {
  primary:
    'bg-primary text-primary-on hover:opacity-90 shadow-md active:scale-[0.98]',
  secondary:
    'bg-surface-container-high text-text border border-border hover:bg-surface-container-highest active:scale-[0.98]',
  ghost:
    'bg-transparent text-text hover:bg-surface-container-low active:scale-[0.98]',
};


function Spinner() {
  return (
    <svg className="animate-spin h-3 w-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  type = 'button',
  onClick,
  className = '',
  children,
}) {
  const disabled = isDisabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-md font-medium
        transition-all duration-200
        ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md}
        ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}

export default Button;

