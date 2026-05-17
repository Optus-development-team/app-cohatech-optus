'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, DollarSign, Users, Zap, Bell, ShieldCheck, CreditCard, ArrowUpRight, BarChart2, LogOut, X, ChevronRight, CheckCircle, Percent, Calendar, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/* ── Trust Gauge ── */
function TrustGauge({ score }: { score: number }) {
  const size = 220, cx = 110, cy = 110, r = 88;
  const circ = Math.PI * r;
  const dashOffset = circ - (score / 1000) * circ;
  const color = score < 400 ? 'var(--color-danger)' : score < 600 ? 'var(--color-gold)' : score < 800 ? 'var(--color-accent)' : 'var(--color-success)';
  const label = score < 400 ? 'Bajo Riesgo' : score < 600 ? 'Moderado' : score < 800 ? 'Confiable' : 'Excelente';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 24} viewBox={`0 0 ${size} ${size / 2 + 24}`}>
        <path d={`M 16 ${cy} A ${r} ${r} 0 0 1 ${size - 16} ${cy}`} 
          fill="none" stroke="var(--color-border)" strokeWidth={18} strokeLinecap="round" />
        <path d={`M 16 ${cy} A ${r} ${r} 0 0 1 ${size - 16} ${cy}`} 
          fill="none" stroke={color} strokeWidth={18} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={dashOffset} 
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
        <text x={cx} y={cy + 8} textAnchor="middle" 
          style={{ fontFamily: 'Inter,sans-serif', fontSize: 42, fontWeight: 800, fill: color }}>
          {score}
        </text>
        <text x={cx} y={cy + 26} textAnchor="middle" 
          style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, fill: 'var(--color-text-muted)' }}>
          TRUST SCORE
        </text>
      </svg>
      <span className="badge mt-2" style={{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }}>
        {label}
      </span>
    </div>
  );
}

/* ── Loan Modal ── */
function LoanModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const loan = { amount: 2000, rate: 2.8, weeks: 8, fee: 35, total: 2219 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass w-full max-w-md rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}>
                <ArrowLeft size={18} className="text-[var(--color-text-muted)]" />
              </button>
            )}
            <h2 className="font-heading font-bold text-xl">Solicitud de Crédito</h2>
          </div>
          <button onClick={onClose}>
            <X size={20} className="text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-dim)]'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 rounded-full ${
                  step > s ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl text-center bg-[var(--color-surface)]">
              <p className="text-sm text-[var(--color-text-muted)] mb-2">Monto Pre-Aprobado</p>
              <p className="font-heading font-bold text-4xl gradient-text mb-2">BOB 2,000</p>
              <p className="text-sm text-[var(--color-success)]">Basado en tu historial QR</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Percent, label: 'Tasa', value: `${loan.rate}% sem.` }, 
                { icon: Calendar, label: 'Plazo', value: `${loan.weeks} sem.` }, 
                { icon: Shield, label: 'Comisión', value: `BOB ${loan.fee}` }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass p-4 rounded-xl text-center">
                  <Icon size={20} className="text-[var(--color-primary)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">{label}</p>
                  <p className="text-sm font-bold">{value}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full py-3">
              Continuar <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Resumen de Condiciones</h3>
            <div className="space-y-3">
              {[
                ['Monto recibido', `BOB ${loan.amount.toLocaleString()}`], 
                ['Tasa semanal', `${loan.rate}%`], 
                ['Número de pagos', `${loan.weeks} cuotas`], 
                ['Cuota semanal est.', `BOB ${Math.ceil(loan.total / loan.weeks)}`], 
                ['Comisión única', `BOB ${loan.fee}`], 
                ['Total a pagar', `BOB ${loan.total.toLocaleString()}`]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm p-3 rounded-lg bg-[var(--color-surface-2)]">
                  <span className="text-[var(--color-text-muted)]">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="btn-primary w-full py-3">
              Aceptar Términos <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-6 py-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[var(--color-success)] text-white">
              <CheckCircle size={42} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl mb-2">¡Crédito Aprobado!</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                BOB <strong>2,000</strong> serán depositados en las próximas <strong>2 horas</strong>.
              </p>
            </div>
            <div className="badge badge-success text-sm px-4 py-2">Transacción registrada on-chain</div>
            <button onClick={onClose} className="btn-primary w-full py-3">Entendido, ¡Gracias!</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Revenue data ── */
const DAILY = [{ h: '8am', v: 120 }, { h: '10am', v: 310 }, { h: '12pm', v: 790 }, { h: '2pm', v: 420 }, { h: '4pm', v: 290 }, { h: '6pm', v: 650 }];
const WEEKLY = [{ h: 'Lun', v: 1240 }, { h: 'Mar', v: 1890 }, { h: 'Mié', v: 2100 }, { h: 'Jue', v: 1780 }, { h: 'Vie', v: 3200 }, { h: 'Sáb', v: 2900 }];
const MONTHLY = [{ h: 'Sem 1', v: 8400 }, { h: 'Sem 2', v: 11200 }, { h: 'Sem 3', v: 9800 }, { h: 'Sem 4', v: 13500 }];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return <div className="glass px-3 py-2 rounded-xl text-xs"><p className="text-[var(--color-text-muted)] mb-0.5">{label}</p><p className="font-bold gradient-text">BOB {payload[0].value.toLocaleString()}</p></div>;
};

export default function MerchantDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showLoan, setShowLoan] = useState(false);

  if (!user) { router.push('/login'); return null; }
  if (user.role !== 'merchant') { router.push('/student'); return null; }

  const data = period === 'daily' ? DAILY : period === 'weekly' ? WEEKLY : MONTHLY;
  const total = data.reduce((s, d) => s + d.v, 0);

  return (
    <div className="min-h-screen relative z-10 pt-16 pb-8" style={{ paddingTop: 'calc(70px + 1rem)' }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-[var(--color-text-muted)] font-medium uppercase tracking-wide mb-2">Panel Comerciante</p>
            <h1 className="font-heading font-bold text-3xl">
              <span className="gradient-text">{user.name}</span>
            </h1>
            <span className="badge badge-primary mt-2">Comercio Verificado</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 glass rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              <Bell size={18} />
            </button>
            <button onClick={logout} className="btn-ghost text-sm px-4 py-2 gap-2">
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: DollarSign, label: 'Ingresos Hoy', value: 'BOB 2,140', delta: '+18%', color: 'var(--color-primary)' },
            { icon: BarChart2, label: 'Esta Semana', value: 'BOB 14,090', delta: '+9%', color: 'var(--color-accent)' },
            { icon: Users, label: 'Clientes Únicos', value: '187', delta: '+23%', color: 'var(--color-gold)' },
            { icon: TrendingUp, label: 'Retención', value: '76%', delta: '+5%', color: 'var(--color-success)' },
          ].map(stat => (
            <div key={stat.label} className="glass p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <stat.icon size={20} style={{ color: stat.color }} />
                <span className="text-sm text-[var(--color-text-muted)]">{stat.label}</span>
              </div>
              <p className="font-heading font-bold text-2xl mb-2">{stat.value}</p>
              <div className="flex items-center gap-2">
                <ArrowUpRight size={14} className="text-[var(--color-success)]" />
                <span className="text-sm text-[var(--color-success)]">{stat.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="glass p-6 rounded-xl lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-lg mb-1">Ingresos QR</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Total: <span className="text-[var(--color-text)] font-bold">BOB {total.toLocaleString()}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map(p => (
                  <button key={p} onClick={() => setPeriod(p)} 
                    className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                      period === p 
                        ? 'bg-[var(--color-primary)] text-white' 
                        : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}>
                    {p === 'daily' ? 'Hoy' : p === 'weekly' ? 'Semana' : 'Mes'}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="h" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="v" stroke="#7c3aed" strokeWidth={2.5} fill="url(#rg)" dot={false} activeDot={{ r: 5, fill: '#a78bfa', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trust Score */}
          <div className="glass p-6 rounded-xl flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4 self-start">
              <ShieldCheck size={20} className="text-[var(--color-accent)]" />
              <h2 className="font-semibold text-lg">Trust Score On-Chain</h2>
            </div>
            <TrustGauge score={742} />
            <div className="w-full mt-6 space-y-4">
              {[
                { label: 'Frecuencia de pagos', pct: 88, color: 'var(--color-primary)' }, 
                { label: 'Retención clientes', pct: 76, color: 'var(--color-accent)' }, 
                { label: 'Volumen mensual', pct: 65, color: 'var(--color-gold)' }
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--color-text-muted)]">{m.label}</span>
                    <span className="font-medium">{m.pct}%</span>
                  </div>
                  <div className="h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loan Banner */}
        <div className="mt-8 p-8 rounded-xl bg-[var(--color-surface)] border border-[var(--color-primary)] cursor-pointer card-hover"
          onClick={() => setShowLoan(true)}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[var(--color-primary)] text-white">
                <CreditCard size={24} />
              </div>
              <div>
                <div className="badge badge-success mb-3">Pre-Aprobado</div>
                <h3 className="font-heading font-bold text-2xl mb-2">
                  Calificaste para <span className="gradient-text">BOB 2,000</span> de capital de trabajo
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  Inyección instantánea · Tasa 2.8% sem · Sin garantías · Basado en tu historial QR
                </p>
              </div>
            </div>
            <button className="btn-primary shrink-0 py-3 px-8 text-lg" 
              onClick={e => { e.stopPropagation(); setShowLoan(true); }}>
              Solicitar Ahora <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {showLoan && <LoanModal onClose={() => setShowLoan(false)} />}
    </div>
  );
}
