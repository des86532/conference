import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for GitHub Pages deployment
  // If deploying to username.github.io/repo-name/, set base to '/repo-name/'
  // For now, assuming root or relative
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
