import { resolveApiBase, type RuntimeConfig } from "./runtime";

let cachedBase: string | null = null;

export function setApiBase(base: string) {
  cachedBase = base.replace(/\/$/, "");
}

export function getApiBase(): string {
  if (cachedBase) return cachedBase;
  const envBase = (import.meta as any).env?.VITE_API_BASE_URL || "";
  return (envBase || "http://127.0.0.1:8000").replace(/\/$/, "");
}

export function buildApiUrl(path: string) {
  const base = cachedBase || getApiBase();
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withApi = clean.startsWith("/api/") ? clean : `/api${clean}`;
  return `${base}${withApi}`;
}

export function applyRuntimeConfig(cfg: RuntimeConfig) {
  const base = resolveApiBase(cfg);
  setApiBase(base);
}
