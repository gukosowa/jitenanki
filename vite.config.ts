import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { appwriteBackend } from './src/stores/client'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: { target: ['es2020'] },
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm'], // TODO remove once fixed https://github.com/vitejs/vite/issues/8427
    esbuildOptions: { target: 'es2020' },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    proxy: {
      '/v1': {
        target: appwriteBackend.endpoint,
        rewrite: (path) => path.replace(/^\/v1/, ''),
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err)
          })
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
          })
        },
      },
    },
  },
  resolve: {
    alias: {
      '~src': fileURLToPath(new URL('./src', import.meta.url)),
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
