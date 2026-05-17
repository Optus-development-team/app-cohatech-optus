'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, QrCode, Users, ChevronDown, GraduationCap, Store, Sparkles, ChartColumnBig } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TextType from '@/components/ui/TextType';
import GradualBlur from '@/components/ui/GradualBlur';

const HeroStat = ({ value, label }: { value: string; label: string }) => (
  <div className="glass border-gradient home-stat-card">
    <p className="font-heading home-stat-value gradient-text">{value}</p>
    <p className="home-stat-label">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, color }: { icon: React.ElementType; title: string; desc: string; color: string }) => (
  <div className="glass card-hover border-gradient home-feature-card">
    <div className="home-feature-icon" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
      <Icon size={24} style={{ color }} />
    </div>
    <h3 className="home-feature-title">{title}</h3>
    <p className="home-feature-copy">{desc}</p>
  </div>
);

const MODULES = [
  {
    icon: GraduationCap,
    role: 'Módulo Estudiantil',
    title: 'Dashboard del Estudiante',
    color: 'var(--color-primary)',
    href: '/student',
    perks: [
      'Dashboard de gasto inteligente con alcancía digital automática',
      'Scanner QR simulado con confirmación de redondeo',
      'Gamificación: retos semanales y counter de puntos ERC-20',
      'Historial y análisis de categorías de gasto',
    ],
  },
  {
    icon: Store,
    role: 'Módulo Comerciante',
    title: 'Panel del Comercio',
    color: 'var(--color-accent)',
    href: '/merchant',
    perks: [
      'Gráfico de ingresos QR diario, semanal y mensual',
      'Medidor animado de Trust Score on-chain (0–1000)',
      'Pre-aprobación automática de microcréditos en BOB',
      'Modal multistep para solicitud transparente de crédito',
    ],
  },
] as const;

export default function LandingPage() {
  return (
    <div className="home-root">
      <Navbar />

      <main className="home-main">
        <div className="home-content-shell">
          <GradualBlur
            target="page"
            position="top"
            height="12rem"
            strength={6}
            divCount={9}
            curve="bezier"
            exponential
            opacity={1}
            zIndex={2}
            className="home-blur-layer"
          />
          <GradualBlur
            target="page"
            position="bottom"
            height="12rem"
            strength={6}
            divCount={9}
            curve="bezier"
            exponential
            opacity={1}
            zIndex={2}
            className="home-blur-layer"
          />

          <div className="home-content-body">
            <section className="home-section">
              <div className="home-container-wide">
                <div className="home-hero-copy">
                  <div className="badge badge-primary home-eyebrow">
                    <Zap size={14} /> OPTUS PAY
                  </div>

                  <h1 className="home-title">
                    <TextType
                      text="Finanzas que empoderan a tu comunidad"
                      as="span"
                      typingSpeed={75}
                      pauseDuration={2100}
                      showCursor
                      cursorCharacter="_"
                      deletingSpeed={50}
                      cursorBlinkDuration={0.5}
                      startOnVisible
                      loop={false}
                      className="home-title-type"
                    />
                  </h1>

                  <p className="home-subtitle">
                    La primera plataforma de finanzas embebidas para el ecosistema universitario boliviano. Ahorro inteligente, pagos QR y crédito transparente basado en reputación on-chain.
                  </p>

                  <div className="home-hero-actions">
                    <Link href="/login" className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4">
                      Comenzar Ahora <ArrowRight size={18} />
                    </Link>
                    <a href="#features" className="btn-ghost inline-flex items-center gap-2 text-lg px-10 py-4">
                      Ver Características <ChevronDown size={18} />
                    </a>
                  </div>
                </div>

                <div className="home-stats-grid">
                  <HeroStat value="12,000+" label="Estudiantes activos" />
                  <HeroStat value="580+" label="Comerciantes verificados" />
                  <HeroStat value="2.4M BOB" label="Transacciones procesadas" />
                  <HeroStat value="98.7%" label="Satisfacción del usuario" />
                </div>
              </div>
            </section>

            <section id="features" className="home-section-surface">
              <div className="home-container-wide">
                <div className="home-section-header">
                  <p className="badge badge-primary home-section-eyebrow">¿Cómo funciona?</p>
                  <h2 className="home-section-title">
                    Un ecosistema <span className="gradient-text">circular</span>
                  </h2>
                  <div className="home-divider" />
                  <p className="home-section-subtitle">
                    Conectamos estudiantes, comerciantes y universidades en una red financiera inteligente.
                  </p>
                </div>

                <div className="home-feature-grid">
                  <FeatureCard
                    icon={QrCode}
                    title="Pagos QR Inteligentes"
                    desc="Paga con QR y ahorra automáticamente el cambio. Cada transacción contribuye a tu futuro financiero."
                    color="var(--color-primary)"
                  />
                  <FeatureCard
                    icon={Shield}
                    title="Crédito Transparente"
                    desc="Accede a microcréditos basados en tu historial de transacciones y comportamiento financiero verificado."
                    color="var(--color-success)"
                  />
                  <FeatureCard
                    icon={TrendingUp}
                    title="Ahorro Gamificado"
                    desc="Convierte el ahorro en un juego. Completa retos, gana recompensas y construye hábitos financieros saludables."
                    color="var(--color-gold)"
                  />
                  <FeatureCard
                    icon={Users}
                    title="Red Universitaria"
                    desc="Conecta con tu comunidad estudiantil. Comparte gastos, divide cuentas y colabora financieramente."
                    color="var(--color-accent)"
                  />
                  <FeatureCard
                    icon={ChartColumnBig}
                    title="Educación Financiera"
                    desc="Aprende mientras usas la plataforma. Contenido personalizado para mejorar tu salud financiera."
                    color="var(--color-primary)"
                  />
                  <FeatureCard
                    icon={Store}
                    title="Comercios Verificados"
                    desc="Red de comerciantes universitarios verificados. Descuentos exclusivos y promociones para estudiantes."
                    color="var(--color-success)"
                  />
                </div>
              </div>
            </section>

            <section className="home-section-content">
              <div className="home-container-narrow">
                <div className="home-section-header">
                  <p className="badge badge-primary home-module-eyebrow">Módulos del Sistema</p>
                  <h2 className="home-module-title">
                    Hecho para <span className="gradient-text-gold">ti</span>
                  </h2>
                  <div className="home-divider" />
                </div>

                <div className="home-module-grid">
                  {MODULES.map(({ icon: Icon, role, title, color, href, perks }) => (
                    <div key={role} className="glass card-hover border-gradient">
                      <div className="home-module-card">
                        <div className="home-module-head">
                          <div className="home-module-icon" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                            <Icon size={24} style={{ color }} />
                          </div>
                          <div>
                            <p className="badge badge-primary home-module-tag">{role}</p>
                            <h3 className="home-module-title">{title}</h3>
                          </div>
                        </div>

                        <ul className="home-module-list">
                          {perks.map((perk, i) => (
                            <li key={i} className="home-module-item">
                              <Sparkles size={16} className="home-module-spark" style={{ color }} />
                              {perk}
                            </li>
                          ))}
                        </ul>

                        <Link href={href} className="btn-ghost w-full justify-center" style={{ borderColor: color, color }}>
                          Explorar módulo <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="home-section-cta">
              <div className="home-container-narrow">
                <div className="glass home-cta-card">
                  <div className="home-cta-icon" style={{ background: 'var(--color-primary)', color: 'white' }}>
                    <Zap size={28} />
                  </div>
                  <h2 className="home-cta-title">
                    El futuro financiero <span className="gradient-text">comienza hoy</span>
                  </h2>
                  <p className="home-cta-subtitle">
                    Únete a miles de estudiantes y comerciantes bolivianos construyendo una economía más justa y transparente.
                  </p>
                  <Link href="/login" className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg">
                    Acceder a la Plataforma <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}