import { AppShell } from "../layout/AppShell";

const RELATORIOS = [
  { titulo: "Saúde do ativo", periodo: "Últimos 30 dias", status: "Disponível" },
  { titulo: "OS executadas", periodo: "Q4 2025", status: "Processando" },
  { titulo: "Compliance PMOC", periodo: "2025", status: "Disponível" },
];

const statusTone: Record<string, string> = {
  Disponível: "text-cyan-200 bg-cyan-500/10 border-cyan-500/30",
  Processando: "text-amber-200 bg-amber-500/10 border-amber-500/30",
};

export default function Relatorios() {
  return (
    <AppShell title="Relatórios">
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5">
          <div className="text-sm font-semibold text-white">Relatórios e insights</div>
          <p className="mt-1 text-sm text-slate-400">
            Consolide dados de ativos, OS e PMOC em um só lugar.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {RELATORIOS.map((item) => (
            <div
              key={item.titulo}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-pink-500/5"
            >
              <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-gradient-to-br from-pink-500/30 to-cyan-400/30 blur-3xl" />
              <div className="relative text-sm font-semibold text-white">{item.titulo}</div>
              <div className="relative mt-2 text-xs uppercase tracking-[0.15em] text-slate-400">
                {item.periodo}
              </div>
              <span
                className={`relative mt-4 inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[item.status] ?? "border-white/10 text-slate-200"}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
