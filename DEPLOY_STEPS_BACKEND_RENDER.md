Para colocar o backend FastAPI online no Render:

1. Entre em https://render.com e faça login.
2. Clique em **New** > **Web Service**.
3. Conecte seu repositório com esta pasta `fastapi-backend/`.
4. Configure:
   - **Name**: `eagl-fastapi` (ou outro).
   - **Root Directory**: `fastapi-backend`.
   - **Environment**: Python.
   - **Build Command**: `pip install -r requirements.txt`.
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Crie o serviço e aguarde o deploy. Copie a URL pública (ex.: `https://eagl-fastapi.onrender.com`).
6. Edite `frontend/.env.production` e coloque:
   ```
   VITE_API_BASE_URL=https://SUA-URL-DO-RENDER/api
   ```
   (Troque pela URL pública real.)
7. No frontend, rode:
   ```
   npm run build:app
   firebase deploy --only hosting:app
   ```
8. Teste o login em `https://app.eagl.com.br/login` com:
   - email: `admin@eagl.com.br`
   - senha: `123456`
