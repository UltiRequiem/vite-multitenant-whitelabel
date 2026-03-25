import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const tenant = env.VITE_TENANT || 'default'

  console.log(`Building for tenant: ${tenant}`)

  return {
    plugins: [react()],

    define: {
      // Compile-time constant — enables dead code elimination.
      // Vite's tree-shaker will remove all tenant branches
      // that don't match this value.
      'import.meta.env.VITE_TENANT': JSON.stringify(tenant),
    },

    resolve: {
      alias: {
        '@app': path.resolve(__dirname, 'src'),
        '@tenants': path.resolve(__dirname, 'tenants'),
      },
    },

    build: {
      // Each tenant gets its own output folder:
      // dist/default, dist/acme, dist/globex
      outDir: `dist/${tenant}`,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          // Predictable chunk names for debugging
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },

    server: {
      port: tenant === 'default' ? 5173 : tenant === 'acme' ? 5174 : 5175,
    },
  }
})
