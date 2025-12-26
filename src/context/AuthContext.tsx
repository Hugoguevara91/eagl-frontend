import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";

type Role = "super_admin" | "admin" | "user" | "ADM";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId?: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isSupportMode: boolean;
  impersonatedTenantId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refresh: (
    overrideToken?: string,
    opts?: { supportMode?: boolean; impersonatedTenantId?: string | null },
  ) => Promise<void>;
  applySupportToken: (token: string, tenantId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "eagl_auth";

type StoredAuth = {
  token: string;
  user: User;
  supportMode?: boolean;
  impersonatedTenantId?: string | null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as StoredAuth;
      return parsed.user;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as StoredAuth;
      return parsed.token;
    } catch {
      return null;
    }
  });
  const [supportMode, setSupportMode] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    try {
      const parsed = JSON.parse(stored) as StoredAuth;
      return Boolean(parsed.supportMode);
    } catch {
      return false;
    }
  });
  const [impersonatedTenantId, setImpersonatedTenantId] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as StoredAuth;
      return parsed.impersonatedTenantId ?? null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      refresh(token, { supportMode, impersonatedTenantId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user, token, supportMode, impersonatedTenantId }),
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, token, supportMode, impersonatedTenantId]);

  const setAuthState = (
    nextUser: User | null,
    nextToken: string | null,
    support = false,
    impersonatedId: string | null = null,
  ) => {
    setUser(nextUser);
    setToken(nextToken);
    setSupportMode(support);
    setImpersonatedTenantId(impersonatedId);
  };

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const res = await apiFetch<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: { email: normalizedEmail, password },
      });
      setAuthState(res.user, res.token, false, null);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const refresh = async (
    overrideToken?: string,
    opts?: { supportMode?: boolean; impersonatedTenantId?: string | null },
  ) => {
    const activeToken = overrideToken ?? token;
    if (!activeToken) return;
    try {
      const res = await apiFetch<{ user: User }>("/auth/me", { token: activeToken });
      setAuthState(
        res.user,
        activeToken,
        opts?.supportMode ?? supportMode,
        opts?.impersonatedTenantId ?? impersonatedTenantId,
      );
    } catch (err) {
      console.warn("Sessao invalida, removendo token", err);
      setAuthState(null, null, false, null);
    }
  };

  const logout = () => {
    setAuthState(null, null, false, null);
  };

  const applySupportToken = async (supportToken: string, tenantId: string) => {
    await refresh(supportToken, { supportMode: true, impersonatedTenantId: tenantId });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isSupportMode: supportMode,
      impersonatedTenantId,
      login,
      logout,
      refresh,
      applySupportToken,
    }),
    [user, token, supportMode, impersonatedTenantId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
