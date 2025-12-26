# EAGL Frontend (React + Vite)

## Rodar local
```bash
npm ci
npm run dev              # dev server
npm run build            # usa vite.app.config.ts
npm run preview          # testar build
npm run test             # smoke Vitest
```

## Runtime config e API base
O app lê `public/config.json` em produção e usa esta ordem de prioridade:
1. `config.json` (`apiBaseUrl`, `environment`)
2. `VITE_API_BASE_URL`
3. Fallback dev: `http://127.0.0.1:8000/api`

Se a API base ficar vazia, o app expõe `/diagnostico` mostrando o valor resolvido. `window.__APP_CONFIG__` traz o config carregado.

## Deploy (Render)
- Build command: `npm run build`
- Publish dir: `dist-app`
- Env: `VITE_API_BASE_URL=https://eagl-backend.onrender.com`
- Headers recomendados:
  - `/*` -> `Cache-Control: no-store` (já aplicado)
  - `/assets/*` -> `Cache-Control: public, max-age=31536000, immutable` (opcional)
- SPA rewrite: manter default do Render (todas rotas -> index/app sem afetar `/assets/*`).

## Diagnóstico de tela preta
1. Rodar `npm run build && npm run preview`.
2. Abrir DevTools: Console e Network (404 de JS/CSS/asset?).
3. Ver `/diagnostico`: versão (package.json), env, apiBaseUrl, health da API.
4. ErrorBoundary global exibe erro em tela e loga com prefixo `[EAGL-APP]`.

## Rota /diagnostico
Mostra versão, env, API base resolvida, resultado de `/health` e botão de teste de chamada simples.

## Teste de fumaça
Vitest (`npm run test`) renderiza o App com ErrorBoundary/AuthProvider e falha se houver crash de inicialização.

## Checklist de produção
- Frontend: build `npm run build` -> publicar `dist-app`.
- Backend: `/api/auth/me` e `/api/health` funcionando; CORS com origens:
  - https://app.eagl.com.br
  - https://eagl-frontend.onrender.com
  - http://localhost:5173
  - http://127.0.0.1:5173
- Limpar cache/aba anônima após redeploy para baixar o bundle novo (hash diferente).***
