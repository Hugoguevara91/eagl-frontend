import { AppShell } from "../layout/AppShell";

const PREVENTIVAS = [
  { nome: "Inspeção HVAC", recorrencia: "Mensal", proxima: "15/01/2026", status: "No prazo" },
  { nome: "Filtro AHU", recorrencia: "Trimestral", proxima: "05/02/2026", status: "Planejada" },
  { nome: "Calibração sensores", recorrencia: "Semestral", proxima: "20/03/2026", status: "No prazo" },
];

const statusTone: Record<string, string> = {
  "No prazo": "text-cyan-200 bg-cyan-500/10 border-cyan-500/30",
  Planejada: "text-amber-200 bg-amber-500/10 border-amber-500/30",
};

export default function Preventivas() {
  return (
    <AppShell title="Preventivas">
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5">
          <div className="text-sm font-semibold text-white">Manutenção preventiva</div>
          <p className="mt-1 text-sm text-slate-400">
            Programação de PMOC com prazos e recorrências.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 shadow-lg shadow-pink-500/5">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-2 border-b border-white/5 px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-400">
            <div>Atividade</div>
            <div>Recorrência</div>
            <div>Próxima</div>
            <div>Status</div>
          </div>
          <div className="divide-y divide-white/5">
            {PREVENTIVAS.map((item) => (
              <div
                key={item.nome}
                className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] items-center gap-2 px-4 py-3 text-sm text-white"
              >
                <div className="font-semibold">{item.nome}</div>
                <div className="text-slate-300">{item.recorrencia}</div>
                <div className="text-slate-300">{item.proxima}</div>
                <span
                  className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[item.status] ?? "border-white/10 text-slate-200"}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
