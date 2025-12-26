import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND } from "../config/brand";

const BENEFICIOS = [
  { title: "SLA e performance", desc: "Visibilidade de SLA em tempo real e alertas antes do estouro." },
  { title: "Auditoria e trilha", desc: "Cada OS e checklist rastreaveis para compliance e B2B." },
  { title: "Produtividade em campo", desc: "Times com rotas, SLA e OS priorizadas por impacto." },
  { title: "Padronizacao", desc: "Procedimentos, PMOC e modelos de OS consistentes." },
  { title: "Rastreabilidade total", desc: "Historico de ativos, pecas, falhas e responsaveis." },
  { title: "Dashboards vivos", desc: "KPIs e estado operacional atualizados com dados conectados." },
];

const MODULOS = [
  { title: "Clientes & Contratos", bullets: ["Cadastros, SLA e multi-sites", "Portfolio e contratos ativos"] },
  { title: "Ativos & Saude", bullets: ["Inventario e criticidade", "Telemetria e alertas preditivos"] },
  { title: "Ordens de Servico", bullets: ["Priorizacao automatica", "SLA, checklists e anexos"] },
  { title: "PMOC / Preventivas", bullets: ["Dentro do cliente", "Planejamento recorrente e checklist"] },
  { title: "Relatorios gerenciais", bullets: ["KPIs de disponibilidade", "Exportacao e filtros avancados"] },
  { title: "Administracao (ADM)", bullets: ["Perfis, permissoes", "Trilha de auditoria completa"] },
];

const INTEGRACOES = ["WhatsApp / Email", "API REST", "Webhooks", "BI (PowerBI/Tableau)", "IoT / Gateways"];

const PRODUTO_STEPS = [
  { title: "Captura", desc: "Telemetria, chamados e OS entram em um so pipeline." },
  { title: "Prioriza", desc: "IA e regras ordenam por impacto e SLA." },
  { title: "Executa", desc: "Time em campo com checklists, fotos e assinatura digital." },
];

const TRUST = [
  { label: "+ Ativos monitorados", value: "12.480" },
  { label: "+ OS / mes", value: "1.240" },
  { label: "SLA cumprido", value: "99,2%" },
  { label: "Clientes", value: "128" },
];

const AREA_DATA = [
  { mes: "Jan", disponibilidade: 95 },
  { mes: "Fev", disponibilidade: 96 },
  { mes: "Mar", disponibilidade: 96.5 },
  { mes: "Abr", disponibilidade: 97.2 },
  { mes: "Mai", disponibilidade: 97.8 },
  { mes: "Jun", disponibilidade: 98.4 },
];

const DONUT_DATA = [
  { name: "Operando", value: 72, color: "#22d3ee" },
  { name: "Em risco", value: 18, color: "#fbbf24" },
  { name: "Critico", value: 10, color: "#ec4899" },
];

export default function MarketingHome() {
  const logo = BRAND.logo || BRAND.logoAlt || BRAND.logoWhite;

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(0,200,255,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.16),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(0,200,255,0.08),transparent_35%)]" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#040712]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
          <div className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                className="h-12 w-auto max-w-[220px] object-contain drop-shadow-[0_0_30px_rgba(0,200,255,0.35)]"
                alt="EAGL"
              />
            ) : null}
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">EAGL Plataforma</div>
            </div>
          </div>
          <nav className="hidden flex-1 items-center gap-6 text-sm text-slate-200 md:flex">
            {[
              { label: "Produto", href: "#produto" },
              { label: "Beneficios", href: "#beneficios" },
              { label: "Modulos", href: "#modulos" },
              { label: "Integracoes", href: "#integracoes" },
              { label: "Seguranca", href: "#seguranca" },
              { label: "Contato", href: "#contato" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="https://app.eagl.com.br/login"
            className="ml-auto rounded-full border border-cyan-500/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(0,200,255,0.35)] hover:border-cyan-300"
            style={{ position: "relative", zIndex: 2 }}
          >
            Entrar
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-14">
        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-7">
            <div className="flex flex-col items-start gap-3 sm:items-center">
              {logo ? (
                <img
                  src={logo}
                  className="h-24 w-auto max-w-[380px] object-contain drop-shadow-[0_0_65px_rgba(0,200,255,0.42)]"
                  alt="EAGL"
                />
              ) : null}
              <div className="text-center text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100 sm:text-base">
                Tecnologia aplicada a manutencao e engenharia
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100 shadow-[0_0_20px_rgba(0,200,255,0.15)]">
              Manutencao preditiva • Ativos conectados
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold leading-[1.05] text-white md:text-5xl">
                Controle absoluto de ativos criticos, com inteligencia e previsibilidade.
              </h1>
              <p className="text-lg text-slate-200 font-semibold leading-relaxed">
                Tecnologia aplicada a manutencao e engenharia. Dados, telemetria e execucao em campo em um unico cockpit,
                com decisoes guiadas por impacto e SLA.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://app.eagl.com.br/login"
                className="rounded-xl border border-cyan-400/60 bg-cyan-500/20 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(0,200,255,0.35)] hover:border-cyan-300"
              >
                Entrar no sistema
              </a>
              <a
                href="#produto"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:border-cyan-400/60"
              >
                Ver como funciona
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              {TRUST.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-[#0b1220]/80 p-4 shadow-lg shadow-cyan-500/15"
                >
                  <div className="text-xl font-bold text-white">{item.value}</div>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220]/95 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-pink-500/10" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Mini cockpit EAGL</div>
                <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
                  Live demo
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  Disponibilidade de equipamentos criticos (%)
                </div>
                <div className="mt-2 h-44 rounded-xl border border-white/5 bg-slate-950/70 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={AREA_DATA}>
                      <defs>
                        <linearGradient id="gradSaude" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="mes" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" domain={[80, 100]} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="disponibilidade"
                        stroke="#22d3ee"
                        fill="url(#gradSaude)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c1320] via-[#0f192c] to-[#0c1320] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                  <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400">OS por status</div>
                  <div className="mt-3 flex flex-col gap-2 text-sm text-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                        Em execucao
                      </div>
                      <span className="text-white font-semibold">38</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                        Planejada
                      </div>
                      <span className="text-white font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-pink-400" />
                        Critica
                      </div>
                      <span className="text-white font-semibold">6</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c1320] via-[#0d1a2c] to-[#0c1320] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Distribuicao de ativos</div>
                  <div className="text-lg font-semibold text-white">Operacao x Risco</div>
                  <div className="mt-3 flex items-center justify-center">
                    <PieChart width={200} height={200}>
                      <Pie data={DONUT_DATA} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={2} dataKey="value">
                        {DONUT_DATA.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="#0a0f1d" strokeWidth={3} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="mt-3 flex flex-col gap-1 text-sm font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: DONUT_DATA[0].color }} />
                      <span className="text-cyan-100">Operando</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: DONUT_DATA[1].color }} />
                      <span className="text-amber-200">Em risco</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: DONUT_DATA[2].color }} />
                      <span className="text-pink-200">Critico</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c1320] via-[#0f192c] to-[#0c1320] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                  <div className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                    PMOC e Preventivas
                  </div>
                  <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                    Planejamento automatico com recorrencias, responsaveis e checklist assinado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Produto */}
        <section id="produto" className="mt-16 rounded-3xl border border-white/10 bg-[#0b1220]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Produto</div>
              <h2 className="text-2xl font-semibold text-white">Como a EAGL acelera a operacao</h2>
              <p className="mt-2 text-sm text-slate-300">
                Do chamado a execucao em campo, com priorizacao por impacto e telemetria conectada.
              </p>
            </div>
            <a className="text-sm font-semibold text-cyan-200 hover:text-white" href="#modulos">
              Ver modulos →
            </a>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PRODUTO_STEPS.map((item, idx) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-cyan-500/12"
              >
                <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500/30 to-pink-500/30 blur-3xl" />
                <div className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="relative mt-2 text-sm font-semibold text-white">{item.title}</div>
                <p className="relative mt-2 text-sm text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Beneficios */}
        <section id="beneficios" className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Beneficios</div>
              <h2 className="text-2xl font-semibold text-white">O que muda com a EAGL</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {BENEFICIOS.map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]/80 p-4 shadow-lg shadow-cyan-500/12"
              >
                <div className="absolute -right-6 -top-6 h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500/25 to-pink-500/25 blur-3xl" />
                <div className="relative text-sm font-semibold text-white">{item.title}</div>
                <p className="relative mt-2 text-sm text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modulos */}
        <section id="modulos" className="mt-16">
          <div className="flex flex-col gap-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Modulos</div>
            <h2 className="text-2xl font-semibold text-white">Tudo o que voce precisa para operar</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODULOS.map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-cyan-500/12"
              >
                <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500/25 to-pink-500/25 blur-3xl" />
                <div className="relative text-sm font-semibold text-white">{item.title}</div>
                <ul className="relative mt-2 space-y-1 text-sm text-slate-300">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Integracoes */}
        <section id="integracoes" className="mt-16 rounded-3xl border border-white/10 bg-[#0b1220]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Integracoes</div>
              <h2 className="text-2xl font-semibold text-white">Conecte sua operacao</h2>
              <p className="text-sm text-slate-300">Mensageria, APIs, IoT e BI no mesmo ecossistema.</p>
            </div>
            <a href="https://app.eagl.com.br/login" className="text-sm font-semibold text-cyan-200 hover:text-white">
              Fale com a EAGL →
            </a>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRACOES.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/8"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Seguranca */}
        <section id="seguranca" className="mt-16 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-[#0b1220]/80 p-6 shadow-lg shadow-cyan-500/12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Seguranca & Governanca</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">Controle e confianca para B2B</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />
                Controle de acesso por perfil e trilha de auditoria completa.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />
                Backups, segregacao de ambientes e conformidade para operacoes criticas.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />
                Logs detalhados de OS, preventivas e alteracoes de configuracao.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg shadow-pink-500/12">
            <div className="text-sm font-semibold text-white">Perfil ADM</div>
            <p className="mt-2 text-sm text-slate-300">
              Acesso total para configurar modulos, permissoes e integracoes. Visibilidade completa de trilhas, auditoria
              e SLAs.
            </p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Recursos do ADM</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                <li>• Perfis e permissoes</li>
                <li>• Auditoria de OS e Preventivas</li>
                <li>• Integracoes e webhooks</li>
                <li>• Governanca de dados e relatorios</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section
          id="contato"
          className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-slate-900/60 to-pink-500/10 px-6 py-6 shadow-lg shadow-cyan-500/10"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-100">Pronto para decolar</div>
            <h3 className="text-xl font-semibold text-white">Operacao de manutencao com a identidade EAGL</h3>
            <p className="text-sm text-cyan-100/80">Ambiente local ou producao, dashboards e OS conectados.</p>
          </div>
          <a
            href="https://app.eagl.com.br/login"
            className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:border-cyan-300"
          >
            Entrar
          </a>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/60 py-6 text-center text-sm text-slate-400">
        <div className="flex flex-col items-center gap-1">
          {logo ? <img src={logo} className="h-8 w-auto max-w-[150px] object-contain opacity-90" alt="EAGL" /> : null}
          <div className="text-white font-semibold">Tecnologia aplicada a manutencao e engenharia</div>
          <div className="text-slate-400">EAGL.com.br · Operacoes inteligentes e manutencao preditiva</div>
        </div>
        <div className="mt-1 flex items-center justify-center gap-4 text-xs text-slate-500">
          <a href="#" className="hover:text-slate-300">
            Privacidade
          </a>
          <a href="#" className="hover:text-slate-300">
            Termos
          </a>
          <a href="mailto:contato@eagl.com.br" className="hover:text-slate-300">
            contato@eagl.com.br
          </a>
        </div>
      </footer>
    </div>
  );
}
