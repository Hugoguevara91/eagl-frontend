import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { loadRuntimeConfig, resolveApiBase } from "./config/runtime";
import { applyRuntimeConfig } from "./config/api";
import "./index.css";

// Kill switch: evita loops de health-check e silencia logs repetitivos.
const originalFetch = window.fetch.bind(window);
let healthCalls = 0;
window.fetch = (...args) => {
  const target = args[0];
  const url =
    typeof target === "string"
      ? target
      : target instanceof URL
        ? target.toString()
        : target instanceof Request
          ? target.url
          : "";
  if (url && url.includes("/api/health")) {
    if (healthCalls >= 1) {
      return Promise.resolve(
        new Response(JSON.stringify({ ok: true, cached: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }
    healthCalls += 1;
  }
  return originalFetch(...args);
};

const originalLog = console.log;
console.log = (...args: any[]) => {
  const first = args[0];
  if (typeof first === "string" && first.toLowerCase().includes("api health")) return;
  originalLog(...args);
};

async function bootstrap() {
  const cfg = await loadRuntimeConfig();
  applyRuntimeConfig(cfg);
  (window as any).__APP_CONFIG__ = {
    apiBaseUrl: resolveApiBase(cfg),
    environment: cfg.environment || (import.meta as any).env?.MODE || "prod",
  };

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </React.StrictMode>,
  );
}

bootstrap();
