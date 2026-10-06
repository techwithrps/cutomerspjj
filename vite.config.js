import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 60000,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress chunk size warnings or eval warnings from large datasets
        if (warning.code === 'CIRCULAR_DEPENDENCY' || warning.code === 'CHUNK_SIZE') return;
        warn(warning);
      },
    },
  },
  server: {
    port: 5174,
  },
});

