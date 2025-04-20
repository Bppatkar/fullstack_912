import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  esbuild: {
    loader: {
      '.js': 'jsx',
    },
  },
  optimizeDeps: {
    exclude: ['react-dom/client'],  // Add the problematic dependency here
  },
});
