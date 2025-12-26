import { buildApiUrl } from "../config/api";

type Options = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string | null;
};

export async function apiFetch<T = any>(path: string, options: Options = {}): Promise<T> {
  const { method = "GET", headers = {}, body, token } = options;
  const url = buildApiUrl(path);
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const error = (data as any)?.error || `Erro ${res.status}`;
    throw new Error(error);
  }

  return data as T;
}
