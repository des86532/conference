import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for GitHub Pages deployment under des86532.github.io/conference
  base: '/conference/', 
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
