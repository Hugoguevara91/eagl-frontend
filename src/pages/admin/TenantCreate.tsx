import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminShell } from "../../layout/AdminShell";
import { useAuth } from "../../context/AuthContext";
import { createTenant } from "../../services/adminTenantsService";
import { listPlans } from "../../services/adminPlansService";
import type { Plan } from "../../services/adminPlansService";

export function TenantCreate() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState({
    name: "",
    cnpj: "",
    ownerEmail: "",
    status: "trial",
    planId: "",
  });
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        setLoadingPlans(true);
        const res = await listPlans(token);
        setPlans(res.plans);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar planos");
      } finally {
        setLoadingPlans(false);
      }
    };
    load();
  }, [token]);

  const handleSubmit = async () => {
    if (!token) return;
    if (!form.name) {
      setError("Informe o nome do tenant");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const res = await createTenant(token, {
        name: form.name,
        cnpj: form.cnpj || undefined,
        ownerEmail: form.ownerEmail || undefined,
        status: form.status,
        planId: form.planId || undefined,
      });
      setMessage("Tenant criado com sucesso");
      navigate(`/admin/tenants/${res.tenant.id}`);
    } catch (err: any) {
      setError(err.message || "Erro ao criar tenant");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="Novo Tenant">
      {error ? (
        <div className="mb-3 rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
      ) : null}
      {message ? (
        <div className="mb-3 rounded-xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{message}</div>
      ) : null}

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Nome da empresa</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-slate-400">CNPJ (opcional)</label>
          <input
            value={form.cnpj}
            onChange={(e) => setForm((f) => ({ ...f, cnpj: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Email do owner</label>
          <input
            value={form.ownerEmail}
            onChange={(e) => setForm((f) => ({ ...f, ownerEmail: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Plano inicial</label>
          <select
            value={form.planId}
            onChange={(e) => setForm((f) => ({ ...f, planId: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          >
            <option value="">Selecione um plano</option>
            {loadingPlans ? <option>Carregando...</option> : null}
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          >
            <option value="trial">Trial</option>
            <option value="active">Ativo</option>
            <option value="suspended">Suspenso</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:border-cyan-300 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Criar tenant"}
          </button>
          <button
            onClick={() => navigate("/admin/tenants")}
            className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-400/60"
          >
            Cancelar
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
