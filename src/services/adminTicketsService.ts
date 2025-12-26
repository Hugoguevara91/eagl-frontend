import { apiFetch } from "./api";

export type Ticket = {
  id: string;
  tenantId: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
};

export async function listTickets(token: string, filters?: { tenantId?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.tenantId) params.append("tenantId", filters.tenantId);
  if (filters?.status) params.append("status", filters.status);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<{ tickets: Ticket[] }>(`/admin/tickets${suffix}`, { token });
}

export async function createTicket(token: string, payload: { tenantId: string; title: string; status?: string; priority?: string }) {
  return apiFetch<{ ticket: Ticket }>(`/admin/tickets`, { method: "POST", token, body: payload });
}

export async function updateTicket(token: string, id: string, payload: Partial<Ticket>) {
  return apiFetch<{ ticket: Ticket }>(`/admin/tickets/${id}`, { method: "PATCH", token, body: payload });
}
