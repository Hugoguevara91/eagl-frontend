import { useEffect, useState } from "react";
import { AdminShell } from "../../layout/AdminShell";
import { useAuth } from "../../context/AuthContext";
import { createTicket, listTickets, updateTicket } from "../../services/adminTicketsService";
import type { Ticket } from "../../services/adminTicketsService";
import { listTenants } from "../../services/adminTenantsService";

export function SupportTickets() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);
  const [tenantFilter, setTenantFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [newTicket, setNewTicket] = useState({ tenantId: "", title: "", priority: "medium" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [ticketsRes, tenantsRes] = await Promise.all([
        listTickets(token, {
          tenantId: tenantFilter || undefined,
          status: statusFilter || undefined,
        }),
        listTenants(token),
      ]);
      setTickets(ticketsRes.tickets);
      setTenants(tenantsRes.tenants.map((t) => ({ id: t.id, name: t.name })));
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tenantFilter, statusFilter]);

  const handleCreate = async () => {
    if (!token) return;
    if (!newTicket.tenantId || !newTicket.title) {
      setError("Informe tenant e título");
      return;
    }
    try {
      setSaving(true);
      await createTicket(token, {
        tenantId: newTicket.tenantId,
        title: newTicket.title,
        priority: newTicket.priority,
      });
      setMessage("Ticket criado");
      setNewTicket({ tenantId: "", title: "", priority: "medium" });
      await load();
    } catch (err: any) {
      setError(err.message || "Erro ao criar ticket");
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      setSaving(true);
      await updateTicket(token, id, { status });
      await load();
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar ticket");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="Suporte">
      {error ? (
        <div className="mb-3 rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
      ) : null}
      {message ? (
        <div className="mb-3 rounded-xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{message}</div>
      ) : null}

      <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <select
          value={tenantFilter}
          onChange={(e) => setTenantFilter(e.target.value)}
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
        >
          <option value="">Todos os status</option>
          <option value="open">Aberto</option>
          <option value="in_progress">Em progresso</option>
          <option value="resolved">Resolvido</option>
        </select>
        <button
          onClick={load}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-400/60"
        >
          Filtrar
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold text-white">Novo ticket</div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <select
            value={newTicket.tenantId}
            onChange={(e) => setNewTicket((f) => ({ ...f, tenantId: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          >
            <option value="">Selecione tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Título"
            value={newTicket.title}
            onChange={(e) => setNewTicket((f) => ({ ...f, title: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          />
          <select
            value={newTicket.priority}
            onChange={(e) => setNewTicket((f) => ({ ...f, priority: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <button
          onClick={handleCreate}
          disabled={saving}
          className="mt-3 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-300 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Criar ticket"}
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70">
        <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-slate-400">
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Prioridade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Criado</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-300" colSpan={6}>
                  Carregando...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={6}>
                  Nenhum ticket encontrado.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    {tenants.find((tenant) => tenant.id === t.tenantId)?.name ?? t.tenantId}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{t.title}</td>
                  <td className="px-4 py-3">{t.priority}</td>
                  <td className="px-4 py-3">{t.status}</td>
                  <td className="px-4 py-3">{new Date(t.createdAt).toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleStatus(t.id, "in_progress")}
                      className="rounded-lg border border-white/15 px-3 py-1 text-xs text-white hover:border-cyan-400/60"
                    >
                      Em progresso
                    </button>
                    <button
                      onClick={() => handleStatus(t.id, "resolved")}
                      className="rounded-lg border border-green-400/40 px-3 py-1 text-xs text-green-100 hover:border-green-300"
                    >
                      Resolver
                    </button>
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
