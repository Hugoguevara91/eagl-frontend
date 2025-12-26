import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminShell } from "../../layout/AdminShell";
import { useAuth } from "../../context/AuthContext";
import { activateTenant, listTenants, suspendTenant } from "../../services/adminTenantsService";
import type { Tenant } from "../../services/adminTenantsService";
import { listPlans } from "../../services/adminPlansService";

export function TenantsList() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchTenants = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listTenants(token, {
        status: statusFilter || undefined,
        planId: planFilter || undefined,
        search: search || undefined,
      });
      setTenants(data.tenants);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      await fetchTenants();
      const plansRes = await listPlans(token);
      setPlans(plansRes.plans.map((p) => ({ id: p.id, name: p.name })));
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSuspend = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Suspender tenant?")) return;
    try {
      setBusyId(id);
      await suspendTenant(token, id);
      await fetchTenants();
    } catch (err: any) {
      setError(err.message || "Erro ao suspender");
    } finally {
      setBusyId(null);
    }
  };

  const handleActivate = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Ativar tenant?")) return;
    try {
      setBusyId(id);
      await activateTenant(token, id);
      await fetchTenants();
    } catch (err: any) {
      setError(err.message || "Erro ao ativar");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminShell
      title="Tenants"
      actions={
        <button
          onClick={() => navigate("/admin/tenants/new")}
          className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-300"
        >
          Novo tenant
        </button>
      }
    >
      {error ? (
        <div className="mb-3 rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
      ) : null}
      <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou CNPJ"
          className="flex-1 min-w-[180px] rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
        >
          <option value="">Status</option>
          <option value="trial">Trial</option>
          <option value="active">Ativo</option>
          <option value="suspended">Suspenso</option>
        </select>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
        >
          <option value="">Plano</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          onClick={fetchTenants}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-400/60"
        >
          Filtrar
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70">
        <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-slate-400">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Plano</th>
              <th className="px-4 py-3">Usuários</th>
              <th className="px-4 py-3">Ativos</th>
              <th className="px-4 py-3">OS/mês</th>
              <th className="px-4 py-3">Storage</th>
              <th className="px-4 py-3">Último login</th>
              <th className="px-4 py-3">Health</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-300" colSpan={10}>
                  Carregando...
                </td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={10}>
                  Nenhum tenant encontrado.
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold text-white">{tenant.name}</td>
                  <td className="px-4 py-3 text-xs uppercase">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] ${
                        tenant.status === "active"
                          ? "bg-green-500/15 text-green-200"
                          : tenant.status === "suspended"
                            ? "bg-pink-500/15 text-pink-100"
                            : "bg-amber-500/15 text-amber-100"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{tenant.planName ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-200">{tenant.usersCount ?? 0}</td>
                  <td className="px-4 py-3 text-slate-200">{tenant.assetsCount ?? 0}</td>
                  <td className="px-4 py-3 text-slate-200">{tenant.osPerMonth ?? 0}</td>
                  <td className="px-4 py-3 text-slate-200">{tenant.storageGb ?? 0} GB</td>
                  <td className="px-4 py-3 text-slate-300">
                    {tenant.lastLoginAt ? new Date(tenant.lastLoginAt).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{tenant.health ?? "—"}</td>
                  <td className="px-4 py-3 space-x-2 text-sm">
                    <button
                      onClick={() => navigate(`/admin/tenants/${tenant.id}`)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-white hover:border-cyan-400/50"
                    >
                      Ver
                    </button>
                    {tenant.status !== "suspended" ? (
                      <button
                        disabled={busyId === tenant.id}
                        onClick={() => handleSuspend(tenant.id)}
                        className="rounded-lg border border-pink-400/40 px-3 py-1 text-pink-100 hover:border-pink-300 disabled:opacity-60"
                      >
                        Suspender
                      </button>
                    ) : (
                      <button
                        disabled={busyId === tenant.id}
                        onClick={() => handleActivate(tenant.id)}
                        className="rounded-lg border border-green-400/40 px-3 py-1 text-green-100 hover:border-green-300 disabled:opacity-60"
                      >
                        Ativar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
