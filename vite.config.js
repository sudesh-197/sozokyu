import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The backend (Node or FastAPI) runs on http://localhost:8000.
// During development every request to /api is forwarded there, so no CORS setup is needed.
const proxy = { '/api': { target: process.env.VITE_BACKEND_URL || 'http://localhost:8000', changeOrigin: true } };

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
});
