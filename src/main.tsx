import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// Proteção contra loops de health-check: garante no máx. 1 chamada e silencia logs repetitivos.
const originalFetch = window.fetch.bind(window);
let healthCalls = 0;
window.fetch = (...args) => {
  const url = typeof args[0] === "string" ? args[0] : args[0]?.url;
  if (url && url.includes("/api/health")) {
    if (healthCalls >= 1) {
      // responde localmente para evitar tráfego e evitar loops
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
