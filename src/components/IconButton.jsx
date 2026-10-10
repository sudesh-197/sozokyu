export default function IconButton({
  size = 40,
  label,
  children,
  onClick,
  badge = 0,
}) {
  return (
    <button
      className="icon-btn"
      style={{ width: size, height: size, position: "relative" }}
      aria-label={label}
      onClick={onClick}
    >
      {children}
      {badge > 0 && (
        <span key={badge} className="icon-btn__badge">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}
