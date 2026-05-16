export default function HomePage() {
  const highlights = [
    {
      title: 'Next.js',
      description: 'Routing, rendering y estructura lista para escalar.',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h8v2H4zM4 11h16v2H4zM4 17h12v2H4z" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: 'React',
      description: 'Componentes reutilizables para UI consistente.',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 8.2c2.1 0 3.8 1.7 3.8 3.8S14.1 15.8 12 15.8 8.2 14.1 8.2 12 9.9 8.2 12 8.2Zm0-2.2c4.5 0 8.3 2.1 8.3 5s-3.8 5-8.3 5-8.3-2.1-8.3-5 3.8-5 8.3-5Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      title: 'TypeScript',
      description: 'Tipos claros para mantener orden y seguridad.',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 5h14v14H5zM10.5 9v1.8h-2V11h4.8v-.2h-2V9h-0.8Zm0 5.2V14h.8v1.6c0 .6.4 1 1 1 .5 0 .9-.2 1.2-.5l.6.9c-.5.5-1.1.8-1.9.8-1.4 0-2.3-.9-2.3-2.6Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ];

  const stats = [
    { value: '01', label: 'Base limpia' },
    { value: '03', label: 'Capas preparadas' },
    { value: '100%', label: 'Frontend focus' },
  ];

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-top">
          <div className="brand-mark" aria-hidden="true">
            <span>OC</span>
          </div>
          <div>
            <p className="eyebrow">Frontend foundation</p>
            <h1>Un inicio limpio, visual y listo para crecer.</h1>
          </div>
        </div>

        <p className="lead">
          Esta base ya está pensada para trabajar con Next.js, React, TypeScript y pnpm, con una
          estructura clara para componentes, features, servicios y utilidades compartidas.
        </p>

        <div className="stat-row" aria-label="Resumen del proyecto">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>

        <div className="highlight-grid">
          {highlights.map((item) => (
            <article className="highlight-card" key={item.title}>
              <div className="icon-badge" aria-hidden="true">
                {item.icon}
              </div>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
