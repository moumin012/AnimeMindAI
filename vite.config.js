import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The app is served through a proxied preview host, so any origin must be
// accepted and every API call stays relative (the dev server forwards it).
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
  preview: { host: '0.0.0.0', port: 5173, allowedHosts: true },
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    chunkSizeWarningLimit: 600,
  },
});
