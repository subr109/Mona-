import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Determine correct base URL:
  // 1. Explicit BASE_PATH (e.g. from environment or CI)
  // 2. Auto-detect from GitHub Actions GITHUB_REPOSITORY (e.g. 'owner/repo' -> '/repo/')
  // 3. Fallback to './' for local and relative preview
  let base = process.env.BASE_PATH || './';
  if (process.env.GITHUB_REPOSITORY && !process.env.BASE_PATH) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    if (repoName) {
      base = repoName.endsWith('.github.io') ? '/' : `/${repoName}/`;
    }
  }

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
