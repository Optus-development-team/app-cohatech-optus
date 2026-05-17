"use client";

import { useState, useEffect } from "react";
import { CreditCard, Settings } from "lucide-react";
import {
  StudentLayout,
  PresupuestoView,
  MetaAhorroView
} from "@/components/student";
import {
  getAuth,
  clearAuth,
  getPresupuesto,
  createPresupuesto,
  updatePresupuesto,
  Presupuesto
} from "@/services/api";

interface User {
  id_usuario: string;
  nombre: string;
  correo: string;
  tipo_usuario: string;
  estado: string;
}

export default function StudentPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("presupuesto");

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setUser(auth.user);
      cargarPresupuesto();
    }
  }, []);

  const cargarPresupuesto = async () => {
    try {
      const data = await getPresupuesto();
      setPresupuesto(data);
    } catch (error) {
      console.error("Error cargando presupuesto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  const handleSavePresupuesto = async (data: { presupuesto_semanal: number; presupuesto_mensual: number }) => {
    await updatePresupuesto(data);
    await cargarPresupuesto();
  };

  const handleCreatePresupuesto = async (data: { universidad: string; carrera: string; presupuesto_semanal: number; presupuesto_mensual: number }) => {
    await createPresupuesto(data);
    await cargarPresupuesto();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0a1a]">
        <div className="w-8 h-8 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0a1a]">
        <div className="text-[#a78bfa]">Cargando...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "presupuesto":
        return (
          <PresupuestoView
            presupuesto={presupuesto}
            onSave={handleSavePresupuesto}
            onCreate={handleCreatePresupuesto}
          />
        );
      case "metaAhorro":
        return <MetaAhorroView />;
      case "billetera":
        return <BilleteraView />;
      case "config":
        return <ConfigView />;
      default:
        return null;
    }
  };

  return (
    <StudentLayout
      userName={user.nombre}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </StudentLayout>
  );
}

function BilleteraView() {
  return (
    <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#8B5CF6]/20">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
          <CreditCard className="text-[#a78bfa]" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Mi Billetera</h2>
        <p className="text-gray-400">Gestiona tus métodos de pago y tarjetas</p>
      </div>
      <div className="text-center text-gray-500 py-8">
        Próximamente...
      </div>
    </div>
  );
}

function ConfigView() {
  return (
    <div className="min-h-screen relative z-10 pt-16 flex flex-col" style={{ paddingTop: 'calc(70px + 1rem)' }}>
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={onBack} className="w-9 h-9 glass rounded-full flex items-center justify-center">←</button>
        <h2 className="font-heading font-semibold text-lg">
          {state === 'scanning' ? 'Escaneando QR' : state === 'confirm' ? 'Confirmar Pago' : '¡Pago Exitoso!'}
        </h2>
    <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#8B5CF6]/20">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
          <Settings className="text-[#a78bfa]" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Configuración</h2>
        <p className="text-gray-400">Administra tu cuenta y preferencias</p>
      </div>
      <div className="text-center text-gray-500 py-8">
        Próximamente...
      </div>
    </div>
  );
}

/* ── Challenges ── */
const CHALLENGES = [
  { id: 1, title: 'Foodie QR', desc: 'Paga via QR en 3 puestos de comida esta semana', reward: 50, progress: 2, total: 3, color: '#7c3aed', done: false },
  { id: 2, title: 'Ahorrador Constante', desc: 'Acumula 5 redondeos consecutivos sin retirar', reward: 30, progress: 5, total: 5, color: '#f59e0b', done: true },
  { id: 3, title: 'Explorador del Campus', desc: 'Realiza pagos en 4 comercios distintos del campus', reward: 75, progress: 1, total: 4, color: '#06b6d4', done: false },
];

/* ── Main Dashboard ── */
export default function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { balance: tokenBalance, recentGain, addTokens } = useTokens();
  const [showQR, setShowQR] = useState(false);
  const [claimed, setClaimed] = useState<Set<number>>(new Set());

  if (!user) { router.push('/login'); return null; }
  if (user.role !== 'student') { router.push('/merchant'); return null; }
  if (showQR) return <QRScanner onBack={() => setShowQR(false)} />;

  const savingsPercent = 67;

  return (
    <div className="min-h-screen relative z-10 pt-16 pb-24 md:pb-8" style={{ paddingTop: 'calc(70px + 1rem)' }}>
          {recentGain && (
        <div className="fixed top-24 right-6 z-50 pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-[var(--color-primary)] text-white shadow-lg">
            <Zap size={14} /> +{recentGain} Pts
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-[var(--color-text-muted)] font-medium uppercase tracking-wide mb-2">Panel Estudiantil</p>
            <h1 className="font-heading font-bold text-3xl">
              Hola, <span className="gradient-text">{user.name.split(' ')[0]}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 glass rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              <Bell size={18} />
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-[var(--color-primary)] text-white">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Wallet size={20} className="text-[var(--color-primary)]" />
              <span className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Saldo Disponible</span>
            </div>
            <p className="font-heading font-bold text-4xl mb-2">
              <span className="text-lg text-[var(--color-text-muted)] mr-2">BOB</span>487.50
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpRight size={16} className="text-[var(--color-success)]" />
              <span className="text-sm text-[var(--color-success)]">+12.4% este mes</span>
            </div>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <PiggyBank size={20} className="text-[var(--color-gold)]" />
              <span className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Alcancía Digital</span>
            </div>
            <p className="font-heading font-bold text-4xl gradient-text-gold mb-2">
              <span className="text-lg text-[var(--color-text-muted)] mr-2">BOB</span>34.80
            </p>
            <p className="text-sm text-[var(--color-text-dim)]">Redondeos automáticos</p>
          </div>
        </div>

        {/* Token Balance */}
        <div className="glass p-6 rounded-xl mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--color-primary)] text-white">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Puntos ERC-20 Acumulados</p>
              <p className="font-heading font-bold text-2xl gradient-text">{tokenBalance.toLocaleString()} pts</p>
            </div>
          </div>
          <span className="badge badge-gold">Nivel Plata</span>
        </div>

        {/* QR Button */}
        <button onClick={() => setShowQR(true)} className="btn-primary w-full py-4 text-lg mb-8 flex items-center justify-center gap-3">
          <QrCode size={22} /> Escanear y Pagar con QR <ChevronRight size={18} />
        </button>

        {/* Savings Goal */}
        <div className="glass p-5 rounded-2xl mb-5 anim-fade-up anim-fade-up-d3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Target size={16} className="text-[var(--color-accent)]" /><span className="font-semibold text-sm">Meta Mensual de Ahorro</span></div>
            <span className="text-xs text-[var(--color-text-muted)]">BOB 134 / 200</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full anim-progress-fill"
              style={{ '--progress-target': `${savingsPercent}%`, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' } as React.CSSProperties} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[var(--color-text-dim)]">{savingsPercent}% completado</span>
            <span className="text-sm text-[var(--color-success)]">¡Vas muy bien!</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass p-5 rounded-2xl mb-5 anim-fade-up anim-fade-up-d3">
          <div className="flex items-center gap-2 mb-4"><TrendingUp size={16} className="text-[var(--color-primary-l)]" /><h2 className="font-semibold text-sm">Categorías de Gasto</h2></div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart cats={[
              { label: 'Alimentación', value: 42, color: '#7c3aed' },
              { label: 'Transporte', value: 28, color: '#06b6d4' },
              { label: 'Fotocopias', value: 18, color: '#f59e0b' },
              { label: 'Otros', value: 12, color: '#10b981' },
            ]} />
            <div className="flex flex-col gap-3 flex-1 w-full">
              {[{ label: 'Alimentación', value: 42, color: '#7c3aed' }, { label: 'Transporte', value: 28, color: '#06b6d4' }, { label: 'Fotocopias', value: 18, color: '#f59e0b' }, { label: 'Otros', value: 12, color: '#10b981' }].map(c => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-sm text-[var(--color-text-muted)] flex-1">{c.label}</span>
                  <span className="font-semibold text-sm">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges */}
        <div className="anim-fade-up anim-fade-up-d4">
          <div className="flex items-center gap-2 mb-3"><Trophy size={16} className="text-[var(--color-gold)]" /><h2 className="font-semibold text-sm">Retos de la Semana</h2></div>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {CHALLENGES.map(ch => (
              <div key={ch.id} className="glass card-hover p-5 rounded-2xl shrink-0 w-60 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${ch.color}20` }}>
                    <Zap size={18} style={{ color: ch.color }} />
                  </div>
                  <span className="badge badge-gold text-[10px]">+{ch.reward} pts</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{ch.title}</h3>
                  <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">{ch.desc}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1.5">
                    <span>{ch.progress}/{ch.total}</span><span>{Math.round((ch.progress / ch.total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(ch.progress / ch.total) * 100}%`, background: ch.color }} />
                  </div>
                </div>
                {(ch.done || claimed.has(ch.id)) ? (
                  <button onClick={() => { if (!claimed.has(ch.id)) { setClaimed(p => new Set([...p, ch.id])); addTokens(ch.reward); } }}
                    disabled={claimed.has(ch.id)}
                    className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                    style={{ background: claimed.has(ch.id) ? 'rgba(16,185,129,0.1)' : `${ch.color}22`, color: claimed.has(ch.id) ? '#10b981' : ch.color, border: `1px solid ${claimed.has(ch.id) ? '#10b98140' : `${ch.color}40`}` }}>
                    ✓ {claimed.has(ch.id) ? 'Reclamado' : 'Reclamar Recompensa'}
                  </button>
                ) : (
                  <button disabled className="w-full py-2 rounded-xl text-xs font-semibold opacity-40 flex items-center justify-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-muted)' }}>
                    🔒 En progreso...
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav md:hidden">
        <div className="flex items-center justify-around">
          {[
            { icon: 'Home', label: 'Inicio', active: true }, 
            { icon: 'QrCode', label: 'Pagar', active: false }, 
            { icon: 'Trophy', label: 'Retos', active: false }, 
            { icon: 'User', label: 'Perfil', active: false }
          ].map(tab => {
            const IconComponent = tab.icon === 'Home' ? 'div' : 
                                 tab.icon === 'QrCode' ? QrCode :
                                 tab.icon === 'Trophy' ? Trophy : 'div';
            return (
              <button key={tab.label} onClick={tab.label === 'Pagar' ? () => setShowQR(true) : undefined}
                className="flex flex-col items-center gap-1 px-4 py-2 transition-all"
                style={{ color: tab.active ? 'var(--color-primary)' : 'var(--color-text-dim)' }}>
                {typeof IconComponent === 'string' ? (
                  <div className="w-5 h-5 rounded bg-current opacity-20" />
                ) : (
                  <IconComponent size={20} />
                )}
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
}
