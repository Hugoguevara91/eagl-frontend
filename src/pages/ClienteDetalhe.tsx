import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppShell } from "../layout/AppShell";

const TABS = ["Visão Geral", "Ativos", "Preventivas", "Ordens de Serviço", "Relatórios"] as const;
type Tab = (typeof TABS)[number];

// ✅ Use a mesma base (mock) do Clientes.tsx pra não inventar nome
const MOCK_CLIENTES = [
  { id: "eagl-001", nome: "EAGL São Paulo", contrato: "EAGL-2025-001", status: "Ativo" },
  { id: "eagl-002", nome: "EAGL Rio", contrato: "EAGL-2025-014", status: "Ativo" },
  { id: "eagl-003", nome: "EAGL Minas", contrato: "EAGL-2025-021", status: "Em risco" },
  { id: "eagl-004", nome: "EAGL Brasília", contrato: "EAGL-2025-034", status: "Suspenso" },
  { id: "eagl-005", nome: "EAGL Nordeste", contrato: "EAGL-2025-045", status: "Ativo" },
];

const MOCK_ATIVOS = [
  { id: "ATV-101", nome: "Chiller Central", status: "Operacional", saude: 92 },
  { id: "ATV-205", nome: "AHU - Bloco B", status: "Em risco", saude: 68 },
  { id: "ATV-330", nome: "VRF Rooftop", status: "Crítico", saude: 38 },
  { id: "ATV-404", nome: "Sensor IAQ", status: "Operacional", saude: 88 },
];

const MOCK_PREVENTIVAS = [
  { nome: "Inspeção HVAC", periodicidade: "Mensal", proxima: "15/01/2026", status: "No prazo" },
  { nome: "Filtro AHU", periodicidade: "Trimestral", proxima: "05/02/2026", status: "Planejada" },
  { nome: "Calibração sensores", periodicidade: "Semestral", proxima: "20/03/2026", status: "No prazo" },
];

const statusTone: Record<string, string> = {
  Operacional: "text-cyan-200 bg-cyan-500/10 border-cyan-500/30",
  "Em risco": "text-amber-200 bg-amber-500/10 border-amber-500/30",
  Crítico: "text-pink-100 bg-pink-500/10 border-pink-500/30",
  "No prazo": "text-cyan-200 bg-cyan-500/10 border-cyan-500/30",
  Planejada: "text-amber-200 bg-amber-500/10 border-amber-500/30",
};

function normalizeTab(raw: string | null): Tab {
  if (!raw) return "Visão Geral";
  const found = (TABS as readonly string[]).find((t) => t.toLowerCase() === raw.toLowerCase());
  return (found as Tab) ?? "Visão Geral";
}

export default function ClienteDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tab, setTab] = useState<Tab>("Visão Geral");

  // ✅ lê a tab pela URL (?tab=Ativos)
  useEffect(() => {
    setTab(normalizeTab(searchParams.get("tab")));
  }, [searchParams]);

  const cliente = useMemo(() => {
    if (!id) return null;
    return MOCK_CLIENTES.find((c) => c.id === id) ?? null;
  }, [id]);

  const title = cliente ? `Cliente: ${cliente.nome}` : `Cliente: ${id ?? "—"}`;

  const setTabAndUrl = (next: Tab) => {
    setTab(next);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("tab", next);
      return p;
    });
  };

  if (!id) {
    return (
      <AppShell title="Cliente">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
          ID do cliente não informado.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={title}>
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.15em] text-slate-400">Contrato</div>

              <div className="text-lg font-semibold text-white">
                {cliente ? cliente.contrato : "—"} • {id}
              </div>

              <div className="text-sm text-slate-400">
                Manutenção inteligente e monitoramento 24/7
              </div>
            </div>

            <div className="flex gap-2">
              <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                SLA 4h
              </span>
              <span className="rounded-full border border-pink-400/40 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-100">
                IoT ativo
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 shadow-lg shadow-cyan-500/5">
          <div className="flex flex-wrap border-b border-white/5 bg-white/5">
            {TABS.map((item) => (
              <button
                key={item}
                onClick={() => setTabAndUrl(item)}
                className={`relative px-4 py-3 text-sm font-semibold transition ${
                  tab === item ? "text-white" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab === item ? (
                  <span className="absolute inset-0 -bottom-px bg-gradient-to-r from-cyan-500/30 via-pink-400/30 to-transparent blur-xl" />
                ) : null}
                <span className="relative">{item}</span>
                {tab === item ? (
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-cyan-400 via-pink-400 to-transparent" />
                ) : null}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === "Visão Geral" ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.15em] text-slate-400">Ativos</div>
                  <div className="mt-2 text-2xl font-bold text-white">128</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.15em] text-slate-400">OS abertas</div>
                  <div className="mt-2 text-2xl font-bold text-white">9</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.15em] text-slate-400">Preventivas</div>
                  <div className="mt-2 text-2xl font-bold text-white">23</div>
                </div>
              </div>
            ) : null}

            {tab === "Ativos" ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-3 border-b border-white/5 px-4 py-3 text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  <div>Ativo</div>
                  <div>Código</div>
                  <div>Status</div>
                  <div>Saúde</div>
                </div>
                <div className="divide-y divide-white/5">
                  {MOCK_ATIVOS.map((ativo) => (
                    <button
                      key={ativo.id}
                      onClick={() => alert(`MVP: abrir detalhe do ativo ${ativo.id}`)}
                      className="grid w-full grid-cols-[1.2fr_1fr_1fr_0.8fr] items-center gap-3 px-4 py-3 text-left text-sm text-white hover:bg-white/5"
                    >
                      <div className="font-semibold">{ativo.nome}</div>
                      <div className="text-slate-300">{ativo.id}</div>
                      <span
                        className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          statusTone[ativo.status] ?? "border-white/10 text-slate-200"
                        }`}
                      >
                        {ativo.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500"
                            style={{ width: `${ativo.saude}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs text-slate-200">{ativo.saude}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {tab === "Preventivas" ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-2 border-b border-white/5 px-4 py-3 text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  <div>Atividade</div>
                  <div>Periodicidade</div>
                  <div>Próxima</div>
                  <div>Status</div>
                </div>
                <div className="divide-y divide-white/5">
                  {MOCK_PREVENTIVAS.map((item) => (
                    <div
                      key={item.nome}
                      className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] items-center gap-2 px-4 py-3 text-sm text-white"
                    >
                      <div className="font-semibold">{item.nome}</div>
                      <div className="text-slate-300">{item.periodicidade}</div>
                      <div className="text-slate-300">{item.proxima}</div>
                      <span
                        className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          statusTone[item.status] ?? "border-white/10 text-slate-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {tab === "Ordens de Serviço" ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                Últimas OS e SLA serão exibidos aqui.{" "}
                <button
                  className="ml-2 text-cyan-200 underline"
                  onClick={() => navigate("/app/ordens-servico")}
                >
                  Ir para OS
                </button>
              </div>
            ) : null}

            {tab === "Relatórios" ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                Relatórios consolidados e exportações futuras.{" "}
                <button
                  className="ml-2 text-cyan-200 underline"
                  onClick={() => navigate("/app/relatorios")}
                >
                  Ir para Relatórios
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
