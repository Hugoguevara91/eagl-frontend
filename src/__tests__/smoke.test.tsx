import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";
import { AuthProvider } from "../context/AuthContext";
import { ErrorBoundary } from "../components/ErrorBoundary";

vi.mock("../config/runtime", () => ({
  loadRuntimeConfig: () => Promise.resolve({ apiBaseUrl: "http://127.0.0.1:8000/api", environment: "test" }),
  resolveApiBase: () => "http://127.0.0.1:8000/api",
}));

describe("smoke", () => {
  it("render app shell without crash", () => {
    const { container } = render(
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AuthProvider>,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
