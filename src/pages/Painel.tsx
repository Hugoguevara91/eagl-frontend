import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layout/AppShell";

type Kpi = { label: string; value: number; accent: string };

const formatNumber = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

// Mock (MVP). Depois isso vem da API.
const KPI_VALUES = {
  clientesTotais: 128,
  ativosTotais: 1280,
  ativosCriticos: 32,
  clientesComCriticos: 14,
  osEmAberto: 56,
};

const KPIS: Kpi[] = [
  { label: "Clientes totais", value: KPI_VALUES.clientesTotais, accent: "from-cyan-400/50 to-pink-500/50" },
  { label: "Ativos totais", value: KPI_VALUES.ativosTotais, accent: "from-cyan-400/60 to-blue-500/50" },
  { label: "Ativos críticos", value: KPI_VALUES.ativosCriticos, accent: "from-pink-500/60 to-amber-400/50" },
  { label: "Clientes c/ críticos", value: KPI_VALUES.clientesComCriticos, accent: "from-amber-300/50 to-pink-500/50" },
  { label: "OS em aberto", value: KPI_VALUES.osEmAberto, accent: "from-cyan-400/60 to-pink-500/50" },
];

const LINE_DATA = [
  { mes: "Jul", saude: 91 },
  { mes: "Ago", saude: 89 },
  { mes: "Set", saude: 90 },
  { mes: "Out", saude: 92 },
  { mes: "Nov", saude: 93 },
  { mes: "Dez", saude: 94 },
];

const BAR_DATA = [
  { status: "Em execução", total: 28 },
  { status: "Planejada", total: 15 },
  { status: "Aguardando peça", total: 8 },
  { status: "Crítica", total: 5 },
];

const PIE_DATA = [
  { name: "Operando", value: 980 },
  { name: "Em risco", value: 210 },
  { name: "Crítico", value: 90 },
];

const PIE_COLORS = ["#22d3ee", "#fbbf24", "#ec4899"];
const BAR_COLORS = ["#22d3ee", "#fbbf24", "#38bdf8", "#ec4899"];

export default function Painel() {
  const navigate = useNavigate();

  return (
    <AppShell title="Painel">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {KPIS.map((item) => (
          <div
            key={item.label}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-cyan-500/10"
          >
            <div className={`absolute -right-6 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${item.accent} blur-3xl`} />
            <div className="relative text-[11px] uppercase tracking-[0.2em] text-slate-400">
              {item.label}
            </div>
            <div className="relative mt-2 text-3xl font-bold text-white">{formatNumber(item.value)}</div>
          </div>
        ))}
      </div>

      {/* Linha + CTA */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/10 lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-pink-500/5" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.15em] text-slate-400">
                Saúde média do ativo
              </div>
              <div className="text-xl font-semibold text-white">Últimos 6 meses</div>
            </div>
          </div>

          <div className="relative mt-4 h-64 rounded-xl border border-white/5 bg-slate-950/40 p-3 text-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LINE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[80, 100]} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="saude"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-pink-500/10">
          <div className="absolute -right-6 -top-10 h-20 w-20 rounded-full bg-gradient-to-br from-pink-500/30 to-cyan-400/30 blur-3xl" />
          <div className="relative text-sm font-semibold text-white">Criar Ordem de Serviço</div>
          <p className="relative mt-2 text-sm text-slate-400">
            Crie uma OS com prioridade, SLA e vínculo com ativo.
          </p>

          <button
            onClick={() => navigate("/app/ordens-servico?novo=1")}
            className="relative mt-4 w-full rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:border-cyan-300"
          >
            Criar OS agora
          </button>
        </div>
      </div>

      {/* Barra + Pizza */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/10 lg:col-span-2">
          <div className="relative mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.15em] text-slate-400">OS por status</div>
              <div className="text-lg font-semibold text-white">Últimos 30 dias</div>
            </div>
          </div>

          <div className="relative h-64 rounded-xl border border-white/5 bg-slate-950/40 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="status" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                <Legend />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {BAR_DATA.map((entry, index) => (
                    <Cell key={entry.status} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-pink-500/10">
          <div className="relative mb-3">
            <div className="text-sm uppercase tracking-[0.15em] text-slate-400">Distribuição de ativos</div>
            <div className="text-lg font-semibold text-white">Operação x Risco</div>
          </div>

          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={PIE_DATA} innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
