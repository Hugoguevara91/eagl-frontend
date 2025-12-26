import { apiFetch } from "./api";

export type Plan = {
  id: string;
  name: string;
  price: number;
  limits: Record<string, any>;
  modules: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function listPlans(token: string) {
  return apiFetch<{ plans: Plan[] }>("/admin/plans", { token });
}

export async function createPlan(token: string, payload: Partial<Plan> & { name: string }) {
  return apiFetch<{ plan: Plan }>("/admin/plans", { method: "POST", token, body: payload });
}

export async function updatePlan(token: string, id: string, payload: Partial<Plan>) {
  return apiFetch<{ plan: Plan }>(`/admin/plans/${id}`, { method: "PATCH", token, body: payload });
}
