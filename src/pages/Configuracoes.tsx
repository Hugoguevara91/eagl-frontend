import { useState } from "react";
import { AppShell } from "../layout/AppShell";
import { useAuth } from "../context/AuthContext";

const ITEMS = [
  { titulo: "Identidade visual", desc: "Logo, cores e tema neon premium." },
  { titulo: "Usuários e papéis", desc: "Controle de acesso e MFA." },
  { titulo: "Integrações", desc: "Gateways IoT, BMS e exportação de dados." },
];

export default function Configuracoes() {
  const { user, logout, changePassword } = useAuth() as any;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onChangePassword = async () => {
    setError(null);
    setOk(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (newPassword.length < 8) {
      setError("A nova senha precisa ter no mínimo 8 caracteres.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("A confirmação da nova senha não confere.");
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      setOk("Senha atualizada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e: any) {
      setError(e?.message ?? "Não foi possível atualizar a senha.");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    logout();
    // se você tiver rota de login, você pode navegar; mas só sair já resolve.
    // navigate("/login");
  };

  return (
    <AppShell title="Configurações">
      <div className="space-y-4">
        {/* Cabeçalho */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Preferências do ambiente</div>
              <p className="mt-1 text-sm text-slate-400">
                Ajuste identidade, integrações e governança de acesso.
              </p>
              {user ? (
                <div className="mt-3 text-xs text-slate-300">
                  <span className="text-slate-400">Logado como:</span> {user.email}{" "}
                  <span className="ml-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-cyan-100">
                    {user.role}
                  </span>
                </div>
              ) : null}
            </div>

            <button
              onClick={onLogout}
              className="mt-3 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-pink-400/40 hover:text-white md:mt-0"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Cards (mantive os seus) */}
        <div className="grid gap-4 md:grid-cols-3">
          {ITEMS.map((item) => (
            <div
              key={item.titulo}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-pink-500/5"
            >
              <div className="absolute -right-6 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400/30 to-pink-500/30 blur-3xl" />
              <div className="relative text-sm font-semibold text-white">{item.titulo}</div>
              <p className="relative mt-2 text-sm text-slate-300">{item.desc}</p>
              <button className="relative mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 hover:text-white">
                Configurar →
              </button>
            </div>
          ))}
        </div>

        {/* Troca de senha (novo, funcional) */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5">
          <div className="text-sm font-semibold text-white">Segurança</div>
          <p className="mt-1 text-sm text-slate-400">Troque sua senha de acesso.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-xs text-slate-300">Senha atual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300">Nova senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                placeholder="mínimo 8 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300">Confirmar nova senha</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                placeholder="repita a nova senha"
                autoComplete="new-password"
              />
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
          ) : null}

          {ok ? (
            <div className="mt-4 rounded-xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{ok}</div>
          ) : null}

          <button
            onClick={onChangePassword}
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-pink-500/40 bg-pink-500/20 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(236,72,153,0.25)] hover:border-pink-400 disabled:opacity-60 md:w-auto"
          >
            {loading ? "Atualizando..." : "Atualizar senha"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
