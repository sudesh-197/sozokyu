import { forwardRef } from 'react';

// Underlined input used by every auth popup. Shows its error text under the line.
const TextField = forwardRef(function TextField({ error, label, ...props }, ref) {
  return (
    <div className="field">
      <input ref={ref} aria-label={label} aria-invalid={!!error} {...props} />
      {error && <span className="field__error" role="alert">{error}</span>}
    </div>
  );
});

export default TextField;
