"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BadgeCheck,
  Clock3,
  Crown,
  Flame,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./Merchant.module.css";
import { Comercio, getComercio } from "@/services/api";

type StatTone = "violet" | "cyan" | "amber" | "emerald";

interface MetricCard {
  label: string;
  value: string;
  detail: string;
  tone: StatTone;
  icon: LucideIcon;
}

interface AchievementItem {
  label: string;
  icon: LucideIcon;
  active: boolean;
}

interface TrendPoint {
  label: string;
  value: number;
}

interface StatsMemo {
  score: number;
  tone: StatTone;
  daysActive: number;
  trend: TrendPoint[];
  metrics: MetricCard[];
  achievements: AchievementItem[];
  momentum: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const riskLabelMap: Record<string, string> = {
  bajo: "Riesgo bajo",
  medio: "Riesgo medio",
  alto: "Riesgo alto",
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getTone(score: number): StatTone {
  if (score >= 80) return "emerald";
  if (score >= 60) return "violet";
  if (score >= 40) return "cyan";
  return "amber";
}

function getToneLabel(tone: StatTone) {
  switch (tone) {
    case "emerald":
      return "text-emerald-300 border-emerald-400/30 bg-emerald-500/10";
    case "cyan":
      return "text-cyan-300 border-cyan-400/30 bg-cyan-500/10";
    case "amber":
      return "text-amber-300 border-amber-400/30 bg-amber-500/10";
    default:
      return "text-violet-300 border-violet-400/30 bg-violet-500/10";
  }
}

function getMetricCardClass(tone: StatTone) {
  switch (tone) {
    case "emerald":
      return "border-emerald-400/20 bg-emerald-500/10";
    case "cyan":
      return "border-cyan-400/20 bg-cyan-500/10";
    case "amber":
      return "border-amber-400/20 bg-amber-500/10";
    default:
      return "border-violet-400/20 bg-violet-500/10";
  }
}

function buildTrend(score: number) {
  const base = clamp(score || 32, 24, 96);
  return [
    { label: "Lun", value: clamp(base - 10, 18, 100) },
    { label: "Mar", value: clamp(base - 4, 18, 100) },
    { label: "Mié", value: clamp(base + 3, 18, 100) },
    { label: "Jue", value: clamp(base - 1, 18, 100) },
    { label: "Vie", value: clamp(base + 8, 18, 100) },
    { label: "Sáb", value: clamp(base + 12, 18, 100) },
  ];
}

function getDaysActive(fechaRegistro?: string) {
  if (!fechaRegistro) return 0;
  const start = new Date(fechaRegistro);
  if (Number.isNaN(start.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
}

export default function MerchantStatsView() {
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarComercio = async () => {
      const data = await getComercio();
      setComercio(data);
      setLoading(false);
    };

    cargarComercio();
  }, []);

  const { score, tone, daysActive: activeDays, trend, metrics, achievements, momentum } = useMemo<StatsMemo>(() => {
    const scoreValue = clamp(comercio?.score_actual ?? 0, 0, 100);
    const toneValue = getTone(scoreValue);
    const activeDays = getDaysActive(comercio?.fecha_registro);
    const generatedTrend = buildTrend(scoreValue);
    const estimatedMonthlyGain = Math.round(scoreValue * 42 + activeDays * 3.5);
    const estimatedOrders = Math.max(0, Math.round(scoreValue * 1.6 + activeDays / 6));
    const loyalty = clamp(Math.round(scoreValue * 0.78 + activeDays / 4), 0, 100);
    const growth = clamp(Math.round(scoreValue * 0.9 + activeDays / 8), 0, 100);

    const metricItems: MetricCard[] = [
      {
        label: "Score actual",
        value: `${scoreValue}`,
        detail: comercio?.nivel_riesgo_actual ? riskLabelMap[comercio.nivel_riesgo_actual.toLowerCase()] || comercio.nivel_riesgo_actual : "Calculado con tu actividad",
        tone: toneValue,
        icon: BadgeCheck,
      },
      {
        label: "Ganancia proyectada",
        value: formatMoney(estimatedMonthlyGain),
        detail: "Proyección visual del mes",
        tone: "emerald",
        icon: Wallet,
      },
      {
        label: "Órdenes estimadas",
        value: `${estimatedOrders}`,
        detail: "Movimientos esperados por tu score",
        tone: "cyan",
        icon: BarChart3,
      },
      {
        label: "Lealtad comercial",
        value: `${loyalty}%`,
        detail: "Clientes que vuelven a comprar",
        tone: "amber",
        icon: Star,
      },
    ];

    const badgeList: AchievementItem[] = [
      { label: "Perfil verificado", icon: ShieldCheck, active: Boolean(comercio) },
      { label: "Impulso creciente", icon: TrendingUp, active: growth >= 60 },
      { label: "Operación constante", icon: Clock3, active: activeDays >= 14 },
      { label: "Destino top campus", icon: Crown, active: scoreValue >= 75 },
      { label: "Estrategia activa", icon: Flame, active: scoreValue >= 50 },
      { label: "Potencial premium", icon: Sparkles, active: scoreValue >= 85 },
    ];

    const enabledBadges = badgeList.filter((item) => item.active);

    return {
      score: scoreValue,
      tone: toneValue,
      daysActive: activeDays,
      trend: generatedTrend,
      metrics: metricItems,
      achievements: enabledBadges,
      momentum: growth,
    };
  }, [comercio]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!comercio) {
    return (
      <div className={styles.panelCard + " space-y-5"}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-400/20 flex items-center justify-center text-violet-200">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className={styles.titleMedium}>Estadística del emprendimiento</h2>
            <p className={styles.mutedText + " text-sm"}>Aún no hay comercio configurado para mostrar métricas.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-violet-400/30 bg-white/5 p-5 text-sm text-gray-300">
          Completa tu perfil de comercio para activar el tablero de rendimiento, logros y proyección de ganancias.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={styles.statsHero + " relative overflow-hidden " + styles.panelCard}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f59e0b] via-[#7c3aed] to-[#06b6d4]" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between text-center lg:text-left">
          <div className="max-w-2xl space-y-4 mx-auto lg:mx-0">
            <div className={styles.statsChip + ` ${getToneLabel(tone)} mx-auto lg:mx-0`}>
              <Sparkles size={14} />
              Estadística del emprendimiento
            </div>
            <div className="space-y-3">
              <h2 className={styles.titleLarge}>Rendimiento de {comercio.nombre_comercio}</h2>
              <p className={styles.mutedText + " max-w-xl leading-7"}>
                Panel visual para revisar score, crecimiento, proyección de ganancias y los logros más importantes de tu negocio. Todo está pensado para verse claro también en celular.
              </p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm text-gray-300">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {comercio.rubro}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {comercio.zona}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {activeDays > 0 ? `${activeDays} días activo` : "Nuevo comercio"}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-black/20 p-5 shadow-[0_0_40px_rgba(124,58,237,0.15)] mx-auto lg:mx-0">
            <div
              className={styles.statsGauge + " relative"}
              style={{
                background: `conic-gradient(#7c3aed ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            >
              <div className={styles.statsGaugeInner + " text-center"}>
                <span className="text-5xl font-black text-white">{score}</span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.3em] text-gray-400">Score</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Momentum de crecimiento</p>
              <p className="text-lg font-semibold text-emerald-300">+{momentum}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_.95fr] gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {metrics.map((metric: MetricCard) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className={`${styles.panelCard} ${styles.statsMetric} border ${getMetricCardClass(metric.tone)} shadow-[0_18px_40px_rgba(0,0,0,0.18)] text-center sm:text-left`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${getToneLabel(metric.tone)}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.3em] text-gray-400">{metric.label}</span>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className={styles.valueXL + " leading-none"}>{metric.value}</p>
                    <p className="text-sm text-gray-400">{metric.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.statsTrendCard + " " + styles.panelCard + " space-y-5"}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-center sm:text-left w-full">
                <h3 className={styles.titleMedium}>Tendencia semanal</h3>
                <p className={styles.mutedText + " text-sm"}>Lectura visual del rendimiento del negocio en los últimos días.</p>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 shrink-0 hidden sm:inline-flex">
                Tendencia positiva
              </div>
            </div>

            <div className={styles.statsTrendBar + " grid grid-cols-6 gap-2 sm:gap-3 items-end h-40 sm:h-48"}>
              {trend.map((item: TrendPoint) => (
                <div key={item.label} className="flex h-full flex-col items-center justify-end gap-2">
                  <div className="relative flex h-full w-full items-end rounded-2xl bg-white/5 p-1 ring-1 ring-white/5">
                    <div
                      className="w-full rounded-[0.9rem] bg-gradient-to-t from-[#6d28d9] via-[#7c3aed] to-[#22d3ee] shadow-[0_0_25px_rgba(124,58,237,0.25)] transition-all"
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={styles.statsSummaryRow + " flex-col sm:flex-row text-center sm:text-left"}>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Riesgo</p>
                <p className="mt-2 text-lg font-semibold text-white">{comercio.nivel_riesgo_actual || "Sin clasificar"}</p>
              </div>
              <div className={styles.statsSummaryRow + " flex-col sm:flex-row text-center sm:text-left"}>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Antigüedad</p>
                <p className="mt-2 text-lg font-semibold text-white">{activeDays > 0 ? `${activeDays} días` : "Recién iniciado"}</p>
              </div>
              <div className={styles.statsSummaryRow + " flex-col sm:flex-row text-center sm:text-left"}>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Estado</p>
                <p className="mt-2 text-lg font-semibold text-white capitalize">{comercio.estado}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={styles.panelCard + " space-y-4"}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-center sm:text-left w-full">
                <h3 className={styles.titleMedium}>Logros del emprendimiento</h3>
                <p className={styles.mutedText + " text-sm"}>Insignias y metas que reflejan tu avance.</p>
              </div>
              <Target className="text-[#f59e0b] shrink-0" size={22} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((achievement: AchievementItem) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.label}
                    className={`rounded-2xl border px-4 py-4 ${styles.statsBadge} ${getToneLabel(tone)} bg-white/5 text-center sm:text-left`}
                  >
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{achievement.label}</p>
                        <p className="text-xs text-gray-400">Desbloqueado</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {achievements.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                Cuando tu score suba, aquí aparecerán tus logros.
              </div>
            )}
          </div>

          <div className={styles.panelCard + " space-y-4 text-center sm:text-left"}>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/20">
                <Crown size={18} />
              </div>
              <div>
                <h3 className={styles.titleSmall}>Resumen ejecutivo</h3>
                <p className={styles.mutedText + " text-sm"}>Lectura rápida del estado de tu negocio.</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 flex-col sm:flex-row text-center sm:text-left">
                <span>Rubro más fuerte</span>
                <span className="font-medium capitalize text-white">{comercio.rubro}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 flex-col sm:flex-row text-center sm:text-left">
                <span>Proyección visual</span>
                <span className="font-medium text-cyan-200">{formatMoney(Math.max(0, Math.round(score * 42 + activeDays * 3.5)))}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 flex-col sm:flex-row text-center sm:text-left">
                <span>Fuerza comercial</span>
                <span className="font-medium text-emerald-200">{score >= 80 ? "Excelente" : score >= 60 ? "Muy buena" : score >= 40 ? "Estable" : "En desarrollo"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}