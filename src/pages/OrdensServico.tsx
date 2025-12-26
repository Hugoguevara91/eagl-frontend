import { useEffect, useState } from "react";
import { AppShell } from "../layout/AppShell";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

type OS = {
  id: string;
  clienteNome: string;
  prioridade: string;
  status: string;
  descricao: string;
};

const chipTone: Record<string, string> = {
  Alta: "text-amber-200 bg-amber-500/10 border-amber-500/30",
  Média: "text-cyan-200 bg-cyan-500/10 border-cyan-500/30",
  Crítica: "text-pink-100 bg-pink-500/10 border-pink-500/30",
  "Em execução": "text-cyan-100 bg-cyan-500/10 border-cyan-500/40",
  Planejada: "text-slate-100 bg-white/10 border-white/20",
  "Aguardando peça": "text-amber-100 bg-amber-500/10 border-amber-500/30",
  Concluída: "text-cyan-100 bg-cyan-500/10 border-cyan-500/40",
};

export default function OrdensServico() {
  const { token } = useAuth();
  const [osList, setOsList] = useState<OS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const data = await apiFetch<{ os: OS[] }>("/os", { token });
        setOsList(data.os);
      } catch (err: any) {
        setError(err.message || "Não foi possível carregar as OS.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <AppShell title="Ordens de Serviço">
      <div className="flex flex-col gap-4">
        {error ? (
          <div className="rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
        ) : null}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 shadow-lg shadow-pink-500/5">
          <div className="grid grid-cols-[1fr_1fr_0.7fr_0.8fr] gap-2 border-b border-white/5 px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-400">
            <div>OS</div>
            <div>Cliente</div>
            <div>Prioridade</div>
            <div>Status</div>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="px-4 py-4 text-sm text-slate-300">Carregando OS...</div>
            ) : osList.length === 0 ? (
              <div className="px-4 py-4 text-sm text-slate-400">Nenhuma OS cadastrada.</div>
            ) : (
              osList.map((os) => (
                <div
                  key={os.id}
                  className="grid grid-cols-[1fr_1fr_0.7fr_0.8fr] items-center gap-2 px-4 py-3 text-sm text-white"
                >
                  <div className="font-semibold">{os.id}</div>
                  <div className="text-slate-300">{os.clienteNome}</div>
                  <span
                    className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${chipTone[os.prioridade] ?? "border-white/10 text-slate-200"}`}
                  >
                    {os.prioridade}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${chipTone[os.status] ?? "border-white/10 text-slate-200"}`}
                  >
                    {os.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
