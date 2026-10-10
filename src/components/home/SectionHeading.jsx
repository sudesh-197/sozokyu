export default function SectionHeading({ title, text }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
