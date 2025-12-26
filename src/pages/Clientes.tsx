import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layout/AppShell";

const MOCK_CLIENTES = [
  { id: "eagl-001", nome: "EAGL São Paulo", contrato: "EAGL-2025-001", status: "Ativo" },
  { id: "eagl-002", nome: "EAGL Rio", contrato: "EAGL-2025-014", status: "Ativo" },
  { id: "eagl-003", nome: "EAGL Minas", contrato: "EAGL-2025-021", status: "Em risco" },
  { id: "eagl-004", nome: "EAGL Brasília", contrato: "EAGL-2025-034", status: "Suspenso" },
  { id: "eagl-005", nome: "EAGL Nordeste", contrato: "EAGL-2025-045", status: "Ativo" },
];

const statusColor: Record<string, string> = {
  Ativo: "text-cyan-200 bg-cyan-500/10 border-cyan-500/30",
  "Em risco": "text-amber-200 bg-amber-500/10 border-amber-500/30",
  Suspenso: "text-pink-100 bg-pink-500/10 border-pink-500/30",
};

export default function Clientes() {
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return MOCK_CLIENTES;

    return MOCK_CLIENTES.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.contrato.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q),
    );
  }, [busca]);

  return (
    <AppShell title="Clientes">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-cyan-500/5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Base de clientes</div>
            <div className="mt-1 text-xs text-slate-400">
              Clique em uma linha para abrir os detalhes do cliente.
            </div>
            <div className="mt-2 text-xs text-slate-300">
              {filtrados.length} de {MOCK_CLIENTES.length} clientes
            </div>
          </div>

          <div className="flex w-full gap-2 md:w-auto">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar cliente, contrato ou ID"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30 md:w-72"
            />
            <button
              onClick={() => setBusca("")}
              className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:text-white"
              title="Limpar busca"
            >
              Limpar
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg shadow-pink-500/5">
          <div className="grid grid-cols-[2fr_1fr_1fr] items-center gap-2 border-b border-white/5 px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-400">
            <div>Cliente</div>
            <div>Contrato</div>
            <div>Status</div>
          </div>

          <div className="divide-y divide-white/5">
            {filtrados.map((cliente) => (
              <button
                key={cliente.id}
                onClick={() => navigate(`/app/clientes/${cliente.id}`)}
                className="grid w-full grid-cols-[2fr_1fr_1fr] items-center gap-2 px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/5"
              >
                <div className="font-semibold text-white">
                  {cliente.nome}
                  <div className="mt-1 text-xs text-slate-400">{cliente.id}</div>
                </div>
                <div className="text-slate-300">{cliente.contrato}</div>
                <span
                  className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    statusColor[cliente.status] ?? "border-white/10 text-slate-200"
                  }`}
                >
                  {cliente.status}
                </span>
              </button>
            ))}

            {filtrados.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">
                Nenhum cliente encontrado.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
