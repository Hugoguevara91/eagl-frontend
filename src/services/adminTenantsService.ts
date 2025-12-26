import { apiFetch } from "./api";

export type Tenant = {
  id: string;
  name: string;
  cnpj?: string | null;
  ownerEmail?: string | null;
  status: string;
  planId?: string | null;
  planName?: string | null;
  limits?: Record<string, any>;
  usersCount?: number;
  assetsCount?: number;
  osPerMonth?: number;
  storageGb?: number;
  health?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
};

export type Invoice = {
  id: string;
  tenantId: string;
  amount: number;
  status: string;
  dueDate: string;
  issuedAt: string;
  description?: string;
};

export type Ticket = {
  id: string;
  tenantId: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
};

export async function listTenants(token: string, filters?: { status?: string; planId?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.planId) params.append("planId", filters.planId);
  if (filters?.search) params.append("search", filters.search);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<{ tenants: Tenant[] }>(`/admin/tenants${suffix}`, { token });
}

export async function createTenant(
  token: string,
  payload: Partial<Tenant> & { name: string; status?: string; planId?: string },
) {
  return apiFetch<{ tenant: Tenant }>(`/admin/tenants`, { method: "POST", token, body: payload });
}

export async function getTenant(token: string, id: string) {
  return apiFetch<{ tenant: Tenant; invoices: Invoice[]; tickets: Ticket[] }>(`/admin/tenants/${id}`, {
    token,
  });
}

export async function updateTenant(token: string, id: string, payload: Partial<Tenant>) {
  return apiFetch<{ tenant: Tenant }>(`/admin/tenants/${id}`, { method: "PATCH", token, body: payload });
}

export async function suspendTenant(token: string, id: string) {
  return apiFetch<{ tenant: Tenant }>(`/admin/tenants/${id}/suspend`, { method: "POST", token });
}

export async function activateTenant(token: string, id: string) {
  return apiFetch<{ tenant: Tenant }>(`/admin/tenants/${id}/activate`, { method: "POST", token });
}

export async function impersonateTenant(token: string, id: string) {
  return apiFetch<{ token: string; tenant: { id: string; name: string } }>(`/admin/tenants/${id}/impersonate`, {
    method: "POST",
    token,
  });
}

export async function resetTenantSessions(token: string, id: string) {
  return apiFetch<{ ok: boolean }>(`/admin/tenants/${id}/reset-sessions`, { method: "POST", token });
}
