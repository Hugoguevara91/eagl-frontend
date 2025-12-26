import { apiFetch } from "./api";

export type Asset = {
  id: string;
  clientId: string;
  tenantId?: string | null;
  name: string;
  family: string;
  tag?: string | null;
  status: string;
  health: string;
  manufacturer?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  powerKw?: string | null;
  location?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function listAssets(token: string, clientId: string) {
  return apiFetch<{ assets: Asset[] }>(`/clients/${clientId}/assets`, { token });
}

export async function getAsset(token: string, clientId: string, assetId: string) {
  return apiFetch<{ asset: Asset }>(`/clients/${clientId}/assets/${assetId}`, { token });
}

export async function createAsset(token: string, clientId: string, payload: Partial<Asset> & { name: string; family: string }) {
  return apiFetch<{ asset: Asset }>(`/clients/${clientId}/assets`, { method: "POST", token, body: payload });
}

export async function updateAsset(token: string, clientId: string, assetId: string, payload: Partial<Asset>) {
  return apiFetch<{ asset: Asset }>(`/clients/${clientId}/assets/${assetId}`, { method: "PATCH", token, body: payload });
}

export async function deleteAsset(token: string, clientId: string, assetId: string) {
  return apiFetch<{ asset: { id: string } }>(`/clients/${clientId}/assets/${assetId}`, { method: "DELETE", token });
}
