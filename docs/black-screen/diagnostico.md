# Diagnóstico (tela preta / produção)

- Sintoma: tela preta em `/painel` em produção, spam de `API health ...` no console e warning de throttling no Chrome. Chamada `/api/auth/me` retorna 404.
- Causa provável: deploy de frontend servindo bundle antigo (`app-DX2FVBRg.js`) + backend sem rota `/api/auth/me` na instância publicada.
- Evidência:
  - Network/Console em produção mostra bundle `app-DX2FVBRg.js` (hash antigo) e múltiplos calls a `/api/health`.
  - `https://eagl-backend.onrender.com/api/auth/me` retorna `{"detail": "Not Found"}` (backend não atualizado).
  - Build local gera hash novo (`dist-app/assets/app-DpseNiwi.js`) e passa `npm run build`.
- Status local:
  - `npm run build` ✅ (26/12) com hash `app-DpseNiwi.js`.
  - Preview não apresentou falha de build; sem evidência de tela preta local (assumido após build ok).
- Próximo passo: limpar cache de build no Render (frontend) e publicar `dist-app` do commit atual; redeploy do backend com `/api/auth/me` ativo e CORS corrigido.
