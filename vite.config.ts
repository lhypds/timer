import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Vite blocks every Host header it was not told about, so a deploy behind a
  // reverse proxy has to name itself. HOST takes a comma-separated list because
  // one instance is often reachable under both a public domain and the deploy
  // host's own name. Empty stays empty: that is local development, where Vite's
  // localhost default applies.
  const allowedHosts = (env.HOST ?? '')
    .split(',')
    .map(host => host.trim())
    .filter(Boolean);

  return {
    server: {
      host: true,
      port: 3300
    },
    preview: {
      allowedHosts,
      // Without strictPort a second instance asking for a taken port silently
      // moves to the next one, where it answers nothing the reverse proxy sends.
      strictPort: true
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: [
      react({
        babel: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { version: '2023-05' }]
          ]
        }
      }),
      svgr()
    ],
    build: {
      sourcemap: mode === 'production' ? 'hidden' : true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router']
          }
        }
      }
    }
  };
});
