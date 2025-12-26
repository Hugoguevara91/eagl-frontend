import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminShell } from "../../layout/AdminShell";
import { useAuth } from "../../context/AuthContext";
import {
  activateTenant,
  getTenant,
  impersonateTenant,
  resetTenantSessions,
  suspendTenant,
  updateTenant,
} from "../../services/adminTenantsService";
import { listPlans } from "../../services/adminPlansService";
import { createInvoice, listInvoices } from "../../services/adminBillingService";
import { listTickets, createTicket, updateTicket } from "../../services/adminTicketsService";
import type { Tenant } from "../../services/adminTenantsService";
import type { Invoice } from "../../services/adminBillingService";
import type { Ticket } from "../../services/adminTicketsService";
import { createUser, deleteUser, listUsers, updateUser } from "../../services/adminUsersService";
import type { AdminUser } from "../../services/adminUsersService";

const tabs = [
  "Visão Geral",
  "Plano e Limites",
  "Cobrança",
  "Segurança e Acesso",
  "Suporte e Auditoria",
  "Usuários",
];

export function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, applySupportToken } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [saving, setSaving] = useState(false);
  const [generalForm, setGeneralForm] = useState({
    name: "",
    cnpj: "",
    ownerEmail: "",
    status: "trial",
  });
  const [planForm, setPlanForm] = useState({
    planId: "",
    osPerMonth: 0,
    storageGb: 0,
    usersCount: 0,
  });
  const [newInvoice, setNewInvoice] = useState({ amount: "", dueDate: "", description: "" });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState({ title: "", priority: "medium" });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const [recentPassword, setRecentPassword] = useState<string | null>(null);
  const [lastPasswordInfo, setLastPasswordInfo] = useState<{ email: string; password: string } | null>(
    null,
  );
  const userLimit = useMemo(() => {
    if (!tenant?.limits) return null;
    const raw = (tenant.limits as any).users ?? (tenant.limits as any).usersCount ?? null;
    return typeof raw === "number" ? raw : null;
  }, [tenant]);
  const userCount = users.length;
  const limitReached = userLimit !== null ? userCount >= userLimit : false;

  const loadData = async () => {
    if (!token || !id) return;
    try {
      setLoading(true);
      setError(null);
      const detail = await getTenant(token, id);
      setTenant(detail.tenant);
      setInvoices(detail.invoices ?? []);
      setTickets(detail.tickets ?? []);
      setGeneralForm({
        name: detail.tenant.name,
        cnpj: detail.tenant.cnpj || "",
        ownerEmail: detail.tenant.ownerEmail || "",
        status: detail.tenant.status,
      });
      setPlanForm({
        planId: detail.tenant.planId || "",
        osPerMonth: detail.tenant.osPerMonth ?? 0,
        storageGb: detail.tenant.storageGb ?? 0,
        usersCount: detail.tenant.usersCount ?? 0,
      });
      const plansRes = await listPlans(token);
      setPlans(plansRes.plans.map((p) => ({ id: p.id, name: p.name })));
      const usersRes = await listUsers(token);
      setUsers(usersRes.users.filter((u) => u.tenantId === id));
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tenant");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const handleSaveGeneral = async () => {
    if (!token || !id) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await updateTenant(token, id, {
        name: generalForm.name,
        cnpj: generalForm.cnpj,
        ownerEmail: generalForm.ownerEmail,
        status: generalForm.status,
      });
      setTenant(res.tenant);
      setMessage("Dados atualizados");
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlan = async () => {
    if (!token || !id) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await updateTenant(token, id, {
        planId: planForm.planId,
        osPerMonth: planForm.osPerMonth,
        storageGb: planForm.storageGb,
        usersCount: planForm.usersCount,
        limits: { osPerMonth: planForm.osPerMonth, storageGb: planForm.storageGb, users: planForm.usersCount },
      });
      setTenant(res.tenant);
      setMessage("Plano e limites atualizados");
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar plano");
    } finally {
      setSaving(false);
    }
  };

  const handleInvoiceCreate = async () => {
    if (!token || !id) return;
    if (!newInvoice.amount || !newInvoice.dueDate) {
      setError("Informe valor e vencimento da fatura");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await createInvoice(token, {
        tenantId: id,
        amount: Number(newInvoice.amount),
        dueDate: newInvoice.dueDate,
        description: newInvoice.description,
      });
      const invRes = await listInvoices(token, { tenantId: id });
      setInvoices(invRes.invoices);
      setNewInvoice({ amount: "", dueDate: "", description: "" });
      setMessage("Fatura criada");
    } catch (err: any) {
      setError(err.message || "Erro ao criar fatura");
    } finally {
      setSaving(false);
    }
  };

  const handleTicketCreate = async () => {
    if (!token || !id) return;
    if (!newTicket.title) {
      setError("Informe o título do ticket");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await createTicket(token, { tenantId: id, title: newTicket.title, priority: newTicket.priority });
      const updated = await listTickets(token, { tenantId: id });
      setTickets(updated.tickets);
      setNewTicket({ title: "", priority: "medium" });
      setMessage("Ticket criado");
    } catch (err: any) {
      setError(err.message || "Erro ao criar ticket");
    } finally {
      setSaving(false);
    }
  };

  const handleTicketStatus = async (ticketId: string, status: string) => {
    if (!token) return;
    try {
      setSaving(true);
      await updateTicket(token, ticketId, { status });
      const updated = await listTickets(token, { tenantId: id });
      setTickets(updated.tickets);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar ticket");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async () => {
    if (!token || !id) return;
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError("Preencha nome, email e senha do usuário");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const res = await createUser(token, {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        tenantId: id,
      });
      setUsers((prev) => [...prev, res.user]);
      setMessage("Usuário criado");
      setLastPasswordInfo({ email: newUser.email, password: newUser.password });
      setNewUser({ name: "", email: "", password: "", role: "user" });
    } catch (err: any) {
      setError(err.message || "Erro ao criar usuário");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!token) return;
    const generated = Math.random().toString(36).slice(-10);
    try {
      setSaving(true);
      setRecentPassword(generated);
      await updateUser(token, userId, { password: generated });
      const u = users.find((user) => user.id === userId);
      if (u) {
        setLastPasswordInfo({ email: u.email, password: generated });
      }
      setMessage(`Senha redefinida: ${generated}`);
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir senha");
    } finally {
      setSaving(false);
    }
  };

  const handleSuspend = async () => {
    if (!token || !id) return;
    if (!window.confirm("Suspender tenant?")) return;
    try {
      setSaving(true);
      const res = await suspendTenant(token, id);
      setTenant(res.tenant);
    } catch (err: any) {
      setError(err.message || "Erro ao suspender");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    if (!token || !id) return;
    try {
      setSaving(true);
      const res = await activateTenant(token, id);
      setTenant(res.tenant);
    } catch (err: any) {
      setError(err.message || "Erro ao ativar");
    } finally {
      setSaving(false);
    }
  };

  const handleImpersonate = async () => {
    if (!token || !id) return;
    try {
      setSaving(true);
      const res = await impersonateTenant(token, id);
      await applySupportToken(res.token, res.tenant.id);
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Erro ao entrar em modo suporte");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSessions = async () => {
    if (!token || !id) return;
    try {
      setSaving(true);
      await resetTenantSessions(token, id);
      setMessage("Sessões resetadas");
    } catch (err: any) {
      setError(err.message || "Erro ao resetar sessões");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    if (!window.confirm("Remover este usuário?")) return;
    try {
      setSaving(true);
      await deleteUser(token, userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setMessage("Usuário removido");
    } catch (err: any) {
      setError(err.message || "Erro ao remover usuário");
    } finally {
      setSaving(false);
    }
  };

  const renderTab = useMemo(() => {
    switch (activeTab) {
      case "Visão Geral":
        return (
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Nome</label>
              <input
                value={generalForm.name}
                onChange={(e) => setGeneralForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.15em] text-slate-400">CNPJ</label>
              <input
                value={generalForm.cnpj}
                onChange={(e) => setGeneralForm((f) => ({ ...f, cnpj: e.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Owner email</label>
              <input
                value={generalForm.ownerEmail}
                onChange={(e) => setGeneralForm((f) => ({ ...f, ownerEmail: e.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Status</label>
              <select
                value={generalForm.status}
                onChange={(e) => setGeneralForm((f) => ({ ...f, status: e.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
              >
                <option value="trial">Trial</option>
                <option value="active">Ativo</option>
                <option value="suspended">Suspenso</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveGeneral}
                disabled={saving}
                className="rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-300 disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              {tenant?.status !== "suspended" ? (
                <button
                  onClick={handleSuspend}
                  disabled={saving}
                  className="rounded-xl border border-pink-400/40 px-4 py-3 text-sm font-semibold text-pink-100 hover:border-pink-300 disabled:opacity-60"
                >
                  Suspender
                </button>
              ) : (
                <button
                  onClick={handleActivate}
                  disabled={saving}
                  className="rounded-xl border border-green-400/40 px-4 py-3 text-sm font-semibold text-green-100 hover:border-green-300 disabled:opacity-60"
                >
                  Ativar
                </button>
              )}
              <button
                onClick={handleImpersonate}
                disabled={saving}
                className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-400/60 disabled:opacity-60"
              >
                Impersonate
              </button>
            </div>
          </div>
        );
      case "Plano e Limites":
        return (
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Plano</label>
              <select
                value={planForm.planId}
                onChange={(e) => setPlanForm((f) => ({ ...f, planId: e.target.value }))}
                className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
              >
                <option value="">Selecione</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.15em] text-slate-400">OS/mês</label>
                <input
                  type="number"
                  value={planForm.osPerMonth}
                  onChange={(e) => setPlanForm((f) => ({ ...f, osPerMonth: Number(e.target.value) }))}
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Storage GB</label>
                <input
                  type="number"
                  value={planForm.storageGb}
                  onChange={(e) => setPlanForm((f) => ({ ...f, storageGb: Number(e.target.value) }))}
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Usuários</label>
                <input
                  type="number"
                  value={planForm.usersCount}
                  onChange={(e) => setPlanForm((f) => ({ ...f, usersCount: Number(e.target.value) }))}
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                />
              </div>
            </div>
            <button
              onClick={handleSavePlan}
              disabled={saving}
              className="w-fit rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-300 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar limites"}
            </button>
          </div>
        );
      case "Cobrança":
        return (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Nova fatura</div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
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
                onClick={handleInvoiceCreate}
                disabled={saving}
                className="mt-3 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-300 disabled:opacity-60"
              >
                Criar fatura
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70">
              <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
                <thead>
                  <tr className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-4 py-3">Valor</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Vencimento</th>
                    <th className="px-4 py-3">Emitido em</th>
                    <th className="px-4 py-3">Descrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-sm text-slate-400" colSpan={5}>
                        Nenhuma fatura.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-semibold text-white">
                          R$ {Number(inv.amount).toFixed(2)}
                        </td>
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
          </div>
        );
      case "Segurança e Acesso":
        return (
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <div className="text-sm text-slate-200">
              Último login: {tenant?.lastLoginAt ? new Date(tenant.lastLoginAt).toLocaleString("pt-BR") : "—"}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleResetSessions}
                disabled={saving}
                className="rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm font-semibold text-amber-50 hover:border-amber-300 disabled:opacity-60"
              >
                Forçar logout / reset
              </button>
              <button
                onClick={handleImpersonate}
                disabled={saving}
                className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-400/60 disabled:opacity-60"
              >
                Entrar em modo suporte
              </button>
            </div>
          </div>
        );
      case "Suporte e Auditoria":
        return (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Abrir ticket</div>
              <div className="mt-3 grid gap-3 md:grid-cols-[2fr_1fr]">
                <input
                  placeholder="Título do ticket"
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
                onClick={handleTicketCreate}
                disabled={saving}
                className="mt-3 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-300 disabled:opacity-60"
              >
                Criar ticket
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70">
              <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
                <thead>
                  <tr className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-4 py-3">Título</th>
                    <th className="px-4 py-3">Prioridade</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Criado em</th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tickets.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-sm text-slate-400" colSpan={5}>
                        Nenhum ticket.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-semibold text-white">{t.title}</td>
                        <td className="px-4 py-3">{t.priority}</td>
                        <td className="px-4 py-3">{t.status}</td>
                        <td className="px-4 py-3">{new Date(t.createdAt).toLocaleString("pt-BR")}</td>
                        <td className="px-4 py-3 space-x-2">
                          <button
                            onClick={() => handleTicketStatus(t.id, "in_progress")}
                            className="rounded-lg border border-white/15 px-3 py-1 text-xs text-white hover:border-cyan-400/60"
                          >
                            Em progresso
                          </button>
                          <button
                            onClick={() => handleTicketStatus(t.id, "resolved")}
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
          </div>
        );
      case "Usuários":
        return (
          <div className="grid gap-4">
            {lastPasswordInfo ? (
              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-sm text-white">
                <div className="font-semibold">Senha gerada</div>
                <div className="text-slate-100">
                  Usuário: <span className="font-mono">{lastPasswordInfo.email}</span>
                </div>
                <div className="mt-1 font-mono text-lg text-white">{lastPasswordInfo.password}</div>
                <button
                  className="mt-2 rounded-lg border border-white/20 px-3 py-1 text-xs text-white hover:border-cyan-300"
                  onClick={() => navigator.clipboard.writeText(lastPasswordInfo.password)}
                >
                  Copiar senha
                </button>
              </div>
            ) : null}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white">Novo usuário do tenant</div>
              {limitReached ? (
                <div className="mt-2 rounded-xl border border-pink-400/30 bg-pink-500/10 px-3 py-2 text-xs text-pink-100">
                  Limite de usuários do plano atingido.
                </div>
              ) : null}
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                <input
                  placeholder="Nome"
                  value={newUser.name}
                  onChange={(e) => setNewUser((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                />
                <input
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((f) => ({ ...f, email: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                />
                <input
                  placeholder="Senha"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser((f) => ({ ...f, password: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser((f) => ({ ...f, role: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Admin do tenant</option>
                </select>
              </div>
              <button
                onClick={handleCreateUser}
                disabled={saving || limitReached}
                className="mt-3 rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-300 disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Criar usuário"}
              </button>
              {recentPassword ? (
                <div className="mt-2 text-xs text-amber-100">
                  Senha gerada: <span className="font-mono">{recentPassword}</span>
                </div>
              ) : null}
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70">
              <table className="min-w-full divide-y divide-white/5 text-sm text-slate-100">
                <thead>
                  <tr className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Criado</th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-sm text-slate-400" colSpan={5}>
                        Nenhum usuário do tenant.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-semibold text-white">{u.name}</td>
                        <td className="px-4 py-3 text-slate-200">{u.email}</td>
                        <td className="px-4 py-3 text-xs uppercase">{u.role}</td>
                        <td className="px-4 py-3 text-slate-300">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt-BR") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleResetPassword(u.id)}
                            disabled={saving}
                            className="rounded-lg border border-white/15 px-3 py-1 text-xs text-white hover:border-cyan-400/60 disabled:opacity-60"
                          >
                            Redefinir senha
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={saving}
                            className="ml-2 rounded-lg border border-pink-400/40 px-3 py-1 text-xs text-pink-100 hover:border-pink-300 disabled:opacity-60"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, generalForm, planForm, plans, invoices, tickets, tenant, saving, users, newUser, recentPassword]);

  return (
    <AdminShell
      title={tenant ? tenant.name : "Tenant"}
      actions={
        <button
          onClick={() => navigate("/admin/tenants")}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-cyan-400/60"
        >
          Voltar
        </button>
      }
    >
      {error ? (
        <div className="mb-3 rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
      ) : null}
      {message ? (
        <div className="mb-3 rounded-xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{message}</div>
      ) : null}
      {loading ? (
        <div className="text-sm text-slate-300">Carregando...</div>
      ) : !tenant ? (
        <div className="text-sm text-slate-300">Tenant não encontrado.</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  activeTab === tab
                    ? "bg-cyan-500/20 text-cyan-100 border border-cyan-400/40"
                    : "text-slate-200 border border-white/10 hover:border-cyan-400/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4">{renderTab}</div>
        </>
      )}
    </AdminShell>
  );
}
