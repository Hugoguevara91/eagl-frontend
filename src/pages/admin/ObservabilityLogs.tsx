import { useEffect, useState } from "react";
import { AdminShell } from "../../layout/AdminShell";
import { useAuth } from "../../context/AuthContext";
import { listLogs } from "../../services/adminLogsService";
import type { LogEvent } from "../../services/adminLogsService";
import { listTenants } from "../../services/adminTenantsService";

export function ObservabilityLogs() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({ tenantId: "", level: "", from: "", to: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [logsRes, tenantsRes] = await Promise.all([
        listLogs(token, {
          tenantId: filters.tenantId || undefined,
          level: filters.level || undefined,
          from: filters.from || undefined,
          to: filters.to || undefined,
        }),
        listTenants(token),
      ]);
      setLogs(logsRes.logs);
      setTenants(tenantsRes.tenants.map((t) => ({ id: t.id, name: t.name })));
    } catch (err: any) {
      setError(err.message || "Erro ao carregar logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AdminShell title="Logs e Observabilidade">
      {error ? (
        <div className="mb-3 rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
      ) : null}
      <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <select
          value={filters.tenantId}
          onChange={(e) => setFilters((f) => ({ ...f, tenantId: e.target.value }))}
          className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
        >
          <option value="">Todos os tenants</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={filters.level}
          onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value }))}
          className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
        >
          <option value="">Nível</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
          <option value="AUDIT">AUDIT</option>
          <option value="SECURITY">SECURITY</option>
        </select>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
          className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
        />
        <button
          onClick={load}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-400/60"
        >
          Filtrar
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70">
        <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-slate-400">
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Nível</th>
              <th className="px-4 py-3">Mensagem</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-300" colSpan={4}>
                  Carregando...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={4}>
                  Nenhum log encontrado.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    {tenants.find((t) => t.id === log.tenantId)?.name ?? log.tenantId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs uppercase">{log.level}</td>
                  <td className="px-4 py-3 text-slate-100">{log.message}</td>
                  <td className="px-4 py-3 text-slate-200">
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
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
