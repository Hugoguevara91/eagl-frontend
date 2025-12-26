import { useEffect, useState } from "react";
import { AdminShell } from "../../layout/AdminShell";
import { useAuth } from "../../context/AuthContext";
import { listTenants } from "../../services/adminTenantsService";
import { listPlans } from "../../services/adminPlansService";
import { listTickets } from "../../services/adminTicketsService";
import { listInvoices } from "../../services/adminBillingService";

export function AdminDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    tenants: 0,
    activeTenants: 0,
    plans: 0,
    openTickets: 0,
    invoices: 0,
  });

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const [tenantsRes, plansRes, ticketsRes, invoicesRes] = await Promise.all([
          listTenants(token),
          listPlans(token),
          listTickets(token),
          listInvoices(token),
        ]);
        setMetrics({
          tenants: tenantsRes.tenants.length,
          activeTenants: tenantsRes.tenants.filter((t) => t.status === "active").length,
          plans: plansRes.plans.length,
          openTickets: ticketsRes.tickets.filter((t) => t.status !== "resolved").length,
          invoices: invoicesRes.invoices.length,
        });
      } catch (err: any) {
        setError(err.message || "Erro ao carregar painel");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <AdminShell title="Dashboard">
      {error ? (
        <div className="rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Tenants", value: metrics.tenants },
          { label: "Ativos", value: metrics.activeTenants },
          { label: "Planos", value: metrics.plans },
          { label: "Tickets abertos", value: metrics.openTickets },
          { label: "Faturas", value: metrics.invoices },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-md shadow-cyan-500/10"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
            <div className="mt-2 text-3xl font-bold text-white">
              {loading ? <span className="text-sm text-slate-400">carregando...</span> : item.value}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
