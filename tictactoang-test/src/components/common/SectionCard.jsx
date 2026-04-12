export default function SectionCard({ title, subtitle, children }) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}