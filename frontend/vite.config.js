import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'


export default defineConfig({
  plugins: [react({include: '**/*.{jsx,tsx}'}), jsconfigPaths()],

  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log('Proxying:', path)
          return path
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }

})
