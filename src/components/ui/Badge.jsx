const TONE_CLASSES = {
  neutral: 'bg-white/5 text-muted border-white/10',
  success: 'bg-primary/10 text-primary border-primary/20',
  warning: 'bg-error/10 text-error border-error/20',
  info:    'bg-secondary/10 text-secondary border-secondary/20',
};

export function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
        transition-all duration-300
        ${TONE_CLASSES[tone] ?? TONE_CLASSES.neutral}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;

