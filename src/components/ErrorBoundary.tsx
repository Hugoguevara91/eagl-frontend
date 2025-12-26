import React from "react";

type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("[EAGL-APP] Uncaught", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: "#fff", background: "#0f172a", minHeight: "100vh" }}>
          <h2>Erro inesperado</h2>
          <p>Tente recarregar. Se persistir, copie o diagnóstico abaixo.</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error?.stack || String(this.state.error || "Erro desconhecido")}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
