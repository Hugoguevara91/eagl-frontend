import { apiFetch } from "./api";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string | null;
  createdAt?: string;
};

export async function listUsers(token: string) {
  return apiFetch<{ users: AdminUser[] }>("/users", { token });
}

export async function createUser(
  token: string,
  payload: { name: string; email: string; password: string; role: string; tenantId?: string | null },
) {
  return apiFetch<{ user: AdminUser }>("/users", { method: "POST", token, body: payload });
}

export async function updateUser(
  token: string,
  id: string,
  payload: Partial<AdminUser> & { password?: string },
) {
  return apiFetch<{ user: AdminUser }>(`/users/${id}`, { method: "PUT", token, body: payload });
}

export async function deleteUser(token: string, id: string) {
  return apiFetch<{ user: { id: string } }>(`/users/${id}`, { method: "DELETE", token });
}
