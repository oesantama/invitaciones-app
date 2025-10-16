import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  build: {
    // Optimizaciones de build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
      },
    },
    // Code splitting mejorado
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils': ['html2canvas', 'jspdf', 'qrcode', 'xlsx'],
        },
      },
    },
    // Aumentar límite de advertencia de chunks
    chunkSizeWarningLimit: 1000,
    // Sourcemaps solo para producción si es necesario
    sourcemap: false,
  },

  server: {
    host: true,
    port: 9001,
    strictPort: true,
  },

  preview: {
    host: true,
    port: 9001,
    strictPort: true,
  },
});
