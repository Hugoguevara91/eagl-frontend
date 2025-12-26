import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../layout/AppShell";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

type Role = "super_admin" | "admin" | "user" | "ADM" | "USER";
type User = { id: string; name: string; email: string; role: Role };

export default function Usuarios() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{ id?: string; name: string; email: string; role: Role; password?: string }>({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  const isAdm = useMemo(
    () => currentUser?.role === "admin" || currentUser?.role === "super_admin" || currentUser?.role === "ADM",
    [currentUser],
  );

  const load = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await apiFetch<{ users: User[] }>("/users", { token });
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const normalizeRole = (role: Role) => {
    if (role === "ADM" || role === "super_admin") return "admin";
    if (role === "USER") return "user";
    return role;
  };

  const roleLabel = (role: Role) => {
    const r = normalizeRole(role);
    if (r === "admin") return "Admin";
    return "Usuário";
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || (!form.id && !form.password)) {
      setError("Nome, email e senha são obrigatórios.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      if (form.id) {
        await apiFetch(`/users/${form.id}`, {
          method: "PUT",
          token,
          body: {
            name: form.name,
            email: form.email,
            role: normalizeRole(form.role),
            password: form.password?.trim() ? form.password : undefined,
          },
        });
        setMessage("Usuário atualizado.");
      } else {
        await apiFetch("/users", {
          method: "POST",
          token,
          body: {
            name: form.name,
            email: form.email,
            role: normalizeRole(form.role),
            password: form.password,
          },
        });
        setMessage("Usuário criado.");
      }
      setForm({ name: "", email: "", role: "user", password: "" });
      setShowForm(false);
      await load();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar usuário.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remover este usuário?")) return;
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE", token });
      setMessage("Usuário removido.");
      await load();
    } catch (err: any) {
      setError(err.message || "Erro ao remover usuário.");
    }
  };

  return (
    <AppShell title="Administração • Usuários">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Gestão de usuários</div>
            <div className="text-xs text-slate-400">Controle de acesso para administradores e operadores.</div>
          </div>
          {isAdm ? (
            <button
              onClick={() => setShowForm((p) => !p)}
              className="rounded-xl border border-pink-500/40 bg-pink-500/20 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:border-pink-400"
            >
              {showForm ? "Fechar formulário" : "Cadastrar novo usuário"}
            </button>
          ) : null}
        </div>

        {error ? <div className="rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div> : null}
        {message ? <div className="rounded-xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{message}</div> : null}

        {showForm ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-lg shadow-cyan-500/5">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Nome</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Perfil</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                >
                  <option value="admin">Admin</option>
                  <option value="user">Usuário</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  {form.id ? "Nova senha (opcional)" : "Senha"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                disabled={saving}
                onClick={handleSubmit}
                className="rounded-xl border border-pink-500/40 bg-pink-500/20 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:border-pink-400 disabled:opacity-60"
              >
                {saving ? "Salvando..." : form.id ? "Atualizar" : "Criar"}
              </button>
              <button
                onClick={() => {
                  setForm({ name: "", email: "", role: "user", password: "" });
                  setShowForm(false);
                }}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-400/60"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 shadow-lg shadow-pink-500/5">
          <div className="grid grid-cols-[1.2fr_1.4fr_0.8fr_0.8fr] gap-2 border-b border-white/5 px-4 py-3 text-xs uppercase tracking-[0.15em] text-slate-400">
            <div>Nome</div>
            <div>Email</div>
            <div>Perfil</div>
            <div>Ações</div>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="px-4 py-4 text-sm text-slate-300">Carregando usuários...</div>
            ) : users.length === 0 ? (
              <div className="px-4 py-4 text-sm text-slate-400">Nenhum usuário encontrado.</div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-[1.2fr_1.4fr_0.8fr_0.8fr] items-center gap-2 px-4 py-3 text-sm text-white"
                >
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-slate-300">{user.email}</div>
                  <span
                    className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${
                      normalizeRole(user.role) === "admin"
                        ? "border-pink-500/40 bg-pink-500/10 text-pink-100"
                        : "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                    }`}
                  >
                    {roleLabel(user.role)}
                  </span>
                  <div className="flex gap-2 text-xs">
                    <button
                      disabled={!isAdm}
                      onClick={() => {
                        setForm({
                          id: user.id,
                          name: user.name,
                          email: user.email,
                          role: normalizeRole(user.role),
                          password: "",
                        });
                        setShowForm(true);
                      }}
                      className="rounded-lg border border-white/10 px-3 py-1 text-cyan-100 hover:border-cyan-400/60 disabled:opacity-50"
                    >
                      Editar
                    </button>
                    <button
                      disabled={!isAdm || user.id === currentUser?.id}
                      onClick={() => handleDelete(user.id)}
                      className="rounded-lg border border-pink-500/30 px-3 py-1 text-pink-100 hover:border-pink-400/70 disabled:opacity-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
