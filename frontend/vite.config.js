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
        rewrite: (path) => path
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'mantine': ['@mantine/core', '@mantine/hooks'],
          'query': ['@tanstack/react-query'],
          'icons': ['@tabler/icons-react'],
          'axios': ['axios'],
          'zustand': ['zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mantine/core', '@mantine/hooks',  '@mantine/tiptap',
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-text-style',
      '@tiptap/extension-color',],
  },
  define: {
    // // 환경 변수를 빌드 시점에 정의
    // 'process.env': process.env
  }

})
