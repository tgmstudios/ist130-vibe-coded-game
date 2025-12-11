import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    open: true
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    // Inline CSS into JS bundle to avoid relying on correct CSS mime-type on host
    cssCodeSplit: false
  }
});

