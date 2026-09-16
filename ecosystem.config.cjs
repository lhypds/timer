const fs = require('fs');
const path = require('path');

const env = {};
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) env[match[1]] = (match[2] || '').trim();
  }
}

const PORT = env.PORT || '3301';
const PM2_NAME = env.PM2_NAME || 'timer';

module.exports = {
  apps: [
    {
      name: PM2_NAME,
      // There is no backend — the app is the built dist/, served by vite preview.
      // Vite's own binary is the script rather than `pnpm run preview`, so pm2
      // signals the server directly instead of a package-manager wrapper that
      // would leave the real process orphaned on stop.
      script: 'node_modules/vite/bin/vite.js',
      args: `preview --host --port ${PORT}`,
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      time: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
