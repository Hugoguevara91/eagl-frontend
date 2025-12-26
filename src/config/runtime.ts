export type RuntimeConfig = {
  apiBaseUrl?: string;
  environment?: string;
};

const fallback = "http://127.0.0.1:8000/api";

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  try {
    const res = await fetch("/config.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`config.json status ${res.status}`);
    return (await res.json()) as RuntimeConfig;
  } catch (err) {
    console.error("[EAGL-APP] runtime config fallback:", err);
    return {};
  }
}

export function resolveApiBase(cfg: RuntimeConfig): string {
  const fromConfig = cfg.apiBaseUrl?.trim();
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL?.trim?.();
  const base = fromConfig || fromEnv || fallback;
  return base.replace(/\/$/, "");
}
