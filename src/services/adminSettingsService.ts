import { apiFetch } from "./api";

export type AdminSettings = {
  supportEmail?: string;
  billingProvider?: string;
  supportModeTimeoutMinutes?: number;
  updatedAt?: string;
};

export async function getAdminSettings(token: string) {
  return apiFetch<{ settings: AdminSettings }>("/admin/settings", { token });
}

export async function updateAdminSettings(token: string, payload: Partial<AdminSettings>) {
  return apiFetch<{ settings: AdminSettings }>("/admin/settings", { method: "PATCH", token, body: payload });
}
