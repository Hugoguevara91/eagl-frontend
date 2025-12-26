import { useEffect, useState } from "react";
import { AdminShell } from "../../layout/AdminShell";
import { useAuth } from "../../context/AuthContext";
import { createPlan, listPlans, updatePlan } from "../../services/adminPlansService";
import type { Plan } from "../../services/adminPlansService";

export function PlansList() {
  const { token } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState({ name: "", price: 0, isActive: true });
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await listPlans(token);
      setPlans(res.plans);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCreate = async () => {
    if (!token) return;
    if (!newPlan.name) {
      setError("Informe o nome do plano");
      return;
    }
    try {
      setSavingId("new");
      await createPlan(token, { name: newPlan.name, price: newPlan.price, isActive: newPlan.isActive });
      setNewPlan({ name: "", price: 0, isActive: true });
      setMessage("Plano criado");
      await load();
    } catch (err: any) {
      setError(err.message || "Erro ao criar plano");
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdate = async (plan: Plan) => {
    if (!token) return;
    try {
      setSavingId(plan.id);
      await updatePlan(token, plan.id, plan);
      setMessage("Plano atualizado");
      await load();
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar plano");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminShell title="Planos e Preços">
      {error ? (
        <div className="mb-3 rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
      ) : null}
      {message ? (
        <div className="mb-3 rounded-xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{message}</div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold text-white">Novo plano</div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            placeholder="Nome"
            value={newPlan.name}
            onChange={(e) => setNewPlan((f) => ({ ...f, name: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          />
          <input
            type="number"
            placeholder="Preço"
            value={newPlan.price}
            onChange={(e) => setNewPlan((f) => ({ ...f, price: Number(e.target.value) }))}
            className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
          />
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={newPlan.isActive}
              onChange={(e) => setNewPlan((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Ativo
          </label>
        </div>
        <button
          onClick={handleCreate}
          disabled={savingId === "new"}
          className="mt-3 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-300 disabled:opacity-60"
        >
          {savingId === "new" ? "Salvando..." : "Criar plano"}
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70">
        <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-slate-400">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Ativo</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-300" colSpan={4}>
                  Carregando...
                </td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={4}>
                  Nenhum plano cadastrado.
                </td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <input
                      value={plan.name}
                      onChange={(e) =>
                        setPlans((prev) =>
                          prev.map((p) => (p.id === plan.id ? { ...p, name: e.target.value } : p)),
                        )
                      }
                      className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) =>
                        setPlans((prev) =>
                          prev.map((p) => (p.id === plan.id ? { ...p, price: Number(e.target.value) } : p)),
                        )
                      }
                      className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex items-center gap-2 text-sm text-slate-200">
                      <input
                        type="checkbox"
                        checked={plan.isActive}
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) => (p.id === plan.id ? { ...p, isActive: e.target.checked } : p)),
                          )
                        }
                      />
                      Ativo
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleUpdate(plan)}
                      disabled={savingId === plan.id}
                      className="rounded-lg border border-cyan-400/40 px-3 py-1 text-sm text-white hover:border-cyan-300 disabled:opacity-60"
                    >
                      {savingId === plan.id ? "Salvando..." : "Salvar"}
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
