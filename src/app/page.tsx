'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, QrCode, Users, Star, ChevronDown, GraduationCap, Store, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const HeroStat = ({ value, label }: { value: string; label: string }) => (
  <div className="glass p-6 rounded-xl text-center">
    <p className="font-heading font-bold text-2xl gradient-text mb-1">{value}</p>
    <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, color }: { icon: React.ElementType; title: string; desc: string; color: string }) => (
  <div className="glass card-hover p-8 rounded-xl border-gradient">
    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
      <Icon size={24} style={{ color }} />
    </div>
    <h3 className="font-heading font-semibold text-xl mb-3">{title}</h3>
    <p className="text-[var(--color-text-muted)] leading-relaxed">{desc}</p>
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20 pt-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 badge badge-primary mb-8 text-sm px-6 py-3">
            <Zap size={14} /> Economía Circular Universitaria · Bolivia
          </div>
          
          <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-8 max-w-4xl mx-auto">
            Finanzas que <span className="gradient-text">empoderan</span><br />a tu comunidad
          </h1>
          
          <p className="text-xl text-[var(--color-text-muted)] max-w-3xl mx-auto mb-12 leading-relaxed">
            La primera plataforma de finanzas embebidas para el ecosistema universitario boliviano. Ahorro inteligente, pagos QR y crédito transparente basado en reputación on-chain.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link href="/login" className="btn-primary text-lg px-10 py-4">
              Comenzar Ahora <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn-ghost text-lg px-10 py-4">
              Ver Características <ChevronDown size={18} />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <HeroStat value="12,000+" label="Estudiantes activos" />
            <HeroStat value="580+" label="Comerciantes verificados" />
            <HeroStat value="2.4M BOB" label="Transacciones procesadas" />
            <HeroStat value="98.7%" label="Satisfacción del usuario" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="badge badge-primary mb-6 text-sm px-6 py-3">¿Cómo funciona?</p>
            <h2 className="font-heading font-bold text-4xl sm:text-5xl mb-6 max-w-3xl mx-auto">
              Un ecosistema <span className="gradient-text">circular</span>
            </h2>
            <div className="section-divider mx-auto" />
            <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mt-6">
              Conectamos estudiantes, comerciantes y universidades en una red financiera inteligente
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
              icon={GraduationCap}
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

      {/* USER TYPES */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="badge badge-primary mb-6 text-sm px-6 py-3">Módulos del Sistema</p>
            <h2 className="font-heading font-bold text-4xl sm:text-5xl mb-6">
              Hecho para <span className="gradient-text-gold">ti</span>
            </h2>
            <div className="section-divider mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
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
                  'Historial y análisis de categorías de gasto'
                ] 
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
                  'Modal multistep para solicitud transparente de crédito'
                ] 
              },
            ].map(({ icon: Icon, role, title, color, href, perks }) => (
              <div key={role} className="glass p-8 rounded-xl flex flex-col gap-6 card-hover border-gradient">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon size={24} style={{ color }} />
                  </div>
                  <div>
                    <p className="badge badge-primary mb-2">{role}</p>
                    <h3 className="font-heading font-semibold text-xl">{title}</h3>
                  </div>
                </div>
                
                <ul className="space-y-3 flex-1">
                  {perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--color-text-muted)]">
                      <Sparkles size={16} className="mt-0.5 shrink-0" style={{ color }} />
                      {perk}
                    </li>
                  ))}
                </ul>
                
                <Link href={href} className="btn-ghost w-full justify-center" style={{ borderColor: color, color }}>
                  Explorar módulo <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-12 rounded-xl">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <Zap size={28} />
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              El futuro financiero <span className="gradient-text">comienza hoy</span>
            </h2>
            <p className="text-xl text-[var(--color-text-muted)] mb-10 leading-relaxed max-w-2xl mx-auto">
              Únete a miles de estudiantes y comerciantes bolivianos construyendo una economía más justa y transparente.
            </p>
            <Link href="/login" className="btn-primary text-lg px-10 py-4 inline-flex">
              Acceder a la Plataforma <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}