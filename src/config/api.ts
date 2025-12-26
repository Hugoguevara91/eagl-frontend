// Base da API vem sempre das variáveis do Vite. Em produção use https.
const envBase = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? "";
// Normaliza e garante o sufixo /api
const normalizedBase = (envBase || "http://127.0.0.1:8000").replace(/\/$/, "");
export const API_URL = `${normalizedBase}/api`;

export const defaultHeaders = {
  "Content-Type": "application/json",
};
