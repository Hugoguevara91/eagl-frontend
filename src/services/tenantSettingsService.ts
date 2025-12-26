import { apiFetch } from "./api";

export type TenantSettings = {
  identity: { brandName?: string; primaryColor?: string; logoUrl?: string };
  notifications: { email?: boolean; push?: boolean };
  integrations: { iot?: boolean; bms?: boolean; exports?: boolean };
  governance: { mfa?: boolean; sessionTimeoutMinutes?: number };
  updatedAt?: string;
};

export async function getTenantSettings(token: string) {
  return apiFetch<{ settings: TenantSettings }>("/tenant/settings", { token });
}

export async function updateTenantSettings(token: string, payload: Partial<TenantSettings>) {
  return apiFetch<{ settings: TenantSettings }>("/tenant/settings", { method: "PATCH", token, body: payload });
}
