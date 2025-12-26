import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BRAND } from "../config/brand";
import { useAuth } from "../context/AuthContext";

type Props = {
  title: string;
  children: React.ReactNode;
};

type NavItem = { to: string; label: string; adminOnly?: boolean };

const NAV_MAIN: NavItem[] = [
  { to: "/app/painel", label: "Painel" },
  { to: "/app/clientes", label: "Clientes" },
  { to: "/app/ordens-servico", label: "Ordens de Serviço" },
  { to: "/app/solucionador", label: "Solucionador" },
  { to: "/app/relatorios", label: "Relatórios" },
  { to: "/app/usuarios", label: "Usuários", adminOnly: true },
  { to: "/app/perfis", label: "Perfis / Permissões", adminOnly: true },
  { to: "/app/configuracoes", label: "Configurações" },
];

const NAV_ADMIN: NavItem[] = [{ to: "/admin", label: "Console Admin" }];

const PRIMARY = BRAND.palette?.primary ?? "#00C8FF";
const ACCENT = BRAND.palette?.accent ?? "#EC4899";
const primaryGlow = `${PRIMARY}33`;
const accentGlow = `${ACCENT}22`;

const linkBase =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition";
const linkActive =
  "bg-white/10 text-white shadow-[0_0_20px_rgba(0,200,255,0.35)] border border-cyan-400/40";
const linkIdle = "text-slate-200 hover:text-white hover:bg-white/5";

const IconCircle: React.FC<{ active?: boolean }> = ({ active }) => (
  <span
    className={`h-2.5 w-2.5 rounded-full ${
      active ? "bg-cyan-300 shadow-[0_0_10px_rgba(0,200,255,0.8)]" : "bg-cyan-400/70"
    }`}
  />
);

export function AppShell({ title, children }: Props) {
  const [open, setOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const logoSrc = React.useMemo(
    () => BRAND.logo || BRAND.logoAlt || BRAND.logoWhite,
    [],
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const userInitials = React.useMemo(() => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return "HG";
  }, [user]);

  const normalizedRole = (user?.role || "").toString().toLowerCase();
  const isAdmin = normalizedRole === "adm" || normalizedRole === "super_admin" || normalizedRole === "admin";
  const isSuperAdmin = normalizedRole === "adm" || normalizedRole === "super_admin";
  const navMain = NAV_MAIN.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05070f] via-[#070a15] to-[#05070f] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100 hover:border-cyan-400/60 hover:text-white md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>

          <div className="flex items-center gap-3">
            {logoSrc ? (
              <img
                src={logoSrc}
                className="h-10 w-auto max-w-[180px] rounded-lg bg-[#0b1220] px-3 py-1 object-contain shadow-[0_0_30px_rgba(0,200,255,0.25)]"
                alt={BRAND?.name ?? "EAGL"}
                onError={(e) => ((e.currentTarget.style.display = "none") as any)}
              />
            ) : null}
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                APP EAGL
              </div>
              <div className="text-sm font-semibold text-white">{BRAND?.name ?? "EAGL"}</div>
              <div className="text-[12px] font-semibold text-cyan-200">
                Tecnologia aplicada à manutenção e engenharia
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100 md:flex">
              Ambiente Local
            </div>
            <div className="relative">
              <button
                className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white hover:border-cyan-400/60"
                onClick={() => setProfileOpen((p) => !p)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/90 to-slate-100 text-xs font-bold text-slate-900">
                  {userInitials}
                </div>
                <div className="hidden text-left md:block">
                  <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-200">
                    {isAdmin ? "ADMIN" : "USER"}
                  </div>
                  <div className="text-sm font-semibold text-white">{user?.name ?? "Usuário"}</div>
                </div>
              </button>
              {profileOpen ? (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-lg shadow-cyan-500/10 backdrop-blur">
                  <button
                    className="block w-full px-4 py-3 text-left text-sm text-slate-100 hover:bg-white/5"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/app/configuracoes");
                    }}
                  >
                    Meu perfil
                  </button>
                  <button
                    className="block w-full px-4 py-3 text-left text-sm text-pink-200 hover:bg-white/5"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            style={{ boxShadow: `0 0 32px ${primaryGlow}` }}
          >
            <div className="absolute inset-0 rounded-3xl border border-cyan-500/10" />
            <div className="absolute -left-10 top-12 h-28 w-28 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-pink-500/15 blur-3xl" />
            <div className="relative">
              <div className="px-2 pb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Navegação
              </div>
              <nav className="space-y-1">
                {navMain.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkIdle}`
                    }
                    end={item.to === "/app/painel"}
                  >
                    {({ isActive }) => (
                      <>
                        <IconCircle active={isActive} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {isSuperAdmin ? (
                <div className="mt-5 space-y-1 border-t border-white/5 pt-4">
                  <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Administração
                  </div>
                  {NAV_ADMIN.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : linkIdle}`
                      }
                      end={item.to === "/admin"}
                    >
                      {({ isActive }) => (
                        <>
                          <IconCircle active={isActive} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <main>
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(0,0,0,0.4)]"
            style={{ boxShadow: `0 0 32px ${accentGlow}` }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <p className="mt-1 text-sm font-semibold text-cyan-100">
                  Tecnologia aplicada à manutenção e engenharia
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden h-9 items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 text-[11px] uppercase tracking-[0.2em] text-cyan-100 md:flex">
                  Ambiente Local
                </span>
                <span className="hidden h-9 items-center rounded-full border border-pink-400/30 bg-pink-500/10 px-3 text-[11px] uppercase tracking-[0.2em] text-pink-100 md:flex">
                  EAGL PRIME
                </span>
              </div>
            </div>

            <div className="mt-6">{children}</div>
          </div>
        </main>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] overflow-hidden rounded-r-3xl border-r border-white/10 bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    className="h-8 w-auto max-w-[120px] rounded-md bg-white/5 px-2 py-1 object-contain"
                  />
                ) : null}
                <div className="text-sm font-semibold text-white">{BRAND?.name ?? "EAGL"}</div>
              </div>
              <button
                className="rounded-xl border border-white/10 px-3 py-1 text-slate-200 hover:border-cyan-400/60 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Fechar
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {navMain.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkIdle}`
                  }
                  end={item.to === "/app/painel"}
                >
                  {({ isActive }) => (
                    <>
                      <IconCircle active={isActive} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}

              {isSuperAdmin
                ? NAV_ADMIN.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : linkIdle}`
                      }
                      end={item.to === "/admin"}
                    >
                      {({ isActive }) => (
                        <>
                          <IconCircle active={isActive} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))
                : null}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
