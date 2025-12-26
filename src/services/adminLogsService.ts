import { apiFetch } from "./api";

export type LogEvent = {
  id: string;
  tenantId?: string;
  level: string;
  message: string;
  context?: Record<string, any>;
  createdAt: string;
};

export async function listLogs(
  token: string,
  filters?: { tenantId?: string; level?: string; from?: string; to?: string },
) {
  const params = new URLSearchParams();
  if (filters?.tenantId) params.append("tenantId", filters.tenantId);
  if (filters?.level) params.append("level", filters.level);
  if (filters?.from) params.append("from", filters.from);
  if (filters?.to) params.append("to", filters.to);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<{ logs: LogEvent[] }>(`/admin/logs${suffix}`, { token });
}
