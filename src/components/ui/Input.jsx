export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  hasError = false,
  errorMessage,
  placeholder,
  autoComplete,
  isDisabled = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-semibold text-muted tracking-wide"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={isDisabled}
        className={`
          input-field
          ${hasError ? 'border-error/40 bg-error/5 focus:border-error/50' : ''}
          ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      />

      {hasError && errorMessage && (
        <p className="text-[11px] text-error font-medium mt-0.5">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default Input;

