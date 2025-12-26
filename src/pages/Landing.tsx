import { Link } from "react-router-dom";
import { BRAND } from "../config/brand";
import { useAuth } from "../context/AuthContext";

const highlights = [
  { label: "Ativos monitorados", value: "12.480" },
  { label: "OS fechadas no mês", value: "1.032" },
  { label: "Disponibilidade média", value: "99,2%" },
];

const benefits = [
  "Gestão centralizada de ativos",
  "Manutenção preditiva e preventiva",
  "Indicadores em tempo real",
  "Redução de falhas e custos",
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const ctaHref = isAuthenticated ? "/painel" : "/login";
  const PRIMARY = BRAND.palette?.primary ?? "#00C8FF";
  const ACCENT = BRAND.palette?.accent ?? "#EC4899";
  const heroLogo = BRAND.logo || BRAND.logoAlt || BRAND.logoWhite;

  return (
    <div className="min-h-screen bg-[#04050b] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.12),transparent_32%)]" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {BRAND.logo ? (
              <img src={BRAND.logo} className="h-9 w-9 rounded-lg bg-white/5 p-2" alt={BRAND.name} />
            ) : null}
            <div className="text-sm font-semibold text-white">{BRAND.name}</div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={ctaHref}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-pink-400/60"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pink-100"
              style={{ boxShadow: `0 0 18px ${ACCENT}44` }}
            >
              Engenharia + IA
            </span>
            <h1 className="text-4xl font-bold leading-[1.1] text-white md:text-5xl">
              Manutenção inteligente para ativos críticos
            </h1>
            <p className="text-lg text-slate-300">
              EAGL é a plataforma de gestão de ativos, manutenção preditiva e indicadores em tempo real
              para operações industriais e missão crítica. Dados, performance e confiabilidade em um único lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={ctaHref}
                className="rounded-xl border border-cyan-400/60 bg-cyan-500/20 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(0,200,255,0.35)] hover:border-cyan-300"
              >
                Acessar Plataforma
              </Link>
              <a
                href="https://eagl.com.br"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white hover:border-cyan-400/60"
              >
                Conheça a EAGL
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-cyan-500/10"
                >
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="text-xs uppercase tracking-[0.15em] text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
            style={{ boxShadow: `0 0 36px ${PRIMARY}33` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-pink-500/10" />
            {heroLogo ? (
              <img
                src={heroLogo}
                className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 opacity-20"
              />
            ) : null}
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">KPIs de Operação</div>
                <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  Tempo real
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.15em] text-slate-400">Saúde do ativo</div>
                  <div className="mt-2 text-3xl font-bold text-white">94%</div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[94%] bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500" />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.15em] text-slate-400">OS em aberto</div>
                  <div className="mt-2 text-3xl font-bold text-white">56</div>
                  <p className="text-xs text-slate-400">Prioridades e SLAs equilibrados com IA.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.15em] text-slate-400">Preventivas</div>
                <div className="mt-2 text-lg font-semibold text-white">Planejamento PMOC automatizado</div>
                <p className="text-sm text-slate-300">
                  Agendamento dinâmico e alertas inteligentes para reduzir falhas e custos operacionais.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div
              key={item}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-cyan-500/5"
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-pink-500/30 to-cyan-400/30 blur-3xl" />
              <div className="relative text-sm font-semibold text-white">{item}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
