// Configuração central da API: exige VITE_API_BASE_URL e normaliza sem barra final.
const rawBase = import.meta.env.VITE_API_BASE_URL;

if (!rawBase) {
  throw new Error("VITE_API_BASE_URL não configurada. Defina a URL base da API (ex.: https://eagl-backend.onrender.com)");
}

export const API_BASE_URL = rawBase.replace(/\/$/, "");

export const defaultHeaders = {
  "Content-Type": "application/json",
};
