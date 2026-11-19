import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function createBuildVersion(): string {
  const sha = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 8) : '';
  const ts = Date.now().toString(36);
  return sha ? `fsp-${sha}-${ts}` : `fsp-${ts}`;
}

function stampSwAndVersionPlugin(buildVersion: string): Plugin {
  return {
    name: 'fsp-stamp-sw-and-version',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      // 1. Write dist/version.json so open tabs detect new deploys instantly
      fs.writeFileSync(
        path.join(distDir, 'version.json'),
        JSON.stringify({version: buildVersion, builtAt: new Date().toISOString()}),
        'utf8',
      );

      // 2. Stamp unique cache version into dist/sw.js on every build
      const swPath = path.join(distDir, 'sw.js');
      if (fs.existsSync(swPath)) {
        const swContent = fs.readFileSync(swPath, 'utf8');
        const stamped = swContent.replace(/__BUILD_VERSION__/g, buildVersion);
        fs.writeFileSync(swPath, stamped, 'utf8');
      }
    },
  };
}

export default defineConfig(() => {
  const buildVersion = createBuildVersion();

  return {
    base: '/',
    define: {
      __APP_BUILD_VERSION__: JSON.stringify(buildVersion),
    },
    plugins: [react(), tailwindcss(), stampSwAndVersionPlugin(buildVersion)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
                return 'vendor-react';
              }
              if (id.includes('firebase')) return 'vendor-firebase';
              if (id.includes('lucide-react')) return 'vendor-icons';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
