export default function Pill({ children, className = '', ...rest }) {
  return <span className={`pill ${className}`} {...rest}>{children}</span>;
}
