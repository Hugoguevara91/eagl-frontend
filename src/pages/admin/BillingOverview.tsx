import { useEffect, useState } from "react";
import { AdminShell } from "../../layout/AdminShell";
import { useAuth } from "../../context/AuthContext";
import { createInvoice, listInvoices } from "../../services/adminBillingService";
import type { Invoice } from "../../services/adminBillingService";
import { listTenants } from "../../services/adminTenantsService";

export function BillingOverview() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);
  const [tenantFilter, setTenantFilter] = useState("");
  const [newInvoice, setNewInvoice] = useState({ tenantId: "", amount: "", dueDate: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [invRes, tenantsRes] = await Promise.all([
        listInvoices(token, tenantFilter ? { tenantId: tenantFilter } : undefined),
        listTenants(token),
      ]);
      setInvoices(invRes.invoices);
      setTenants(tenantsRes.tenants.map((t) => ({ id: t.id, name: t.name })));
    } catch (err: any) {
      setError(err.message || "Erro ao carregar faturamento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tenantFilter]);

  const handleCreate = async () => {
    if (!token) return;
    if (!newInvoice.tenantId || !newInvoice.amount || !newInvoice.dueDate) {
      setError("Informe tenant, valor e vencimento");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await createInvoice(token, {
        tenantId: newInvoice.tenantId,
        amount: Number(newInvoice.amount),
        dueDate: newInvoice.dueDate,
        description: newInvoice.description,
      });
      setMessage("Fatura criada");
      setNewInvoice({ tenantId: "", amount: "", dueDate: "", description: "" });
      await load();
    } catch (err: any) {
      setError(err.message || "Erro ao criar fatura");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="Faturamento">
      {error ? (
        <div className="mb-3 rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
      ) : null}
      {message ? (
        <div className="mb-3 rounded-xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{message}</div>
      ) : null}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-3">
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
          <button
            onClick={load}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-400/60"
          >
            Filtrar
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold text-white">Nova fatura</div>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <select
            value={newInvoice.tenantId}
            onChange={(e) => setNewInvoice((f) => ({ ...f, tenantId: e.target.value }))}
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
            type="number"
            placeholder="Valor"
            value={newInvoice.amount}
            onChange={(e) => setNewInvoice((f) => ({ ...f, amount: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          />
          <input
            type="date"
            value={newInvoice.dueDate}
            onChange={(e) => setNewInvoice((f) => ({ ...f, dueDate: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          />
          <input
            placeholder="Descrição"
            value={newInvoice.description}
            onChange={(e) => setNewInvoice((f) => ({ ...f, description: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={saving}
          className="mt-3 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-300 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Criar fatura"}
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70">
        <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-slate-400">
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Vencimento</th>
              <th className="px-4 py-3">Emitido</th>
              <th className="px-4 py-3">Descrição</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-300" colSpan={6}>
                  Carregando...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={6}>
                  Nenhuma fatura encontrada.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">{tenants.find((t) => t.id === inv.tenantId)?.name ?? inv.tenantId}</td>
                  <td className="px-4 py-3 font-semibold text-white">R$ {Number(inv.amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs uppercase">{inv.status}</td>
                  <td className="px-4 py-3">{new Date(inv.dueDate).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3">{new Date(inv.issuedAt).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 text-slate-200">{inv.description || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
