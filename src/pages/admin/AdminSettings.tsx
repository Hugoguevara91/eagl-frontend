import { useEffect, useState } from "react";
import { AdminShell } from "../../layout/AdminShell";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../services/api";

type Settings = {
  supportEmail?: string;
  billingProvider?: string;
  supportModeTimeoutMinutes?: number;
  updatedAt?: string;
};

export function AdminSettings() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await apiFetch<{ settings: Settings }>("/admin/settings", { token });
        setSettings(res.settings);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar configurações");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    try {
      setSaving(true);
      setMessage(null);
      setError(null);
      const res = await apiFetch<{ settings: Settings }>("/admin/settings", {
        method: "PATCH",
        token,
        body: settings,
      });
      setSettings(res.settings);
      setMessage("Configurações salvas");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="Configurações do Admin">
      {error ? (
        <div className="mb-3 rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div>
      ) : null}
      {message ? (
        <div className="mb-3 rounded-xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{message}</div>
      ) : null}
      {loading ? (
        <div className="text-sm text-slate-300">Carregando...</div>
      ) : (
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Email de suporte</label>
            <input
              value={settings.supportEmail ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))}
              className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Provedor de billing</label>
            <input
              value={settings.billingProvider ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, billingProvider: e.target.value }))}
              className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.15em] text-slate-400">Tempo de suporte (min)</label>
            <input
              type="number"
              value={settings.supportModeTimeoutMinutes ?? 0}
              onChange={(e) =>
                setSettings((s) => ({ ...s, supportModeTimeoutMinutes: Number(e.target.value) }))
              }
              className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-fit rounded-xl border border-cyan-500/40 bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-300 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      )}
    </AdminShell>
  );
}
