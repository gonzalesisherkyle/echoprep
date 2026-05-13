/**
 * Card — premium container with scaled-down spacing.
 */

const PADDING_CLASSES = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6 md:p-8',
};

export function Card({
  as: Tag = 'div',
  padding = 'md',
  className = '',
  children,
}) {
  return (
    <Tag
      className={`
        rounded-lg bg-surface-container border border-white/5
        transition-shadow duration-300 shadow-sm
        ${PADDING_CLASSES[padding] ?? PADDING_CLASSES.md}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
}

export default Card;

