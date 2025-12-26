import { apiFetch } from "./api";

export async function fetchOsDetail(id: string, token: string) {
  return apiFetch(`/os/${id}`, { token });
}

export async function fetchActiveOsTemplate(token: string) {
  return apiFetch("/templates/os/active", { token });
}
