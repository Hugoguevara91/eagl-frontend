import { apiFetch } from "./api";

export type Invoice = {
  id: string;
  tenantId: string;
  amount: number;
  status: string;
  dueDate: string;
  issuedAt: string;
  description?: string;
};

export async function listInvoices(token: string, filters?: { tenantId?: string }) {
  const params = new URLSearchParams();
  if (filters?.tenantId) params.append("tenantId", filters.tenantId);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<{ invoices: Invoice[] }>(`/admin/billing${suffix}`, { token });
}

export async function createInvoice(
  token: string,
  payload: { tenantId: string; amount: number; status?: string; dueDate: string; description?: string },
) {
  return apiFetch<{ invoice: Invoice }>(`/admin/billing`, { method: "POST", token, body: payload });
}

export async function updateInvoice(token: string, id: string, payload: Partial<Invoice>) {
  return apiFetch<{ invoice: Invoice }>(`/admin/billing/${id}`, { method: "PATCH", token, body: payload });
}
