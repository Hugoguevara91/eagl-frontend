# Inventário rápido (black screen)

- Rotas atuais (App):
  - `/`, `/login`, `/painel` (redirect para `/app/painel`)
  - `/diagnostico`
  - `/app/painel`, `/app/clientes`, `/app/ordens-servico`, `/app/relatorios`, `/app/configuracoes`
  - `/app/usuarios`, `/app/perfis`
  - fallback `*` -> `/login`

- Scripts de build/deploy (package.json):
  - `build` / `build:app`: `tsc -b && vite build --config vite.app.config.ts`
  - `build:landing`: `tsc -b && vite build --config vite.landing.config.ts`
  - `preview` / `preview:app`: `vite preview --config vite.app.config.ts`
  - `preview:landing`: `vite preview --config vite.landing.config.ts`
  - `dev`: `vite`
  - `test`: `vitest run`

- Pastas de saída/publicação:
  - App: `dist-app` (entrada `app.html`)
  - Landing: `dist-landing` (quando usada)
  - `dist` não é utilizada para produção

- Observações de deploy:
  - Publish directory no Render: `dist-app`
  - Reescrita SPA via UI do Render: todas as rotas -> `app.html`, exceto `/assets/*` servindo estático
