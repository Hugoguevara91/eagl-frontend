import { AppShell } from "../layout/AppShell";

const PERFIS = [
  { nome: "ADM", descricao: "Acesso total, gestão de usuários e parâmetros." },
  { nome: "USER", descricao: "Operação diária: OS, Preventivas, Relatórios." },
];

export default function Perfis() {
  return (
    <AppShell title="Administração · Perfis e Permissões">
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5">
          <div className="text-sm font-semibold text-white">Papéis e permissões</div>
          <p className="mt-1 text-sm text-slate-400">
            Defina responsabilidades para cada time. Por enquanto os perfis são mockados.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PERFIS.map((perfil) => (
            <div
              key={perfil.nome}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-pink-500/5"
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-pink-500/30 to-cyan-400/30 blur-3xl" />
              <div className="relative text-sm font-semibold text-white">{perfil.nome}</div>
              <p className="relative mt-2 text-sm text-slate-300">{perfil.descricao}</p>
              <button className="relative mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 hover:text-white">
                Gerenciar permissões →
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
