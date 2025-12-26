import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { loadRuntimeConfig, resolveApiBase } from "../config/runtime";

type Info = {
  version?: string;
  apiBase?: string;
  environment?: string;
  sha?: string;
};

export default function Diagnostico() {
  const [info, setInfo] = useState<Info>({});
  const [health, setHealth] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const cfg = await loadRuntimeConfig();
      const apiBase = resolveApiBase(cfg);
      const pkg = await import("../../package.json");
      setInfo({
        version: pkg.version,
        apiBase,
        environment: cfg.environment || (import.meta as any).env?.MODE,
        sha: (import.meta as any).env?.VITE_GIT_SHA || "n/d",
      });
      try {
        const res = await apiFetch("/health");
        setHealth(res);
      } catch (e: any) {
        setErr(e.message || String(e));
      }
    })();
  }, []);

  const testCall = async () => {
    try {
      const t0 = performance.now();
      await apiFetch("/health");
      alert(`Chamada OK em ${(performance.now() - t0).toFixed(0)}ms`);
    } catch (e: any) {
      alert(`Erro: ${e.message || e}`);
    }
  };

  return (
    <div style={{ padding: 24, color: "#e5e7eb", background: "#0f172a", minHeight: "100vh" }}>
      <h1>Diagnóstico</h1>
      <pre>{JSON.stringify(info, null, 2)}</pre>

      <h2>Health</h2>
      <pre>{health ? JSON.stringify(health, null, 2) : err || "carregando..."}</pre>

      <button
        onClick={testCall}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          background: "#0ea5e9",
          border: "none",
          borderRadius: 8,
          color: "#0f172a",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Testar chamada
      </button>
    </div>
  );
}
