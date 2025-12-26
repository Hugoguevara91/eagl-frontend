import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { BRAND } from "../config/brand";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Força limpar qualquer preenchimento automático do navegador ao abrir a tela
  React.useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  // Diagnóstico: valida a base da API e o /api/health em runtime (útil em produção)
  useEffect(() => {
    const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    if (!base) return;
    fetch(`${base}/api/health`).catch((err) => console.error("API health error", base, err));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        const next = location.state?.from ?? "/app/painel";
        navigate(next, { replace: true });
      } else {
        setError("Credenciais inválidas");
      }
    } catch {
      setError("Não foi possível autenticar agora.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/app/painel" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050510] px-4 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.08),transparent_32%)]" />
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur">
        <div className="flex flex-col items-center gap-3 text-center">
          {BRAND.logo ? (
            <img
              src={BRAND.logo}
              className="h-16 w-auto max-w-[240px] rounded-xl bg-[#0b1220] px-4 py-2 object-contain shadow-[0_0_40px_rgba(0,200,255,0.3)]"
            />
          ) : null}
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Acesso</div>
          <div className="text-lg font-semibold text-white">EAGL Plataforma</div>
          <div className="text-sm font-semibold text-cyan-100">
            Tecnologia aplicada à manutenção e engenharia
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} autoComplete="off">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="login-email"
              autoComplete="new-password"
              inputMode="email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="login-password"
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-2 ring-transparent focus:border-cyan-400/40 focus:ring-cyan-500/30"
            />
          </div>

          {error ? <div className="rounded-xl bg-pink-500/10 px-4 py-3 text-sm text-pink-100">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl border border-pink-500/40 bg-pink-500/20 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:border-pink-400 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Precisa de acesso? Entre em contato com <Link to="/" className="text-cyan-200 underline">eagl.com.br</Link>
        </div>
      </div>
    </div>
  );
}
