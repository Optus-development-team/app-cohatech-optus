"use client";

import { useState, useEffect } from "react";
import {
  MerchantLayout,
  MerchantProfileView
} from "@/components/merchant";
import {
  getAuth,
  clearAuth,
} from "@/services/api";

interface User {
  id_usuario: string;
  nombre: string;
  correo: string;
  tipo_usuario: string;
  estado: string;
}

export default function MerchantPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("perfil");

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setUser(auth.user);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0a1a]">
        <div className="w-8 h-8 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "perfil":
        return <MerchantProfileView />;
      case "config":
        return <ConfigView />;
      default:
        return null;
    }
  };

  return (
    <MerchantLayout
      userName={user.nombre}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </MerchantLayout>
  );
}

function ConfigView() {
  return (
    <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#8B5CF6]/20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Configuración</h2>
        <p className="text-gray-400">Administra tu cuenta y preferencias</p>
      </div>
      <div className="text-center text-gray-500 py-8">
        Próximamente...
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
}
