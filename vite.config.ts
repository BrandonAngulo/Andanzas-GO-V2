import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          maps: ['@vis.gl/react-google-maps'],
          motion: ['framer-motion'],
          markdown: ['react-markdown', 'remark-gfm'],
        },
      },
    },
  }
});
