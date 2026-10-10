// Boxed input + error line used by the Profile and Address forms.
export default function PfField({ error, ...props }) {
  return (
    <div className="pf-field">
      <input
        className="pf-input"
        aria-label={props.placeholder}
        aria-invalid={!!error}
        {...props}
      />
      {error && <span className="pf-error">{error}</span>}
    </div>
  );
}
